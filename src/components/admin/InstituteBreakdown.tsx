'use client';

import { useLocale, useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { HIGHER_INSTITUTES } from '@/lib/constants/programmes';

interface InstituteBreakdownProps {
  byInstitute: Record<string, number>;
  total: number;
}

export function InstituteBreakdown({ byInstitute, total }: InstituteBreakdownProps) {
  const t = useTranslations('admin');
  const locale = useLocale();
  const isFr = locale === 'fr';

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="mb-4 font-semibold text-gray-800">{t('by_institute')}</h3>
        <div className="space-y-3">
          {HIGHER_INSTITUTES.map((inst) => {
            const count = byInstitute[inst.id] ?? 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={inst.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">{isFr ? inst.acronymFr : inst.acronymEn}</span>
                  <span className="font-medium text-gray-800">{count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-ztf-navy to-ztf-gold"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
