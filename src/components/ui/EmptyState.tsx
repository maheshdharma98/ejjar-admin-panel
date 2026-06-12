// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { Search } from 'lucide-react'

interface Props {
  icon?: React.ElementType
  title?: string
  subtitle?: string
  ctaLabel?: string
  onCta?: () => void
}

export default function EmptyState({
  icon: Icon = Search,
  title = 'No results',
  subtitle = 'Try adjusting your filters.',
  ctaLabel,
  onCta,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-input border border-border-card flex items-center justify-center">
        <Icon size={20} strokeWidth={1.5} className="text-text-label" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-text-primary">{title}</p>
        <p className="text-[11px] text-text-muted mt-1">{subtitle}</p>
      </div>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-1 px-4 py-2 rounded-[12px] bg-brand-orange text-white text-[13px] font-bold hover:bg-[#D4692E] transition-colors shadow-[0_2px_12px_rgba(230,126,58,0.20)]"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
