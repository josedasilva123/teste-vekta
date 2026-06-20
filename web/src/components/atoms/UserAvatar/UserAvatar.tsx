import { getUserInitial } from '@/lib/userInitials'

type UserAvatarProps = {
  name: string
  className?: string
}

export function UserAvatar({ name, className = '' }: UserAvatarProps) {
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white ${className}`}
      aria-hidden="true"
    >
      {getUserInitial(name)}
    </span>
  )
}
