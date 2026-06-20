type ConversationItemProps = {
  id: string
  title: string
  isActive: boolean
  onSelect: (id: string) => void
}

export function ConversationItem({ id, title, isActive, onSelect }: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm transition ${
        isActive
          ? 'bg-surface-elevated text-white'
          : 'text-muted hover:bg-surface-elevated/70 hover:text-white'
      }`}
    >
      {title}
    </button>
  )
}
