'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, FileText, ImageIcon, Loader2 } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Document } from '@/types';
import { formatFileSize } from '@/lib/utils/helpers';

export async function resolveDocumentUrl(path: string): Promise<string> {
  const res = await fetch(`/api/admin/documents/sign?path=${encodeURIComponent(path)}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error ?? 'Could not resolve document');
  return data.url;
}

export function DocumentViewer({ document: doc }: { document: Document }) {
  const t = useTranslations('documents');
  const [open, setOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isImage = doc.mime_type?.startsWith('image/');

  async function handleOpen() {
    setOpen(true);
    setError(null);
    setSignedUrl(null);
    setLoading(true);
    try {
      const url = await resolveDocumentUrl(doc.file_url);
      setSignedUrl(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2">
        <div className="flex items-center gap-2 overflow-hidden">
          {isImage ? (
            <ImageIcon className="h-5 w-5 shrink-0 text-ztf-navy" />
          ) : (
            <FileText className="h-5 w-5 shrink-0 text-ztf-navy" />
          )}
          <div className="overflow-hidden">
            <p className="truncate text-sm font-medium text-gray-700">{doc.document_name}</p>
            <p className="text-xs text-gray-400">{formatFileSize(doc.file_size)}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleOpen}>
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{doc.document_name}</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-[300px] items-center justify-center">
            {loading && <Loader2 className="h-8 w-8 animate-spin text-ztf-navy" />}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {signedUrl && isImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={signedUrl} alt={doc.document_name} className="max-h-[70vh] rounded-md object-contain" />
            )}
            {signedUrl && !isImage && (
              <iframe src={signedUrl} className="h-[70vh] w-full rounded-md border" title={doc.document_name} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
