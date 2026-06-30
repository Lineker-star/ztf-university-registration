'use client';

import { Card, CardContent } from '@/components/ui/card';

interface Props {
  monthlyEntries: [string, number][];
}

function formatMonthLabel(ym: string) {
  const [year, month] = ym.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

export function MonthlyChart({ monthlyEntries }: Props) {
  if (monthlyEntries.length === 0) return null;

  const maxCount = Math.max(1, ...monthlyEntries.map(([, c]) => c));

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="mb-4 font-semibold text-gray-800">Applications by Month</h3>
        <div className="flex items-end gap-2 overflow-x-auto pb-2" style={{ minHeight: 120 }}>
          {monthlyEntries.map(([ym, count]) => (
            <div key={ym} className="flex min-w-[40px] flex-1 flex-col items-center gap-1">
              <span className="text-xs font-semibold text-ztf-navy">{count}</span>
              <div
                className="w-full rounded-t bg-gradient-to-t from-ztf-navy to-ztf-gold"
                style={{ height: `${Math.max(4, (count / maxCount) * 80)}px` }}
              />
              <span className="text-[10px] text-gray-400">{formatMonthLabel(ym)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
