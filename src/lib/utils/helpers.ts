import { ApplicationStatus } from '@/types';

export function formatDate(value: string | null | undefined, locale: 'en' | 'fr' = 'en'): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(value: string | null | undefined, locale: 'en' | 'fr' = 'en'): string {
  if (!value) return '-';
  return new Date(value).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function fullName(first?: string | null, last?: string | null): string {
  return [first, last].filter(Boolean).join(' ') || '-';
}

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' | 'outline';

export const STATUS_BADGE_VARIANT: Record<ApplicationStatus, BadgeVariant> = {
  pending: 'warning',
  under_review: 'info',
  shortlisted: 'secondary',
  admitted: 'success',
  rejected: 'destructive',
  deferred: 'outline',
  withdrawn: 'outline',
};

export const STATUS_OPTIONS: ApplicationStatus[] = [
  'pending',
  'under_review',
  'shortlisted',
  'admitted',
  'rejected',
  'deferred',
  'withdrawn',
];

export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delayMs);
  };
}
