-- 1. Tạo bảng mentor_reviews
CREATE TABLE public.mentor_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('dashboard', 'task', 'goal', 'note')),
  target_id UUID, -- NULL nếu là dashboard review chung
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Bật RLS
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;

-- 3. Indexes để tối ưu query
CREATE INDEX mentor_reviews_mentor_id_idx ON public.mentor_reviews (mentor_id);
CREATE INDEX mentor_reviews_student_id_idx ON public.mentor_reviews (student_id);
CREATE INDEX mentor_reviews_target_type_id_idx ON public.mentor_reviews (target_type, target_id);

-- 4. Policies
-- Student chỉ được xem review viết cho mình
CREATE POLICY "Students can view reviews for them" ON public.mentor_reviews
  FOR SELECT USING (auth.uid() = student_id);

-- Mentor chỉ được tạo review cho student đã accepted connection
CREATE POLICY "Mentors can create reviews for connected students" ON public.mentor_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = mentor_id AND
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE student_id = public.mentor_reviews.student_id
      AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
      AND status = 'accepted'
    )
  );

-- Mentor có thể xem/sửa/xóa review của chính mình
CREATE POLICY "Mentors can manage own reviews" ON public.mentor_reviews
  FOR ALL USING (auth.uid() = mentor_id);

-- 5. Trigger cập nhật updated_at
CREATE TRIGGER update_mentor_reviews_updated_at BEFORE UPDATE ON public.mentor_reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
