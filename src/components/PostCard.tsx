import { Link } from 'react-router-dom'
import { Panel } from './Panel'
import { Button } from './ui/Button'
import type { Post } from '../types'
import { timeAgo } from '../utils/format'
import { cn } from '../utils/cn'
import { HeartIcon } from './icons/Heart'

type PostCardProps = {
  post: Post
  onLike: () => void
  onDelete?: () => void
  canEdit?: boolean
  compact?: boolean
  liked?: boolean
}

export const PostCard = ({ post, onLike, onDelete, canEdit, compact = false, liked = false }: PostCardProps) => {
  return (
    <Panel className="group relative overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40" />
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[3px] text-cyan-200/80">{post.username}</p>
          <p className="text-sm text-slate-400">{timeAgo(post.created_at)}</p>
        </div>
        {canEdit && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-rose-300 transition hover:text-rose-200"
          >
            Hapus
          </button>
        )}
      </div>

      <h3 className="text-xl font-semibold text-white">{post.title}</h3>
      <p
        className={cn(
          'mt-2 text-sm leading-relaxed text-slate-200 whitespace-pre-line',
          compact ? 'line-clamp-3' : '',
        )}
      >
        {post.content}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-300">
        <span className="rounded-full bg-white/5 px-3 py-1">{post.comments.length} komentar</span>
        <span className="rounded-full bg-white/5 px-3 py-1">{post.like_count} suka</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onLike}
          className={cn(
            'aspect-square w-11 p-0 border border-white/10',
            liked ? 'bg-rose-500/20 hover:bg-rose-500/30' : '',
          )}
          aria-label="Suka atau batal suka"
        >
          <HeartIcon
            className={cn('h-5 w-5 text-rose-200', liked ? 'text-rose-300' : '')}
            filled={liked}
          />
        </Button>
        <Link
          to={`/posts/${post.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/60"
        >
          Lihat detail
        </Link>
      </div>
    </Panel>
  )
}
