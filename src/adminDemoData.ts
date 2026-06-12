// ============================================
// OMAN ADMIN DEMO DATA
// ============================================

export const ADMIN_STATS = {
  totalRFQs: 137,
  activeJobs: 24,
  totalSuppliers: 12,
  totalContractors: 4,
  completionRate: 68,
  totalRevenue: 4280,
  inProgressJobs: 14,
  completedJobs: 46,
  pendingJobs: 8,
  cancelledJobs: 2,
}

export const ADMIN_RFQS = [
  {
    id: 'RFQ_DEMO_001',
    category: 'Manpower',
    categoryAr: 'العمالة',
    subcategory: 'Plumber',
    subcategoryAr: 'سباك',
    contractor: 'Ahmed Al-Balushi',
    contractorAr: 'أحمد البلوشي',
    contractorCompany: 'Muscat Construction Co.',
    contractorCompanyAr: 'شركة مسقط للإنشاءات',
    city: 'Muscat',
    cityAr: 'مسقط',
    country: 'Oman',
    status: 'negotiating',
    statusAr: 'قيد التفاوض',
    budgetMin: 150,
    budgetMax: 250,
    suppliersNotified: 4,
    quotesReceived: 3,
    date: '2026-06-09',
  },
  {
    id: 'RFQ_DEMO_002',
    category: 'Machinery',
    categoryAr: 'الآليات والمركبات',
    subcategory: 'Excavator',
    subcategoryAr: 'حفارة',
    contractor: 'Ahmed Al-Balushi',
    contractorAr: 'أحمد البلوشي',
    contractorCompany: 'Muscat Construction Co.',
    contractorCompanyAr: 'شركة مسقط للإنشاءات',
    city: 'Sohar',
    cityAr: 'صحار',
    country: 'Oman',
    status: 'receiving_quotes',
    statusAr: 'استلام عروض',
    budgetMin: 1200,
    budgetMax: 1500,
    suppliersNotified: 4,
    quotesReceived: 2,
    date: '2026-06-09',
  },
  {
    id: 'RFQ_DEMO_003',
    category: 'Shipping',
    categoryAr: 'الشحن',
    subcategory: 'Pallet',
    subcategoryAr: 'بالتات',
    contractor: 'Ahmed Al-Balushi',
    contractorAr: 'أحمد البلوشي',
    contractorCompany: 'Muscat Construction Co.',
    contractorCompanyAr: 'شركة مسقط للإنشاءات',
    city: 'Muscat',
    cityAr: 'مسقط',
    country: 'Oman',
    status: 'broadcasted',
    statusAr: 'تم البث',
    budgetMin: 400,
    budgetMax: 600,
    suppliersNotified: 4,
    quotesReceived: 0,
    date: '2026-06-09',
  },
]

