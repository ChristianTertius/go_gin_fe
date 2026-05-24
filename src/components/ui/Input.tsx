import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 shadow-inner shadow-black/20 focus:border-cyan-400/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/40',
      className,
    )}
    {...props}
  />
))

Input.displayName = 'Input'
