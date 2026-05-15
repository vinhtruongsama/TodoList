'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { MentorStudentLink } from '@/types'
import { ROUTES } from '@/lib/constants'
import { createNotification } from './notifications'

/**
 * Student mời Mentor.
 */
export async function inviteMentor(email: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const normalizedEmail = email.toLowerCase().trim()

  // Không cho tự mời chính mình
  if (user.email === normalizedEmail) {
    return { error: 'Bạn không thể tự mời chính mình làm Mentor' }
  }

  const { error } = await supabase.from('mentor_student_links').insert({
    student_id: user.id,
    mentor_email: normalizedEmail,
    status: 'pending'
  })

  if (error) return { error: error.message }

  // Tìm Mentor trong DB để gửi thông báo (nếu họ đã có account)
  const { data: mentorProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (mentorProfile) {
    await createNotification({
      userId: mentorProfile.id,
      type: 'new_invitation',
      title: 'Lời mời kết nối mới',
      message: `Học viên ${user.user_metadata?.full_name || user.email} muốn kết nối với bạn.`,
      relatedEntityType: 'mentor_student_link'
    })
  }

  revalidatePath(ROUTES.MENTORS)
  return { success: true }
}

/**
 * Mentor lấy danh sách lời mời và student.
 */
export async function getMentorConnections() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Link có profile của student (Sử dụng join bảng profiles qua student_id)
  const { data, error } = await supabase
    .from('mentor_student_links')
    .select('*, profiles:student_id(full_name)')
    .or(`mentor_email.eq.${user.email},mentor_id.eq.${user.id}`)

  if (error) throw new Error(error.message)
  return data as MentorStudentLink[]
}

/**
 * Mentor chấp nhận/từ chối.
 */
export async function respondToInvitation(linkId: string, status: 'accepted' | 'rejected') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('mentor_student_links')
    .update({ 
      status,
      mentor_id: user.id,
      accepted_at: status === 'accepted' ? new Date().toISOString() : null
    })
    .eq('id', linkId)

  if (error) return { error: error.message }

  // Nếu chấp nhận, gửi thông báo cho Student
  if (status === 'accepted') {
    const { data: link } = await supabase
      .from('mentor_student_links')
      .select('student_id')
      .eq('id', linkId)
      .single()

    if (link) {
      await createNotification({
        userId: link.student_id,
        type: 'invitation_accepted',
        title: 'Mentor đã chấp nhận kết nối',
        message: `Mentor ${user.user_metadata?.full_name || 'bạn mời'} đã chấp nhận lời mời của bạn.`,
        relatedEntityType: 'mentor_student_link',
        relatedEntityId: linkId
      })
    }
  }

  revalidatePath(ROUTES.MENTOR_STUDENTS)
  return { success: true }
}

/**
 * Lấy danh sách mentor của student.
 */
export async function getStudentMentors() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('mentor_student_links')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as MentorStudentLink[]
}
