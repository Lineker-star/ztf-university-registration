// Official ZTF University Institute programme structure, extracted verbatim
// from the official EN/FR admissions brochure (3 Higher Institutes, 7 Fields).

export interface Specialty {
  id: string;
  en: string;
  fr: string;
}

export interface SubDepartment {
  en: string;
  fr: string;
  specialties: Specialty[];
}

export interface Field {
  id: string;
  numberLabel: string; // '01' .. '07'
  en: string;
  fr: string;
  specialties: Specialty[];
  subDepartments?: SubDepartment[];
}

export interface HigherInstitute {
  id: string;
  acronymEn: string;
  acronymFr: string;
  nameEn: string;
  nameFr: string;
  fields: Field[];
  programmes: string[]; // MAIN_PROGRAMMES ids offered at this institute
}

export const HIGHER_INSTITUTES: HigherInstitute[] = [
  {
    id: 'hilepmah',
    acronymEn: 'HILEPMAH',
    acronymFr: 'ISMEDMAH',
    nameEn: 'Higher Institute of Legal Professions, Management and Humanities',
    nameFr: "Institut Supérieur des Métiers de Droit, de Management et des Humanités",
    programmes: ['hnd', 'bts', 'bachelor', 'licence', 'master'],
    fields: [
      {
        id: 'applied-economic-sciences-management',
        numberLabel: '01',
        en: 'Applied Economic Sciences & Management',
        fr: 'Sciences Économiques et Management',
        specialties: [
          { id: 'assistant-manager', en: 'Assistant Manager', fr: 'Assistant(e) de direction' },
          { id: 'air-transport-operations', en: 'Air Transport Operations', fr: 'Opérations de transport aérien' },
          { id: 'logistics-transport', en: 'Logistics & Transport', fr: 'Logistique & Transport' },
          { id: 'insurance', en: 'Insurance', fr: 'Assurance' },
          { id: 'quality-management', en: 'Quality Management', fr: 'Management de la qualité' },
          { id: 'banking-finance', en: 'Banking & Finance', fr: 'Banque & Finance' },
          { id: 'management-ngos', en: 'Management of NGOs', fr: 'Gestion des ONG' },
          { id: 'accountancy', en: 'Accountancy', fr: 'Comptabilité et gestion des entreprises' },
          { id: 'project-management', en: 'Project Management', fr: 'Gestion de projets' },
          { id: 'international-trade', en: 'International Trade', fr: 'Commerce International' },
          { id: 'hr-management', en: 'Human Resource Management', fr: 'Gestion des ressources humaines' },
          { id: 'marketing-trade-sales', en: 'Marketing · Trade · Sales', fr: 'Marketing · Commerce · Vente' },
        ],
      },
      {
        id: 'legal-professions-political-science',
        numberLabel: '02',
        en: 'Legal Professions & Political Science',
        fr: 'Métiers du Droit et de la Science Politique',
        specialties: [
          { id: 'business-corporate-law', en: 'Business & Corporate Law', fr: 'Comptabilité et gestion des entreprises' },
          { id: 'tax-management', en: 'Tax Management', fr: 'Gestion fiscale' },
          { id: 'land-regime-law-practice', en: 'Land Regime & Law Practice', fr: 'Régime foncier & pratique juridique' },
          { id: 'local-government-management', en: 'Local Government Management', fr: 'Gestion des collectivités territoriales' },
          { id: 'legal-assistant', en: 'Legal Assistant', fr: "Assistant(e) juridique" },
          { id: 'local-government-taxation', en: 'Local Government Taxation', fr: 'Fiscalité des collectivités territoriales' },
          { id: 'customs-transit', en: 'Customs & Transit', fr: 'Douanes & Transit' },
          { id: 'local-government-admin', en: 'Local Government Administration', fr: 'Administration des collectivités territoriales' },
        ],
      },
      {
        id: 'applied-human-sciences',
        numberLabel: '03',
        en: 'Applied Human Sciences',
        fr: 'Sciences Humaines Appliquées',
        specialties: [
          { id: 'cinematography', en: 'Cinematography', fr: 'Cinématographie' },
          { id: 'event-management', en: 'Event Management', fr: "Gestion d'Événements" },
          {
            id: 'documentation-archiving-library',
            en: 'Documentation, Archiving & Library Science',
            fr: "Documentation, archivistique & sciences de l'information (bibliothéconomie)",
          },
        ],
      },
    ],
  },
  {
    id: 'hiacomst',
    acronymEn: 'HIACOMST',
    acronymFr: 'ISASCOMT',
    nameEn: 'Higher Institute of Agronomy, Communication Sciences and Technology',
    nameFr: "Institut Supérieur d'Agronomie, des Sciences de la Communication et de Technologie",
    programmes: ['hnd', 'bts', 'bachelor', 'licence', 'master'],
    fields: [
      {
        id: 'agronomy-biotechnology',
        numberLabel: '04',
        en: 'Agronomy & Biotechnology',
        fr: 'Agronomie et Biotechnologie',
        specialties: [
          { id: 'agri-business-technics', en: 'Agricultural Business Technics', fr: "Techniques de l'Entreprise Agricole" },
          { id: 'agricultural-engineering', en: 'Agricultural Engineering', fr: 'Génie Agricole' },
          { id: 'animal-production-tech', en: 'Animal Production Technology', fr: 'Technologie de la Production Animale' },
          { id: 'agro-pastoral-entrepreneurship', en: 'Agro-Pastoral Entrepreneurship', fr: 'Entrepreneuriat agro-pastoral' },
          { id: 'aquaculture', en: 'Aquaculture', fr: 'Aquaculture' },
          { id: 'agro-pastoral-adviser', en: 'Agro-Pastoral Adviser', fr: 'Conseiller agro-pastoral' },
          { id: 'agro-forestry-forest-mgmt', en: 'Agro-Forestry & Forest Management', fr: 'Agroforesterie & Gestion Forestière' },
          { id: 'food-sciences-biotech', en: 'Food Sciences & Biotechnology', fr: 'Sciences Alimentaires & Biotechnologie' },
        ],
      },
      {
        id: 'engineering-technology',
        numberLabel: '05',
        en: 'Engineering & Technology',
        fr: 'Ingénierie et Technologie',
        specialties: [
          { id: 'software-engineering', en: 'Software Engineering', fr: 'Génie logiciel' },
          { id: 'ecommerce-digital-marketing', en: 'E-Commerce & Digital Marketing', fr: 'Marketing digital' },
          { id: 'graphics-web-design', en: 'Graphics & Web Design', fr: 'Design graphique & conception web' },
          {
            id: 'electrical-power-systems',
            en: 'Electrical Power Systems | Electrotechnics',
            fr: 'Systèmes Énergétiques Électriques | Électrotechnique',
          },
          { id: 'network-telecom', en: 'Network & Telecommunication', fr: 'Réseaux & Télécommunications' },
          { id: 'civil-engineering-urbanism', en: 'Civil Engineering & Urbanism', fr: 'Génie civil & urbanisme' },
          { id: 'network-security', en: 'Network & Security', fr: 'Réseaux & Sécurité' },
          { id: 'geotechnics-topography', en: 'Geotechnics | Topography', fr: 'Géotechnique | Topographie' },
          { id: 'computer-science-networks', en: 'Computer Science & Networks', fr: 'Informatique & Réseaux' },
          { id: 'mechanical-engineering', en: 'Mechanical Engineering', fr: 'Génie mécanique' },
          { id: 'industrial-computing-automation', en: 'Industrial Computing & Automation', fr: 'Informatique industrielle & automatisation' },
          { id: 'thermal-engineering', en: 'Thermal Engineering', fr: 'Génie thermique' },
          { id: 'hardware-maintenance-databases', en: 'Hardware Maintenance | Databases', fr: 'Maintenance informatique | Bases de données' },
          { id: 'chemical-engineering', en: 'Chemical Engineering', fr: 'Génie chimique' },
          { id: 'water-engineering', en: 'Water Engineering', fr: "Génie de l'eau" },
        ],
      },
      {
        id: 'communication',
        numberLabel: '06',
        en: 'Communication',
        fr: 'Sciences de la Communication',
        specialties: [
          { id: 'journalism-mass-comm', en: 'Journalism & Mass Communication', fr: 'Journalisme & Communication de masse' },
          {
            id: 'media-photography-av',
            en: 'Media Photography & Audiovisual Production',
            fr: 'Photographie médiatique & production audiovisuelle',
          },
          { id: 'corporate-communication', en: 'Corporate Communication', fr: "Communication d'entreprise" },
          { id: 'translation-interpretation', en: 'Translation & Interpretation', fr: 'Traduction & Interprétation' },
        ],
      },
    ],
  },
  {
    id: 'hihs',
    acronymEn: 'HIHS',
    acronymFr: 'ISSS',
    nameEn: 'Higher Institute of Health Sciences',
    nameFr: 'Institut Supérieur des Sciences de la Santé',
    programmes: ['hnd', 'bts', 'bachelor', 'licence', 'master'],
    fields: [
      {
        id: 'health-sciences',
        numberLabel: '07',
        en: 'Health Sciences',
        fr: 'Sciences de la Santé',
        specialties: [],
        subDepartments: [
          {
            en: 'Nursing Sciences',
            fr: 'Sciences Infirmières',
            specialties: [{ id: 'nursing', en: 'Nursing', fr: 'Soins infirmiers' }],
          },
          {
            en: 'Midwifery',
            fr: 'Sage-Femme',
            specialties: [
              { id: 'midwifery', en: 'Midwifery', fr: 'Maïeutique' },
              { id: 'reproductive-health', en: 'Reproductive Health', fr: 'Santé reproductive' },
            ],
          },
          {
            en: 'Biomedical Sciences',
            fr: 'Sciences Biomédicales',
            specialties: [
              { id: 'medical-lab-sciences', en: 'Medical Laboratory Sciences', fr: 'Sciences de laboratoire médical' },
              { id: 'radiological-techniques', en: 'Radiological Techniques', fr: 'Techniques radiologiques' },
              { id: 'physiotherapy', en: 'Physiotherapy', fr: 'Kinésithérapie' },
            ],
          },
        ],
      },
    ],
  },
];

