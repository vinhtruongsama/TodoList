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
