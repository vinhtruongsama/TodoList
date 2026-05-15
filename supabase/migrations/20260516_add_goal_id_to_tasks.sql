-- 1. Thêm cột goal_id vào bảng tasks (Liên kết nhiệm vụ với mục tiêu)
-- Sử dụng DO block để đảm bảo tính an toàn và Idempotent (chạy lại nhiều lần không lỗi)
DO $$
BEGIN
    -- Thêm cột nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = 'tasks' AND column_name = 'goal_id') THEN
        ALTER TABLE public.tasks ADD COLUMN goal_id UUID;
    END IF;

    -- Thêm ràng buộc Foreign Key nếu chưa tồn tại
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE constraint_name = 'tasks_goal_id_fkey') THEN
        ALTER TABLE public.tasks 
        ADD CONSTRAINT tasks_goal_id_fkey 
        FOREIGN KEY (goal_id) REFERENCES public.goals(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Chỉ mục để tối ưu hiệu suất truy vấn
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON public.tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_goal ON public.tasks(user_id, goal_id);

-- 3. Đảm bảo tính toàn vẹn dữ liệu chéo người dùng (Cross-user Integrity)
-- Hàm kiểm tra: Đảm bảo goal_id được gán vào task phải thuộc về cùng một user_id
CREATE OR REPLACE FUNCTION public.check_task_goal_ownership()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu goal_id không NULL, kiểm tra xem goal đó có thuộc về user_id của task không
  IF NEW.goal_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.goals
      WHERE id = NEW.goal_id AND user_id = NEW.user_id
    ) THEN
      RAISE EXCEPTION 'Mục tiêu không tồn tại hoặc không thuộc quyền sở hữu của người dùng này.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger kiểm tra trước khi INSERT hoặc UPDATE
-- DROP và CREATE lại để đảm bảo cập nhật logic mới nhất nếu có thay đổi
DROP TRIGGER IF EXISTS tr_check_task_goal_ownership ON public.tasks;
CREATE TRIGGER tr_check_task_goal_ownership
BEFORE INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE PROCEDURE public.check_task_goal_ownership();
