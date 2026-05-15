-- 20260515_fix_review_rls.sql
-- Củng cố RLS cho bảng mentor_reviews để validate ownership của target_id và fix lỗi bảo mật

-- 1. Xóa các policy cũ để ghi đè
DROP POLICY IF EXISTS "Mentors can create reviews for connected students" ON public.mentor_reviews;
DROP POLICY IF EXISTS "Mentors can manage own reviews" ON public.mentor_reviews;

-- 2. Policy SELECT: Mentor xem được review của chính mình, Student xem được review gửi cho mình
CREATE POLICY "Mentors can view own reviews" ON public.mentor_reviews
  FOR SELECT USING (auth.uid() = mentor_id);

-- (Policy cho Student đã có từ migration trước, nhưng viết lại cho chắc chắn)
DROP POLICY IF EXISTS "Students can view reviews for them" ON public.mentor_reviews;
CREATE POLICY "Students can view reviews for them" ON public.mentor_reviews
  FOR SELECT USING (auth.uid() = student_id);

-- 3. Policy INSERT: Mentor chỉ được tạo review cho student đã kết nối và PHẢI validate ownership của target_id
CREATE POLICY "Mentors can insert reviews for connected students" ON public.mentor_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = mentor_id AND
    EXISTS (
      SELECT 1 FROM public.mentor_student_links
      WHERE student_id = public.mentor_reviews.student_id
      AND (mentor_id = auth.uid() OR mentor_email = auth.jwt()->>'email')
      AND status = 'accepted'
    ) AND (
      target_id IS NULL OR
      (target_type = 'task' AND EXISTS (SELECT 1 FROM public.tasks WHERE id = target_id AND user_id = student_id)) OR
      (target_type = 'goal' AND EXISTS (SELECT 1 FROM public.goals WHERE id = target_id AND user_id = student_id)) OR
      (target_type = 'note' AND EXISTS (SELECT 1 FROM public.learning_notes WHERE id = target_id AND user_id = student_id))
    )
  );

-- 4. Policy UPDATE/DELETE: Chỉ Mentor tạo ra review mới được sửa/xóa
CREATE POLICY "Mentors can update/delete own reviews" ON public.mentor_reviews
  FOR ALL USING (auth.uid() = mentor_id)
  WITH CHECK (auth.uid() = mentor_id);

-- 5. Bổ sung check constraint cho rating (nếu migration trước chưa có hoặc muốn chắc chắn)
-- ALTER TABLE public.mentor_reviews ADD CONSTRAINT mentor_reviews_rating_check CHECK (rating >= 1 AND rating <= 5);
