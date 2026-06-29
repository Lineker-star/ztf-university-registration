'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { step1Schema, Step1FormValues } from '@/lib/validations/step1';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploader, UploadedFileInfo } from '@/components/registration/FileUploader';
import { StepNavigation } from '@/components/registration/StepNavigation';
import { COUNTRIES } from '@/lib/constants/countries';
import { CAMEROON_REGIONS } from '@/lib/constants/programmes';

const RELIGIONS = ['Christianity', 'Islam', 'Other', 'Prefer not to say'];

export default function Step1Personal() {
  const t = useTranslations('personal');
  const tValidation = useTranslations('validation');
  const router = useRouter();
  const applicationId = useRegistrationStore((s) => s.applicationId);
  const step1 = useRegistrationStore((s) => s.formData.step1);
  const updateStep1 = useRegistrationStore((s) => s.updateStep1);

  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(
    !!step1.whatsapp && step1.whatsapp === step1.phone
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      first_name: step1.first_name ?? '',
      last_name: step1.last_name ?? '',
      date_of_birth: step1.date_of_birth ?? '',
      place_of_birth: step1.place_of_birth ?? '',
      gender: step1.gender ?? 'male',
      nationality: step1.nationality ?? 'Cameroonian',
      national_id: step1.national_id ?? '',
      email: step1.email ?? '',
      phone: step1.phone ?? '',
      whatsapp: step1.whatsapp ?? '',
      address: step1.address ?? '',
      city: step1.city ?? '',
      region: step1.region ?? '',
      country: step1.country ?? 'Cameroon',
      marital_status: step1.marital_status ?? 'single',
      religion: step1.religion ?? '',
      passport_photo_url: step1.passport_photo_url ?? null,
    },
  });

  const selectedCountry = watch('country');
  const photoUrl = watch('passport_photo_url');
  const photoValue: UploadedFileInfo | null = photoUrl
    ? { url: photoUrl, name: 'passport-photo.jpg', size: 0, mimeType: 'image/jpeg' }
    : null;

  function onSubmit(values: Step1FormValues) {
    updateStep1(values);
    router.push('/register/2');
  }

  const fieldError = (key: keyof Step1FormValues) => {
    const err = errors[key];
    if (!err) return null;
    return tValidation(err.message as any) || tValidation('required');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="text-sm text-gray-500">{t('subtitle')}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="first_name">{t('first_name')}</Label>
          <Input id="first_name" {...register('first_name')} />
          {errors.first_name && <p className="mt-1 text-xs text-red-600">{fieldError('first_name')}</p>}
        </div>
        <div>
          <Label htmlFor="last_name">{t('last_name')}</Label>
          <Input id="last_name" {...register('last_name')} />
          {errors.last_name && <p className="mt-1 text-xs text-red-600">{fieldError('last_name')}</p>}
        </div>
        <div>
          <Label htmlFor="date_of_birth">{t('date_of_birth')}</Label>
          <Input id="date_of_birth" type="date" {...register('date_of_birth')} />
          {errors.date_of_birth && <p className="mt-1 text-xs text-red-600">{fieldError('date_of_birth')}</p>}
        </div>
        <div>
          <Label htmlFor="place_of_birth">{t('place_of_birth')}</Label>
          <Input id="place_of_birth" {...register('place_of_birth')} />
        </div>
        <div>
          <Label>{t('gender')}</Label>
          <Select defaultValue={step1.gender ?? 'male'} onValueChange={(v) => setValue('gender', v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t('male')}</SelectItem>
              <SelectItem value="female">{t('female')}</SelectItem>
              <SelectItem value="other">{t('other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="nationality">{t('nationality')}</Label>
          <Input id="nationality" {...register('nationality')} />
        </div>
        <div>
          <Label htmlFor="national_id">{t('national_id')}</Label>
          <Input id="national_id" {...register('national_id')} />
          {errors.national_id && <p className="mt-1 text-xs text-red-600">{fieldError('national_id')}</p>}
        </div>
        <div>
          <Label htmlFor="email">{t('email')}</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{tValidation('email_invalid')}</p>}
        </div>
        <div>
          <Label htmlFor="phone">{t('phone')}</Label>
          <div className="flex">
            <span className="flex items-center rounded-l-md border border-r-0 border-input bg-gray-50 px-3 text-sm text-gray-500">
              +237
            </span>
            <Input
              id="phone"
              className="rounded-l-none"
              {...register('phone', {
                onChange: (e) => {
                  if (whatsappSameAsPhone) setValue('whatsapp', e.target.value);
                },
              })}
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-600">{fieldError('phone')}</p>}
        </div>
        <div>
          <Label htmlFor="whatsapp">{t('whatsapp')}</Label>
          <Input id="whatsapp" disabled={whatsappSameAsPhone} {...register('whatsapp')} />
          <div className="mt-1.5 flex items-center gap-2">
            <Checkbox
              id="whatsapp_same"
              checked={whatsappSameAsPhone}
              onCheckedChange={(checked) => {
                setWhatsappSameAsPhone(!!checked);
                if (checked) setValue('whatsapp', watch('phone'));
              }}
            />
            <Label htmlFor="whatsapp_same" className="text-xs font-normal text-gray-500">
              {t('same_as_phone')}
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="address">{t('address')}</Label>
        <Input id="address" {...register('address')} />
        {errors.address && <p className="mt-1 text-xs text-red-600">{fieldError('address')}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="city">{t('city')}</Label>
          <Input id="city" {...register('city')} />
        </div>
        <div>
          <Label htmlFor="region">{t('region')}</Label>
          {selectedCountry === 'Cameroon' ? (
            <Controller
              control={control}
              name="region"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder={t('region')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMEROON_REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Input id="region" {...register('region')} />
          )}
        </div>
        <div>
          <Label htmlFor="country">{t('country')}</Label>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>{t('marital_status')}</Label>
          <Select
            defaultValue={step1.marital_status ?? 'single'}
            onValueChange={(v) => setValue('marital_status', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">{t('single')}</SelectItem>
              <SelectItem value="married">{t('married')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="religion">{t('religion')}</Label>
          <Controller
            control={control}
            name="religion"
            render={({ field }) => (
              <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                <SelectTrigger id="religion">
                  <SelectValue placeholder={t('religion')} />
                </SelectTrigger>
                <SelectContent>
                  {RELIGIONS.map((religion) => (
                    <SelectItem key={religion} value={religion}>
                      {religion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {applicationId && (
        <FileUploader
          applicationId={applicationId}
          documentType="passport_photo"
          target="photo"
          label={t('photo')}
          maxSizeMB={2}
          acceptedTypes={['image/jpeg', 'image/png']}
          value={photoValue}
          onChange={(file) => setValue('passport_photo_url', file?.url ?? null)}
        />
      )}
      <p className="text-xs text-gray-400">{t('photo_hint')}</p>

      <StepNavigation isFirstStep isSubmitting={isSubmitting} />
    </form>
  );
}
