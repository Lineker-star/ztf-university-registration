'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Award, Briefcase, CheckCircle2, Landmark, User, Users } from 'lucide-react';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { step5Schema, Step5FormValues } from '@/lib/validations/step5';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { StepNavigation } from '@/components/registration/StepNavigation';
import { cn } from '@/lib/utils';

const SPONSOR_TYPES = [
  { key: 'self', icon: User },
  { key: 'parent_sponsor', icon: Users },
  { key: 'scholarship', icon: Award },
  { key: 'employer_sponsor', icon: Briefcase },
  { key: 'loan', icon: Landmark },
] as const;

export default function Step5Guardian() {
  const t = useTranslations('guardian');
  const router = useRouter();
  const step5 = useRegistrationStore((s) => s.formData.step5);
  const updateStep5 = useRegistrationStore((s) => s.updateStep5);

  const [sameAsGuardian, setSameAsGuardian] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step5FormValues>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      guardian_full_name: step5.guardian_full_name ?? '',
      guardian_relationship: step5.guardian_relationship ?? '',
      guardian_phone: step5.guardian_phone ?? '',
      guardian_email: step5.guardian_email ?? '',
      guardian_address: step5.guardian_address ?? '',
      guardian_occupation: step5.guardian_occupation ?? '',
      guardian_employer: step5.guardian_employer ?? '',
      emergency_full_name: step5.emergency_full_name ?? '',
      emergency_relationship: step5.emergency_relationship ?? '',
      emergency_phone: step5.emergency_phone ?? '',
      emergency_phone2: step5.emergency_phone2 ?? '',
      sponsor_type: step5.sponsor_type ?? 'self',
      sponsor_name: step5.sponsor_name ?? '',
      sponsor_contact: step5.sponsor_contact ?? '',
    },
  });

  const sponsorType = watch('sponsor_type');
  const showSponsorDetails = sponsorType === 'scholarship' || sponsorType === 'employer_sponsor';

  function toggleSameAsGuardian(checked: boolean) {
    setSameAsGuardian(checked);
    if (checked) {
      setValue('emergency_full_name', watch('guardian_full_name'));
      setValue('emergency_relationship', watch('guardian_relationship'));
      setValue('emergency_phone', watch('guardian_phone'));
    }
  }

  function onSubmit(values: Step5FormValues) {
    updateStep5(values);
    router.push('/register/6');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-sm text-gray-500">{t('subtitle')}</p>

      <div>
        <h4 className="mb-3 font-semibold text-ztf-navy">{t('parent_title')}</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t('parent_name')}</Label>
            <Input {...register('guardian_full_name')} />
            {errors.guardian_full_name && <p className="mt-1 text-xs text-red-600">Required</p>}
          </div>
          <div>
            <Label>{t('parent_relationship')}</Label>
            <Input {...register('guardian_relationship')} />
          </div>
          <div>
            <Label>{t('parent_phone')}</Label>
            <Input {...register('guardian_phone')} />
          </div>
          <div>
            <Label>{t('parent_email')}</Label>
            <Input type="email" {...register('guardian_email')} />
          </div>
          <div>
            <Label>{t('parent_address')}</Label>
            <Input {...register('guardian_address')} />
          </div>
          <div>
            <Label>{t('parent_occupation')}</Label>
            <Input {...register('guardian_occupation')} />
          </div>
          <div>
            <Label>{t('parent_employer')}</Label>
            <Input {...register('guardian_employer')} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold text-ztf-navy">{t('emergency_title')}</h4>
          <div className="flex items-center gap-2">
            <Checkbox
              id="same_as_guardian"
              checked={sameAsGuardian}
              onCheckedChange={(checked) => toggleSameAsGuardian(!!checked)}
            />
            <Label htmlFor="same_as_guardian" className="text-xs font-normal text-gray-500">
              {t('same_as_guardian')}
            </Label>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t('emergency_name')}</Label>
            <Input disabled={sameAsGuardian} {...register('emergency_full_name')} />
          </div>
          <div>
            <Label>{t('emergency_relationship')}</Label>
            <Input disabled={sameAsGuardian} {...register('emergency_relationship')} />
          </div>
          <div>
            <Label>{t('emergency_phone')}</Label>
            <Input disabled={sameAsGuardian} {...register('emergency_phone')} />
          </div>
          <div>
            <Label>{t('emergency_phone2')}</Label>
            <Input {...register('emergency_phone2')} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h4 className="mb-3 font-semibold text-ztf-navy">{t('sponsor_title')}</h4>
        <Label className="mb-2 block">{t('sponsor_type')}</Label>
        <Controller
          control={control}
          name="sponsor_type"
          render={({ field }) => (
            <div className="grid gap-3 sm:grid-cols-3">
              {SPONSOR_TYPES.map(({ key, icon: Icon }) => {
                const selected = field.value === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => field.onChange(key)}
                    className={cn(
                      'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                      selected
                        ? 'border-ztf-gold bg-ztf-navy/5 shadow-sm'
                        : 'border-gray-200 hover:border-ztf-navy/40'
                    )}
                  >
                    {selected && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-ztf-gold" />}
                    <Icon className="h-6 w-6 text-ztf-navy" />
                    <span className="text-sm font-medium text-gray-700">{t(key)}</span>
                  </button>
                );
              })}
            </div>
          )}
        />

        {showSponsorDetails && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('sponsor_name')}</Label>
              <Input {...register('sponsor_name')} />
            </div>
            <div>
              <Label>{t('sponsor_contact')}</Label>
              <Input {...register('sponsor_contact')} />
            </div>
          </div>
        )}
      </div>

      <StepNavigation onPrevious={() => router.push('/register/4')} isSubmitting={isSubmitting} />
    </form>
  );
}
