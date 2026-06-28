import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { RegistrationLayout } from '@/components/registration/RegistrationLayout';
import Step1Personal from '@/components/registration/steps/Step1Personal';
import Step2Academic from '@/components/registration/steps/Step2Academic';
import Step3Programme from '@/components/registration/steps/Step3Programme';
import Step4Documents from '@/components/registration/steps/Step4Documents';
import Step5Guardian from '@/components/registration/steps/Step5Guardian';
import Step6Review from '@/components/registration/steps/Step6Review';

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  '1': Step1Personal,
  '2': Step2Academic,
  '3': Step3Programme,
  '4': Step4Documents,
  '5': Step5Guardian,
  '6': Step6Review,
};

export function generateStaticParams() {
  return Object.keys(STEP_COMPONENTS).map((step) => ({ step }));
}

export default function RegistrationStepPage({ params }: { params: { step: string; locale: string } }) {
  setRequestLocale(params.locale);
  const StepComponent = STEP_COMPONENTS[params.step];
  if (!StepComponent) notFound();

  return (
    <RegistrationLayout currentStep={parseInt(params.step, 10)}>
      <StepComponent />
    </RegistrationLayout>
  );
}
