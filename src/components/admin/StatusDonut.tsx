'use client';

const STATUS_COLORS: Record<string, string> = {
  pending: '#FBBF24',
  under_review: '#60A5FA',
  shortlisted: '#A78BFA',
  admitted: '#22C55E',
  rejected: '#F87171',
  deferred: '#9CA3AF',
};

interface StatusDonutProps {
  data: { status: string; count: number; label: string }[];
}

export function StatusDonut({ data }: StatusDonutProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return <div className="flex h-40 items-center justify-center text-sm text-gray-400">No data</div>;
  }

  let cumulative = 0;
  const segments = data
    .filter((d) => d.count > 0)
    .map((d) => {
      const start = (cumulative / total) * 360;
      cumulative += d.count;
      const end = (cumulative / total) * 360;
      return `${STATUS_COLORS[d.status] ?? '#D1D5DB'} ${start}deg ${end}deg`;
    });

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative h-32 w-32 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${segments.join(', ')})` }}
      >
        <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-bold text-gray-800">{total}</span>
          <span className="text-[10px] text-gray-400">Total</span>
        </div>
      </div>
      <ul className="space-y-1.5 text-sm">
        {data
          .filter((d) => d.count > 0)
          .map((d) => (
            <li key={d.status} className="flex items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[d.status] ?? '#D1D5DB' }}
              />
              {d.label} <span className="font-medium text-gray-800">({d.count})</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
