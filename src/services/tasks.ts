'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Task } from '@/types'
import { VALIDATION, ROUTES } from '@/lib/constants'

/**
 * Lấy danh sách task của ngày hôm nay.
 */
export async function getTodayTasks() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, priority, status, created_at')
    .eq('due_date', today)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Task[]
}

/**
 * Thêm task mới.
 */
export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const title = (formData.get('title') as string || '').trim()
  const priority = (formData.get('priority') as 'low' | 'medium' | 'high') || 'medium'

  if (title.length > VALIDATION.TITLE_MAX_LENGTH) return { error: `Tiêu đề tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự` }

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title,
    priority,
    status: 'pending'
  })

  if (error) return { error: error.message }
  
  revalidatePath(ROUTES.TASKS)
  return { success: true }
}

/**
 * Thay đổi trạng thái hoàn thành.
 */
export async function toggleTaskStatus(id: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
  const completedAt = newStatus === 'completed' ? new Date().toISOString() : null

  const { error } = await supabase
    .from('tasks')
    .update({ 
      status: newStatus,
      completed_at: completedAt
    })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath(ROUTES.TASKS)
  return { success: true }
}

/**
 * Xóa task.
 */
export async function deleteTask(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/tasks')
  return { success: true }
}
