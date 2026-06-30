import { getTranslations } from 'next-intl/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ExportButtons } from '@/components/admin/ExportButtons';
import { AdmittedExportButton } from '@/components/admin/AdmittedExportButton';
import { InstituteBreakdown } from '@/components/admin/InstituteBreakdown';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats as DashboardStatsType } from '@/types';

async function getStatsAndApplications() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('applications')
    .select(
      `id, application_number, status, programme, higher_institute, field_of_study, submitted_at, created_at, language,
       personal_info(first_name, last_name, email, phone, region)`
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
    by_institute: {},
    by_field: {},
    this_month: 0,
  };

  const byRegion: Record<string, number> = {};

  for (const row of applications) {
    if (row.status in stats) (stats as any)[row.status] += 1;
    if (row.programme) stats.by_programme[row.programme] = (stats.by_programme[row.programme] ?? 0) + 1;
    if (row.higher_institute) stats.by_institute[row.higher_institute] = (stats.by_institute[row.higher_institute] ?? 0) + 1;
    if (new Date(row.created_at) >= monthStart) stats.this_month += 1;

    const region = (row.personal_info as any)?.region;
    if (region) byRegion[region] = (byRegion[region] ?? 0) + 1;
  }

  return { stats, applications, byRegion };
}

export default async function AdminReportsPage() {
  const t = await getTranslations('admin');
  const { stats, applications, byRegion } = await getStatsAndApplications();

  const admissionRate = stats.total > 0 ? Math.round((stats.admitted / stats.total) * 100) : 0;
  const regionEntries = Object.entries(byRegion).sort((a, b) => b[1] - a[1]);
  const maxRegionCount = Math.max(1, ...regionEntries.map(([, count]) => count));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ztf-navy">{t('reports')}</h1>
        <div className="flex flex-wrap gap-2">
          <ExportButtons applications={applications as any} filters={{}} />
          <AdmittedExportButton />
        </div>
      </div>

      <DashboardStats stats={stats} />

      <InstituteBreakdown byInstitute={stats.by_institute} total={stats.total} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-1 font-semibold text-gray-800">{t('admission_rate')}</h3>
            <p className="text-3xl font-bold text-ztf-navy">{admissionRate}%</p>
            <p className="mt-1 text-sm text-gray-500">
              {stats.admitted} {t('admitted').toLowerCase()} / {stats.total} {t('total_applications').toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 font-semibold text-gray-800">{t('by_region')}</h3>
            <div className="space-y-3">
              {regionEntries.length === 0 && <p className="text-sm text-gray-400">{t('no_applications')}</p>}
              {regionEntries.map(([region, count]) => (
                <div key={region}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">{region}</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-ztf-gold"
                      style={{ width: `${(count / maxRegionCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5 text-sm text-gray-500">
          {t('this_month')}: <span className="font-semibold text-gray-800">{stats.this_month}</span>
        </CardContent>
      </Card>
    </div>
  );
}
