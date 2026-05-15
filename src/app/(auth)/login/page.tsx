'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signIn } from '@/services/auth'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await signIn(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20 p-6">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl border shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Chào mừng trở lại!</h1>
          <p className="text-muted-foreground mt-2">Đăng nhập để tiếp tục hành trình học tập.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? <Loader2 className="animate-spin" /> : 'Đăng nhập'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
