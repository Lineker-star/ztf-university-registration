'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import { File as FileIcon, ImageIcon, Loader2, Trash2, UploadCloud, AlertCircle } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface UploadedFileInfo {
  url: string;
  name: string;
  size: number;
  mimeType: string;
  documentId?: string;
}

interface FileUploaderProps {
  applicationId: string;
  documentType: string;
  target?: 'document' | 'photo';
  label: string;
  required?: boolean;
  maxSizeMB: number;
  acceptedTypes: string[];
  value: UploadedFileInfo | null;
  onChange: (file: UploadedFileInfo | null) => void;
}

export function FileUploader({
  applicationId,
  documentType,
  target = 'document',
  label,
  required,
  maxSizeMB,
  acceptedTypes,
  value,
  onChange,
}: FileUploaderProps) {
  const t = useTranslations('documents');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    (file: File) => {
      setError(null);

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File exceeds ${maxSizeMB}MB`);
        return;
      }
      if (!acceptedTypes.includes(file.type)) {
        setError('File type not accepted');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicationId', applicationId);
      formData.append('documentType', documentType);
      formData.append('target', target);
      formData.append('isRequired', String(!!required));

      setUploading(true);
      setProgress(0);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/registration/upload');
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        setUploading(false);
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && res.success) {
            onChange({
              url: res.url ?? res.document?.file_url,
              name: file.name,
              size: file.size,
              mimeType: file.type,
              documentId: res.document?.id,
            });
          } else {
            setError(res.error ?? 'Upload failed');
          }
        } catch {
          setError('Upload failed');
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setError('Upload failed');
      };
      xhr.send(formData);
    },
    [applicationId, documentType, target, required, maxSizeMB, acceptedTypes, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) upload(acceptedFiles[0]);
    },
    [upload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {} as Record<string, string[]>),
  });

  const isImage = value?.mimeType.startsWith('image/');

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        <span className="text-xs text-gray-400">{t('max_size', { max: maxSizeMB })}</span>
      </div>

      {value && !uploading ? (
        <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2">
          <div className="flex items-center gap-2 overflow-hidden">
            {isImage ? (
              <ImageIcon className="h-5 w-5 shrink-0 text-green-600" />
            ) : (
              <FileIcon className="h-5 w-5 shrink-0 text-green-600" />
            )}
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium text-green-800">{value.name}</p>
              <p className="text-xs text-green-600">{(value.size / 1024).toFixed(0)} KB &middot; {t('uploaded')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded p-1 text-green-700 hover:bg-green-100"
            aria-label={t('remove')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors',
            isDragActive ? 'border-ztf-navy bg-blue-50' : 'border-gray-300 hover:border-ztf-navy',
            uploading && 'pointer-events-none opacity-70'
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <>
              <Loader2 className="mb-2 h-6 w-6 animate-spin text-ztf-navy" />
              <p className="mb-2 text-sm text-gray-600">{t('uploading')}</p>
              <Progress value={progress} className="w-full max-w-xs" />
            </>
          ) : (
            <>
              <UploadCloud className="mb-2 h-6 w-6 text-gray-400" />
              <p className="text-sm text-gray-600">{t('upload_hint')}</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
