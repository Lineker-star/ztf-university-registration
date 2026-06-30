-- Migration: replace the academic_system/department/specialization model with
-- the real institute -> field -> specialty -> programme hierarchy.
-- Run this in the Supabase SQL Editor against a database that already has
-- the original schema.sql applied.
--
-- This does NOT drop the old academic_system, department, specialization,
-- or second_choice_programme columns -- they're left in place, unused, so
-- existing data is never destroyed. Drop them yourself later once you've
-- confirmed the new columns are populated correctly.

-- =============================================
-- New columns
-- =============================================
ALTER TABLE applications ADD COLUMN IF NOT EXISTS higher_institute VARCHAR(50);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS field_of_study VARCHAR(100);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS specialty VARCHAR(150);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS sub_department VARCHAR(100); -- Health Sciences only (Nursing/Midwifery/Biomedical)

CREATE INDEX IF NOT EXISTS idx_applications_institute ON applications(higher_institute);
CREATE INDEX IF NOT EXISTS idx_applications_field ON applications(field_of_study);

-- =============================================
-- The `programme` column's CHECK constraint must be updated: the new
-- programme ids are lowercase ('hnd','bts','bachelor','licence','master')
-- and 'bachelor' didn't exist in the old enum at all. Without this, every
-- new submission would fail the old CHECK constraint at insert time.
-- =============================================
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_programme_check;
ALTER TABLE applications ADD CONSTRAINT applications_programme_check
  CHECK (programme IS NULL OR programme IN ('hnd', 'bts', 'bachelor', 'licence', 'master'));
