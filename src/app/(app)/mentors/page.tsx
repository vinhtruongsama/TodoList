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
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Người hướng dẫn</h1>
        <p className="text-muted-foreground mt-1">Kết nối với Mentor để nhận nhận xét và hỗ trợ.</p>
      </header>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="space-y-4 p-6 bg-card border rounded-[2.5rem] shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email của Mentor</label>
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mentor@example.com"
              required
              className="w-full h-14 pl-12 pr-4 rounded-2xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
        <Button disabled={inviting || !email.trim()} className="w-full h-14 rounded-2xl text-lg font-bold">
          {inviting ? <Loader2 className="animate-spin w-6 h-6" /> : "Gửi lời mời kết nối"}
        </Button>
      </form>

      {/* Invitation List */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold px-1">Danh sách kết nối</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : links.length === 0 ? (
          <div className="text-center py-12 bg-accent/20 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground">Bạn chưa mời Mentor nào.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-5 rounded-2xl border bg-card shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-xl font-bold">
                    {link.mentor_email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{link.mentor_email}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {link.status === 'pending' && <><Clock className="w-3.5 h-3.5 text-yellow-500" /> <span className="text-xs text-yellow-600 font-bold">Đang chờ</span></>}
                      {link.status === 'accepted' && <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> <span className="text-xs text-green-600 font-bold">Đã kết nối</span></>}
                      {link.status === 'rejected' && <><XCircle className="w-3.5 h-3.5 text-destructive" /> <span className="text-xs text-destructive font-bold">Đã từ chối</span></>}
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
