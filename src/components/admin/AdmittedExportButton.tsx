'use client';

import { useTranslations } from 'next-intl';
import { GraduationCap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { buildExportUrl, downloadFile } from '@/lib/utils/export';

export function AdmittedExportButton() {
  const t = useTranslations('admin');

  async function handleExport() {
    const url = buildExportUrl('excel', { status: 'admitted' });
    await downloadFile(url, `ZTF_Admitted_Students_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <GraduationCap className="h-4 w-4" />
      {t('export_admitted')}
    </Button>
  );
}
