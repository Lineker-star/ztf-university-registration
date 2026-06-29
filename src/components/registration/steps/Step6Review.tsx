'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AlertCircle, Loader2, Pencil } from 'lucide-react';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { SuccessPage } from '@/components/registration/SuccessPage';
import { fullName } from '@/lib/utils/helpers';
import { DOCUMENT_REQUIREMENTS } from '@/lib/constants/documents';

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-800">{value || '-'}</span>
    </div>
  );
}

export default function Step6Review() {
  const t = useTranslations('review');
  const tSteps = useTranslations('steps');
  const tPersonal = useTranslations('personal');
  const tAcademic = useTranslations('academic');
  const tProgramme = useTranslations('programme');
  const tDocuments = useTranslations('documents');
  const tGuardian = useTranslations('guardian');
  const tValidation = useTranslations('validation');
  const locale = useLocale();
  const router = useRouter();

  const applicationId = useRegistrationStore((s) => s.applicationId);
  const formData = useRegistrationStore((s) => s.formData);
  const resetForm = useRegistrationStore((s) => s.resetForm);

  const [agree, setAgree] = useState(false);
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);

  async function handleSubmit() {
    if (!agree || !terms) {
      setError(tValidation('agree_required'));
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/registration/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, formData, language: locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Submission failed');

      setApplicationNumber(data.applicationNumber);
      resetForm();
    } catch (err: any) {
      setError(err.message ?? 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (applicationNumber) {
    return <SuccessPage applicationNumber={applicationNumber} email={formData.step1.email} />;
  }

  const { step1, step2, step3, step4, step5 } = formData;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">{t('subtitle')}</p>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold text-ztf-navy">{t('personal_section')}</h4>
          <Button variant="ghost" size="sm" onClick={() => router.push('/register/1')}>
            <Pencil className="h-3.5 w-3.5" />
            {t('edit')}
          </Button>
        </div>
        <div className="rounded-md border border-gray-100 p-4">
          <ReviewRow label={tPersonal('first_name')} value={fullName(step1.first_name, step1.last_name)} />
          <ReviewRow label={tPersonal('email')} value={step1.email} />
          <ReviewRow label={tPersonal('phone')} value={step1.phone} />
          <ReviewRow label={tPersonal('nationality')} value={step1.nationality} />
          <ReviewRow label={tPersonal('city')} value={step1.city} />
        </div>
      </section>

      <Separator />

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold text-ztf-navy">{t('academic_section')}</h4>
          <Button variant="ghost" size="sm" onClick={() => router.push('/register/2')}>
            <Pencil className="h-3.5 w-3.5" />
            {t('edit')}
          </Button>
        </div>
        <div className="rounded-md border border-gray-100 p-4">
          {step2.qualifications?.filter((q) => q.qualification_type).map((q, i) => (
            <ReviewRow key={i} label={tAcademic(q.qualification_type as any)} value={q.institution_name} />
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold text-ztf-navy">{t('programme_section')}</h4>
          <Button variant="ghost" size="sm" onClick={() => router.push('/register/3')}>
            <Pencil className="h-3.5 w-3.5" />
            {t('edit')}
          </Button>
        </div>
        <div className="rounded-md border border-gray-100 p-4">
          <ReviewRow label={tProgramme('system')} value={step3.academic_system && tProgramme(step3.academic_system)} />
          <ReviewRow label={tProgramme('programme')} value={step3.programme} />
          <ReviewRow label={tProgramme('department')} value={step3.department} />
          <ReviewRow label={tProgramme('intake')} value={step3.intake_session} />
        </div>
      </section>

      <Separator />

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold text-ztf-navy">{t('documents_section')}</h4>
          <Button variant="ghost" size="sm" onClick={() => router.push('/register/4')}>
            <Pencil className="h-3.5 w-3.5" />
            {t('edit')}
          </Button>
        </div>
        <div className="rounded-md border border-gray-100 p-4">
          {step4.documents?.length ? (
            step4.documents
              .filter((d) => d.document_type)
              .map((d, i) => (
                <ReviewRow key={i} label={tDocuments(d.document_type as any)} value={d.document_name} />
              ))
          ) : (
            <p className="text-sm text-gray-400">-</p>
          )}
          {(() => {
            const uploadedTypes = new Set((step4.documents ?? []).map((d) => d.document_type));
            const missing = DOCUMENT_REQUIREMENTS.filter((r) => r.required && !uploadedTypes.has(r.type));
            if (missing.length === 0) return null;
            return (
              <p className="mt-2 border-t border-gray-100 pt-2 text-xs text-red-600">
                {tDocuments('required')}: {missing.map((m) => tDocuments(m.type as any)).join(', ')}
              </p>
            );
          })()}
        </div>
      </section>

      <Separator />

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-semibold text-ztf-navy">{t('guardian_section')}</h4>
          <Button variant="ghost" size="sm" onClick={() => router.push('/register/5')}>
            <Pencil className="h-3.5 w-3.5" />
            {t('edit')}
          </Button>
        </div>
        <div className="rounded-md border border-gray-100 p-4">
          <ReviewRow label={tGuardian('parent_name')} value={step5.guardian_full_name} />
          <ReviewRow label={tGuardian('emergency_name')} value={step5.emergency_full_name} />
        </div>
      </section>

      <Separator />

      <section className="rounded-md bg-gray-50 p-4">
        <h4 className="mb-2 font-semibold text-ztf-navy">{t('declaration')}</h4>
        <p className="mb-4 text-sm text-gray-600">{t('declaration_text')}</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
            <Label htmlFor="agree" className="font-normal">
              {t('agree')}
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="terms" checked={terms} onCheckedChange={(v) => setTerms(!!v)} />
            <Label htmlFor="terms" className="font-normal">
              {t('terms')}
            </Label>
          </div>
        </div>
      </section>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push('/register/5')} disabled={submitting}>
          {tSteps('previous')}
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting || !agree || !terms}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? t('submitting') : t('submit_application')}
        </Button>
      </div>
    </div>
  );
}
