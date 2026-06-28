import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { ApplicationListItem } from '@/types';
import { formatDate, fullName } from './helpers';

export function buildExportUrl(
  format: 'excel',
  filters: { status?: string; programme?: string }
): string {
  const params = new URLSearchParams({ format });
  if (filters.status) params.set('status', filters.status);
  if (filters.programme) params.set('programme', filters.programme);
  return `/api/admin/export?${params.toString()}`;
}

export function exportApplicationsToPDF(applications: ApplicationListItem[], title = 'ZTF Applications Report') {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(16);
  doc.setTextColor(0, 59, 122);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  const rows = applications.map((app) => [
    app.application_number,
    fullName(app.personal_info?.first_name, app.personal_info?.last_name),
    app.personal_info?.email ?? '-',
    app.programme ?? '-',
    app.department ?? '-',
    app.status,
    formatDate(app.submitted_at ?? app.created_at),
  ]);

  autoTable(doc, {
    startY: 28,
    head: [['App No.', 'Name', 'Email', 'Programme', 'Department', 'Status', 'Date']],
    body: rows,
    headStyles: { fillColor: [0, 59, 122] },
    styles: { fontSize: 8 },
  });

  doc.save(`ZTF_Applications_${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function downloadFile(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
