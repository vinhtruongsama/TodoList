-- 1. Tạo bảng activities (Xương sống của Momentum Engine)
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- Chủ sở hữu timeline (sinh viên)
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Người thực hiện hành động (có thể là mentor)
  type TEXT NOT NULL, 
  target_id UUID NOT NULL, 
  metadata JSONB DEFAULT '{}'::jsonb, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tối ưu hóa Feed
CREATE INDEX IF NOT EXISTS idx_activities_user_id_created_at ON public.activities (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities (type);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ nếu có để tránh trùng lặp khi chạy lại
DROP POLICY IF EXISTS "Students can view own activities" ON public.activities;
DROP POLICY IF EXISTS "Mentors can view student activities" ON public.activities;

CREATE POLICY "Students can view own activities" ON public.activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Mentors can view student activities" ON public.activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE mentor_id = auth.uid() 
      AND student_id = public.activities.user_id
      AND status = 'accepted'
    )
  );

-- Hàm helper với SECURITY DEFINER để có thể bypass RLS khi ghi log tự động
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS TRIGGER AS $$
DECLARE
    activity_metadata JSONB;
BEGIN
    IF (TG_TABLE_NAME = 'task_history') THEN
        IF (NEW.event_type = 'completed') THEN
            SELECT jsonb_build_object('task_title', title) INTO activity_metadata FROM public.tasks WHERE id = NEW.task_id;
            INSERT INTO public.activities (user_id, actor_id, type, target_id, metadata, created_at)
            VALUES (NEW.user_id, NEW.user_id, 'task_completed', NEW.task_id, activity_metadata, NEW.created_at);
        ELSIF (NEW.event_type = 'reflection') THEN
            SELECT jsonb_build_object('task_title', title, 'content_preview', substring(NEW.content from 1 for 100)) 
            INTO activity_metadata FROM public.tasks WHERE id = NEW.task_id;
            INSERT INTO public.activities (user_id, actor_id, type, target_id, metadata, created_at)
            VALUES (NEW.user_id, NEW.user_id, 'task_reflection', NEW.id, activity_metadata, NEW.created_at);
        END IF;
    
    ELSIF (TG_TABLE_NAME = 'learning_notes') THEN
        activity_metadata := jsonb_build_object('note_title', NEW.title, 'content_preview', substring(NEW.content from 1 for 100));
        INSERT INTO public.activities (user_id, actor_id, type, target_id, metadata, created_at)
        VALUES (NEW.user_id, NEW.user_id, 'note_created', NEW.id, activity_metadata, NEW.created_at);
        
    ELSIF (TG_TABLE_NAME = 'mentor_reviews') THEN
        -- Lấy tên mentor để lưu vào metadata
        SELECT jsonb_build_object(
          'comment_preview', substring(NEW.comment from 1 for 100),
          'mentor_name', p.full_name
        ) INTO activity_metadata 
        FROM public.profiles p WHERE p.id = NEW.mentor_id;

        INSERT INTO public.activities (user_id, actor_id, type, target_id, metadata, created_at)
        VALUES (NEW.student_id, NEW.mentor_id, 'mentor_review_received', NEW.id, activity_metadata, NEW.created_at);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER cực kỳ quan trọng ở đây

-- Gắn trigger cho task_history
DROP TRIGGER IF EXISTS tr_log_task_activity ON public.task_history;
CREATE TRIGGER tr_log_task_activity
AFTER INSERT ON public.task_history
FOR EACH ROW EXECUTE PROCEDURE public.log_activity();

-- Gắn trigger cho learning_notes
DROP TRIGGER IF EXISTS tr_log_note_activity ON public.learning_notes;
CREATE TRIGGER tr_log_note_activity
AFTER INSERT ON public.learning_notes
FOR EACH ROW EXECUTE PROCEDURE public.log_activity();

-- Gắn trigger cho mentor_reviews
DROP TRIGGER IF EXISTS tr_log_review_activity ON public.mentor_reviews;
CREATE TRIGGER tr_log_review_activity
AFTER INSERT ON public.mentor_reviews
FOR EACH ROW EXECUTE PROCEDURE public.log_activity();
