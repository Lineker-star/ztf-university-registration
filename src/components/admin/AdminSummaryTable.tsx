'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HIGHER_INSTITUTES, MAIN_PROGRAMMES } from '@/lib/constants/programmes';

interface Props {
  byInstitute: Record<string, number>;
  byField: Record<string, number>;
  byProgramme: Record<string, number>;
}

function SectionTable({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  if (rows.length === 0) return null;
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">{title}</h4>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(({ label, count }) => (
            <tr key={label} className="border-t border-gray-100 first:border-0">
              <td className="py-1.5 pr-4 text-gray-700">{label}</td>
              <td className="py-1.5 text-right font-semibold tabular-nums text-ztf-navy">{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminSummaryTable({ byInstitute, byField, byProgramme }: Props) {
  const fieldLookup = useMemo(() => {
    const map: Record<string, string> = {};
    for (const inst of HIGHER_INSTITUTES) {
      for (const f of inst.fields) {
        map[f.id] = `${inst.acronymEn} — ${f.en}`;
      }
    }
    return map;
  }, []);

  const instituteRows = HIGHER_INSTITUTES
    .map((inst) => ({ label: `${inst.acronymEn} — ${inst.nameEn}`, count: byInstitute[inst.id] ?? 0 }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const fieldRows = Object.entries(byField)
    .map(([id, count]) => ({ label: fieldLookup[id] ?? id, count }))
    .sort((a, b) => b.count - a.count);

  const programmeRows = MAIN_PROGRAMMES
    .map((p) => ({ label: `${p.id.toUpperCase()} — ${p.en}`, count: byProgramme[p.id] ?? 0 }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  if (instituteRows.length === 0 && fieldRows.length === 0 && programmeRows.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="mb-5 font-semibold text-gray-800">Applications Breakdown</h3>
        <div className="grid gap-8 sm:grid-cols-3">
          <SectionTable title="By Institute" rows={instituteRows} />
          <SectionTable title="By Field" rows={fieldRows} />
          <SectionTable title="By Programme" rows={programmeRows} />
        </div>
      </CardContent>
    </Card>
  );
}
