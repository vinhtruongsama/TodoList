'use server'

import { createClient } from '@/lib/supabase/server'
import { Task, Goal, LearningNote, UserRole } from '@/types'

export async function getStudentSummary(studentId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const targetId = studentId || user?.id

  if (!targetId) throw new Error('No target user found')

  const today = new Date().toISOString().split('T')[0]

  // Lấy dữ liệu song song để tối ưu tốc độ
  const tasksPromise = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', targetId)
    .eq('due_date', today)

  const goalsPromise = supabase
    .from('goals')
    .select('*')
    .eq('user_id', targetId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(2)

  const notesPromise = supabase
    .from('learning_notes')
    .select('*')
    .eq('user_id', targetId)
    .order('created_at', { ascending: false })
    .limit(3)

  const [tasksRes, goalsRes, notesRes] = await Promise.all([
    tasksPromise,
    goalsPromise,
    notesPromise
  ])

  const tasks = (tasksRes.data || []) as Task[]
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'completed').length
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return {
    stats: {
      totalTasks,
      completedTasks,
      progressPercent
    },
    activeGoals: (goalsRes.data || []) as Goal[],
    recentNotes: (notesRes.data || []) as LearningNote[]
  }
}

export async function getUserRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role as UserRole
}
