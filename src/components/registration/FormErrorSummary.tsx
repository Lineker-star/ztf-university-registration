'use client';

import { useLocale } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import type { FieldErrors, FieldValues } from 'react-hook-form';

function flattenMessages(errors: FieldErrors<FieldValues>, prefix = ''): string[] {
  const messages: string[] = [];
  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && 'message' in value && typeof value.message === 'string' && value.message) {
      messages.push(`${path}: ${value.message}`);
    } else if (typeof value === 'object') {
      messages.push(...flattenMessages(value as FieldErrors<FieldValues>, path));
    }
  }
  return messages;
}

export function FormErrorSummary({ errors }: { errors: FieldErrors<FieldValues> }) {
  const locale = useLocale();
  const messages = flattenMessages(errors);

  if (messages.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
      <div className="flex items-center gap-1.5 font-medium">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {locale === 'fr' ? 'Veuillez corriger les erreurs suivantes :' : 'Please fix the following errors:'}
      </div>
      <ul className="ml-5 mt-1 list-disc">
        {messages.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
