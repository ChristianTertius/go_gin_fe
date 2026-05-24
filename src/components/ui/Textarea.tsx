import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 shadow-inner shadow-black/20 focus:border-cyan-400/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/40',
        className,
      )}
      {...props}
    />
  ),
)

Textarea.displayName = 'Textarea'
