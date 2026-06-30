import { z } from 'zod';

export const step3Schema = z.object({
  higher_institute: z.string().min(1),
  field_of_study: z.string().min(1),
  sub_department: z.string().optional().or(z.literal('')),
  specialty: z.string().min(1),
  programme: z.enum(['hnd', 'bts', 'bachelor', 'licence', 'master']),
  study_mode: z.enum(['full_time', 'part_time', 'distance']),
  intake_session: z.string().min(1),
  academic_year: z.string().min(1),
  why_ztf: z.string().max(2000).optional().or(z.literal('')),
  career_goals: z.string().max(2000).optional().or(z.literal('')),
  referral_source: z.string().optional().or(z.literal('')),
});

export type Step3FormValues = z.infer<typeof step3Schema>;
