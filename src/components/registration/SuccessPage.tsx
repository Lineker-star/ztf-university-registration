'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2, Download, Home, MessageCircle } from 'lucide-react';

import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { generateApplicationPdf } from '@/lib/utils/generateApplicationPdf';
import type { RegistrationFormData } from '@/types';

const CONFETTI_COLORS = ['#C9A84C', '#003B7A', '#E8C96B', '#0056B3', '#22C55E'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-0 h-2.5 w-2.5 animate-confetti-fall rounded-sm"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function SuccessPage({
  applicationNumber,
  email,
  formData,
}: {
  applicationNumber: string;
  email?: string;
  formData?: RegistrationFormData;
}) {
  const t = useTranslations('review');
  const locale = useLocale() as 'en' | 'fr';

  function downloadReceipt() {
    if (!formData) return;
    generateApplicationPdf({
      applicationNumber,
      locale,
      personal: formData.step1,
      qualifications: formData.step2.qualifications,
      programme: formData.step3,
      guardian: formData.step5,
    });
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `My ZTF University application number is ${applicationNumber}`
  )}`;

  return (
    <div className="relative space-y-6 text-center">
      <Confetti />
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
      <h2 className="text-2xl font-bold text-ztf-navy">{t('success_title')}</h2>
      <p className="text-gray-600">{t('success_message')}</p>
      <p className="text-2xl font-mono font-bold tracking-wide text-ztf-navy">{applicationNumber}</p>
      <p className="text-sm text-gray-500">{t('success_email')}</p>

      {formData && (
        <div className="mx-auto w-full max-w-md rounded-xl border-2 border-ztf-gold bg-ztf-gold/10 p-5">
          <button
            type="button"
            onClick={downloadReceipt}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-ztf-navy px-6 py-4 text-base font-bold text-white transition-colors hover:bg-ztf-navyDark active:scale-95"
          >
            <Download className="h-5 w-5 shrink-0" />
            {t('download_form')}
          </button>
          <p className="mt-2 text-center text-xs text-gray-500">{t('download_form_hint')}</p>
        </div>
      )}

      <div className="mx-auto max-w-md rounded-lg bg-blue-50 p-5 text-left">
        <h3 className="mb-2 font-semibold text-ztf-navy">{t('success_next')}</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>1. {t('success_step1')}</li>
          <li>2. {t('success_step2')}</li>
          <li>3. {t('success_step3')}</li>
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
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
