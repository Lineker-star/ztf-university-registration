-- ZTF University Institute - Online Registration System
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)

-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- APPLICATIONS TABLE (main registration table)
-- =============================================
CREATE TABLE applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_number VARCHAR(20) UNIQUE,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
    'pending', 'under_review', 'shortlisted', 'admitted', 'rejected', 'deferred', 'withdrawn'
  )),
  language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'fr')),
  -- Official ZTF institute hierarchy: 3 Higher Institutes (HILEPMAH, HIACOMST,
  -- HIHS), 7 fields between them, each field's specialties, and (Health
  -- Sciences only) a sub-department. See src/lib/constants/programmes.ts.
  higher_institute VARCHAR(50),
  field_of_study VARCHAR(100),
  sub_department VARCHAR(100),
  specialty VARCHAR(150),
  programme VARCHAR(20) CHECK (programme IS NULL OR programme IN ('hnd', 'bts', 'bachelor', 'licence', 'master')),
  study_mode VARCHAR(20) DEFAULT 'full_time',
  intake_session VARCHAR(50),
  academic_year VARCHAR(20),
  why_ztf TEXT,
  career_goals TEXT,
  referral_source VARCHAR(50),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_draft BOOLEAN DEFAULT true,
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- =============================================
-- PERSONAL INFO TABLE (one row per application)
-- =============================================
CREATE TABLE personal_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  place_of_birth VARCHAR(100),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  nationality VARCHAR(100),
  national_id VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Cameroon',
  marital_status VARCHAR(20),
  religion VARCHAR(50),
  passport_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ACADEMIC BACKGROUND TABLES
-- =============================================
CREATE TABLE academic_qualifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  qualification_type VARCHAR(50) NOT NULL,
  institution_name VARCHAR(200) NOT NULL,
  graduation_year INTEGER,
  gpa_grade VARCHAR(20),
  subjects JSONB DEFAULT '[]',
  certificate_url TEXT,
  is_highest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE professional_experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  has_experience BOOLEAN DEFAULT false,
  years_of_experience INTEGER,
  description TEXT,
  field_of_specialization VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOCUMENTS TABLE
-- file_url stores the storage object path for the private
-- "student-documents" bucket (resolved to a signed URL on demand),
-- or a public URL for the public "passport-photos" bucket.
-- =============================================
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_required BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GUARDIAN & EMERGENCY CONTACTS TABLE
-- =============================================
CREATE TABLE guardian_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  guardian_full_name VARCHAR(200) NOT NULL,
  guardian_relationship VARCHAR(50),
  guardian_phone VARCHAR(20),
  guardian_email VARCHAR(255),
  guardian_address TEXT,
  guardian_occupation VARCHAR(100),
  guardian_employer VARCHAR(200),
  emergency_full_name VARCHAR(200),
  emergency_relationship VARCHAR(50),
  emergency_phone VARCHAR(20),
  emergency_phone2 VARCHAR(20),
  sponsor_type VARCHAR(50),
  sponsor_name VARCHAR(200),
  sponsor_contact VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- APPLICATION STATUS HISTORY TABLE
-- =============================================
CREATE TABLE application_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status_from VARCHAR(30),
  status_to VARCHAR(30) NOT NULL,
  changed_by UUID,
  changed_by_email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200),
  role VARCHAR(20) DEFAULT 'reviewer' CHECK (role IN ('super_admin', 'admin', 'reviewer')),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DRAFT SAVES TABLE (auto-save progress)
-- =============================================
CREATE TABLE registration_drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_token VARCHAR(100) UNIQUE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  step_data JSONB DEFAULT '{}',
  current_step INTEGER DEFAULT 1,
  last_saved TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- =============================================
-- EMAIL NOTIFICATIONS LOG
-- =============================================
CREATE TABLE email_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255),
  email_type VARCHAR(50),
  subject VARCHAR(255),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT true,
  error_message TEXT
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_programme ON applications(programme);
CREATE INDEX idx_applications_institute ON applications(higher_institute);
CREATE INDEX idx_applications_field ON applications(field_of_study);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_number ON applications(application_number);
CREATE INDEX idx_personal_info_email ON personal_info(email);
CREATE INDEX idx_documents_app_id ON documents(application_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_drafts_token ON registration_drafts(session_token);

-- =============================================
-- FUNCTION: Auto-generate application number (ZTF-YYYY-00001)
-- =============================================
CREATE OR REPLACE FUNCTION generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part VARCHAR(4);
  seq_num INTEGER;
  new_number VARCHAR(20);
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  SELECT COUNT(*) + 1 INTO seq_num
  FROM applications
  WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
  new_number := 'ZTF-' || year_part || '-' || LPAD(seq_num::TEXT, 5, '0');
  NEW.application_number := new_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_app_number
BEFORE INSERT ON applications
FOR EACH ROW
WHEN (NEW.application_number IS NULL OR NEW.application_number = '')
EXECUTE FUNCTION generate_application_number();

-- =============================================
-- FUNCTION: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_applications
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- All registration/admin API routes in the app use the Supabase
-- service-role key server-side, which bypasses RLS entirely.
-- These policies are a defense-in-depth fallback in case a client
-- ever talks to Supabase directly with the anon key.
-- =============================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON applications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON personal_info FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON academic_qualifications FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON professional_experience FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON documents FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON guardian_info FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public insert" ON registration_drafts FOR ALL TO anon USING (true) WITH CHECK (true);

-- Public can read applications (status checks are scoped by application_number/email in the API layer)
CREATE POLICY "Allow public status check" ON applications FOR SELECT TO anon USING (true);

-- Admins (authenticated users) have full access
CREATE POLICY "Admin full access" ON applications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON personal_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON academic_qualifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON professional_experience FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON guardian_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON application_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================
-- STORAGE BUCKETS
-- student-documents: private (signed URLs only)
-- passport-photos:   public  (directly embeddable)
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('passport-photos', 'passport-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id IN ('student-documents', 'passport-photos'));

CREATE POLICY "Admin can manage documents" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id IN ('student-documents', 'passport-photos'))
  WITH CHECK (bucket_id IN ('student-documents', 'passport-photos'));

-- =============================================
-- FIRST ADMIN USER
-- Run after creating the auth user via
-- Supabase Dashboard > Authentication > Users > Add User
-- =============================================
-- INSERT INTO admin_users (user_id, full_name, role, department)
-- SELECT id, 'ZTF Administrator', 'super_admin', 'Administration'
-- FROM auth.users
-- WHERE email = 'admin@ztfuniversity.com';
