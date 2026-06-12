// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { Info } from 'lucide-react'
import { CATEGORY_CONFIG } from './CategoryChip'

export interface CategoryBar {
  category: string
  value: number
  trend?: string
  trendPositive?: boolean
}


interface Props {
  data: CategoryBar[]
  footerNote?: string
}

function normalize(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z]/g, '')
}

export default function CategoryBarChart({ data, footerNote }: Props) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex flex-col gap-3">
      {data.map((row) => {
        const key = normalize(row.category)
        const cfg = CATEGORY_CONFIG[key] ?? {
          icon: null,
          iconColor: 'text-text-muted',
          bg: 'bg-status-pendingBg',
          barColor: 'bg-text-muted',
          barHex: '#94A3B8',
          label: row.category,
        }
        const pct = (row.value / maxVal) * 100

        return (
          <div key={row.category} className="flex items-center gap-2">
            {/* Label col — fixed 72px */}
            <div className="w-[72px] flex-shrink-0 flex items-center">
              <span className={`inline-flex items-center gap-[3px] px-[6px] py-[2px] rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.iconColor} truncate max-w-full`}>
                {cfg.icon && <cfg.icon size={9} strokeWidth={2} />}
                <span className="truncate">{cfg.label}</span>
              </span>
            </div>

            {/* Bar track */}
            <div className="flex-1 h-[5px] bg-border-divider rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: cfg.barHex }}
              />
            </div>

            {/* Value */}
            <span className="text-[11px] font-bold text-text-primary w-4 text-end flex-shrink-0">
              {row.value}
            </span>

            {/* Trend pill */}
            {row.trend && (
              <span className={`text-[9px] font-semibold px-[5px] py-[1px] rounded-full flex-shrink-0 ${
                row.trendPositive
                  ? 'bg-status-successBg text-status-successText'
                  : 'bg-status-errorBg text-status-errorText'
              }`}>
                {row.trend}
              </span>
            )}
          </div>
        )
      })}

      {footerNote && (
        <div className="flex items-center gap-1 border-t border-border-divider pt-2 mt-1">
          <Info size={11} className="text-text-label flex-shrink-0" />
          <span className="text-[10px] text-text-label">{footerNote}</span>
        </div>
      )}
    </div>
  )
}
