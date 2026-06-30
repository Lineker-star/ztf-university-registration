import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getInstitute, getField, getSpecialtiesByField, MAIN_PROGRAMMES, BACCALAUREAT_SERIES } from '@/lib/constants/programmes';

interface PdfQualification {
  qualification_type?: string | null;
  institution_name?: string | null;
  graduation_year?: number | null;
  gpa_grade?: string | null;
  subjects?: { name: string; grade: string }[] | null;
  bacc_series?: string | null;
}

export interface ApplicationPdfData {
  applicationNumber: string;
  status?: string | null;
  submittedAt?: string | null;
  locale: 'en' | 'fr';
  personal: {
    first_name?: string | null;
    last_name?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    nationality?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    region?: string | null;
  };
  qualifications: PdfQualification[];
  programme: {
    higher_institute?: string | null;
    field_of_study?: string | null;
    specialty?: string | null;
    programme?: string | null;
    study_mode?: string | null;
    intake_session?: string | null;
  };
  guardian: {
    guardian_full_name?: string | null;
    guardian_relationship?: string | null;
    guardian_phone?: string | null;
    emergency_full_name?: string | null;
    emergency_phone?: string | null;
  };
}

const QUALIFICATION_LABELS: Record<string, { en: string; fr: string }> = {
  o_level: { en: 'GCE Ordinary Level (O/L)', fr: 'BEPC' },
  a_level: { en: 'GCE Advanced Level (A/L)', fr: 'GCE Advanced Level (A/L)' },
  bacc: { en: 'Baccalauréat', fr: 'Baccalauréat' },
  hnd_cert: { en: 'HND Certificate', fr: 'HND' },
  degree: { en: 'University Degree', fr: 'Licence / Diplôme Universitaire' },
};

function qualificationLabel(type: string | null | undefined, isEn: boolean) {
  if (!type) return '-';
  const entry = QUALIFICATION_LABELS[type];
  if (!entry) return type;
  return isEn ? entry.en : entry.fr;
}

