export interface DocumentRequirement {
  type: string;
  labelEn: string;
  labelFr: string;
  required: boolean;
  maxSizeMB: number;
  acceptedTypes: string[];
}

export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  {
    type: 'birth_certificate',
    labelEn: 'Birth Certificate',
    labelFr: 'Acte de Naissance',
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'national_id',
    labelEn: 'National ID Card / Passport',
    labelFr: "Carte Nationale d'Identité / Passeport",
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'academic_certificates',
    labelEn: 'Academic Certificates (O/L, A/L, BAC, etc.)',
    labelFr: 'Diplômes Académiques (BEPC, BAC, etc.)',
    required: true,
    maxSizeMB: 10,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'transcript',
    labelEn: 'Academic Transcript',
    labelFr: 'Relevé de Notes',
    required: true,
    maxSizeMB: 10,
    acceptedTypes: ['application/pdf'],
  },
  {
    type: 'passport_photos',
    labelEn: 'Passport Photos (4 copies)',
    labelFr: "Photos d'Identité (4 exemplaires)",
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['image/jpeg', 'image/png'],
  },
  {
    type: 'payment_proof',
    labelEn: 'Proof of Registration Fee Payment',
    labelFr: "Reçu de Paiement des Frais d'Inscription",
    required: true,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  {
    type: 'recommendation_letter',
    labelEn: 'Letter of Recommendation',
    labelFr: 'Lettre de Recommandation',
    required: false,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf'],
  },
  {
    type: 'medical_certificate',
    labelEn: 'Medical Certificate',
    labelFr: 'Certificat Médical',
    required: false,
    maxSizeMB: 5,
    acceptedTypes: ['application/pdf', 'image/jpeg'],
  },
  {
    type: 'cv',
    labelEn: 'Curriculum Vitae (CV)',
    labelFr: 'Curriculum Vitae (CV)',
    required: false,
    maxSizeMB: 5,
    acceptedTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
  {
    type: 'supporting_documents',
    labelEn: 'Other Supporting Documents',
    labelFr: 'Autres Pièces Justificatives',
    required: false,
    maxSizeMB: 10,
    acceptedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  },
];

export const REQUIRED_DOCUMENTS = DOCUMENT_REQUIREMENTS.filter((d) => d.required);
export const OPTIONAL_DOCUMENTS = DOCUMENT_REQUIREMENTS.filter((d) => !d.required);
