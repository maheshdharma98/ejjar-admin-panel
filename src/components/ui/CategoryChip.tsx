// EJJAR Admin Panel
// EJJAR Design System v1.0
// Tokens: tailwind.config.js → brand / surface / border / text / status
import { Users, Settings2, Package, Zap, Building2 } from 'lucide-react'

export const CATEGORY_CONFIG: Record<string, {
  icon: React.ElementType
  iconColor: string
  bg: string
  barColor: string
  barHex: string
  label: string
}> = {
  manpower:  { icon: Users,      iconColor: 'text-[#C9974A]', bg: 'bg-[#FFF0D6]', barColor: 'bg-brand-orange', barHex: '#E67E3A', label: 'Manpower' },
  machinery: { icon: Settings2,  iconColor: 'text-[#4DA8C7]', bg: 'bg-[#E0F2FE]', barColor: 'bg-brand-skyblue', barHex: '#4DA8C7', label: 'Machinery' },
  shipping:  { icon: Package,    iconColor: 'text-[#854D0E]', bg: 'bg-[#FEF9C3]', barColor: 'bg-semantic-warning', barHex: '#F59E0B', label: 'Shipping' },
  electrical:{ icon: Zap,        iconColor: 'text-[#166534]', bg: 'bg-[#DCFCE7]', barColor: 'bg-semantic-success', barHex: '#22C55E', label: 'Electrical' },
  civil:     { icon: Building2,  iconColor: 'text-[#7C3AED]', bg: 'bg-[#F3E8FF]', barColor: 'bg-[#7C3AED]', barHex: '#7C3AED', label: 'Civil' },
}

function normalize(cat: string): string {
  return cat.toLowerCase().replace(/[^a-z]/g, '')
}

interface Props {
  category: string
  showLabel?: boolean
}

export default function CategoryChip({ category, showLabel = true }: Props) {
  const key = normalize(category)
  const cfg = CATEGORY_CONFIG[key] ?? {
    icon: Package,
    iconColor: 'text-text-muted',
    bg: 'bg-status-pendingBg',
    barColor: 'bg-text-muted',
    label: category,
  }

  return (
    <span className={`inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.iconColor}`}>
      <cfg.icon size={10} strokeWidth={2} />
      {showLabel && <span>{cfg.label}</span>}
    </span>
  )
}
