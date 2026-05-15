'use server'

import { createClient } from '@/lib/supabase/server'
import { Task, Goal, LearningNote, UserRole } from '@/types'

export async function getStudentSummary(studentId?: string) {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  // Lấy dữ liệu song song với field selection tối ưu
  let tasksQuery = supabase
    .from('tasks')
    .select('id, status')
    .eq('due_date', today)

  let goalsQuery = supabase
    .from('goals')
    .select('id, title, status, progress_percent, created_at')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(2)

  let notesQuery = supabase
    .from('learning_notes')
    .select('id, title, content, created_at')
    .order('created_at', { ascending: false })
    .limit(3)

  // Nếu mentor xem học sinh, gán ID. Nếu xem chính mình, RLS tự động lo việc filter theo auth.uid()
  if (studentId) {
    tasksQuery = tasksQuery.eq('user_id', studentId)
    goalsQuery = goalsQuery.eq('user_id', studentId)
    notesQuery = notesQuery.eq('user_id', studentId)
  }

  const [tasksRes, goalsRes, notesRes] = await Promise.all([
    tasksQuery,
    goalsQuery,
    notesQuery
  ])

  const tasks = (tasksRes.data || [])
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
