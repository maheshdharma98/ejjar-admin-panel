// EJJAR Admin Panel — EJJAR Design System v1.0
import { useTranslation } from 'react-i18next'
import { FileText, Briefcase, Users, HardHat } from 'lucide-react'
import {
  ADMIN_STATS,
  RECENT_ACTIVITY,
  CATEGORY_STATS,
} from '../adminDemoData'
import { usePageMeta } from '@/stores/pageStore'
import StatCard from '@/components/ui/StatCard'
import CategoryBarChart from '@/components/ui/CategoryBarChart'
import JobsBreakdown from '@/components/ui/JobsBreakdown'
import PageCard, { PeriodPill } from '@/components/ui/PageCard'
import StatusBadge from '@/components/ui/StatusBadge'
import CategoryChip from '@/components/ui/CategoryChip'

export default function DashboardPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'ar' ? 'ar' : 'en'
  usePageMeta('Dashboard', lang === 'ar' ? 'إدارة منصة موارد البناء' : 'Managing Oman construction resources')

  const categoryBars = CATEGORY_STATS.map((c) => ({
    category: c.key,
    value: c.count,
    trend: c.change,
    trendPositive: c.trendPositive,
  }))

  const jobsData = {
    in_progress: ADMIN_STATS.inProgressJobs,
    completed:   ADMIN_STATS.completedJobs,
    pending:     ADMIN_STATS.pendingJobs,
    cancelled:   ADMIN_STATS.cancelledJobs,
  }

  return (
    <>
      {/* Row 1 — Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <StatCard
          label="Total RFQs"
          value={ADMIN_STATS.totalRFQs}
          icon={FileText}
          trend={12}
          trendValue="+12% vs last month"
          colorVariant="rfqs"
        />
        <StatCard
          label="Active Jobs"
          value={ADMIN_STATS.activeJobs}
          icon={Briefcase}
          trend={5}
          trendValue="+5% vs last month"
          colorVariant="jobs"
        />
        <StatCard
          label="Total Suppliers"
          value={ADMIN_STATS.totalSuppliers}
          icon={Users}
          trend={3}
          trendValue="+3% vs last month"
          colorVariant="suppliers"
        />
        <StatCard
          label="Total Contractors"
          value={ADMIN_STATS.totalContractors}
          icon={HardHat}
          trend={-2}
          trendValue="-2% vs last month"
          colorVariant="contractors"
        />
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3">
        <PageCard
          title="RFQs by Category"
          subtitle="Platform-wide RFQ distribution"
          rightSlot={<PeriodPill>This Month</PeriodPill>}
        >
          <CategoryBarChart
            data={categoryBars}
            footerNote="Bar widths are proportional to highest category volume."
          />
        </PageCard>

        <PageCard
          title="Jobs by Status"
          subtitle="Active and completed jobs breakdown"
          rightSlot={<PeriodPill>All time</PeriodPill>}
        >
          <JobsBreakdown
            jobs={jobsData}
            completionRate={ADMIN_STATS.completionRate}
            completionTrend="+5%"
          />
        </PageCard>
      </div>

      {/* Row 3 — Recent activity */}
      <PageCard
        title="Recent Activity"
        subtitle="Latest platform actions"
        noPadding
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-input">
              <th className="px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px]">
                Activity
              </th>
              <th className="px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px]">
                Category
              </th>
              <th className="px-[14px] py-[7px] text-start text-[9px] font-semibold text-text-label uppercase tracking-[0.8px]">
                Status
              </th>
              <th className="px-[14px] py-[7px] text-end text-[9px] font-semibold text-text-label uppercase tracking-[0.8px]">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ACTIVITY.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border-divider last:border-0 hover:bg-[#FFFBF4] transition-colors"
              >
                <td className="px-[14px] py-[9px]">
                  <p className="text-[11px] text-text-primary font-medium">
                    {lang === 'ar' ? item.titleAr : item.titleEn}
                  </p>
                  <p className="text-[10px] text-text-muted mt-px">
                    {lang === 'ar' ? item.locationAr : item.locationEn}
                  </p>
                </td>
                <td className="px-[14px] py-[9px]">
                  <CategoryChip category={item.category} />
                </td>
                <td className="px-[14px] py-[9px]">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-[14px] py-[9px] text-end">
                  <span className="text-[10px] text-text-muted">
                    {lang === 'ar' ? item.timeAr : item.time}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageCard>
    </>
  )
}
