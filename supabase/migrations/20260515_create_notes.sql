-- 1. Tạo bảng learning_notes
CREATE TABLE public.learning_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.tasks ON DELETE SET NULL,
  goal_id UUID REFERENCES public.goals ON DELETE SET NULL,
  goal_step_id UUID REFERENCES public.goal_steps ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  note_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bật RLS
ALTER TABLE public.learning_notes ENABLE ROW LEVEL SECURITY;

-- 3. Tạo Index để tìm kiếm nhanh theo user và ngày
CREATE INDEX IF NOT EXISTS notes_user_id_date_idx ON public.learning_notes (user_id, note_date);

-- 4. Policies
CREATE POLICY "Users can view own notes" ON public.learning_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.learning_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON public.learning_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON public.learning_notes FOR DELETE USING (auth.uid() = user_id);

-- 5. Trigger cập nhật updated_at
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.learning_notes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
