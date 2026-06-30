'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, Check, Copy, MessageCircle, Printer, Search } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatDate, fullName } from '@/lib/utils/helpers';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types';
import { getInstitute, MAIN_PROGRAMMES } from '@/lib/constants/programmes';

interface StatusResult {
  application_number: string;
  status: ApplicationStatus;
  programme: string | null;
  higher_institute: string | null;
  field_of_study: string | null;
  specialty: string | null;
  submitted_at: string | null;
  created_at: string;
  personal_info: { first_name: string; last_name: string } | null;
}

const DECIDED_STATUSES: ApplicationStatus[] = ['shortlisted', 'admitted', 'rejected', 'deferred', 'withdrawn'];

export default function StatusPage() {
  const t = useTranslations('status');
  const locale = useLocale() as 'en' | 'fr';
  const [appNumber, setAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!appNumber && !email) {
      setError(t('not_found'));
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (appNumber) params.set('number', appNumber);
      if (email) params.set('email', email);

      const res = await fetch(`/api/status?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(t('not_found'));
        return;
      }
      setResult(data.application);
    } catch {
      setError(t('not_found'));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.application_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const underReviewDone = !!result && result.status !== 'pending';
  const decisionDone = !!result && DECIDED_STATUSES.includes(result.status);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pb-12 pt-24 sm:pt-28">
        <div className="container max-w-xl">
          <Card className="print:hidden">
            <CardContent className="p-6 sm:p-8">
              <h1 className="text-xl font-bold text-ztf-navy">{t('title')}</h1>
              <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>

              <form onSubmit={handleCheck} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="appNumber">{t('app_number')}</Label>
                  <Input
                    id="appNumber"
                    placeholder="ZTF-2026-00001"
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="h-px flex-1 bg-gray-200" />
                  OR
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Search className="h-4 w-4" />
                  {t('check')}
                </Button>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {result && (
            <Card className="glass-card animate-slide-up mt-6 rounded-2xl">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ztf-navy">{result.application_number}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-gray-400 hover:text-ztf-navy"
                      aria-label={t('copy_number')}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <StatusBadge status={result.status} />
                </div>

                <p className="text-sm text-gray-600">
                  {fullName(result.personal_info?.first_name, result.personal_info?.last_name)}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t('programme_label')}:{' '}
                  {(() => {
                    const institute = result.higher_institute ? getInstitute(result.higher_institute) : undefined;
                    const programme = MAIN_PROGRAMMES.find((p) => p.id === result.programme);
                    const programmeLabel = programme ? (locale === 'fr' ? programme.fr : programme.en) : null;
                    const instituteLabel = institute ? (locale === 'fr' ? institute.acronymFr : institute.acronymEn) : null;
                    return [programmeLabel, instituteLabel].filter(Boolean).join(' · ') || '-';
                  })()}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t('submitted_on')}: {formatDate(result.submitted_at ?? result.created_at, locale)}
                </p>

                <div className="mt-6 flex items-center">
                  {[
                    { label: t('timeline_submitted'), done: true },
                    { label: t('timeline_review'), done: underReviewDone },
                    { label: t('timeline_decision'), done: decisionDone },
                  ].map((step, index) => (
                    <div key={step.label} className={cn('flex items-center', index < 2 && 'flex-1')}>
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                            step.done ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                          )}
                        >
                          {step.done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                        </div>
                        <span className="mt-1 max-w-[4.5rem] text-center text-[11px] text-gray-500">
                          {step.label}
                        </span>
                      </div>
                      {index < 2 && (
                        <div className={cn('mx-1 h-0.5 flex-1', step.done ? 'bg-green-600' : 'bg-gray-200')} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2 print:hidden">
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" />
                    {t('print_status')}
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `My ZTF University application (${result.application_number}) status: ${result.status}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t('share_whatsapp')}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
