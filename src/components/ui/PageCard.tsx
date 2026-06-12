// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import React from 'react'

interface Props {
  title: string
  subtitle?: string
  rightSlot?: React.ReactNode
  children: React.ReactNode
  noPadding?: boolean
}

export default function PageCard({ title, subtitle, rightSlot, children, noPadding }: Props) {
  return (
    <div className="bg-surface-card border border-border-card rounded-[14px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-[14px] pb-[10px] border-b border-border-divider">
        <div>
          <p className="text-[13px] font-semibold text-text-primary leading-tight">{title}</p>
          {subtitle && (
            <p className="text-[11px] text-text-muted mt-[2px]">{subtitle}</p>
          )}
        </div>
        {rightSlot && (
          <div className="ms-4 flex-shrink-0">
            {rightSlot}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  )
}

export function PeriodPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] text-text-muted bg-border-divider px-2 py-[2px] rounded-[6px]">
      {children}
    </span>
  )
}

export function ViewAllLink({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] font-medium text-brand-orange flex items-center gap-[3px] hover:underline"
    >
      View All
    </button>
  )
}
