'use client';

import { useTranslations } from 'next-intl';
import { FileSpreadsheet, FileDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ApplicationListItem } from '@/types';
import { buildExportUrl, exportApplicationsToPDF, downloadFile } from '@/lib/utils/export';

interface ExportButtonsProps {
  applications: ApplicationListItem[];
  filters: { status?: string; programme?: string };
}

export function ExportButtons({ applications, filters }: ExportButtonsProps) {
  const t = useTranslations('admin');

  async function handleExcelExport() {
    const url = buildExportUrl('excel', filters);
    await downloadFile(url, `ZTF_Applications_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  function handlePdfExport() {
    exportApplicationsToPDF(applications);
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExcelExport}>
        <FileSpreadsheet className="h-4 w-4" />
        {t('export_excel')}
      </Button>
      <Button variant="outline" size="sm" onClick={handlePdfExport}>
        <FileDown className="h-4 w-4" />
        {t('export_pdf')}
      </Button>
    </div>
  );
}
