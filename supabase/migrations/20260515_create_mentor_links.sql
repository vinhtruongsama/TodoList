-- 1. Tạo bảng mentor_student_links
CREATE TABLE public.mentor_student_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES auth.users ON DELETE SET NULL, -- Null nếu mentor chưa có account
  mentor_email TEXT NOT NULL,
  student_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(mentor_email, student_id) -- Tránh mời trùng
);

-- 2. Bật RLS
ALTER TABLE public.mentor_student_links ENABLE ROW LEVEL SECURITY;

-- 3. Policies cho mentor_student_links
-- Student thấy link mình tạo
CREATE POLICY "Students can view own invitations" ON public.mentor_student_links
  FOR SELECT USING (auth.uid() = student_id);

-- Student có thể tạo link mời
CREATE POLICY "Students can create invitations" ON public.mentor_student_links
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Mentor thấy link liên quan email của mình
CREATE POLICY "Mentors can view invitations by email" ON public.mentor_student_links
  FOR SELECT USING (mentor_email = auth.jwt()->>'email' OR mentor_id = auth.uid());

-- Mentor có thể update status
CREATE POLICY "Mentors can update invitation status" ON public.mentor_student_links
  FOR UPDATE USING (mentor_email = auth.jwt()->>'email' OR mentor_id = auth.uid());

-- 4. CẬP NHẬT RLS CHO CÁC BẢNG KHÁC ĐỂ MENTOR CÓ THỂ XEM
-- Thêm quyền xem cho Mentor vào bảng Tasks
CREATE POLICY "Mentors can view student tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE student_id = public.tasks.user_id
      AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
      AND status = 'accepted'
    )
  );

-- Thêm quyền xem cho Mentor vào bảng Goals
CREATE POLICY "Mentors can view student goals" ON public.goals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE student_id = public.goals.user_id
      AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
      AND status = 'accepted'
    )
  );

-- Thêm quyền xem cho Mentor vào bảng Goal Steps
CREATE POLICY "Mentors can view student goal steps" ON public.goal_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE student_id = public.goal_steps.user_id
      AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
      AND status = 'accepted'
    )
  );

-- Thêm quyền xem cho Mentor vào bảng Notes
CREATE POLICY "Mentors can view student notes" ON public.learning_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE student_id = public.learning_notes.user_id
      AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
      AND status = 'accepted'
    )
  );

-- 5. Trigger cập nhật updated_at
CREATE TRIGGER update_mentor_links_updated_at BEFORE UPDATE ON public.mentor_student_links FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
