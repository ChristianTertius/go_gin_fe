import { cn } from '../utils/cn'

type PanelProps = React.HTMLAttributes<HTMLDivElement>

export const Panel = ({ className, ...props }: PanelProps) => (
  <div
    className={cn(
      'relative rounded-2xl border border-white/10 bg-white/5 shadow-glass backdrop-blur-lg',
      className,
    )}
    {...props}
  />
)
