export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'shortlisted'
  | 'admitted'
  | 'rejected'
  | 'deferred'
  | 'withdrawn';

export type Programme = 'hnd' | 'bts' | 'bachelor' | 'licence' | 'master';
export type StudyMode = 'full_time' | 'part_time' | 'distance';
export type Locale = 'en' | 'fr';

export interface Application {
  id: string;
  application_number: string;
  status: ApplicationStatus;
  language: Locale;
  higher_institute: string | null; // HigherInstitute.id
  field_of_study: string | null; // Field.id
  sub_department: string | null; // SubDepartment.en (Health Sciences only)
  specialty: string | null; // Specialty.id
  programme: Programme | null;
  study_mode: StudyMode;
  intake_session: string | null;
  academic_year: string | null;
  why_ztf: string | null;
  career_goals: string | null;
  referral_source: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

export interface PersonalInfo {
  id?: string;
  application_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  place_of_birth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  national_id: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  region: string;
  country: string;
  marital_status: string;
  religion: string;
  passport_photo_url: string | null;
}

export interface AcademicQualification {
  id?: string;
  application_id: string;
  qualification_type: string;
  institution_name: string;
  graduation_year: number;
  gpa_grade: string;
  subjects: { name: string; grade: string }[];
  bacc_series?: string | null; // Baccalauréat only
  certificate_url: string | null;
  is_highest: boolean;
}

export interface ProfessionalExperience {
  id?: string;
  application_id: string;
  has_experience: boolean;
  years_of_experience: number | null;
  description: string | null;
  field_of_specialization: string | null;
}

export interface GuardianInfo {
  id?: string;
  application_id: string;
  guardian_full_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  guardian_email: string;
  guardian_address: string;
  guardian_occupation: string;
  guardian_employer: string;
  emergency_full_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  emergency_phone2: string;
  sponsor_type: string;
  sponsor_name: string;
  sponsor_contact: string;
}

export interface Document {
  id: string;
  application_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_required: boolean;
  is_verified: boolean;
  verified_by?: string | null;
  verified_at?: string | null;
  created_at?: string;
}

export interface ApplicationHistoryEntry {
  id: string;
  application_id: string;
  status_from: ApplicationStatus | null;
  status_to: ApplicationStatus;
  changed_by: string | null;
  changed_by_email: string | null;
  notes: string | null;
  created_at: string;
}

export interface RegistrationFormData {
  step1: Partial<PersonalInfo>;
  step2: {
    qualifications: Partial<AcademicQualification>[];
    experience: Partial<ProfessionalExperience>;
  };
  step3: Partial<
    Pick<
      Application,
      | 'higher_institute'
      | 'field_of_study'
      | 'sub_department'
      | 'specialty'
      | 'programme'
      | 'study_mode'
      | 'intake_session'
      | 'academic_year'
      | 'why_ztf'
      | 'career_goals'
      | 'referral_source'
    >
  >;
  step4: { documents: Partial<Document>[] };
  step5: Partial<GuardianInfo>;
  step6?: { agree: boolean; terms: boolean };
}

export interface AdminUser {
  id: string;
  user_id: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'reviewer';
  department: string;
  is_active: boolean;
}

export interface DashboardStats {
  total: number;
  pending: number;
  under_review: number;
  shortlisted: number;
  admitted: number;
  rejected: number;
  deferred: number;
  by_programme: Record<string, number>;
  by_institute: Record<string, number>;
  by_field: Record<string, number>;
  this_month: number;
}

export interface ApplicationListItem {
  id: string;
  application_number: string;
  status: ApplicationStatus;
  programme: Programme | null;
  higher_institute: string | null;
  field_of_study: string | null;
  submitted_at: string | null;
  created_at: string;
  language: Locale;
  personal_info: Pick<PersonalInfo, 'first_name' | 'last_name' | 'email' | 'phone'> | null;
}

export interface ApplicationDetailData extends Application {
  personal_info: PersonalInfo | null;
  academic_qualifications: AcademicQualification[];
  professional_experience: ProfessionalExperience | null;
  documents: Document[];
  guardian_info: GuardianInfo | null;
  application_history: ApplicationHistoryEntry[];
}
