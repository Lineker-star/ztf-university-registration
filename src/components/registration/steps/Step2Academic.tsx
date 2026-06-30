'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';

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
import { StepNavigation } from '@/components/registration/StepNavigation';
import { FormErrorSummary } from '@/components/registration/FormErrorSummary';

const QUALIFICATION_TYPES = ['o_level', 'a_level', 'bacc', 'hnd_cert', 'degree'] as const;

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
          : [{ qualification_type: 'o_level', institution_name: '', graduation_year: new Date().getFullYear(), gpa_grade: '', subjects: [], is_highest: true }],
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

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="border-gray-100">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-ztf-navy">
                  {t('certificate')} #{index + 1}
                </h4>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
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
                <div>
                  <Label>{t('gpa')}</Label>
                  <Input {...register(`qualifications.${index}.gpa_grade`)} />
                </div>
              </div>
            </CardContent>
          </Card>
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
