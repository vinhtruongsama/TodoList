-- 1. Thêm cột goal_id vào bảng tasks (Liên kết nhiệm vụ với mục tiêu)
-- Sử dụng DO block để đảm bảo tính an toàn và Idempotent (chạy lại nhiều lần không lỗi)
DO $$
BEGIN
    -- Thêm cột nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'tasks' AND column_name = 'goal_id') THEN
        ALTER TABLE public.tasks ADD COLUMN goal_id UUID;
    END IF;

    -- Thêm ràng buộc Foreign Key nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE constraint_name = 'tasks_goal_id_fkey') THEN
        ALTER TABLE public.tasks 
        ADD CONSTRAINT tasks_goal_id_fkey 
        FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Chỉ mục để tối ưu hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON public.tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_goal ON public.tasks(user_id, goal_id);

-- 3. Đảm bảo tính toàn vẹn dữ liệu chéo người dùng (Cross-user Integrity)
-- Hàm kiểm tra: Đảm bảo goal_id được gán vào task phải thuộc về cùng một user_id
CREATE OR REPLACE FUNCTION public.check_task_goal_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu goal_id không NULL, kiểm tra xem goal đó có thuộc về user_id của task không
  IF NEW.goal_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.goals
      WHERE id = NEW.goal_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Mục tiêu không tồn tại hoặc không thuộc quyền sở hữu của người dùng này.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger kiểm tra trước khi INSERT hoặc UPDATE
-- DROP và CREATE lại để đảm bảo cập nhật logic mới nhất nếu có thay đổi
DROP TRIGGER IF EXISTS tr_check_task_goal_ownership ON public.tasks;
CREATE TRIGGER tr_check_task_goal_ownership
BEFORE INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE PROCEDURE public.check_task_goal_ownership();


-- 1. Tạo bảng task_history (Lưu nhật ký hành động học tập)
CREATE TABLE IF NOT EXISTS public.task_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  content TEXT,
  duration_minutes INTEGER,
  mood TEXT,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Ràng buộc (Constraints)
  CONSTRAINT task_history_event_type_check CHECK (
    event_type IN ('completed', 'reflection', 'skipped_reflection', 'updated', 'reopened')
  ),
  CONSTRAINT task_history_duration_minutes_check CHECK (
    duration_minutes IS NULL OR duration_minutes >= 0
  ),
  CONSTRAINT task_history_difficulty_check CHECK (
    difficulty IS NULL OR difficulty IN ('easy', 'normal', 'hard')
  )
);

-- 2. Chỉ mục (Indexes) để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_task_history_user_id ON public.task_history(user_id);
CREATE INDEX IF NOT EXISTS idx_task_history_task_id ON public.task_history(task_id);
CREATE INDEX IF NOT EXISTS idx_task_history_event_type ON public.task_history(event_type);
CREATE INDEX IF NOT EXISTS idx_task_history_created_at ON public.task_history(created_at);
CREATE INDEX IF NOT EXISTS idx_task_history_user_created ON public.task_history(user_id, created_at);

-- 3. Bật Row Level Security (RLS)
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;

-- 4. Chính sách bảo mật (Policies)
-- Để an toàn khi chạy lại, chúng ta xóa policy cũ nếu tồn tại
DROP POLICY IF EXISTS "Users can manage own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can view own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can insert own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can update own task history" ON public.task_history;
DROP POLICY IF EXISTS "Users can delete own task history" ON public.task_history;
DROP POLICY IF EXISTS "Mentors can view student task history" ON public.task_history;

-- Sinh viên xem lịch sử của chính mình
CREATE POLICY "Users can view own task history" ON public.task_history
  FOR SELECT USING (auth.uid() = user_id);

-- Sinh viên chỉ có thể TẠO lịch sử cho chính mình
CREATE POLICY "Users can insert own task history" ON public.task_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sinh viên chỉ có thể SỬA lịch sử của chính mình
CREATE POLICY "Users can update own task history" ON public.task_history
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sinh viên chỉ có thể XÓA lịch sử của chính mình
CREATE POLICY "Users can delete own task history" ON public.task_history
  FOR DELETE USING (auth.uid() = user_id);

-- Mentor chỉ có quyền XEM lịch sử của học viên đã chấp nhận kết nối
CREATE POLICY "Mentors can view student task history" ON public.task_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE student_id = public.task_history.user_id
      AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
      AND status = 'accepted'
    )
  );

-- 5. Trigger cập nhật updated_at
-- Chúng ta giả định hàm update_updated_at_column() đã tồn tại
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_task_history_updated_at') THEN
      CREATE TRIGGER update_task_history_updated_at 
      BEFORE UPDATE ON public.task_history 
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
    END IF;
  END IF;
END $$;


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


-- 20260516_create_notifications.sql
-- Tạo hệ thống thông báo (Notifications Foundation) cho Phase 9

-- 1. Tạo bảng notifications
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- e.g., 'new_review', 'new_invitation', 'invitation_accepted'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_entity_type TEXT, -- e.g., 'mentor_review', 'mentor_student_link'
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bật RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Indexes
CREATE INDEX notifications_user_id_idx ON public.notifications (user_id);
CREATE INDEX notifications_is_read_idx ON public.notifications (is_read);
CREATE INDEX notifications_created_at_idx ON public.notifications (created_at DESC);

-- 4. Policies
-- Người dùng chỉ được xem thông báo của chính mình
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Người dùng chỉ được cập nhật trạng thái is_read của chính mình
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Người dùng có thể xóa thông báo của chính mình
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- 5. Trigger cập nhật updated_at
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
