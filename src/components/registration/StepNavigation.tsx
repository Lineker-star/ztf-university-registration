'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export function StepNavigation({ onPrevious, isFirstStep, isLastStep, isSubmitting }: StepNavigationProps) {
  const t = useTranslations('steps');

  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
      {!isFirstStep ? (
        <Button type="button" variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4" />
          {t('previous')}
        </Button>
      ) : (
        <span />
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLastStep ? t('submit') : t('next')}
        {!isLastStep && !isSubmitting && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}
