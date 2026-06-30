// Source: https://www.ztfuniversity.com/en/schools and /fr/schools (verified 2026-06-30)

export interface HigherInstitute {
  key: string;
  abbreviationEn: string;
  abbreviationFr: string;
  nameEn: string;
  nameFr: string;
  schoolsEn: string[];
  schoolsFr: string[];
}

export const HIGHER_INSTITUTES: HigherInstitute[] = [
  {
    key: 'hiacomst',
    abbreviationEn: 'HIACOMST',
    abbreviationFr: 'ISASCOMT',
    nameEn: 'Higher Institute of Agronomy, Communication Sciences and Technology',
    nameFr: 'Institut Supérieur d\'Agronomie, des Sciences de la Communication et de Technologie',
    schoolsEn: ['School of Agronomy and Biotechnology', 'School of Engineering & Applied Technology', 'School of Communication'],
    schoolsFr: ['École d\'Agronomie et de Biotechnologie', 'École d\'Ingénierie et de Technologie Appliquée', 'École de Communication'],
  },
  {
    key: 'hilepmah',
    abbreviationEn: 'HILEPMAH',
    abbreviationFr: 'ISMEDMAH',
    nameEn: 'Higher Institute of Legal Professions, Management and Humanities',
    nameFr: 'Institut Supérieur des Métiers du Droit, de Management et des Humanités',
    schoolsEn: ['School of Legal Professions', 'School of Applied Economic Sciences', 'School of Applied Human Sciences'],
    schoolsFr: ['École des Métiers du Droit', 'École des Sciences Économiques Appliquées', 'École des Sciences Humaines Appliquées'],
  },
  {
    key: 'hihs',
    abbreviationEn: 'HIHS',
    abbreviationFr: 'ISSS',
    nameEn: 'Higher Institute of Health Sciences',
    nameFr: 'Institut Supérieur des Sciences de la Santé',
    schoolsEn: ['School of Health Sciences'],
    schoolsFr: ['École des Sciences de la Santé'],
  },
];

// SHP sits alongside the 3 Higher Institutes rather than nested under one.
export const STANDALONE_SCHOOL = {
  abbreviationEn: 'SHP',
  abbreviationFr: 'EMS',
  nameEn: 'School of Health Professions',
  nameFr: 'École des Métiers de la Santé',
};

export const TOTAL_FIELDS = HIGHER_INSTITUTES.reduce((sum, inst) => sum + inst.schoolsEn.length, 0);
