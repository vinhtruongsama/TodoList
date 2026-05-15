-- 1. Thêm Index để tăng tốc độ truy vấn theo người dùng và ngày tháng
CREATE INDEX IF NOT EXISTS tasks_user_id_due_date_idx ON public.tasks (user_id, due_date);

-- 2. Hàm tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Trigger cho bảng tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
