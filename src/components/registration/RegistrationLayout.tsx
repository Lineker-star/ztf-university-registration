'use client';

import { useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
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

  useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

  useEffect(() => {
    if (applicationId || initializing.current) return;
    initializing.current = true;

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
        }
      })
      .catch(() => {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not start registration session.' });
      });
  }, [applicationId, locale, setApplicationId, setApplicationNumber, setSessionToken, toast]);

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
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <StepIndicator currentStep={currentStep} />
              <div className="my-6 border-t border-gray-100" />
              <h1 className="mb-1 text-xl font-bold text-ztf-navy">{t(`step${currentStep}_title` as any)}</h1>
              <div className="mt-6">{children}</div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
