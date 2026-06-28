import { getTranslations } from 'next-intl/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ExportButtons } from '@/components/admin/ExportButtons';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats as DashboardStatsType } from '@/types';

async function getStatsAndApplications() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('applications')
    .select(
      `id, application_number, status, programme, department, academic_system, submitted_at, created_at, language,
       personal_info(first_name, last_name, email, phone)`
    )
    .eq('is_draft', false)
    .order('created_at', { ascending: false })
    .limit(1000);

  const applications = data ?? [];
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats: DashboardStatsType = {
    total: applications.length,
    pending: 0,
    under_review: 0,
    shortlisted: 0,
    admitted: 0,
    rejected: 0,
    deferred: 0,
    by_programme: {},
    this_month: 0,
  };

  for (const row of applications) {
    if (row.status in stats) (stats as any)[row.status] += 1;
    if (row.programme) stats.by_programme[row.programme] = (stats.by_programme[row.programme] ?? 0) + 1;
    if (new Date(row.created_at) >= monthStart) stats.this_month += 1;
  }

  return { stats, applications };
}

export default async function AdminReportsPage() {
  const t = await getTranslations('admin');
  const { stats, applications } = await getStatsAndApplications();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ztf-navy">{t('reports')}</h1>
        <ExportButtons applications={applications as any} filters={{}} />
      </div>

      <DashboardStats stats={stats} />

      <Card>
        <CardContent className="p-5 text-sm text-gray-500">
          {t('this_month')}: <span className="font-semibold text-gray-800">{stats.this_month}</span>
        </CardContent>
      </Card>
    </div>
  );
}
