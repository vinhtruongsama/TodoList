'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { MentorReview, ReviewTargetType } from '@/types'
import { ROUTES } from '@/lib/constants'
import { createNotification } from './notifications'

/**
 * Mentor tạo nhận xét cho Student.
 */
export async function createReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Vui lòng đăng nhập' }

  const studentId = formData.get('studentId') as string
  const targetType = (formData.get('targetType') as ReviewTargetType) || 'dashboard'
  const targetId = formData.get('targetId') as string
  const comment = (formData.get('comment') as string || '').trim()
  const rating = parseInt(formData.get('rating') as string)

  if (!studentId) return { error: 'Thiếu ID học viên' }
  if (!comment) return { error: 'Nội dung nhận xét không được rỗng' }
  if (comment.length > 1000) return { error: 'Nhận xét quá dài (tối đa 1000 ký tự)' }

  if (!isNaN(rating)) {
    if (rating < 1 || rating > 5) return { error: 'Đánh giá phải từ 1 đến 5 sao' }
  }

  const { error } = await supabase.from('mentor_reviews').insert({
    mentor_id: user.id,
    student_id: studentId,
    target_type: targetType,
    target_id: targetId || null,
    comment,
    rating: isNaN(rating) ? null : rating
  })

  if (error) return { error: error.message }

  // Tạo thông báo cho Student
  await createNotification({
    userId: studentId,
    type: 'new_review',
    title: 'Nhận xét mới từ Mentor',
    message: `Mentor ${user.user_metadata?.full_name || 'của bạn'} vừa gửi một nhận xét mới.`,
    relatedEntityType: 'mentor_review',
    relatedEntityId: undefined // Sẽ tốt hơn nếu lấy được ID vừa insert, nhưng inserts trong Supabase JS client không trả về ID trừ khi dùng .select()
  })

  revalidatePath(ROUTES.REVIEWS)
  revalidatePath(`${ROUTES.MENTOR_STUDENTS}/${studentId}`)
  return { success: true }
}

/**
 * Lấy danh sách nhận xét của Student hiện tại.
 */
export async function getStudentReviews() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('mentor_reviews')
    .select(`
      *,
      profiles:mentor_id (full_name)
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data as MentorReview[]
}

/**
 * Lấy danh sách nhận xét cho một Student (dành cho Mentor xem lại).
 */
export async function getReviewsByStudentId(studentId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('mentor_reviews')
    .select(`
      *,
      profiles:mentor_id (full_name)
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data as MentorReview[]
}

/**
 * Xóa nhận xét (Chỉ dành cho Mentor của chính nhận xét đó).
 */
export async function deleteReview(id: string, studentId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('mentor_reviews')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath(ROUTES.REVIEWS)
  revalidatePath(`${ROUTES.MENTOR_STUDENTS}/${studentId}`)
  return { success: true }
}
