'use client';

import { useTranslations } from 'next-intl';
import { FileText, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats as DashboardStatsType } from '@/types';
import { StatusDonut } from '@/components/admin/StatusDonut';

export function DashboardStats({ stats }: { stats: DashboardStatsType }) {
  const t = useTranslations('admin');
  const tStatus = useTranslations('status');

  const cards = [
    { label: t('total_applications'), value: stats.total, icon: FileText, color: 'text-ztf-navy bg-blue-50' },
    { label: t('pending'), value: stats.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: t('admitted'), value: stats.admitted, icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
    { label: t('rejected'), value: stats.rejected, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ];

  const statusEntries = [
    { status: 'pending', count: stats.pending, label: tStatus('pending') },
    { status: 'under_review', count: stats.under_review, label: tStatus('under_review') },
    { status: 'shortlisted', count: stats.shortlisted, label: tStatus('shortlisted') },
    { status: 'admitted', count: stats.admitted, label: tStatus('admitted') },
    { status: 'rejected', count: stats.rejected, label: tStatus('rejected') },
    { status: 'deferred', count: stats.deferred, label: tStatus('deferred') },
  ];

  const programmeEntries = Object.entries(stats.by_programme).sort((a, b) => b[1] - a[1]);
  const maxProgrammeCount = Math.max(1, ...programmeEntries.map(([, count]) => count));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
              <TrendingUp className="h-4 w-4 text-ztf-gold" />
              {t('by_programme')}
            </h3>
            <div className="space-y-3">
              {programmeEntries.length === 0 && <p className="text-sm text-gray-400">{t('no_applications')}</p>}
              {programmeEntries.map(([programme, count]) => (
                <div key={programme}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">{programme}</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-ztf-navy"
                      style={{ width: `${(count / maxProgrammeCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 font-semibold text-gray-800">{t('by_status')}</h3>
            <StatusDonut data={statusEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
