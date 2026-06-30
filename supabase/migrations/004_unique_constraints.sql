-- Adds UNIQUE constraints needed for ON CONFLICT (application_id) upserts
-- in the registration submit route. These constraints should have been in
-- the initial schema but were missing, causing "there is no unique or
-- exclusion constraint matching the ON CONFLICT specification" errors on
-- Step 6 submission. ADD-only, safe to run on a live database.

ALTER TABLE personal_info
  ADD CONSTRAINT personal_info_application_id_unique UNIQUE (application_id);

ALTER TABLE professional_experience
  ADD CONSTRAINT professional_experience_app_id_unique UNIQUE (application_id);

ALTER TABLE guardian_info
  ADD CONSTRAINT guardian_info_application_id_unique UNIQUE (application_id);
