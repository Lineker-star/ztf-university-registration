'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { ExportButtons } from '@/components/admin/ExportButtons';
import { ApplicationListItem } from '@/types';
import { STATUS_OPTIONS, debounce } from '@/lib/utils/helpers';
import { ALL_PROGRAMMES } from '@/lib/constants/programmes';

const PAGE_SIZE = 20;

export default function AdminApplicationsPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [programme, setProgramme] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>('');

  const fetchApplications = useCallback(
    async (searchValue: string) => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (status !== 'all') params.set('status', status);
      if (programme !== 'all') params.set('programme', programme);
      if (searchValue) params.set('search', searchValue);

      try {
        const res = await fetch(`/api/admin/applications?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications);
          setTotal(data.total);
        }
      } finally {
        setLoading(false);
      }
    },
    [page, status, programme]
  );

  const debouncedFetch = useMemo(() => debounce((value: string) => fetchApplications(value), 400), [fetchApplications]);

  useEffect(() => {
    debouncedFetch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, status, programme]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      if (prev.size === applications.length) return new Set();
      return new Set(applications.map((a) => a.id));
    });
  }

  async function applyBulkStatus() {
    if (!bulkStatus || selectedIds.size === 0) return;
    await Promise.all(
      Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/applications/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: bulkStatus }),
        })
      )
    );
    setSelectedIds(new Set());
    setBulkStatus('');
    fetchApplications(search);
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ztf-navy">{t('applications')}</h1>
        <ExportButtons applications={applications} filters={{ status, programme }} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-9"
                placeholder={t('search')}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            <Select
              value={status}
              onValueChange={(v) => {
                setPage(1);
                setStatus(v);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t('filter_status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_statuses')}</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={programme}
              onValueChange={(v) => {
                setPage(1);
                setProgramme(v);
              }}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t('filter_programme')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_programmes')}</SelectItem>
                {Object.keys(ALL_PROGRAMMES).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 rounded-md bg-blue-50 px-4 py-2">
              <span className="text-sm text-ztf-navy">
                {selectedIds.size} {t('bulk_actions')}
              </span>
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder={t('update_status')} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={applyBulkStatus} disabled={!bulkStatus}>
                {tCommon('apply')}
              </Button>
            </div>
          )}

          <ApplicationsTable
            applications={applications}
            selectable
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
          />

          {!loading && (
            <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
              <span>
                {tCommon('page')} {page} {tCommon('of')} {totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  {tCommon('back')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {tCommon('continue')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
