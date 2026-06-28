'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const STEP_KEYS = ['step1_title', 'step2_title', 'step3_title', 'step4_title', 'step5_title', 'step6_title'] as const;

export function StepIndicator({ currentStep }: { currentStep: number }) {
  const t = useTranslations('steps');

  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEP_KEYS.map((key, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isLast = stepNumber === STEP_KEYS.length;

          return (
            <div key={key} className={cn('flex items-center', !isLast && 'flex-1')}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    isCompleted && 'border-green-600 bg-green-600 text-white',
                    isCurrent && 'border-ztf-navy bg-ztf-navy text-white',
                    !isCompleted && !isCurrent && 'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    'mt-2 hidden max-w-[5.5rem] text-center text-xs font-medium sm:block',
                    isCurrent ? 'text-ztf-navy' : isCompleted ? 'text-green-700' : 'text-gray-400'
                  )}
                >
                  {t(key)}
                </span>
              </div>
              {!isLast && (
                <div className={cn('mx-1 h-0.5 flex-1', isCompleted ? 'bg-green-600' : 'bg-gray-200')} />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-gray-500 sm:hidden">
        {t(STEP_KEYS[currentStep - 1])} &middot; {currentStep} {t('of')} {STEP_KEYS.length}
      </p>
    </div>
  );
}
