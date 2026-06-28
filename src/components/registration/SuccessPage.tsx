'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, Download, Home } from 'lucide-react';
import jsPDF from 'jspdf';

import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';

export function SuccessPage({ applicationNumber, email }: { applicationNumber: string; email?: string }) {
  const t = useTranslations('review');

  function downloadReceipt() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 59, 122);
    doc.text('ZTF University Institute', 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Application Receipt', 14, 30);
    doc.setFontSize(11);
    doc.text(`Application Number: ${applicationNumber}`, 14, 45);
    doc.text(`Status: Pending Review`, 14, 53);
    if (email) doc.text(`Email: ${email}`, 14, 61);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 69);
    doc.save(`${applicationNumber}_receipt.pdf`);
  }

  return (
    <div className="space-y-6 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
      <h2 className="text-2xl font-bold text-ztf-navy">{t('success_title')}</h2>
      <p className="text-gray-600">{t('success_message')}</p>
      <p className="text-2xl font-mono font-bold tracking-wide text-ztf-navy">{applicationNumber}</p>
      <p className="text-sm text-gray-500">{t('success_email')}</p>

      <div className="mx-auto max-w-md rounded-lg bg-blue-50 p-5 text-left">
        <h3 className="mb-2 font-semibold text-ztf-navy">{t('success_next')}</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>1. {t('success_step1')}</li>
          <li>2. {t('success_step2')}</li>
          <li>3. {t('success_step3')}</li>
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button onClick={downloadReceipt} variant="outline">
          <Download className="h-4 w-4" />
          {t('download_receipt')}
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            {t('back_home')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
