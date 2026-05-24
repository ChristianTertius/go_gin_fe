import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'

import { fetchPostById, likeOrUnlikePostRequest, createCommentRequest, likeOrUnlikeCommentRequest } from '../api/posts'
import { Panel } from '../components/Panel'
import { Button } from '../components/ui/Button'
import { Loader } from '../components/Loader'
import { Textarea } from '../components/ui/Textarea'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../lib/api'
import { timeAgo } from '../utils/format'
import { HeartIcon } from '../components/icons/Heart'

const commentSchema = z.object({ content: z.string().min(1, 'Komentar tidak boleh kosong') })

export const PostDetailPage = () => {
  const params = useParams()
  const id = Number(params.id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()
  const [likedPost, setLikedPost] = useState(false)
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())

  const { data: post, isLoading, isError, refetch } = useQuery({
    queryKey: ['post-detail', id],
    queryFn: () => fetchPostById(id),
    enabled: Boolean(id),
  })

  useEffect(() => {
    setLikedPost(false)
    setLikedComments(new Set())
  }, [id])

  const likePostMutation = useMutation({
    mutationFn: () => likeOrUnlikePostRequest({ post_id: id }),
    onSuccess: async () => {
      setLikedPost((prev) => !prev)
      await queryClient.invalidateQueries({ queryKey: ['post-detail', id] })
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const commentMutation = useMutation({
    mutationFn: createCommentRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['post-detail', id] })
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      form.reset()
      toast.success('Komentar dikirim')
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const likeCommentMutation = useMutation({
    mutationFn: likeOrUnlikeCommentRequest,
    onSuccess: async (_data, variables) => {
      setLikedComments((prev) => {
        const next = new Set(prev)
        if (next.has(variables.comment_id)) next.delete(variables.comment_id)
        else next.add(variables.comment_id)
        return next
      })
      await queryClient.invalidateQueries({ queryKey: ['post-detail', id] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const form = useForm({ resolver: zodResolver(commentSchema), defaultValues: { content: '' } })

  const handleProtected = (action: () => void) => {
    if (!isAuthenticated) {
      toast.error('Perlu login untuk aksi ini')
      navigate('/login')
      return
    }
    action()
  }

  const handleComment = form.handleSubmit((values) =>
    handleProtected(() => commentMutation.mutate({ ...values, post_id: id })),
  )

  if (isLoading) {
    return (
      <Panel className="p-6">
        <Loader label="Memuat detail..." />
      </Panel>
    )
  }

  if (isError || !post) {
    return (
      <Panel className="p-6">
        <p className="text-rose-300">Gagal memuat. <button className="underline" onClick={() => refetch()}>Coba lagi</button></p>
      </Panel>
    )
  }

  return (
    <div className="space-y-6">
      <Panel className="p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[3px] text-cyan-200/80">{post.username}</p>
            <p className="text-sm text-slate-400">{timeAgo(post.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleProtected(() => likePostMutation.mutate())}
              loading={likePostMutation.isPending}
              className="aspect-square w-11 p-0"
              aria-label="Suka atau batal suka"
            >
              <HeartIcon className="h-5 w-5 text-rose-200" filled={likedPost} />
            </Button>
            <span className="text-sm text-slate-200">{post.like_count}</span>
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-bold text-white">{post.title}</h1>
        <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-slate-200">{post.content}</p>
      </Panel>

      <Panel className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Komentar ({post.comments.length})</h3>
          {!isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Masuk untuk komentar
            </Button>
          )}
        </div>

        {isAuthenticated && (
          <form className="mt-4 space-y-3" onSubmit={handleComment}>
            <Textarea rows={3} placeholder="Tulis komentar" {...form.register('content')} />
            {form.formState.errors.content && (
              <p className="text-sm text-rose-300">{form.formState.errors.content.message as string}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit" loading={commentMutation.isPending}>
                Kirim
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {post.comments.length === 0 && (
            <p className="text-sm text-slate-300">Belum ada komentar.</p>
          )}

          {post.comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-white/5 bg-white/5 p-4 shadow-inner shadow-black/10"
            >
              <div className="flex items-center justify-between text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">@{comment.username}</span>
                  <span className="text-slate-400">{timeAgo(comment.created_at)}</span>
                </div>
                <button
                  type="button"
                  className={
                    'flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-cyan-200 transition hover:border-cyan-300 hover:text-white'
                  }
                  onClick={() =>
                    handleProtected(() => likeCommentMutation.mutate({ comment_id: comment.id }))
                  }
                  aria-label="Suka komentar"
                >
                  <HeartIcon className="h-4 w-4" filled={likedComments.has(comment.id)} />
                  <span className="text-xs text-slate-100">{comment.like_count}</span>
                </button>
              </div>
              <p className="mt-2 whitespace-pre-line text-slate-100">{comment.content}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
