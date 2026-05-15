'use server'

import { createClient } from '@/lib/supabase/server'
import { AppActivity } from '@/types'

/**
 * Lấy danh sách hoạt động học tập (Momentum Feed).
 * Có thể lấy cho bản thân hoặc cho học viên nếu là Mentor.
 */
export async function getMomentumFeed(
  userId?: string, 
  limit: number = 20, 
  offset: number = 0
) {
  const supabase = await createClient()
  
  // Nếu không truyền userId, mặc định lấy của user hiện tại
  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')
    targetUserId = user.id
  }

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', targetUserId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching momentum feed:', error)
    return { success: false, error: error.message }
  }

  return { 
    success: true, 
    data: data as AppActivity[] 
  }
}

/**
 * Lấy feed tổng hợp cho Mentor (Tất cả hoạt động của học viên).
 */
export async function getMentorStudentFeed(limit: number = 50) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Nhờ RLS, query này sẽ chỉ trả về những hoạt động mà Mentor có quyền xem
  // (dựa trên mentor_student_links)
  const { data, error } = await supabase
    .from('activities')
    .select('*, profiles:user_id(full_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching mentor student feed:', error)
    return { success: false, error: error.message }
  }

  return { 
    success: true, 
    data: data 
  }
}
