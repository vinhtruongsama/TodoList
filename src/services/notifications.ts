'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { AppNotification, NotificationType } from '@/types'
import { ROUTES } from '@/lib/constants'

/**
 * Tạo thông báo (Dùng nội bộ trong Server Actions)
 */
export async function createNotification(params: {
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedEntityType?: string
  relatedEntityId?: string
}) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('notifications').insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    message: params.message,
    related_entity_type: params.relatedEntityType,
    related_entity_id: params.relatedEntityId
  })

  if (error) {
    console.error('Failed to create notification:', error)
    return { error: error.message }
  }

  return { success: true }
}

/**
 * Lấy danh sách thông báo của người dùng hiện tại
 */
export async function getMyNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, message, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data as AppNotification[]
}

/**
 * Đánh dấu một thông báo là đã đọc
 */
export async function markAsRead(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath(ROUTES.NOTIFICATIONS || '/notifications')
  return { success: true }
}

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
export async function markAllAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) return { error: error.message }

  revalidatePath(ROUTES.NOTIFICATIONS || '/notifications')
  return { success: true }
}

/**
 * Lấy số lượng thông báo chưa đọc
 */
export async function getUnreadCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  // Chỉ lấy COUNT, không lấy data (head: true)
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) return 0
  return count || 0
}
