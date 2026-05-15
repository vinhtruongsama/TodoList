'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Goal, GoalStep } from '@/types'
import { ROUTES, VALIDATION } from '@/lib/constants'

/**
 * Lấy danh sách mục tiêu.
 */
export async function getGoals() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('goals')
    .select('id, title, status, progress_percent, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as Goal[]
}

/**
 * Lấy chi tiết một mục tiêu kèm các bước.
 */
export async function getGoalWithSteps(goalId: string) {
  const supabase = await createClient()
  
  const goalPromise = supabase.from('goals').select('id, title, description, status, progress_percent, created_at').eq('id', goalId).single()
  const stepsPromise = supabase.from('goal_steps').select('id, title, status, order_index').eq('goal_id', goalId).order('order_index', { ascending: true })

  const [goalRes, stepsRes] = await Promise.all([goalPromise, stepsPromise])

  if (goalRes.error) throw new Error(goalRes.error.message)
  
  return {
    goal: goalRes.data as Goal,
    steps: (stepsRes.data || []) as GoalStep[]
  }
}

/**
 * Tạo mục tiêu mới.
 */
export async function createGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const title = (formData.get('title') as string || '').trim()
  if (!title) return { error: 'Tiêu đề không được rỗng' }
  if (title.length > VALIDATION.TITLE_MAX_LENGTH) return { error: `Tiêu đề tối đa ${VALIDATION.TITLE_MAX_LENGTH} ký tự` }

  const { error } = await supabase.from('goals').insert({
    user_id: user.id,
    title,
    description: formData.get('description') as string,
    status: 'active'
  })

  if (error) return { error: error.message }
  revalidatePath(ROUTES.GOALS)
  return { success: true }
}

/**
 * Thêm bước mới cho mục tiêu.
 */
export async function createStep(goalId: string, title: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('goal_steps').insert({
    goal_id: goalId,
    user_id: user.id,
    title: title.trim(),
    status: 'pending'
  })

  if (error) return { error: error.message }
  revalidatePath(ROUTES.GOALS)
  revalidatePath(`${ROUTES.GOALS}/${goalId}`)
  return { success: true }
}

/**
 * Toggle trạng thái bước.
 */
export async function toggleStepStatus(stepId: string, currentStatus: string, goalId: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'

  const { error } = await supabase
    .from('goal_steps')
    .update({ 
      status: newStatus,
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null
    })
    .eq('id', stepId)

  if (error) return { error: error.message }
  revalidatePath(ROUTES.GOALS)
  revalidatePath(`${ROUTES.GOALS}/${goalId}`)
  return { success: true }
}