export function generateApplicationPdf(data: ApplicationPdfData) {
  const doc = new jsPDF();
  const isEn = data.locale === 'en';
  const navy: [number, number, number] = [0, 59, 122];
  const gold: [number, number, number] = [201, 168, 76];

  doc.setFillColor(...navy);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ZTF University Institute', 14, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(isEn ? 'Student Registration Application' : 'Dossier de Candidature', 14, 21);

  doc.setFillColor(...gold);
  doc.roundedRect(138, 8, 58, 14, 2, 2, 'F');
  doc.setTextColor(10, 22, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(data.applicationNumber, 167, 16, { align: 'center' });

  let y = 40;
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);
  doc.setTextColor(...navy);
  doc.text(isEn ? 'Personal Information' : 'Informations Personnelles', 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    body: [
      [isEn ? 'Full Name' : 'Nom complet', `${data.personal.first_name ?? ''} ${data.personal.last_name ?? ''}`.trim() || '-'],
      [isEn ? 'Date of Birth' : 'Date de naissance', data.personal.date_of_birth ?? '-'],
      [isEn ? 'Gender' : 'Sexe', data.personal.gender ?? '-'],
      [isEn ? 'Nationality' : 'Nationalité', data.personal.nationality ?? '-'],
      [isEn ? 'Email' : 'Email', data.personal.email ?? '-'],
      [isEn ? 'Phone' : 'Téléphone', data.personal.phone ?? '-'],
      [
        isEn ? 'Address' : 'Adresse',
        [data.personal.address, data.personal.city, data.personal.region].filter(Boolean).join(', ') || '-',
      ],
    ],
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  doc.setFontSize(12);
  doc.setTextColor(...navy);
  doc.text(isEn ? 'Academic Background' : 'Parcours Académique', 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    theme: 'striped',
    headStyles: { fillColor: navy, fontSize: 8 },
    styles: { fontSize: 8 },
    head: [[
      isEn ? 'Qualification' : 'Diplôme',
      isEn ? 'Institution' : 'Établissement',
      isEn ? 'Year' : 'Année',
      isEn ? 'Result' : 'Résultat',
    ]],
    body: data.qualifications.map((q) => [
      qualificationLabel(q.qualification_type, isEn),
      q.institution_name ?? '-',
      q.graduation_year ?? '-',
      q.qualification_type === 'a_level'
        ? `${q.subjects?.length ?? 0} ${isEn ? 'subjects passed' : 'matières réussies'}`
        : q.gpa_grade || '-',
    ]),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  const aLevelQual = data.qualifications.find((q) => q.qualification_type === 'a_level' && q.subjects?.length);
  if (aLevelQual) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(11);
    doc.setTextColor(...navy);
    doc.text(isEn ? 'GCE A-Level Subject Grades' : 'Notes GCE A-Level', 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      theme: 'grid',
      styles: { fontSize: 8 },
      head: [[isEn ? 'Subject' : 'Matière', isEn ? 'Grade' : 'Note']],
      body: (aLevelQual.subjects ?? []).map((s) => [s.name, s.grade]),
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  const baccQual = data.qualifications.find((q) => q.qualification_type === 'bacc');
  if (baccQual) {
    if (y > 250) { doc.addPage(); y = 20; }
    const series = BACCALAUREAT_SERIES.find((s) => s.id === baccQual.bacc_series);
    doc.setFontSize(11);
    doc.setTextColor(...navy);
    doc.text(isEn ? 'Baccalauréat Details' : 'Détails du Baccalauréat', 14, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      theme: 'plain',
      styles: { fontSize: 9 },
      body: [
        [isEn ? 'Series' : 'Série', series?.label ?? baccQual.bacc_series ?? '-'],
        [isEn ? 'Average (out of 20)' : 'Moyenne (sur 20)', baccQual.gpa_grade || '-'],
      ],
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  if (y > 240) { doc.addPage(); y = 20; }

  const institute = data.programme.higher_institute ? getInstitute(data.programme.higher_institute) : undefined;
  const field = data.programme.higher_institute && data.programme.field_of_study
    ? getField(data.programme.higher_institute, data.programme.field_of_study)
    : undefined;
  const specialty = getSpecialtiesByField(field).find((s) => s.id === data.programme.specialty);
  const programme = MAIN_PROGRAMMES.find((p) => p.id === data.programme.programme);

  doc.setFontSize(12);
  doc.setTextColor(...navy);
  doc.text(isEn ? 'Programme Selection' : 'Choix de Filière', 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    body: [
      [isEn ? 'Higher Institute' : 'Institut Supérieur', institute ? (isEn ? institute.nameEn : institute.nameFr) : '-'],
      [isEn ? 'Field' : 'Domaine', field ? (isEn ? field.en : field.fr) : '-'],
      [isEn ? 'Specialty' : 'Spécialité', specialty ? (isEn ? specialty.en : specialty.fr) : '-'],
      [isEn ? 'Programme' : 'Programme', programme ? (isEn ? programme.en : programme.fr) : '-'],
      [isEn ? "Study Mode" : "Mode d'étude", data.programme.study_mode ?? '-'],
      [isEn ? 'Intake' : 'Session', data.programme.intake_session ?? '-'],
    ],
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  if (y > 250) { doc.addPage(); y = 20; }

  doc.setFontSize(12);
  doc.setTextColor(...navy);
  doc.text(isEn ? 'Guardian & Emergency Contact' : "Tuteur et Contact d'Urgence", 14, y);
  y += 4;
  autoTable(doc, {
    startY: y,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    body: [
      [isEn ? 'Guardian Name' : 'Nom du tuteur', data.guardian.guardian_full_name ?? '-'],
      [isEn ? 'Relationship' : 'Lien de parenté', data.guardian.guardian_relationship ?? '-'],
      [isEn ? 'Phone' : 'Téléphone', data.guardian.guardian_phone ?? '-'],
      [isEn ? 'Emergency Contact' : "Contact d'urgence", data.guardian.emergency_full_name ?? '-'],
      [isEn ? 'Emergency Phone' : "Téléphone d'urgence", data.guardian.emergency_phone ?? '-'],
    ],
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });

  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      isEn
        ? `ZTF University Institute · Koumé - Bertoua, East Region, Cameroon · ${data.applicationNumber} · Page ${i}/${pageCount}`
        : `Institut Universitaire ZTF · Koumé - Bertoua, Région de l'Est, Cameroun · ${data.applicationNumber} · Page ${i}/${pageCount}`,
      14,
      290
    );
  }

  doc.save(`ZTF_Application_${data.applicationNumber}.pdf`);
}
