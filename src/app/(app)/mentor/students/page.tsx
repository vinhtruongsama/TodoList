'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getMentorConnections, respondToInvitation } from '@/services/mentors'
import { Users, Check, ArrowRight, Loader2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MentorStudentLink } from '@/types'

export default function MentorStudentsPage() {
  const [connections, setConnections] = useState<MentorStudentLink[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConnections = useCallback(async () => {
    try {
      const data = await getMentorConnections()
      setConnections(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const data = await getMentorConnections()
        if (isMounted) setConnections(data)
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])

  async function handleResponse(id: string, status: 'accepted' | 'rejected') {
    const res = await respondToInvitation(id, status)
    if (res.success) {
      fetchConnections()
    }
  }

  const invitations = connections.filter(c => c.status === 'pending')
  const students = connections.filter(c => c.status === 'accepted')

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10 pb-24">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Học viên</h1>
        <p className="text-muted-foreground mt-1">Xem lời mời và theo dõi tiến trình của Student.</p>
      </header>

      {/* Invitations */}
      {invitations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold px-1 flex items-center gap-2">
            Lời mời mới <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{invitations.length}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invitations.map((inv) => (
              <div key={inv.id} className="p-6 bg-primary/5 border border-primary/20 rounded-[2rem] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center font-bold text-primary">
                    {inv.profiles?.full_name[0] || 'S'}
                  </div>
                  <div>
                    <p className="font-bold">{inv.profiles?.full_name || 'Student'}</p>
                    <p className="text-xs text-muted-foreground italic">Muốn kết nối với bạn</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleResponse(inv.id, 'accepted')} className="flex-1 rounded-xl bg-primary">Chấp nhận</Button>
                  <Button onClick={() => handleResponse(inv.id, 'rejected')} variant="outline" className="flex-1 rounded-xl">Từ chối</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Student List */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold px-1">Danh sách Student của bạn</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 bg-accent/20 rounded-[2.5rem] border-2 border-dashed">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Bạn chưa kết nối với Student nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((conn) => (
              <Link 
                key={conn.id} 
                href={`/mentor/students/${conn.student_id}`}
                className="p-6 bg-card border rounded-[2rem] shadow-sm hover:border-primary/50 transition-all group"
              >
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-xl font-black mb-4 group-hover:scale-110 transition-transform">
                  {conn.profiles?.full_name[0]}
                </div>
                <h3 className="font-bold text-lg mb-1">{conn.profiles?.full_name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Kết nối từ {conn.accepted_at ? new Date(conn.accepted_at).toLocaleDateString('vi-VN') : '---'}
                </div>
                <div className="mt-6 flex items-center justify-between text-primary font-bold text-sm">
                  Xem tiến độ <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
