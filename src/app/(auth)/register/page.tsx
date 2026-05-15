'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signUp } from '@/services/auth'
import { Loader2, GraduationCap, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'mentor'>('student')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    formData.append('role', role)
    
    const result = await signUp(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(result.success)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20 p-6">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl border shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Bắt đầu ngay!</h1>
          <p className="text-muted-foreground mt-2">Tạo tài khoản để quản lý tiến trình của bạn.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-green-500/10 text-green-600 text-sm font-medium border border-green-500/20 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium px-1">Bạn là ai?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all space-y-1",
                  role === 'student' ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                )}
              >
                <GraduationCap className="w-6 h-6" />
                <span className="text-xs font-semibold">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all space-y-1",
                  role === 'mentor' ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                )}
              >
                <Users className="w-6 h-6" />
                <span className="text-xs font-semibold">Mentor</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium px-1">Họ và tên</label>
            <input 
              name="fullName"
              type="text" 
              required
              placeholder="Nguyễn Văn A"
              className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium px-1">Email</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="name@example.com"
              className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium px-1">Mật khẩu</label>
            <input 
              name="password"
              type="password" 
              required
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Đăng ký'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
