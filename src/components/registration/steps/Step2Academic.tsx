'use client';

import { useForm, useFieldArray, Controller, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { step2Schema, Step2FormValues } from '@/lib/validations/step2';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StepNavigation } from '@/components/registration/StepNavigation';
import { FormErrorSummary } from '@/components/registration/FormErrorSummary';
import { GCE_A_LEVEL_GRADES, GCE_A_LEVEL_SUBJECTS, BACCALAUREAT_SERIES } from '@/lib/constants/programmes';

const QUALIFICATION_TYPES = ['o_level', 'a_level', 'bacc', 'hnd_cert', 'degree'] as const;
const QUALIFYING_TYPES = ['a_level', 'bacc'];

function QualificationRow({
  control,
  index,
  qualificationType,
  t,
  onRemove,
  canRemove,
  register,
}: {
  control: Control<Step2FormValues>;
  index: number;
  qualificationType: string;
  t: ReturnType<typeof useTranslations>;
  onRemove: () => void;
  canRemove: boolean;
  register: ReturnType<typeof useForm<Step2FormValues>>['register'];
}) {
  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
    control,
    name: `qualifications.${index}.subjects`,
  });

  return (
    <Card className="border-gray-100">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-ztf-navy">
            {t('certificate')} #{index + 1}
          </h4>
          {canRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
              {t('remove_qualification')}
            </Button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t('highest_qualification')}</Label>
            <Controller
              control={control}
              name={`qualifications.${index}.qualification_type`}
              render={({ field: f }) => (
                <Select value={f.value} onValueChange={f.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUALIFICATION_TYPES.map((type) => (
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
            <Label>{t('institution')}</Label>
            <Input {...register(`qualifications.${index}.institution_name`)} />
          </div>
          <div>
            <Label>{t('graduation_year')}</Label>
            <Input type="number" {...register(`qualifications.${index}.graduation_year`)} />
          </div>

          {qualificationType === 'bacc' && (
            <div>
              <Label>{t('bacc_series')}</Label>
              <Controller
                control={control}
                name={`qualifications.${index}.bacc_series`}
                render={({ field: f }) => (
                  <Select value={f.value ?? ''} onValueChange={f.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('bacc_series')} />
                    </SelectTrigger>
                    <SelectContent>
                      {BACCALAUREAT_SERIES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {qualificationType !== 'a_level' && (
            <div>
              <Label>{qualificationType === 'bacc' ? t('bacc_average') : t('gpa')}</Label>
              <Input {...register(`qualifications.${index}.gpa_grade`)} />
            </div>
          )}
        </div>

        {qualificationType === 'a_level' && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <Label>{t('a_level_subjects')}</Label>
              <span className="text-xs text-gray-400">
                {subjectFields.length}/5 &middot; {t('a_level_min_hint')}
              </span>
            </div>

            {subjectFields.map((subjectField, subjectIndex) => (
              <div key={subjectField.id} className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={`qualifications.${index}.subjects.${subjectIndex}.name`}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={t('subjects')} />
                      </SelectTrigger>
                      <SelectContent>
                        {GCE_A_LEVEL_SUBJECTS.map((subj) => (
                          <SelectItem key={subj} value={subj}>
                            {subj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name={`qualifications.${index}.subjects.${subjectIndex}.grade`}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder={t('grade')} />
                      </SelectTrigger>
                      <SelectContent>
                        {GCE_A_LEVEL_GRADES.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <button
                  type="button"
                  onClick={() => removeSubject(subjectIndex)}
                  className="p-2 text-red-400 hover:text-red-600"
                  aria-label={t('remove_qualification')}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {subjectFields.length < 5 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => appendSubject({ name: '', grade: 'A' })}
              >
                <Plus className="h-4 w-4" />
                {t('add_subject')}
              </Button>
            )}

            {subjectFields.length < 2 && (
              <p className="text-xs text-red-500">{t('a_level_min_warning')}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Step2Academic() {
  const t = useTranslations('academic');

  const router = useRouter();
  const step2 = useRegistrationStore((s) => s.formData.step2);
  const updateStep2 = useRegistrationStore((s) => s.updateStep2);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      qualifications:
        step2.qualifications?.length
          ? (step2.qualifications as Step2FormValues['qualifications'])
          : [{ qualification_type: 'a_level', institution_name: '', graduation_year: new Date().getFullYear(), gpa_grade: '', subjects: [], is_highest: true }],
      experience: {
        has_experience: step2.experience?.has_experience ?? false,
        years_of_experience: step2.experience?.years_of_experience ?? 0,
        description: step2.experience?.description ?? '',
        field_of_specialization: step2.experience?.field_of_specialization ?? '',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'qualifications' });
  const hasExperience = watch('experience.has_experience');
  const watchedQualifications = watch('qualifications');
  const hasQualifyingCredential = watchedQualifications?.some((q) => QUALIFYING_TYPES.includes(q.qualification_type));

  function onSubmit(values: Step2FormValues) {
    updateStep2(values);
    router.push('/register/3');
  }

  function onInvalid(formErrors: typeof errors) {
    // eslint-disable-next-line no-console
    console.error('Step 2 validation failed:', formErrors);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      <FormErrorSummary errors={errors} />
      <p className="text-sm text-gray-500">{t('subtitle')}</p>

      {!hasQualifyingCredential && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{t('qualifying_credential_notice')}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <QualificationRow
            key={field.id}
            control={control}
            register={register}
            index={index}
            qualificationType={watchedQualifications?.[index]?.qualification_type ?? field.qualification_type}
            t={t}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            qualification_type: 'a_level',
            institution_name: '',
            graduation_year: new Date().getFullYear(),
            gpa_grade: '',
            subjects: [],
            is_highest: false,
          })
        }
      >
        <Plus className="h-4 w-4" />
        {t('add_qualification')}
      </Button>

      <div className="border-t border-gray-100 pt-6">
        <h4 className="mb-3 font-semibold text-ztf-navy">{t('professional_exp')}</h4>
        <div className="mb-4 flex items-center gap-2">
          <Controller
            control={control}
            name="experience.has_experience"
            render={({ field: f }) => (
              <Checkbox id="has_experience" checked={f.value} onCheckedChange={f.onChange} />
            )}
          />
          <Label htmlFor="has_experience">{t('has_experience')}</Label>
        </div>

        {hasExperience && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('exp_years')}</Label>
              <Input type="number" {...register('experience.years_of_experience')} />
            </div>
            <div>
              <Label>{t('specialization')}</Label>
              <Input {...register('experience.field_of_specialization')} />
            </div>
            <div className="sm:col-span-2">
              <Label>{t('exp_description')}</Label>
              <Textarea rows={3} {...register('experience.description')} />
            </div>
          </div>
        )}
      </div>

      <StepNavigation onPrevious={() => router.push('/register/1')} isSubmitting={isSubmitting} />
    </form>
  );
}
