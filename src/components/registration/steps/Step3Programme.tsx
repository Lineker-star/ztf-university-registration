'use client';

import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { step3Schema, Step3FormValues } from '@/lib/validations/step3';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepNavigation } from '@/components/registration/StepNavigation';
import {
  ANGLOPHONE_PROGRAMMES,
  FRANCOPHONE_PROGRAMMES,
  ALL_PROGRAMMES,
  INTAKE_SESSIONS,
  ACADEMIC_YEARS,
} from '@/lib/constants/programmes';

const REFERRAL_SOURCES = ['social_media', 'friend', 'school', 'website', 'other'] as const;
const STUDY_MODES = ['full_time', 'part_time', 'distance'] as const;

export default function Step3Programme() {
  const t = useTranslations('programme');
  const router = useRouter();
  const step3 = useRegistrationStore((s) => s.formData.step3);
  const updateStep3 = useRegistrationStore((s) => s.updateStep3);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      academic_system: step3.academic_system ?? 'anglophone',
      programme: step3.programme ?? 'HND',
      department: step3.department ?? '',
      specialization: step3.specialization ?? '',
      study_mode: step3.study_mode ?? 'full_time',
      intake_session: step3.intake_session ?? INTAKE_SESSIONS[0],
      academic_year: step3.academic_year ?? ACADEMIC_YEARS[0],
      second_choice_programme: step3.second_choice_programme ?? undefined,
      why_ztf: step3.why_ztf ?? '',
      career_goals: step3.career_goals ?? '',
      referral_source: step3.referral_source ?? '',
    },
  });

  const academicSystem = watch('academic_system');
  const programme = watch('programme');

  const programmeOptions = useMemo(
    () => Object.entries(academicSystem === 'anglophone' ? ANGLOPHONE_PROGRAMMES : FRANCOPHONE_PROGRAMMES),
    [academicSystem]
  );

  const departments = useMemo(() => {
    const entry = (ALL_PROGRAMMES as any)[programme];
    return entry?.departments ?? [];
  }, [programme]);

  function onSubmit(values: Step3FormValues) {
    updateStep3(values);
    router.push('/register/4');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-sm text-gray-500">{t('subtitle')}</p>

      <div>
        <Label>{t('system')}</Label>
        <Controller
          control={control}
          name="academic_system"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v);
                const first = Object.keys(v === 'anglophone' ? ANGLOPHONE_PROGRAMMES : FRANCOPHONE_PROGRAMMES)[0];
                setValue('programme', first as any);
                setValue('department', '');
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anglophone">{t('anglophone')}</SelectItem>
                <SelectItem value="francophone">{t('francophone')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t('programme')}</Label>
          <Controller
            control={control}
            name="programme"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => {
                  field.onChange(v);
                  setValue('department', '');
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programmeOptions.map(([key, p]) => (
                    <SelectItem key={key} value={key}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>{t('department')}</Label>
          <Controller
            control={control}
            name="department"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dep: string) => (
                    <SelectItem key={dep} value={dep}>
                      {dep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>{t('study_mode')}</Label>
          <Controller
            control={control}
            name="study_mode"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STUDY_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {t(mode)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>{t('intake')}</Label>
          <Controller
            control={control}
            name="intake_session"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INTAKE_SESSIONS.map((session) => (
                    <SelectItem key={session} value={session}>
                      {session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>{t('academic_year')}</Label>
          <Controller
            control={control}
            name="academic_year"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <Label>{t('why_ztf')}</Label>
        <Textarea rows={3} {...register('why_ztf')} />
      </div>
      <div>
        <Label>{t('goals')}</Label>
        <Textarea rows={3} {...register('career_goals')} />
      </div>

      <div>
        <Label>{t('referral')}</Label>
        <Controller
          control={control}
          name="referral_source"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REFERRAL_SOURCES.map((source) => (
                  <SelectItem key={source} value={source}>
                    {t(source)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <StepNavigation onPrevious={() => router.push('/register/2')} isSubmitting={isSubmitting} />
    </form>
  );
}
