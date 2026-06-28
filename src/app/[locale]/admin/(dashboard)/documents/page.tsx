'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resolveDocumentUrl } from '@/components/admin/DocumentViewer';
import { formatFileSize, fullName } from '@/lib/utils/helpers';

interface DocumentRow {
  id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_required: boolean;
  is_verified: boolean;
  created_at: string;
  applications: {
    application_number: string;
    personal_info: { first_name: string; last_name: string } | null;
  };
}

export default function AdminDocumentsPage() {
  const t = useTranslations('admin');
  const td = useTranslations('documents');
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/documents');
    const data = await res.json();
    if (data.success) setDocuments(data.documents);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVerified(doc: DocumentRow) {
    setBusyId(doc.id);
    await fetch(`/api/admin/documents/${doc.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_verified: !doc.is_verified }),
    });
    setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, is_verified: !d.is_verified } : d)));
    setBusyId(null);
  }

  async function handleView(doc: DocumentRow) {
    const url = await resolveDocumentUrl(doc.file_url);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ztf-navy">{t('documents')}</h1>

      <Card>
        <CardContent className="p-5">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-ztf-navy" />
            </div>
          ) : (
            <div className="space-y-2">
              {documents.length === 0 && <p className="text-sm text-gray-400">{t('no_applications')}</p>}
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-md border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {doc.document_name}{' '}
                      {doc.is_required && (
                        <Badge variant="outline" className="ml-1 text-[10px]">
                          {td('required')}
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.applications.application_number} &middot;{' '}
                      {fullName(doc.applications.personal_info?.first_name, doc.applications.personal_info?.last_name)}{' '}
                      &middot; {formatFileSize(doc.file_size)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleView(doc)}>
                      {t('view')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={busyId === doc.id}
                      onClick={() => toggleVerified(doc)}
                      className={doc.is_verified ? 'text-green-600' : 'text-gray-400'}
                    >
                      {doc.is_verified ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
