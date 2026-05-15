-- Migration: Fix Schema Drift and Optimize Performance
-- Date: 2026-05-16
-- Description: Adds missing columns to existing tables and ensures correct data types and indexes.

-- 1. Thêm các cột thiếu cho bảng goals
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goals' AND column_name='progress_percent') THEN
        ALTER TABLE public.goals ADD COLUMN progress_percent INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goals' AND column_name='description') THEN
        ALTER TABLE public.goals ADD COLUMN description TEXT;
    END IF;
END $$;

-- 2. Thêm cột thiếu cho bảng learning_notes (liên kết với goal steps)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='learning_notes' AND column_name='goal_step_id') THEN
        ALTER TABLE public.learning_notes ADD COLUMN goal_step_id UUID REFERENCES public.goal_steps(id);
    END IF;
END $$;

-- 3. Đảm bảo các Index quan trọng tồn tại
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON public.goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status_due ON public.tasks(user_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