export const MAIN_PROGRAMMES = [
  { id: 'hnd', en: 'HND (Higher National Diploma)', fr: 'HND (Higher National Diploma)', system: 'anglophone' },
  { id: 'bts', en: 'BTS (Brevet de Technicien Supérieur)', fr: 'BTS (Brevet de Technicien Supérieur)', system: 'francophone' },
  { id: 'bachelor', en: 'BTech / Bachelor', fr: 'BTech / Bachelor', system: 'anglophone' },
  { id: 'licence', en: 'Licence Professionnelle', fr: 'Licence Professionnelle', system: 'francophone' },
  { id: 'master', en: 'Master / Masters', fr: 'Master / Masters', system: 'both' },
] as const;

export const TOTAL_FIELDS = HIGHER_INSTITUTES.reduce((sum, inst) => sum + inst.fields.length, 0);

export function getInstitute(instituteId: string): HigherInstitute | undefined {
  return HIGHER_INSTITUTES.find((i) => i.id === instituteId);
}

export function getFieldsByInstitute(instituteId: string): Field[] {
  return getInstitute(instituteId)?.fields ?? [];
}

export function getField(instituteId: string, fieldId: string): Field | undefined {
  return getFieldsByInstitute(instituteId).find((f) => f.id === fieldId);
}

