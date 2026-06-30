'use client';

import { useTranslations } from 'next-intl';
import { Eye } from 'lucide-react';

import { Link } from '@/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ApplicationListItem } from '@/types';
import { formatDate, fullName } from '@/lib/utils/helpers';

interface ApplicationsTableProps {
  applications: ApplicationListItem[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
}

export function ApplicationsTable({
  applications,
  selectable,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: ApplicationsTableProps) {
  const t = useTranslations('admin');
  const allSelected = selectable && applications.length > 0 && applications.every((a) => selectedIds?.has(a.id));

  return (
    <>
      {/* Desktop table */}
      <div className="glass-card hidden overflow-hidden rounded-2xl md:block">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={() => onToggleSelectAll?.()} />
                </TableHead>
              )}
              <TableHead>App No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">{t('view')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={selectable ? 7 : 6} className="text-center text-sm text-gray-400">
                  {t('no_applications')}
                </TableCell>
              </TableRow>
            )}
            {applications.map((app) => (
              <TableRow key={app.id}>
                {selectable && (
                  <TableCell>
                    <Checkbox checked={selectedIds?.has(app.id)} onCheckedChange={() => onToggleSelect?.(app.id)} />
                  </TableCell>
                )}
                <TableCell className="font-mono text-sm">{app.application_number}</TableCell>
                <TableCell>{fullName(app.personal_info?.first_name, app.personal_info?.last_name)}</TableCell>
                <TableCell className="text-sm text-gray-500">{app.personal_info?.email ?? '-'}</TableCell>
                <TableCell>{app.programme ?? '-'}</TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatDate(app.submitted_at ?? app.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/applications/${app.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {applications.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">{t('no_applications')}</p>
        )}
        {applications.map((app) => (
          <div key={app.id} className="glass-card space-y-2 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectable && (
                  <Checkbox checked={selectedIds?.has(app.id)} onCheckedChange={() => onToggleSelect?.(app.id)} />
                )}
                <span className="font-mono text-xs text-gray-500">{app.application_number}</span>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <p className="font-semibold text-ztf-navy">
              {fullName(app.personal_info?.first_name, app.personal_info?.last_name)}
            </p>
            <p className="text-sm text-gray-500">{app.personal_info?.email ?? '-'}</p>
            <p className="text-sm text-gray-500">
              {app.programme ?? '-'} &middot; {formatDate(app.submitted_at ?? app.created_at)}
            </p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/admin/applications/${app.id}`}>
                <Eye className="h-4 w-4" />
                {t('view')}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
