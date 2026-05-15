-- 1. Tạo bảng goals
CREATE TABLE public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  progress_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tạo bảng goal_steps
CREATE TABLE public.goal_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.goals ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  order_index INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bật RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_steps ENABLE ROW LEVEL SECURITY;

-- 4. Policies cho goals
CREATE POLICY "Users can view own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- 5. Policies cho goal_steps
CREATE POLICY "Users can view own steps" ON public.goal_steps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own steps" ON public.goal_steps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own steps" ON public.goal_steps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own steps" ON public.goal_steps FOR DELETE USING (auth.uid() = user_id);

-- 6. Hàm tự động tính toán progress_percent
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_steps INTEGER;
    completed_steps INTEGER;
    new_progress INTEGER;
BEGIN
    SELECT count(*) INTO total_steps FROM public.goal_steps WHERE goal_id = COALESCE(NEW.goal_id, OLD.goal_id);
    SELECT count(*) INTO completed_steps FROM public.goal_steps WHERE goal_id = COALESCE(NEW.goal_id, OLD.goal_id) AND status = 'completed';
    
    IF total_steps > 0 THEN
        new_progress := (completed_steps * 100) / total_steps;
    ELSE
        new_progress := 0;
    END IF;
    
    UPDATE public.goals SET progress_percent = new_progress WHERE id = COALESCE(NEW.goal_id, OLD.goal_id);
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger tính progress khi thêm/sửa/xóa step
CREATE TRIGGER on_step_change
AFTER INSERT OR UPDATE OR DELETE ON public.goal_steps
FOR EACH ROW EXECUTE PROCEDURE update_goal_progress();

-- 8. Trigger cập nhật updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_steps_updated_at BEFORE UPDATE ON public.goal_steps FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
