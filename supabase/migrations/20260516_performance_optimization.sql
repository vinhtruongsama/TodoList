-- 20260516_performance_optimization.sql
-- Tối ưu hóa hiệu năng Database cho Phase 9

-- 1. Index cho bảng tasks
CREATE INDEX IF NOT EXISTS tasks_user_id_due_date_idx ON public.tasks (user_id, due_date);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks (status);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks (created_at DESC);

-- 2. Index cho bảng goals
CREATE INDEX IF NOT EXISTS goals_user_id_status_idx ON public.goals (user_id, status);
CREATE INDEX IF NOT EXISTS goals_created_at_idx ON public.goals (created_at DESC);

-- 3. Index cho bảng learning_notes
CREATE INDEX IF NOT EXISTS learning_notes_user_id_idx ON public.learning_notes (user_id);
CREATE INDEX IF NOT EXISTS learning_notes_created_at_idx ON public.learning_notes (created_at DESC);

-- 4. Index cho bảng notifications
-- Đã có index cho user_id, is_read, created_at nhưng củng cố lại bằng composite index nếu cần
CREATE INDEX IF NOT EXISTS notifications_user_id_is_read_idx ON public.notifications (user_id, is_read);

-- 5. Index cho bảng mentor_student_links
CREATE INDEX IF NOT EXISTS mentor_links_student_id_idx ON public.mentor_student_links (student_id);
CREATE INDEX IF NOT EXISTS mentor_links_mentor_email_idx ON public.mentor_student_links (mentor_email);
CREATE INDEX IF NOT EXISTS mentor_links_mentor_id_idx ON public.mentor_student_links (mentor_id);
CREATE INDEX IF NOT EXISTS mentor_links_status_idx ON public.mentor_student_links (status);

-- 6. Index cho bảng mentor_reviews
CREATE INDEX IF NOT EXISTS mentor_reviews_student_id_idx ON public.mentor_reviews (student_id);
CREATE INDEX IF NOT EXISTS mentor_reviews_mentor_id_idx ON public.mentor_reviews (mentor_id);
CREATE INDEX IF NOT EXISTS mentor_reviews_target_idx ON public.mentor_reviews (target_type, target_id);

-- 7. Analyze tables để cập nhật thống kê cho query planner
ANALYZE public.tasks;
ANALYZE public.goals;
ANALYZE public.learning_notes;
ANALYZE public.notifications;
ANALYZE public.mentor_student_links;
ANALYZE public.mentor_reviews;
