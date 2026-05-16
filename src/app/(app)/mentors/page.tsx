'use client'

import React, { useState, useEffect } from 'react'
import { inviteMentor, getStudentMentors } from '@/services/mentors'
import { MentorStudentLink } from '@/types'
import { Clock, CheckCircle2, XCircle, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StudentMentorsPage() {
  const [email, setEmail] = useState('')
  const [links, setLinks] = useState<MentorStudentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    fetchMentors()
  }, [])

  async function fetchMentors() {
    try {
      const data = await getStudentMentors()
      setLinks(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setInviting(true)
    const res = await inviteMentor(email)
    if (res.success) {
      setEmail('')
      fetchMentors()
    }
    setInviting(false)
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-10 pb-32">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Người hướng dẫn</h1>
        <p className="text-sm text-muted-foreground">Kết nối với Mentor để nhận phản hồi và lộ trình học tập.</p>
      </header>

      {/* Invite Form */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-muted-foreground px-1">Mời Mentor mới</h2>
        <form onSubmit={handleInvite} className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Email của Mentor</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mentor@example.com"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-lg border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>
            <Button disabled={inviting || !email.trim()} className="w-full h-11 font-bold">
              {inviting ? <Loader2 className="animate-spin w-5 h-5" /> : "Gửi lời mời kết nối"}
            </Button>
          </div>
        </form>
      </section>

      {/* Invitation List */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-muted-foreground px-1">Danh sách đã mời</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin w-8 h-8 text-primary/40" /></div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border/60">
            <p className="text-sm text-muted-foreground">Bạn chưa mời Mentor nào.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold">
                    {link.mentor_email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{link.mentor_email}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {link.status === 'pending' && <><Clock className="w-3 h-3 text-amber-500" /> <span className="text-[11px] text-amber-600 font-bold">Đang chờ</span></>}
                      {link.status === 'accepted' && <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> <span className="text-[11px] text-emerald-600 font-bold">Đã kết nối</span></>}
                      {link.status === 'rejected' && <><XCircle className="w-3 h-3 text-destructive" /> <span className="text-[11px] text-destructive font-bold">Đã từ chối</span></>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
