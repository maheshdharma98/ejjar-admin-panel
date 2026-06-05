import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, TrendingDown, FileText, Briefcase, Building2, Users, ChevronDown } from 'lucide-react'
import { rfqsData, jobsData, suppliersData, contractorsData } from '@/data'
import { timeAgo } from '@/lib/utils'

type RFQ = typeof rfqsData[0]
type Job = typeof jobsData[0]

const generateSparkline = (baseValue: number) => {
  return Array.from({ length: 7 }, () =>
    Math.max(1, baseValue * (0.5 + Math.random() * 0.5))
  )
}

const Sparkline = ({ data, stroke }: { data: number[]; stroke: string }) => {
  const max = Math.max(...data)
  const points = data.map((v, i) => `${(i / 6) * 100},${30 - (v / max) * 26}`).join(' ')
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-8">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


export default function DashboardPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  const totalRFQs = rfqsData.length
  const activeJobs = jobsData.filter((j: Job) => j.status === 'in_progress').length
  const totalSuppliers = suppliersData.length
  const totalContractors = contractorsData.length

  const categoryCount: Record<string, number> = {}
  rfqsData.forEach((r: RFQ) => {
    categoryCount[r.category] = (categoryCount[r.category] || 0) + 1
  })

  const manpowerCount = categoryCount['manpower'] ?? 0
  const machineryCount = categoryCount['machinery'] ?? 0
  const vehiclesCount = categoryCount['vehicle'] ?? 0
  const shippingCount = categoryCount['shipping'] ?? 0

  const rfqKpiCards = [
    {
      label: 'MANPOWER',
      count: manpowerCount,
      trend: '+12%',
      trendPositive: true,
      dot: '#1A4FBA',
      bg: '#F8FAFF',
      sparkStroke: '#1A4FBA',
      sparkData: generateSparkline(manpowerCount || 5),
    },
    {
      label: 'MACHINERY',
      count: machineryCount,
      trend: '+5%',
      trendPositive: true,
      dot: '#F59E0B',
      bg: '#FFFBEB',
      sparkStroke: '#F59E0B',
      sparkData: generateSparkline(machineryCount || 5),
    },
    {
      label: 'VEHICLES',
      count: vehiclesCount,
      trend: '+8%',
      trendPositive: true,
      dot: '#22C55E',
      bg: '#F0FDF4',
      sparkStroke: '#22C55E',
      sparkData: generateSparkline(vehiclesCount || 5),
    },
    {
      label: 'SHIPPING',
      count: shippingCount,
      trend: '-2%',
      trendPositive: false,
      dot: '#8B5CF6',
      bg: '#FAF5FF',
      sparkStroke: '#8B5CF6',
      sparkData: generateSparkline(shippingCount || 5),
    },
  ]

  const totalJobs = jobsData.length
  const inProgressCount = jobsData.filter((j: Job) => j.status === 'in_progress').length
  const completedCount = jobsData.filter((j: Job) => j.status === 'completed').length
  const completionRate = totalJobs > 0 ? Math.round((completedCount / totalJobs) * 100) : 0
  const inProgressPercent = totalJobs > 0 ? (inProgressCount / totalJobs) * 100 : 0
  const completedPercent = totalJobs > 0 ? (completedCount / totalJobs) * 100 : 0

  const activities = [...rfqsData]
    .sort((a: RFQ, b: RFQ) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  const kpis = [
    { label: t('total_rfqs'), value: totalRFQs, icon: FileText, trend: +12, color: 'bg-blue-50 text-[#1A4FBA]' },
    { label: t('active_jobs'), value: activeJobs, icon: Briefcase, trend: +5, color: 'bg-emerald-50 text-emerald-600' },
    { label: t('total_suppliers'), value: totalSuppliers, icon: Building2, trend: +3, color: 'bg-violet-50 text-violet-600' },
    { label: t('total_contractors'), value: totalContractors, icon: Users, trend: -2, color: 'bg-amber-50 text-amber-600' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-16 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{t('dashboard')}</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back, Super Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, trend, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 text-sm font-medium">{label}</p>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <TrendingUp size={14} className="text-emerald-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}% vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* KPI Grid — RFQs by Category */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-lg">{t('rfqs_by_category')}</h2>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              This Month <ChevronDown size={14} />
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Platform-wide RFQ distribution</p>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
            {rfqKpiCards.map((card) => (
              <div key={card.label} style={{ background: card.bg, borderRadius: 12, padding: 14 }}>
                <div className="flex items-center gap-2">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: card.dot, display: 'inline-block', flexShrink: 0 }} />
                  <span className="uppercase text-xs tracking-wider text-gray-500 font-medium">{card.label}</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-3xl font-bold text-gray-900">{card.count}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${card.trendPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {card.trend}
                  </span>
                </div>
                <div className="mt-2">
                  <Sparkline data={card.sparkData} stroke={card.sparkStroke} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stacked Bar — Jobs by Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-lg">{t('jobs_by_status')}</h2>
            <span className="text-sm text-gray-500">All time</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Active and completed jobs breakdown</p>

          <div className="flex justify-between items-baseline mt-5">
            <span className="text-sm font-medium text-gray-700">Total Jobs</span>
            <span className="text-3xl font-bold text-gray-900">{totalJobs}</span>
          </div>

          <div className="mt-3 h-3.5 bg-gray-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${inProgressPercent}%`, background: '#1A4FBA' }} />
            <div style={{ width: `${completedPercent}%`, background: '#22C55E' }} />
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#1A4FBA] flex-shrink-0" />
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-semibold text-gray-900 ml-1">{inProgressCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[#22C55E] flex-shrink-0" />
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-semibold text-gray-900 ml-1">{completedCount}</span>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-lg p-3 mt-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-[#22C55E] mt-0.5">{completionRate}%</p>
            </div>
            <span className="bg-green-50 text-green-700 rounded-full px-2 py-1 text-xs font-medium">
              +5% vs last month
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">{t('recent_activity')}</h2>
        <div className="space-y-3">
          {activities.map((rfq: RFQ, i) => (
            <div key={rfq.id} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                i % 3 === 0 ? 'bg-blue-100' : i % 3 === 1 ? 'bg-emerald-100' : 'bg-amber-100'
              }`}>
                <FileText size={14} className={
                  i % 3 === 0 ? 'text-blue-600' : i % 3 === 1 ? 'text-emerald-600' : 'text-amber-600'
                } />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 font-medium truncate">
                  RFQ <span className="font-mono text-xs text-slate-500">{rfq.id}</span> — {rfq.subcategory} ({rfq.category})
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {rfq.city}, {rfq.country} · Status: <span className="capitalize">{rfq.status.replace(/_/g, ' ')}</span>
                </p>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(rfq.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