export const ADMIN_SUPPLIERS = [
  { id: 'S001', name: 'Rashid Al-Saadi', nameAr: 'راشد السعدي', company: 'Al-Saadi Plumbing', companyAr: 'خدمات السعدي للسباكة', category: 'Manpower', categoryAr: 'العمالة', city: 'Muscat', cityAr: 'مسقط', rating: 4.9, jobs: 142, status: 'active', verified: true },
  { id: 'S002', name: 'Mohammed Al-Hinai', nameAr: 'محمد الهنائي', company: 'Hinai Plumbing', companyAr: 'حلول الهنائي للسباكة', category: 'Manpower', categoryAr: 'العمالة', city: 'Muscat', cityAr: 'مسقط', rating: 4.6, jobs: 89, status: 'active', verified: true },
  { id: 'S003', name: 'Sultan Al-Kindi', nameAr: 'سلطان الكندي', company: 'Kindi Pipe', companyAr: 'الكندي للأنابيب', category: 'Manpower', categoryAr: 'العمالة', city: 'Sohar', cityAr: 'صحار', rating: 4.4, jobs: 67, status: 'active', verified: true },
  { id: 'S004', name: 'Hamad Al-Zaabi', nameAr: 'حمد الزعابي', company: 'Zaabi Plumbing', companyAr: 'شركة الزعابي للسباكة', category: 'Manpower', categoryAr: 'العمالة', city: 'Salalah', cityAr: 'صلالة', rating: 4.2, jobs: 41, status: 'active', verified: false },
  { id: 'S005', name: 'Yousef Al-Riyami', nameAr: 'يوسف الريامي', company: 'Riyami Equipment', companyAr: 'الريامي للمعدات', category: 'Machinery', categoryAr: 'الآليات والمركبات', city: 'Muscat', cityAr: 'مسقط', rating: 4.8, jobs: 78, status: 'active', verified: true },
  { id: 'S006', name: 'Hilal Al-Wahaibi', nameAr: 'هلال الوهيبي', company: 'Wahaibi Equipment', companyAr: 'الوهيبي للمعدات', category: 'Machinery', categoryAr: 'الآليات والمركبات', city: 'Sohar', cityAr: 'صحار', rating: 4.5, jobs: 54, status: 'active', verified: true },
  { id: 'S007', name: 'Talib Al-Mahrooqi', nameAr: 'طالب المحروقي', company: 'Mahrooqi Machinery', companyAr: 'المحروقي للمعدات', category: 'Machinery', categoryAr: 'الآليات والمركبات', city: 'Nizwa', cityAr: 'نزوى', rating: 4.6, jobs: 92, status: 'active', verified: true },
  { id: 'S008', name: 'Abdullah Al-Farsi', nameAr: 'عبدالله الفارسي', company: 'Farsi Mining', companyAr: 'الفارسي للتعدين', category: 'Machinery', categoryAr: 'الآليات والمركبات', city: 'Salalah', cityAr: 'صلالة', rating: 4.3, jobs: 38, status: 'active', verified: true },
  { id: 'S009', name: 'Nasser Al-Lawati', nameAr: 'ناصر اللواتي', company: 'Lawati Logistics', companyAr: 'اللواتي للوجستيات', category: 'Shipping', categoryAr: 'الشحن', city: 'Muscat', cityAr: 'مسقط', rating: 4.7, jobs: 156, status: 'active', verified: true },
  { id: 'S010', name: 'Salim Al-Khusaibi', nameAr: 'سالم الخصيبي', company: 'Khusaibi Freight', companyAr: 'الخصيبي للشحن', category: 'Shipping', categoryAr: 'الشحن', city: 'Sohar', cityAr: 'صحار', rating: 4.5, jobs: 89, status: 'active', verified: true },
  { id: 'S011', name: 'Majid Al-Toobi', nameAr: 'ماجد التوبي', company: 'Toobi Cargo', companyAr: 'حلول التوبي للشحن', category: 'Shipping', categoryAr: 'الشحن', city: 'Salalah', cityAr: 'صلالة', rating: 4.8, jobs: 124, status: 'active', verified: true },
  { id: 'S012', name: 'Khalfan Al-Busaidi', nameAr: 'خلفان البوسعيدي', company: 'Busaidi Transport', companyAr: 'شركة البوسعيدي للنقل', category: 'Shipping', categoryAr: 'الشحن', city: 'Nizwa', cityAr: 'نزوى', rating: 4.2, jobs: 45, status: 'active', verified: false },
]

export const ADMIN_CONTRACTORS = [
  { id: 'C001', name: 'Ahmed Al-Balushi', nameAr: 'أحمد البلوشي', company: 'Muscat Construction Co.', companyAr: 'شركة مسقط للإنشاءات', city: 'Muscat', cityAr: 'مسقط', rating: 4.7, jobs: 34, status: 'active', verified: true },
  { id: 'C002', name: 'Khalid Al-Habsi', nameAr: 'خالد الحبسي', company: 'Salalah Builders LLC', companyAr: 'شركة صلالة للبناء', city: 'Salalah', cityAr: 'صلالة', rating: 4.5, jobs: 22, status: 'active', verified: true },
  { id: 'C003', name: 'Saif Al-Maamari', nameAr: 'سيف المعمري', company: 'Sohar Industrial Works', companyAr: 'صحار للأعمال الصناعية', city: 'Sohar', cityAr: 'صحار', rating: 4.8, jobs: 56, status: 'active', verified: true },
  { id: 'C004', name: 'Faisal Al-Rashdi', nameAr: 'فيصل الراشدي', company: 'Nizwa Development Co.', companyAr: 'شركة نزوى للتنمية', city: 'Nizwa', cityAr: 'نزوى', rating: 4.3, jobs: 18, status: 'active', verified: true },
]

