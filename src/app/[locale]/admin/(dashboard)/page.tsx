import { getTranslations } from 'next-intl/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats as DashboardStatsType } from '@/types';

async function getStats(): Promise<DashboardStatsType> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from('applications').select('status, programme, created_at').eq('is_draft', false);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats: DashboardStatsType = {
    total: data?.length ?? 0,
    pending: 0,
    under_review: 0,
    shortlisted: 0,
    admitted: 0,
    rejected: 0,
    deferred: 0,
    by_programme: {},
    this_month: 0,
  };

  for (const row of data ?? []) {
    if (row.status in stats) (stats as any)[row.status] += 1;
    if (row.programme) stats.by_programme[row.programme] = (stats.by_programme[row.programme] ?? 0) + 1;
    if (new Date(row.created_at) >= monthStart) stats.this_month += 1;
  }

  return stats;
}

async function getRecentApplications() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('applications')
    .select(
      `id, application_number, status, programme, department, academic_system, submitted_at, created_at, language,
       personal_info(first_name, last_name, email, phone)`
    )
    .eq('is_draft', false)
    .order('created_at', { ascending: false })
    .limit(10);

  return data ?? [];
}

export default async function AdminDashboardPage() {
  const t = await getTranslations('admin');
  const [stats, recent] = await Promise.all([getStats(), getRecentApplications()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ztf-navy">{t('dashboard')}</h1>
      </div>

      <DashboardStats stats={stats} />

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold text-gray-800">{t('recent_applications')}</h3>
          <ApplicationsTable applications={recent as any} />
        </CardContent>
      </Card>
    </div>
  );
}
