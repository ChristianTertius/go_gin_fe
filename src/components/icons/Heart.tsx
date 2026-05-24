type HeartIconProps = {
  className?: string
  filled?: boolean
}

export const HeartIcon = ({ className, filled = false }: HeartIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s-6.75-4.35-9-9a5.25 5.25 0 0 1 9-4.5 5.25 5.25 0 0 1 9 4.5c-2.25 4.65-9 9-9 9Z"
    />
  </svg>
)
