import { forwardRef } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:from-sky-400 hover:to-cyan-300 shadow-md shadow-sky-900/40',
  secondary: 'bg-panel text-white border border-border hover:border-accent',
  ghost: 'bg-transparent text-white border border-border hover:border-accent/60',
  danger: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:opacity-90',
}

const sizeClass: Record<Size, string> = {
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-5 py-3',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', loading = false, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
