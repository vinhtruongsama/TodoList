-- 1. Thêm Index cho các cột hay dùng để tìm kiếm
CREATE INDEX IF NOT EXISTS mentor_links_student_id_idx ON public.mentor_student_links (student_id);
CREATE INDEX IF NOT EXISTS mentor_links_mentor_id_idx ON public.mentor_student_links (mentor_id);
CREATE INDEX IF NOT EXISTS mentor_links_mentor_email_idx ON public.mentor_student_links (mentor_email);
CREATE INDEX IF NOT EXISTS mentor_links_status_idx ON public.mentor_student_links (status);

-- 2. Thêm ràng buộc Student không thể tự mời chính mình (dựa trên email)
-- Lưu ý: Chúng ta sẽ xử lý phần này ở phía Service để linh hoạt hơn, 
-- vì email student nằm ở bảng khác (auth.users).
