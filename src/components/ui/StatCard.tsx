// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

type ColorVariant = 'rfqs' | 'jobs' | 'suppliers' | 'contractors'

const ICON_STYLES: Record<ColorVariant, { bg: string; icon: string }> = {
  rfqs:        { bg: 'bg-status-infoBg',     icon: 'text-brand-skyblue' },
  jobs:        { bg: 'bg-status-successBg',  icon: 'text-status-successText' },
  suppliers:   { bg: 'bg-status-warningBg',  icon: 'text-status-warningText' },
  contractors: { bg: 'bg-status-pendingBg',  icon: 'text-text-secondary' },
}

interface Props {
  label: string
  value: number | string
  icon: React.ElementType
  trend?: number
  trendValue?: string
  colorVariant: ColorVariant
}

export default function StatCard({ label, value, icon: Icon, trend = 0, trendValue, colorVariant }: Props) {
  const colors = ICON_STYLES[colorVariant]

  return (
    <div className="bg-surface-card border border-border-card rounded-[12px] px-[14px] py-[12px] flex items-center gap-[10px] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Icon box */}
      <div className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
        <Icon size={16} strokeWidth={1.75} className={colors.icon} />
      </div>

      {/* Text stack */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-text-muted whitespace-nowrap truncate">{label}</p>
        <p className="text-[20px] font-bold text-text-primary leading-[1.1]">{value}</p>
        <div className="flex items-center gap-[2px]">
          {trend > 0 ? (
            <>
              <TrendingUp size={9} className="text-status-successText" />
              <span className="text-[10px] font-semibold text-status-successText">
                {trendValue ?? `+${trend}%`}
              </span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown size={9} className="text-status-errorText" />
              <span className="text-[10px] font-semibold text-status-errorText">
                {trendValue ?? `${trend}%`}
              </span>
            </>
          ) : (
            <>
              <Minus size={9} className="text-text-muted" />
              <span className="text-[10px] font-semibold text-text-muted">
                {trendValue ?? 'No change'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