export const ADMIN_JOBS = [
  {
    id: 'JOB_001',
    title: 'Office wiring - CBD Muscat',
    titleAr: 'تمديدات المكتب - الحي التجاري مسقط',
    category: 'Manpower',
    categoryAr: 'العمالة',
    contractor: 'Ahmed Al-Balushi',
    contractorAr: 'أحمد البلوشي',
    supplier: 'Rashid Al-Saadi',
    supplierAr: 'راشد السعدي',
    city: 'Muscat',
    cityAr: 'مسقط',
    amount: 380,
    status: 'in_progress',
    statusAr: 'قيد التنفيذ',
    progress: 60,
    startDate: '2026-06-05',
  },
  {
    id: 'JOB_002',
    title: 'Concrete mixer - Nizwa villa',
    titleAr: 'خلاطة خرسانة - فيلا نزوى',
    category: 'Machinery',
    categoryAr: 'الآليات والمركبات',
    contractor: 'Faisal Al-Rashdi',
    contractorAr: 'فيصل الراشدي',
    supplier: 'Talib Al-Mahrooqi',
    supplierAr: 'طالب المحروقي',
    city: 'Nizwa',
    cityAr: 'نزوى',
    amount: 520,
    status: 'completed',
    statusAr: 'مكتمل',
    progress: 100,
    startDate: '2026-05-20',
  },
]

export const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'rfq',
    category: 'manpower',
    status: 'negotiating',
    titleEn: 'RFQ RFQ_DEMO_001 — Plumber (Manpower)',
    titleAr: 'طلب RFQ_DEMO_001 — سباك (العمالة)',
    locationEn: 'Muscat, Oman · In Negotiation',
    locationAr: 'مسقط، عُمان · قيد التفاوض',
    time: '2 hours ago',
    timeAr: 'منذ ساعتين',
  },
  {
    id: 2,
    type: 'rfq',
    category: 'machinery',
    status: 'receiving_quotes',
    titleEn: 'RFQ RFQ_DEMO_002 — Excavator (Machinery)',
    titleAr: 'طلب RFQ_DEMO_002 — حفارة (الآليات)',
    locationEn: 'Sohar, Oman · Receiving Quotes',
    locationAr: 'صحار، عُمان · استلام عروض',
    time: '3 hours ago',
    timeAr: 'منذ 3 ساعات',
  },
  {
    id: 3,
    type: 'rfq',
    category: 'shipping',
    status: 'broadcasted',
    titleEn: 'RFQ RFQ_DEMO_003 — Pallet (Shipping)',
    titleAr: 'طلب RFQ_DEMO_003 — بالتات (الشحن)',
    locationEn: 'Muscat, Oman · Broadcasted',
    locationAr: 'مسقط، عُمان · تم البث',
    time: '1 hour ago',
    timeAr: 'منذ ساعة',
  },
  {
    id: 4,
    type: 'job',
    category: 'manpower',
    status: 'in_progress',
    titleEn: 'Job JOB_001 — Office wiring in progress',
    titleAr: 'عمل JOB_001 — تمديدات المكتب قيد التنفيذ',
    locationEn: 'Muscat, Oman · 60% complete',
    locationAr: 'مسقط، عُمان · 60% مكتمل',
    time: '5 hours ago',
    timeAr: 'منذ 5 ساعات',
  },
]

export const CATEGORY_STATS = [
  { key: 'manpower',   labelEn: 'Manpower',   labelAr: 'العمالة',             count: 48, change: '+12%', trendPositive: true },
  { key: 'machinery',  labelEn: 'Machinery',  labelAr: 'الآليات والمركبات',   count: 31, change: '+5%',  trendPositive: true },
  { key: 'shipping',   labelEn: 'Shipping',   labelAr: 'الشحن',               count: 27, change: '+8%',  trendPositive: true },
  { key: 'electrical', labelEn: 'Electrical', labelAr: 'الكهرباء',            count: 19, change: '+3%',  trendPositive: true },
  { key: 'civil',      labelEn: 'Civil',      labelAr: 'الأعمال المدنية',     count: 12, change: '-2%',  trendPositive: false },
]

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    negotiating: '#8B5CF6',
    receiving_quotes: '#F59E0B',
    broadcasted: '#3B82F6',
    accepted: '#10B981',
    rejected: '#EF4444',
    in_progress: '#F59E0B',
    completed: '#10B981',
    cancelled: '#EF4444',
    active: '#10B981',
    new: '#3B82F6',
  }
  return colors[status] || '#9CA3AF'
}

export function getLang(): string {
  return document.documentElement.getAttribute('lang') ||
    localStorage.getItem('i18nextLng') ||
    'ar'
}

export function getField(
  obj: Record<string, unknown>,
  field: string,
  lang?: string
): string {
  const l = lang || getLang()
  if (l === 'ar') {
    const arField = `${field}Ar`
    if (obj[arField]) return String(obj[arField])
  }
  return obj[field] ? String(obj[field]) : ''
}

export function formatOMR(amount: number, lang?: string): string {
  const l = lang || getLang()
  const formatted = amount.toLocaleString('en-US')
  return l === 'ar' ? `${formatted} ر.ع.` : `OMR ${formatted}`
}
