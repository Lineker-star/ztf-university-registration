import { getTranslations } from 'next-intl/server';
import { AlertTriangle, FileWarning } from 'lucide-react';

import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { InstituteBreakdown } from '@/components/admin/InstituteBreakdown';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats as DashboardStatsType } from '@/types';

async function getStats(): Promise<DashboardStatsType> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('applications')
    .select('status, programme, higher_institute, created_at')
    .eq('is_draft', false);

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
    by_institute: {},
    this_month: 0,
  };

  for (const row of data ?? []) {
    if (row.status in stats) (stats as any)[row.status] += 1;
    if (row.programme) stats.by_programme[row.programme] = (stats.by_programme[row.programme] ?? 0) + 1;
    if (row.higher_institute) stats.by_institute[row.higher_institute] = (stats.by_institute[row.higher_institute] ?? 0) + 1;
    if (new Date(row.created_at) >= monthStart) stats.this_month += 1;
  }

  return stats;
}

async function getRecentApplications() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('applications')
    .select(
      `id, application_number, status, programme, higher_institute, field_of_study, submitted_at, created_at, language,
       personal_info(first_name, last_name, email, phone)`
    )
    .eq('is_draft', false)
    .order('created_at', { ascending: false })
    .limit(10);

  return data ?? [];
}

async function getAlerts() {
  const supabase = createAdminSupabaseClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: stalePending }, { count: unverifiedDocs }] = await Promise.all([
    supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('is_draft', false)
      .eq('status', 'pending')
      .lt('created_at', sevenDaysAgo),
    supabase.from('documents').select('id', { count: 'exact', head: true }).eq('is_verified', false),
  ]);

  return { stalePending: stalePending ?? 0, unverifiedDocs: unverifiedDocs ?? 0 };
}

async function getGreetingName() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.email?.split('@')[0] ?? '';
}

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'good_morning';
  if (hour < 18) return 'good_afternoon';
  return 'good_evening';
}

export default async function AdminDashboardPage() {
  const t = await getTranslations('admin');
  const [stats, recent, alerts, name] = await Promise.all([
    getStats(),
    getRecentApplications(),
    getAlerts(),
    getGreetingName(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ztf-navy">
          {t(getGreetingKey())}{name ? `, ${name}` : ''}
        </h1>
        <p className="text-sm text-gray-500">{t('dashboard')}</p>
      </div>

      {(alerts.stalePending > 0 || alerts.unverifiedDocs > 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="space-y-2 p-5">
            <h3 className="flex items-center gap-2 font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              {t('alerts')}
            </h3>
            {alerts.stalePending > 0 && (
              <p className="text-sm text-amber-700">{t('alert_pending_old', { count: alerts.stalePending })}</p>
            )}
            {alerts.unverifiedDocs > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-amber-700">
                <FileWarning className="h-3.5 w-3.5" />
                {t('alert_docs_unverified', { count: alerts.unverifiedDocs })}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <DashboardStats stats={stats} />

      <InstituteBreakdown byInstitute={stats.by_institute} total={stats.total} />

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold text-gray-800">{t('recent_applications')}</h3>
          <ApplicationsTable applications={recent as any} />
        </CardContent>
      </Card>
    </div>
  );
}
