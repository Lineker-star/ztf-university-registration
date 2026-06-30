import { getTranslations } from 'next-intl/server';

import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { ExportButtons } from '@/components/admin/ExportButtons';
import { AdmittedExportButton } from '@/components/admin/AdmittedExportButton';
import { InstituteBreakdown } from '@/components/admin/InstituteBreakdown';
import { AdminSummaryTable } from '@/components/admin/AdminSummaryTable';
import { MonthlyChart } from '@/components/admin/MonthlyChart';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats as DashboardStatsType } from '@/types';
import { HIGHER_INSTITUTES, MAIN_PROGRAMMES, getInstitute, getField, getSpecialtiesByField } from '@/lib/constants/programmes';

async function getStatsAndApplications() {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from('applications')
    .select(
      `id, application_number, status, programme, higher_institute, field_of_study, specialty, submitted_at, created_at, language,
       personal_info(first_name, last_name, email, phone, region)`
    )
    .eq('is_draft', false)
    .order('created_at', { ascending: false })
    .limit(2000);

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
  const byMonth: Record<string, number> = {};

  for (const row of applications) {
    if (row.status in stats) (stats as any)[row.status] += 1;
    if (row.programme) stats.by_programme[row.programme] = (stats.by_programme[row.programme] ?? 0) + 1;
    if (row.higher_institute) stats.by_institute[row.higher_institute] = (stats.by_institute[row.higher_institute] ?? 0) + 1;
    if (row.field_of_study) stats.by_field[row.field_of_study] = (stats.by_field[row.field_of_study] ?? 0) + 1;
    if (new Date(row.created_at) >= monthStart) stats.this_month += 1;

    const region = (row.personal_info as any)?.region;
    if (region) byRegion[region] = (byRegion[region] ?? 0) + 1;

    const monthKey = row.submitted_at
      ? row.submitted_at.slice(0, 7)
      : row.created_at.slice(0, 7);
    byMonth[monthKey] = (byMonth[monthKey] ?? 0) + 1;
  }

  // Breakdown table rows: institute → field → programme
  const breakdownRows: { institute: string; field: string; programme: string; count: number; pct: number }[] = [];
  for (const [instituteId, instCount] of Object.entries(stats.by_institute).sort((a, b) => b[1] - a[1])) {
    const inst = getInstitute(instituteId);
    breakdownRows.push({
      institute: inst ? inst.acronymEn : instituteId,
      field: '',
      programme: '',
      count: instCount,
      pct: stats.total > 0 ? Math.round((instCount / stats.total) * 100) : 0,
    });
  }

  return { stats, applications, byRegion, byMonth, breakdownRows };
}

export default async function AdminReportsPage() {
  const t = await getTranslations('admin');
  const { stats, applications, byRegion, byMonth, breakdownRows } = await getStatsAndApplications();

  const admissionRate = stats.total > 0 ? Math.round((stats.admitted / stats.total) * 100) : 0;
  const regionEntries = Object.entries(byRegion).sort((a, b) => b[1] - a[1]);
  const maxRegionCount = Math.max(1, ...regionEntries.map(([, count]) => count));

  // Monthly sorted ascending for chart
  const monthlyEntries = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)).slice(-12);

  // Full breakdown table: institute × field × programme
  const fullBreakdownRows: { institute: string; field: string; programme: string; count: number; pct: number }[] = [];

  for (const inst of HIGHER_INSTITUTES) {
    const instCount = stats.by_institute[inst.id] ?? 0;
    if (instCount === 0) continue;

    for (const f of inst.fields) {
      const fieldCount = stats.by_field[f.id] ?? 0;
      if (fieldCount === 0) continue;

      for (const progId of inst.programmes) {
        const prog = MAIN_PROGRAMMES.find((p) => p.id === progId);
        // Count apps matching this institute + field + programme
        const matchCount = (applications as any[]).filter(
          (a) => a.higher_institute === inst.id && a.field_of_study === f.id && a.programme === progId
        ).length;
        if (matchCount === 0) continue;

        fullBreakdownRows.push({
          institute: inst.acronymEn,
          field: `${f.numberLabel} — ${f.en}`,
          programme: prog?.id.toUpperCase() ?? progId,
          count: matchCount,
          pct: stats.total > 0 ? Math.round((matchCount / stats.total) * 100) : 0,
        });
      }
    }
  }
  fullBreakdownRows.sort((a, b) => b.count - a.count);

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

      {/* Monthly applications chart */}
      <MonthlyChart monthlyEntries={monthlyEntries} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Admission rate */}
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-1 font-semibold text-gray-800">{t('admission_rate')}</h3>
            <p className="text-4xl font-bold text-ztf-navy">{admissionRate}%</p>
            <p className="mt-1 text-sm text-gray-500">
              {stats.admitted} admitted / {stats.total} total
            </p>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${admissionRate}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* This month */}
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-1 font-semibold text-gray-800">{t('this_month')}</h3>
            <p className="text-4xl font-bold text-ztf-navy">{stats.this_month}</p>
            <p className="mt-1 text-sm text-gray-500">new applications this month</p>
          </CardContent>
        </Card>

        {/* Pending review */}
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-1 font-semibold text-gray-800">Pending Review</h3>
            <p className="text-4xl font-bold text-amber-600">{stats.pending}</p>
            <p className="mt-1 text-sm text-gray-500">awaiting admin action</p>
          </CardContent>
        </Card>
      </div>

      <InstituteBreakdown byInstitute={stats.by_institute} total={stats.total} />

      <AdminSummaryTable
        byInstitute={stats.by_institute}
        byField={stats.by_field}
        byProgramme={stats.by_programme}
      />

      {/* Full breakdown table */}
      {fullBreakdownRows.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 font-semibold text-gray-800">Detailed Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 pr-4 text-left font-semibold text-gray-600">Institute</th>
                    <th className="pb-2 pr-4 text-left font-semibold text-gray-600">Field</th>
                    <th className="pb-2 pr-4 text-left font-semibold text-gray-600">Programme</th>
                    <th className="pb-2 pr-4 text-right font-semibold text-gray-600">Count</th>
                    <th className="pb-2 text-right font-semibold text-gray-600">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {fullBreakdownRows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-medium text-ztf-navy">{row.institute}</td>
                      <td className="py-2 pr-4 text-gray-700">{row.field}</td>
                      <td className="py-2 pr-4">
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-xs font-semibold text-ztf-navy">
                          {row.programme}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right font-semibold tabular-nums">{row.count}</td>
                      <td className="py-2 text-right text-gray-500">{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* By region */}
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
  );
}
