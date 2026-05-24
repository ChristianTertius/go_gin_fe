import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Panel } from '../components/Panel'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

const registerSchema = z
  .object({
    email: z.string().email('Email tidak valid'),
    username: z.string().min(3, 'Minimal 3 karakter'),
    password: z.string().min(6, 'Minimal 6 karakter'),
    password_confirm: z.string().min(6, 'Minimal 6 karakter'),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Konfirmasi password tidak sama',
    path: ['password_confirm'],
  })

type Mode = 'login' | 'register'

export const AuthPage = ({ mode }: { mode: Mode }) => {
  const isLogin = mode === 'login'
  const { login, register, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    defaultValues: isLogin
      ? { email: '', password: '' }
      : { email: '', username: '', password: '', password_confirm: '' },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onSubmit = form.handleSubmit(async (values) => {
    if (isLogin) {
      await login(values)
      navigate('/', { replace: true })
    } else {
      await register(values as any)
      navigate('/login')
    }
  })

  const title = isLogin ? 'Masuk ke akun' : 'Buat akun baru'
  const subtitle = isLogin ? 'Akses timeline dan mulai diskusi.' : 'Mulai berbagi ide terbaikmu.'

  return (
    <div className="mx-auto grid max-w-3xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="relative overflow-hidden p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-500" />
        <p className="text-sm uppercase tracking-[4px] text-cyan-200/80">Go Gin Tweetboard</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 text-slate-300">{subtitle}</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Email</label>
            <Input placeholder="nama@email.com" {...form.register('email')} />
            {form.formState.errors.email && (
              <p className="text-sm text-rose-300">{form.formState.errors.email.message as string}</p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Username</label>
              <Input placeholder="username" {...form.register('username')} />
              {form.formState.errors.username && (
                <p className="text-sm text-rose-300">{form.formState.errors.username.message as string}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Password</label>
            <Input type="password" placeholder="••••••" {...form.register('password')} />
            {form.formState.errors.password && (
              <p className="text-sm text-rose-300">{form.formState.errors.password.message as string}</p>
            )}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Konfirmasi Password</label>
              <Input type="password" placeholder="••••••" {...form.register('password_confirm')} />
              {form.formState.errors.password_confirm && (
                <p className="text-sm text-rose-300">
                  {form.formState.errors.password_confirm.message as string}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {isLogin ? 'Masuk' : 'Daftar'}
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-300">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <Link
            to={isLogin ? '/register' : '/login'}
            className="font-semibold text-cyan-300 transition hover:text-white"
          >
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </Link>
        </p>
      </Panel>

      <Panel className="relative overflow-hidden p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-indigo-500/10 to-transparent" />
        <div className="relative space-y-4">
          <div className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[3px] text-cyan-100">
            Real-time story board
          </div>
          <h2 className="text-2xl font-bold text-white">Bagi ide, dapatkan tanggapan.</h2>
          <p className="text-sm leading-relaxed text-slate-200">
            Timeline ini terhubung dengan backend Go-Gin. Semua aksi—buat, suka, komentar—langsung ke API.
            Tampilan dirancang ringkas, fokus pada konten, dengan status yang jelas untuk setiap aksi.
          </p>

          <ul className="space-y-3 text-sm text-slate-200">
            <li>• Autentikasi dengan JWT + refresh token bridge</li>
            <li>• Query caching dan invalidasi via React Query</li>
            <li>• Form dengan validasi Zod + RHF</li>
            <li>• UI bernuansa kaca, gradien, responsif</li>
          </ul>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Endpoint Base</p>
            <p className="text-cyan-100">{import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080'}</p>
            <p className="text-slate-400">Edit di .env.local jika perlu.</p>
          </div>
        </div>
      </Panel>
    </div>
  )
}
