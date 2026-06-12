// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  // RFQ statuses
  negotiating:      { bg: 'bg-status-pendingBg',  text: 'text-text-secondary',    label: 'Negotiating' },
  receiving_quotes: { bg: 'bg-status-warningBg',  text: 'text-status-warningText', label: 'Receiving Quotes' },
  broadcasted:      { bg: 'bg-status-infoBg',      text: 'text-status-infoText',    label: 'Broadcasted' },
  accepted:         { bg: 'bg-status-successBg',  text: 'text-status-successText', label: 'Accepted' },
  rejected:         { bg: 'bg-status-errorBg',    text: 'text-status-errorText',   label: 'Rejected' },
  // Job / general statuses
  in_progress:      { bg: 'bg-status-infoBg',      text: 'text-status-infoText',    label: 'In Progress' },
  completed:        { bg: 'bg-status-successBg',  text: 'text-status-successText', label: 'Completed' },
  pending:          { bg: 'bg-status-warningBg',  text: 'text-status-warningText', label: 'Pending' },
  cancelled:        { bg: 'bg-status-errorBg',    text: 'text-status-errorText',   label: 'Cancelled' },
  // Supplier/contractor statuses
  active:           { bg: 'bg-status-successBg',  text: 'text-status-successText', label: 'Active' },
  blocked:          { bg: 'bg-status-errorBg',    text: 'text-status-errorText',   label: 'Blocked' },
  // Notification delivery
  sent:             { bg: 'bg-status-successBg',  text: 'text-status-successText', label: 'Sent' },
  failed:           { bg: 'bg-status-errorBg',    text: 'text-status-errorText',   label: 'Failed' },
}

interface Props {
  status: string
  customLabel?: string
}

export default function StatusBadge({ status, customLabel }: Props) {
  const s = STATUS_MAP[status] ?? {
    bg: 'bg-status-pendingBg',
    text: 'text-text-secondary',
    label: status.replace(/_/g, ' '),
  }

  return (
    <span className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      {customLabel ?? s.label}
    </span>
  )
}
