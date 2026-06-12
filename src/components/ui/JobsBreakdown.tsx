// EJJAR Admin Panel — EJJAR Design System v1.0
import { TrendingUp } from 'lucide-react'

interface Props {
  jobs: Record<string, number>
  completionRate: number
  completionTrend?: string
}

// Static class strings so Tailwind JIT always scans them
const STATUS_ROWS = [
  { key: 'in_progress', label: 'In Progress', dotClass: 'bg-brand-skyblue',    fillClass: 'bg-brand-skyblue' },
  { key: 'completed',   label: 'Completed',   dotClass: 'bg-semantic-success', fillClass: 'bg-semantic-success' },
  { key: 'pending',     label: 'Pending',     dotClass: 'bg-semantic-warning', fillClass: 'bg-semantic-warning' },
  { key: 'cancelled',   label: 'Cancelled',   dotClass: 'bg-semantic-error',   fillClass: 'bg-semantic-error' },
]

export default function JobsBreakdown({ jobs, completionRate, completionTrend = '+5%' }: Props) {
  const total = Object.values(jobs).reduce((s, n) => s + n, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Total header */}
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-text-secondary">Total Jobs</span>
        <span className="text-[20px] font-bold text-text-primary">{total}</span>
      </div>

      {/* Status rows */}
      <div className="flex flex-col">
        {STATUS_ROWS.map(({ key, label, dotClass, fillClass }) => {
          const count = jobs[key] ?? 0
          const pct = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={key} className="flex items-center gap-[8px] py-[6px]">
              {/* Colored dot */}
              <div className={`w-[8px] h-[8px] rounded-full flex-shrink-0 ${dotClass}`} />

              {/* Label */}
              <span className="text-[12px] text-text-secondary w-[80px] flex-shrink-0">{label}</span>

              {/* Mini bar track */}
              <div className="flex-1 h-[4px] bg-status-pendingBg rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${fillClass}`} style={{ width: `${pct}%` }} />
              </div>

              {/* Count */}
              <span className="text-[11px] font-bold text-text-primary w-[24px] text-end flex-shrink-0">
                {count}
              </span>

              {/* Percentage */}
              <span className="text-[10px] text-text-muted w-[28px] text-end flex-shrink-0">
                {Math.round(pct)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Completion rate sub-card */}
      <div className="bg-surface-page border border-border-card rounded-[10px] px-[14px] py-[12px]">
        <span className="text-[11px] text-text-muted">Completion Rate</span>
        <div className="flex items-center justify-between mt-[4px]">
          <span className="text-[20px] font-bold text-text-primary">{completionRate}%</span>
          <span className="text-[9px] font-semibold text-status-successText bg-status-successBg px-[6px] py-[2px] rounded-full flex items-center gap-[2px]">
            <TrendingUp size={9} />
            {completionTrend} vs last month
          </span>
        </div>
      </div>
    </div>
  )
}
