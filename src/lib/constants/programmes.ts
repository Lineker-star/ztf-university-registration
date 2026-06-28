export const ANGLOPHONE_PROGRAMMES = {
  HND: {
    label: 'Higher National Diploma (HND)',
    departments: [
      'Computer Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Business Management',
      'Accounting & Finance',
      'Marketing',
      'Agriculture',
      'Public Health',
      'Journalism & Communication',
    ],
  },
  BTech: {
    label: 'Bachelor of Technology (BTech)',
    departments: [
      'Software Engineering',
      'Network & Cybersecurity',
      'Data Science & AI',
      'Civil & Construction Engineering',
      'Electrical & Electronics Engineering',
      'Business Administration',
      'Accounting',
      'Finance & Banking',
    ],
  },
  MTech: {
    label: 'Master of Technology (MTech)',
    departments: [
      'Information Technology',
      'Project Management',
      'Finance & Investment',
      'Public Administration',
      'Environmental Engineering',
    ],
  },
} as const;

export const FRANCOPHONE_PROGRAMMES = {
  BTS: {
    label: 'Brevet de Technicien Supérieur (BTS)',
    departments: [
      'Informatique',
      'Génie Civil',
      'Électrotechnique',
      'Comptabilité & Gestion',
      'Commerce',
      'Secrétariat',
      'Agriculture',
      'Santé Publique',
    ],
  },
  Licence: {
    label: 'Licence Professionnelle',
    departments: [
      'Génie Logiciel',
      'Réseaux & Télécommunications',
      'Gestion des Entreprises',
      'Finance & Comptabilité',
      'Marketing & Commerce',
      'Droit des Affaires',
    ],
  },
  Master: {
    label: 'Master Professionnel',
    departments: [
      "Technologies de l'Information",
      'Gestion de Projets',
      'Finance & Investissement',
      'Administration Publique',
    ],
  },
} as const;

export const ALL_PROGRAMMES = { ...ANGLOPHONE_PROGRAMMES, ...FRANCOPHONE_PROGRAMMES };

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
