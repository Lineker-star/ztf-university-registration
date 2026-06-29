'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { useRouter } from '@/navigation';
import { useRegistrationStore } from '@/lib/store/registrationStore';
import { DOCUMENT_REQUIREMENTS } from '@/lib/constants/documents';
import { FileUploader, UploadedFileInfo } from '@/components/registration/FileUploader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type DocsState = Record<string, UploadedFileInfo | null>;

export default function Step4Documents() {
  const t = useTranslations('documents');
  const tSteps = useTranslations('steps');
  const router = useRouter();
  const applicationId = useRegistrationStore((s) => s.applicationId);
  const step4 = useRegistrationStore((s) => s.formData.step4);
  const updateStep4 = useRegistrationStore((s) => s.updateStep4);

  const initialDocs: DocsState = {};
  for (const req of DOCUMENT_REQUIREMENTS) {
    const existing = step4.documents?.find((d) => d.document_type === req.type);
    initialDocs[req.type] = existing
      ? {
          url: existing.file_url ?? '',
          name: existing.document_name ?? '',
          size: existing.file_size ?? 0,
          mimeType: existing.mime_type ?? '',
        }
      : null;
  }

  const [docs, setDocs] = useState<DocsState>(initialDocs);
  const [error, setError] = useState<string | null>(null);

  const required = DOCUMENT_REQUIREMENTS.filter((d) => d.required);
  const optional = DOCUMENT_REQUIREMENTS.filter((d) => !d.required);

  const requiredUploadedCount = useMemo(
    () => required.filter((r) => docs[r.type]).length,
    [required, docs]
  );
  const allRequiredDone = requiredUploadedCount === required.length;

  function handleSubmit() {
    const missing = required.filter((r) => !docs[r.type]);
    if (missing.length > 0) {
      setError(`${t('required')}: ${missing.map((m) => t(m.type as any)).join(', ')}`);
      return;
    }
    setError(null);

    const documents = DOCUMENT_REQUIREMENTS.filter((r) => docs[r.type]).map((r) => ({
      document_type: r.type,
      document_name: docs[r.type]!.name,
      file_url: docs[r.type]!.url,
      file_size: docs[r.type]!.size,
      mime_type: docs[r.type]!.mimeType,
      is_required: r.required,
    }));

    updateStep4({ documents });
    router.push('/register/5');
  }

  if (!applicationId) return null;

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-500">{t('subtitle')}</p>

      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className={allRequiredDone ? 'flex items-center gap-1.5 font-medium text-green-700' : 'text-gray-600'}>
            {allRequiredDone && <CheckCircle2 className="h-4 w-4" />}
            {allRequiredDone
              ? t('all_required_done')
              : t('required_count', { count: requiredUploadedCount, total: required.length })}
          </span>
        </div>
        <Progress value={(requiredUploadedCount / required.length) * 100} />
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-ztf-navy">{t('required')}</h4>
        <div className="grid gap-5 sm:grid-cols-2">
          {required.map((req) => (
            <FileUploader
              key={req.type}
              applicationId={applicationId}
              documentType={req.type}
              label={t(req.type as any)}
              required
              maxSizeMB={req.maxSizeMB}
              acceptedTypes={req.acceptedTypes}
              value={docs[req.type]}
              onChange={(file) => setDocs((prev) => ({ ...prev, [req.type]: file }))}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-semibold text-ztf-navy">{t('optional')}</h4>
        <div className="grid gap-5 sm:grid-cols-2">
          {optional.map((req) => (
            <FileUploader
              key={req.type}
              applicationId={applicationId}
              documentType={req.type}
              label={t(req.type as any)}
              maxSizeMB={req.maxSizeMB}
              acceptedTypes={req.acceptedTypes}
              value={docs[req.type]}
              onChange={(file) => setDocs((prev) => ({ ...prev, [req.type]: file }))}
            />
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <Button type="button" variant="outline" onClick={() => router.push('/register/3')}>
          {tSteps('previous')}
        </Button>
        <Button type="button" onClick={handleSubmit}>
          {tSteps('next')}
        </Button>
      </div>
    </div>
  );
}
