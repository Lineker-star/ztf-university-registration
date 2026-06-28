'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { step5Schema, Step5FormValues } from '@/lib/validations/step5';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepNavigation } from '@/components/registration/StepNavigation';

const SPONSOR_TYPES = ['self', 'parent_sponsor', 'scholarship', 'employer_sponsor', 'loan'] as const;

export default function Step5Guardian() {
  const t = useTranslations('guardian');
  const router = useRouter();
  const step5 = useRegistrationStore((s) => s.formData.step5);
  const updateStep5 = useRegistrationStore((s) => s.updateStep5);

  const {
    control,
    register,
    handleSubmit,
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
        <h4 className="mb-3 font-semibold text-ztf-navy">{t('emergency_title')}</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t('emergency_name')}</Label>
            <Input {...register('emergency_full_name')} />
          </div>
          <div>
            <Label>{t('emergency_relationship')}</Label>
            <Input {...register('emergency_relationship')} />
          </div>
          <div>
            <Label>{t('emergency_phone')}</Label>
            <Input {...register('emergency_phone')} />
          </div>
          <div>
            <Label>{t('emergency_phone2')}</Label>
            <Input {...register('emergency_phone2')} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <h4 className="mb-3 font-semibold text-ztf-navy">{t('sponsor_title')}</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t('sponsor_type')}</Label>
            <Controller
              control={control}
              name="sponsor_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPONSOR_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>{t('sponsor_name')}</Label>
            <Input {...register('sponsor_name')} />
          </div>
          <div>
            <Label>{t('sponsor_contact')}</Label>
            <Input {...register('sponsor_contact')} />
          </div>
        </div>
      </div>

      <StepNavigation onPrevious={() => router.push('/register/4')} isSubmitting={isSubmitting} />
    </form>
  );
}
