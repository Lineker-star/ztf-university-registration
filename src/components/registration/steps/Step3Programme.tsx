'use client';

import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { step3Schema, Step3FormValues } from '@/lib/validations/step3';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepNavigation } from '@/components/registration/StepNavigation';
import { cn } from '@/lib/utils';
import {
  HIGHER_INSTITUTES,
  MAIN_PROGRAMMES,
  INTAKE_SESSIONS,
  ACADEMIC_YEARS,
  getFieldsByInstitute,
  getField,
  getSpecialtiesByField,
  getProgrammesByInstitute,
} from '@/lib/constants/programmes';

const REFERRAL_SOURCES = ['social_media', 'friend', 'school', 'website', 'other'] as const;
const STUDY_MODES = ['full_time', 'part_time', 'distance'] as const;

export default function Step3Programme() {
  const t = useTranslations('programme');
  const locale = useLocale();
  const isFr = locale === 'fr';
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
      higher_institute: step3.higher_institute ?? '',
      field_of_study: step3.field_of_study ?? '',
      sub_department: step3.sub_department ?? '',
      specialty: step3.specialty ?? '',
      programme: (step3.programme as Step3FormValues['programme']) ?? undefined,
      study_mode: step3.study_mode ?? 'full_time',
      intake_session: step3.intake_session ?? INTAKE_SESSIONS[0],
      academic_year: step3.academic_year ?? ACADEMIC_YEARS[0],
      why_ztf: step3.why_ztf ?? '',
      career_goals: step3.career_goals ?? '',
      referral_source: step3.referral_source ?? '',
    },
  });

  const instituteId = watch('higher_institute');
  const fieldId = watch('field_of_study');
  const subDept = watch('sub_department');
  const specialty = watch('specialty');
  const programme = watch('programme');

  const fields = useMemo(() => getFieldsByInstitute(instituteId), [instituteId]);
  const field = useMemo(() => getField(instituteId, fieldId), [instituteId, fieldId]);
  const hasSubDepartments = !!field?.subDepartments;
  const specialtyOptions = useMemo(() => {
    if (hasSubDepartments) {
      return field?.subDepartments?.find((s) => s.en === subDept)?.specialties ?? [];
    }
    return getSpecialtiesByField(field);
  }, [field, hasSubDepartments, subDept]);
  const availableProgrammes = useMemo(() => {
    const ids = getProgrammesByInstitute(instituteId);
    return MAIN_PROGRAMMES.filter((p) => ids.includes(p.id));
  }, [instituteId]);

  function onSubmit(values: Step3FormValues) {
    updateStep3(values);
    router.push('/register/4');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <p className="text-sm text-gray-500">{t('subtitle')}</p>

      {/* Institute */}
      <div>
        <Label className="mb-3 block">{t('choose_institute')}</Label>
        <Controller
          control={control}
          name="higher_institute"
          render={({ field: f }) => (
            <div className="grid gap-3 sm:grid-cols-3">
              {HIGHER_INSTITUTES.map((inst) => {
                const selected = f.value === inst.id;
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => {
                      f.onChange(inst.id);
                      setValue('field_of_study', '');
                      setValue('sub_department', '');
                      setValue('specialty', '');
                      setValue('programme', undefined as unknown as Step3FormValues['programme']);
                    }}
                    className={cn(
                      'relative rounded-xl border-2 p-4 text-left transition-all',
                      selected ? 'border-ztf-gold bg-ztf-navy/5 shadow-sm' : 'border-gray-200 hover:border-ztf-navy/40'
                    )}
                  >
                    {selected && <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-ztf-gold" />}
                    <span className="text-xs font-bold uppercase tracking-wide text-ztf-gold">
                      {isFr ? inst.acronymFr : inst.acronymEn}
                    </span>
                    <p className="mt-1 text-sm font-semibold leading-snug text-ztf-navy">
                      {isFr ? inst.nameFr : inst.nameEn}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {inst.fields.length} {t('fields_count')}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* Field */}
      {instituteId && (
        <div className="step-enter">
          <Label className="mb-3 block">{t('choose_field')}</Label>
          <Controller
            control={control}
            name="field_of_study"
            render={({ field: f }) => (
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map((fld) => {
                  const selected = f.value === fld.id;
                  return (
                    <button
                      key={fld.id}
                      type="button"
                      onClick={() => {
                        f.onChange(fld.id);
                        setValue('sub_department', '');
                        setValue('specialty', '');
                      }}
                      className={cn(
                        'rounded-xl border-2 p-3.5 text-left transition-all',
                        selected ? 'border-ztf-gold bg-ztf-navy/5' : 'border-gray-200 hover:border-ztf-navy/40'
                      )}
                    >
                      <span className="text-xs font-bold text-ztf-navy">{fld.numberLabel}</span>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">{isFr ? fld.fr : fld.en}</p>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      )}

      {/* Sub-department (Health Sciences only) */}
      {hasSubDepartments && (
        <div className="step-enter">
          <Label className="mb-3 block">{t('choose_department')}</Label>
          <Controller
            control={control}
            name="sub_department"
            render={({ field: f }) => (
              <div className="grid gap-3 sm:grid-cols-3">
                {field?.subDepartments?.map((sub) => {
                  const selected = f.value === sub.en;
                  return (
                    <button
                      key={sub.en}
                      type="button"
                      onClick={() => {
                        f.onChange(sub.en);
                        setValue('specialty', '');
                      }}
                      className={cn(
                        'rounded-xl border-2 p-3 text-center text-sm font-medium transition-all',
                        selected
                          ? 'border-ztf-gold bg-ztf-navy/5 text-ztf-navy'
                          : 'border-gray-200 text-gray-600 hover:border-ztf-navy/40'
                      )}
                    >
                      {isFr ? sub.fr : sub.en}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      )}

      {/* Specialty */}
      {fieldId && (!hasSubDepartments || subDept) && (
        <div className="step-enter">
          <Label htmlFor="specialty">{t('choose_specialty')}</Label>
          <Controller
            control={control}
            name="specialty"
            render={({ field: f }) => (
              <Select value={f.value} onValueChange={f.onChange}>
                <SelectTrigger id="specialty">
                  <SelectValue placeholder={t('choose_specialty')} />
                </SelectTrigger>
                <SelectContent>
                  {specialtyOptions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {isFr ? s.fr : s.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      {/* Programme */}
      {specialty && (
        <div className="step-enter">
          <Label className="mb-3 block">{t('choose_programme')}</Label>
          <Controller
            control={control}
            name="programme"
            render={({ field: f }) => (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                {availableProgrammes.map((p) => {
                  const selected = f.value === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => f.onChange(p.id)}
                      className={cn(
                        'rounded-xl border-2 p-3 text-center text-xs font-bold transition-all',
                        selected
                          ? 'border-ztf-gold bg-ztf-navy text-white'
                          : 'border-gray-200 text-gray-600 hover:border-ztf-navy/40'
                      )}
                    >
                      {p.id.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      )}

      {/* Study mode / intake / academic year */}
      {programme && (
        <div className="step-enter grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
          <div>
            <Label>{t('study_mode')}</Label>
            <Controller
              control={control}
              name="study_mode"
              render={({ field: f }) => (
                <Select value={f.value} onValueChange={f.onChange}>
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
              render={({ field: f }) => (
                <Select value={f.value} onValueChange={f.onChange}>
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
              render={({ field: f }) => (
                <Select value={f.value} onValueChange={f.onChange}>
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
      )}

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
