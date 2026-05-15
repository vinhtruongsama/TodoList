-- 20260516_audit_fix_notifications.sql
-- Củng cố bảo mật và tính nhất quán cho hệ thống thông báo

-- 1. Thêm check constraints cho type để đảm bảo tính nhất quán dữ liệu
ALTER TABLE public.notifications 
  ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('new_review', 'new_invitation', 'invitation_accepted', 'system'));

ALTER TABLE public.notifications 
  ADD CONSTRAINT notifications_related_entity_type_check 
  CHECK (related_entity_type IN ('mentor_review', 'mentor_student_link', 'task', 'goal', 'note') OR related_entity_type IS NULL);

-- 2. Cập nhật RLS: Cho phép authenticated users tạo thông báo
-- (Cần thiết vì Server Actions chạy dưới quyền của user đang đăng nhập)
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;
CREATE POLICY "Users can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Cập nhật RLS UPDATE: Chỉ được sửa chính thông báo của mình (đã có nhưng viết lại cho rõ)
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Bổ sung Index nếu cần (đã có user_id, is_read, created_at)
-- Không cần thêm index mới.
