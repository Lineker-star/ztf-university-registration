-- Adds the Baccalauréat series field (A, B, C, D, E, F1-F5, G, H) alongside
-- the existing gpa_grade ("average out of 20") and subjects (GCE A-Level
-- subject/grade pairs) columns. ADD-only, safe to run on a live database.

ALTER TABLE academic_qualifications ADD COLUMN IF NOT EXISTS bacc_series VARCHAR(5);
