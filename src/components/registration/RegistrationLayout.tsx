'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, RotateCcw } from 'lucide-react';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { StepIndicator } from './StepIndicator';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { useToast } from '@/components/ui/use-toast';

export function RegistrationLayout({
  currentStep,
  children,
}: {
  currentStep: number;
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations('steps');
  const { toast } = useToast();
  const applicationId = useRegistrationStore((s) => s.applicationId);
  const sessionToken = useRegistrationStore((s) => s.sessionToken);
  const setApplicationId = useRegistrationStore((s) => s.setApplicationId);
  const setApplicationNumber = useRegistrationStore((s) => s.setApplicationNumber);
  const setSessionToken = useRegistrationStore((s) => s.setSessionToken);
  const setCurrentStep = useRegistrationStore((s) => s.setCurrentStep);
  const formData = useRegistrationStore((s) => s.formData);
  const initializing = useRef(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

  const startSession = useCallback(() => {
    initializing.current = true;
    setStarting(true);
    setSessionError(null);

    fetch('/api/registration/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: locale }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplicationId(data.applicationId);
          setApplicationNumber(data.applicationNumber);
          setSessionToken(data.sessionToken);
        } else {
          throw new Error(data.error ?? 'Could not start registration session.');
        }
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Could not start registration session.';
        setSessionError(message);
        toast({ variant: 'destructive', title: 'Error', description: message });
      })
      .finally(() => {
        initializing.current = false;
        setStarting(false);
      });
  }, [locale, setApplicationId, setApplicationNumber, setSessionToken, toast]);

  useEffect(() => {
    if (applicationId || initializing.current) return;
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  useEffect(() => {
    if (!applicationId || !sessionToken) return;

    const interval = setInterval(() => {
      fetch('/api/registration/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken, applicationId, stepData: formData, currentStep }),
      }).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [applicationId, sessionToken, formData, currentStep]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pb-8 pt-24 sm:pt-28">
        <div className="container max-w-3xl">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <StepIndicator currentStep={currentStep} />
              <div className="my-6 border-t border-gray-100" />
              <h1 className="mb-1 text-xl font-bold text-ztf-navy">{t(`step${currentStep}_title` as any)}</h1>

              {sessionError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                    <span>
                      Could not start your registration session: {sessionError}
                    </span>
                    <Button type="button" variant="outline" size="sm" onClick={startSession} disabled={starting}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-6">{!sessionError && children}</div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
