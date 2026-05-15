'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TaskHistory, TaskHistoryEventType, CreateTaskHistoryInput } from '@/types'
import { ROUTES } from '@/lib/constants'

/**
 * Ghi nhận một sự kiện lịch sử cho task.
 * Đây là hàm cơ sở cho hệ thống Learning Accountability.
 */
export async function recordTaskEvent(input: CreateTaskHistoryInput) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Bạn cần đăng nhập để thực hiện hành động này.' }

    // Validation cơ bản
    if (!input.task_id) return { success: false, error: 'Thiếu ID nhiệm vụ.' }
    if (!input.event_type) return { success: false, error: 'Thiếu loại sự kiện.' }

    // Kiểm tra quyền sở hữu task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', input.task_id)
      .single()

    if (taskError || !task) {
      return { success: false, error: 'Nhiệm vụ không tồn tại hoặc không thuộc quyền sở hữu của bạn.' }
    }
    
    if (input.event_type === 'reflection' && (!input.content || input.content.trim().length === 0)) {
      return { success: false, error: 'Nội dung phản tư không được để trống.' }
    }

    if (input.content && input.content.length > 1000) {
      return { success: false, error: 'Nội dung quá dài (tối đa 1000 ký tự).' }
    }

    if (input.duration_minutes !== undefined && input.duration_minutes < 0) {
      return { success: false, error: 'Thời gian không được là số âm.' }
    }

    const { data, error } = await supabase
      .from('task_history')
      .insert({
        task_id: input.task_id,
        user_id: user.id,
        event_type: input.event_type,
        content: input.content?.trim(),
        duration_minutes: input.duration_minutes,
        mood: input.mood,
        difficulty: input.difficulty,
      })
      .select()
      .single()

    if (error) {
      console.error('Error recording task event:', error)
      return { success: false, error: 'Không thể lưu lịch sử nhiệm vụ.' }
    }

    revalidatePath(ROUTES.TASKS)
    return { success: true, data: data as TaskHistory }
  } catch (error) {
    console.error('Unexpected error in recordTaskEvent:', error)
    return { success: false, error: 'Đã xảy ra lỗi hệ thống.' }
  }
}

/**
 * Ghi nhận sự kiện hoàn thành task.
 */
export async function recordTaskCompleted(taskId: string) {
  return recordTaskEvent({
    task_id: taskId,
    event_type: 'completed'
  })
}

/**
 * Ghi nhận sự kiện phản tư (Reflection) sau khi học.
 */
export async function recordTaskReflection(taskId: string, content: string, mood?: string, difficulty?: 'easy' | 'normal' | 'hard') {
  return recordTaskEvent({
    task_id: taskId,
    event_type: 'reflection',
    content,
    mood,
    difficulty
  })
}

/**
 * Ghi nhận khi người dùng bỏ qua bước phản tư.
 */
export async function recordSkippedReflection(taskId: string) {
  return recordTaskEvent({
    task_id: taskId,
    event_type: 'skipped_reflection'
  })
}

/**
 * Lấy lịch sử của một task cụ thể.
 */
export async function getTaskHistory(taskId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })

    if (error) return { success: false, error: error.message }
    return { success: true, data: data as TaskHistory[] }
  } catch (error) {
    return { success: false, error: 'Lỗi tải lịch sử.' }
  }
}

/**
 * Lấy danh sách lịch sử học tập gần đây của người dùng.
 */
export async function getMyRecentTaskHistory(limit = 20) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('task_history')
      .select(`
        *,
        tasks (
          title
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return { success: false, error: error.message }
    return { success: true, data: data as any[] }
  } catch (error) {
    return { success: false, error: 'Lỗi tải lịch sử gần đây.' }
  }
}
