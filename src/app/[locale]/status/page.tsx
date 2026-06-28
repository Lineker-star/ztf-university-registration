'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, Search } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatDate, fullName } from '@/lib/utils/helpers';

interface StatusResult {
  application_number: string;
  status: string;
  programme: string | null;
  submitted_at: string | null;
  created_at: string;
  personal_info: { first_name: string; last_name: string } | null;
}

export default function StatusPage() {
  const t = useTranslations('status');
  const locale = useLocale() as 'en' | 'fr';
  const [appNumber, setAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusResult | null>(null);

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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container max-w-xl">
          <Card>
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

              {result && (
                <div className="mt-6 rounded-lg border border-gray-100 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono font-bold text-ztf-navy">{result.application_number}</span>
                    <StatusBadge status={result.status as any} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {fullName(result.personal_info?.first_name, result.personal_info?.last_name)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('programme_label')}: {result.programme ?? '-'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {t('submitted_on')}: {formatDate(result.submitted_at ?? result.created_at, locale)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