export function getSpecialtiesByField(field: Field | undefined): Specialty[] {
  if (!field) return [];
  if (field.subDepartments) return field.subDepartments.flatMap((sub) => sub.specialties);
  return field.specialties;
}

export function getProgrammesByInstitute(instituteId: string): string[] {
  return getInstitute(instituteId)?.programmes ?? [];
}

// --- Unrelated registration-form constants kept alongside the programme data ---

export const INTAKE_SESSIONS = ['September 2026', 'January 2027', 'September 2027'];
export const ACADEMIC_YEARS = ['2026-2027', '2027-2028'];

export const CAMEROON_REGIONS = [
  'Adamaoua',
  'Centre',
  'East',
  'Far North',
  'Littoral',
  'North',
  'North-West',
  'South',
  'South-West',
  'West',
];

export const CAMPUSES = ['Bertoua Main Campus', 'Yaoundé Annex', 'Douala Annex'];

// --- Qualifying credential grading (GCE A-Level / Baccalauréat) ---

export const GCE_A_LEVEL_GRADES = ['A', 'B', 'C', 'D', 'E'] as const;

export const GCE_A_LEVEL_SUBJECTS = [
  'Mathematics',
  'Further Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'Accounting',
  'Geography',
  'History',
  'Literature in English',
  'Government',
  'Religious Studies',
  'French',
  'Food Science',
  'Agricultural Science',
  'Technical Drawing',
  'Additional Mathematics',
];

export const BACCALAUREAT_SERIES = [
  { id: 'A', label: 'Série A — Littéraire' },
  { id: 'B', label: 'Série B — Littéraire (Langues)' },
  { id: 'C', label: 'Série C — Mathématiques et Sciences Physiques' },
  { id: 'D', label: 'Série D — Mathématiques et Sciences de la Nature' },
  { id: 'E', label: 'Série E — Mathématiques et Technologie' },
  { id: 'F1', label: 'Série F1 — Électrotechnique' },
  { id: 'F2', label: 'Série F2 — Électronique' },
  { id: 'F3', label: 'Série F3 — Mécanique Générale' },
  { id: 'F4', label: 'Série F4 — Construction Mécanique' },
  { id: 'F5', label: 'Série F5 — Économie Familiale et Sociale' },
  { id: 'G', label: 'Série G — Techniques Administratives et de Gestion' },
  { id: 'H', label: 'Série H — Techniques Industrielles' },
] as const;
