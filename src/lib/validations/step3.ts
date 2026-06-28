import { z } from 'zod';

export const step3Schema = z.object({
  academic_system: z.enum(['anglophone', 'francophone']),
  programme: z.enum(['HND', 'BTech', 'MTech', 'BTS', 'Licence', 'Master']),
  department: z.string().min(1),
  specialization: z.string().max(100).optional().or(z.literal('')),
  study_mode: z.enum(['full_time', 'part_time', 'distance']),
  intake_session: z.string().min(1),
  academic_year: z.string().min(1),
  second_choice_programme: z.enum(['HND', 'BTech', 'MTech', 'BTS', 'Licence', 'Master']).optional(),
  why_ztf: z.string().max(2000).optional().or(z.literal('')),
  career_goals: z.string().max(2000).optional().or(z.literal('')),
  referral_source: z.string().optional().or(z.literal('')),
});

export type Step3FormValues = z.infer<typeof step3Schema>;
