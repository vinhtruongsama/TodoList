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
