'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Loader2, Mail, Printer, Save } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DocumentViewer, resolveDocumentUrl } from '@/components/admin/DocumentViewer';
import { ApplicationDetailData } from '@/types';
import { formatDateTime, fullName, STATUS_OPTIONS } from '@/lib/utils/helpers';
import { useToast } from '@/components/ui/use-toast';

export function ApplicationDetail({ applicationId }: { applicationId: string }) {
  const t = useTranslations('admin');
  const { toast } = useToast();
  const [data, setData] = useState<ApplicationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [zipping, setZipping] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`);
      const json = await res.json();
      if (json.success) {
        setData(json.application);
        setNotes(json.application.admin_notes ?? '');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  async function confirmStatusChange() {
    if (!pendingStatus) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: pendingStatus, notes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast({ title: 'Status updated', description: `Application is now ${pendingStatus}.` });
      setPendingStatus(null);
      fetchData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveNotes() {
    setSavingNotes(true);
    try {
      await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: notes }),
      });
      toast({ title: 'Notes saved' });
    } finally {
      setSavingNotes(false);
    }
  }

  async function downloadAllDocuments() {
    if (!data?.documents?.length) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      for (const doc of data.documents) {
        const url = await resolveDocumentUrl(doc.file_url);
        const blob = await (await fetch(url)).blob();
        zip.file(doc.document_name, blob);
      }
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${data.application_number}_documents.zip`);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not build ZIP archive.' });
    } finally {
      setZipping(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ztf-navy" />
      </div>
    );
  }

  const personal = data.personal_info;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-ztf-navy">{data.application_number}</h1>
          <p className="text-sm text-gray-500">{fullName(personal?.first_name, personal?.last_name)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={data.status} />
          {personal?.email && (
            <Button asChild variant="outline" size="sm">
              <a href={`mailto:${personal.email}`}>
                <Mail className="h-4 w-4" />
                {t('send_email')}
              </a>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            {t('print')}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAllDocuments} disabled={zipping}>
            {zipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {t('download_docs')}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <Label className="shrink-0">{t('update_status')}</Label>
          <Select value={data.status} onValueChange={(v) => setPendingStatus(v)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">{t('tabs_personal')}</TabsTrigger>
          <TabsTrigger value="academic">{t('tabs_academic')}</TabsTrigger>
          <TabsTrigger value="programme">{t('tabs_programme')}</TabsTrigger>
          <TabsTrigger value="documents">{t('tabs_documents')}</TabsTrigger>
          <TabsTrigger value="guardian">{t('tabs_guardian')}</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
              <Field label="Name" value={fullName(personal?.first_name, personal?.last_name)} />
              <Field label="Email" value={personal?.email} />
              <Field label="Phone" value={personal?.phone} />
              <Field label="WhatsApp" value={personal?.whatsapp} />
              <Field label="Date of Birth" value={personal?.date_of_birth} />
              <Field label="Gender" value={personal?.gender} />
              <Field label="Nationality" value={personal?.nationality} />
              <Field label="National ID" value={personal?.national_id} />
              <Field label="Address" value={personal?.address} />
              <Field label="City" value={personal?.city} />
              <Field label="Region" value={personal?.region} />
              <Field label="Country" value={personal?.country} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardContent className="space-y-4 p-5">
              {data.academic_qualifications.map((q) => (
                <div key={q.id} className="rounded-md border border-gray-100 p-3">
                  <p className="font-medium text-gray-800">{q.qualification_type} &mdash; {q.institution_name}</p>
                  <p className="text-sm text-gray-500">
                    {q.graduation_year} &middot; {q.gpa_grade}
                  </p>
                </div>
              ))}
              {data.professional_experience?.has_experience && (
                <div className="rounded-md border border-gray-100 p-3">
                  <p className="font-medium text-gray-800">Professional Experience</p>
                  <p className="text-sm text-gray-500">
                    {data.professional_experience.years_of_experience} years &middot;{' '}
                    {data.professional_experience.field_of_specialization}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{data.professional_experience.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programme">
          <Card>
            <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
              <Field label="System" value={data.academic_system} />
              <Field label="Programme" value={data.programme} />
              <Field label="Department" value={data.department} />
              <Field label="Specialization" value={data.specialization} />
              <Field label="Study Mode" value={data.study_mode} />
              <Field label="Intake" value={data.intake_session} />
              <Field label="Academic Year" value={data.academic_year} />
              <Field label="Second Choice" value={data.second_choice_programme} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="space-y-3 p-5">
              {data.documents.length === 0 && <p className="text-sm text-gray-400">No documents uploaded.</p>}
              {data.documents.map((doc) => (
                <DocumentViewer key={doc.id} document={doc} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guardian">
          <Card>
            <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
              <Field label="Guardian" value={data.guardian_info?.guardian_full_name} />
              <Field label="Relationship" value={data.guardian_info?.guardian_relationship} />
              <Field label="Phone" value={data.guardian_info?.guardian_phone} />
              <Field label="Email" value={data.guardian_info?.guardian_email} />
              <Field label="Emergency Contact" value={data.guardian_info?.emergency_full_name} />
              <Field label="Emergency Phone" value={data.guardian_info?.emergency_phone} />
              <Field label="Sponsor" value={data.guardian_info?.sponsor_type} />
              <Field label="Sponsor Name" value={data.guardian_info?.sponsor_name} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="print:hidden">
        <CardContent className="space-y-3 p-5">
          <Label>{t('notes')}</Label>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button size="sm" onClick={saveNotes} disabled={savingNotes}>
            {savingNotes ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t('add_note')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-3 font-semibold text-gray-800">{t('history')}</h3>
          <div className="space-y-3 border-l border-gray-200 pl-4">
            {data.application_history.map((h) => (
              <div key={h.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-ztf-navy" />
                <p className="text-sm font-medium text-gray-800">
                  {h.status_from ? `${h.status_from} -> ${h.status_to}` : h.status_to}
                </p>
                {h.notes && <p className="text-sm text-gray-500">{h.notes}</p>}
                <p className="text-xs text-gray-400">{formatDateTime(h.created_at)}</p>
              </div>
            ))}
            {data.application_history.length === 0 && <p className="text-sm text-gray-400">No history yet.</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!pendingStatus} onOpenChange={(open) => !open && setPendingStatus(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirm_status_change', { status: pendingStatus ?? '' })}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingStatus(null)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange} disabled={savingStatus}>
              {savingStatus && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '-'}</p>
    </div>
  );
}
