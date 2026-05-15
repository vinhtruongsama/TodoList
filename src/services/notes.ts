'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { LearningNote } from '@/types'
import { ROUTES, VALIDATION } from '@/lib/constants'

/**
 * Lấy danh sách ghi chú.
 */
export async function getNotes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('learning_notes')
    .select('*')
    .order('note_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as LearningNote[]
}

/**
 * Tạo ghi chú mới.
 */
export async function createNote(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const title = (formData.get('title') as string || '').trim()
  const content = (formData.get('content') as string || '').trim()

  if (!title || !content) return { error: 'Tiêu đề và nội dung không được để trống' }
  if (title.length > VALIDATION.TITLE_MAX_LENGTH) return { error: `Tiêu đề tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự` }

  const { error } = await supabase.from('learning_notes').insert({
    user_id: user.id,
    title,
    content,
    task_id: formData.get('task_id') as string || null,
    goal_id: formData.get('goal_id') as string || null,
    goal_step_id: formData.get('goal_step_id') as string || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/notes')
  return { success: true }
}

/**
 * Xóa ghi chú.
 */
export async function deleteNote(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('learning_notes').delete().eq('id', id)

  if (error) return { error: error.message }
  revalidatePath(ROUTES.NOTES)
  return { success: true }
}
