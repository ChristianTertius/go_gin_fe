import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import {
  createPostRequest,
  deletePostRequest,
  fetchPosts,
  likeOrUnlikePostRequest,
} from '../api/posts'
import { Panel } from '../components/Panel'
import { PostCard } from '../components/PostCard'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Loader } from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/api'
import type { PaginatedPosts, Post } from '../types'

const postSchema = z.object({
  title: z.string().min(3, 'Minimal 3 karakter'),
  content: z.string().min(5, 'Minimal 5 karakter'),
})

export const FeedPage = () => {
  const [page, setPage] = useState(1)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const limit = 6
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const { data, isLoading, isError, refetch } = useQuery<PaginatedPosts>({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page, limit),
    placeholderData: (previous) => previous,
  })

  const form = useForm({ resolver: zodResolver(postSchema), defaultValues: { title: '', content: '' } })

  const createMutation = useMutation({
    mutationFn: createPostRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      form.reset()
      toast.success('Tulisan dikirim')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const likeMutation = useMutation({
    mutationFn: likeOrUnlikePostRequest,
    onSuccess: async (_, variables) => {
      setLikedPosts((prev) => {
        const next = new Set(prev)
        if (next.has(variables.post_id)) next.delete(variables.post_id)
        else next.add(variables.post_id)
        return next
      })
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      await queryClient.invalidateQueries({ queryKey: ['post-detail'] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePostRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post dihapus')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const posts: Post[] = useMemo(() => data?.data || [], [data])
  const currentPage = data?.current_page ?? page
  const totalPage = data?.total_page ?? 1

  const handleProtected = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error('Perlu login untuk aksi ini')
      navigate('/login')
      return
    }
    action()
  }

  const handleCreate = form.handleSubmit((values) =>
    handleProtected(() => createMutation.mutate(values)),
  )

  const hero = (
    <Panel className="overflow-hidden p-8 sm:p-10">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.12), transparent 30%), radial-gradient(circle at 80% 0%, rgba(94,234,212,0.12), transparent 25%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        }}
      />
      <div className="relative">
        <p className="text-sm uppercase tracking-[4px] text-cyan-100">Timeline Publik</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Bagikan ide, bangun percakapan.</h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Frontend ini terhubung langsung ke backend Go-Gin. Aksi suka, komentar, atau postingan baru akan tercatat real-time melalui API.
        </p>
      </div>
    </Panel>
  )

  return (
    <div className="space-y-6">
      {hero}

      {isAuthenticated ? (
        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[3px] text-cyan-200/80">Tulis sesuatu</p>
              <h3 className="text-lg font-semibold text-white">Apa kabar hari ini?</h3>
            </div>
            <div className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200">@{user?.username}</div>
          </div>

          <form className="mt-4 space-y-3" onSubmit={handleCreate}>
            <Input placeholder="Judul" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-sm text-rose-300">{form.formState.errors.title.message as string}</p>
            )}

            <Textarea rows={4} placeholder="Tulis sesuatu..." {...form.register('content')} />
            {form.formState.errors.content && (
              <p className="text-sm text-rose-300">{form.formState.errors.content.message as string}</p>
            )}

            <div className="flex justify-end">
              <Button type="submit" loading={createMutation.isPending}>
                Publikasikan
              </Button>
            </div>
          </form>
        </Panel>
      ) : (
        <Panel className="flex items-center justify-between gap-4 p-6">
          <div>
            <p className="text-sm uppercase tracking-[3px] text-cyan-100">Mulai bergabung</p>
            <p className="text-lg font-semibold text-white">Masuk untuk menulis atau memberikan suka.</p>
          </div>
          <Button onClick={() => navigate('/login')}>Masuk</Button>
        </Panel>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Linimasa</h2>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>Halaman {currentPage} / {data ? data.total_page : '–'}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!data || currentPage >= totalPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {isLoading && (
        <Panel className="p-6">
          <Loader label="Memuat linimasa..." />
        </Panel>
      )}

      {isError && (
        <Panel className="p-6">
          <p className="text-rose-300">Gagal memuat. <button className="underline" onClick={() => refetch()}>Coba lagi</button></p>
        </Panel>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <Panel className="p-6 text-slate-200">Belum ada postingan. Jadi yang pertama!</Panel>
      )}

      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            compact
            onLike={() =>
              handleProtected(() => likeMutation.mutate({ post_id: post.id }))
            }
            onDelete={
              user?.username === post.username
                ? () => handleProtected(() => deleteMutation.mutate(post.id))
                : undefined
            }
            canEdit={user?.username === post.username}
            liked={likedPosts.has(post.id)}
          />
        ))}
      </div>
    </div>
  )
}
