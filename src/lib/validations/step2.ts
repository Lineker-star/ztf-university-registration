import { z } from 'zod';

export const qualificationSchema = z.object({
  qualification_type: z.string().min(1),
  institution_name: z.string().min(2).max(200),
  graduation_year: z.coerce.number().int().min(1960).max(new Date().getFullYear() + 1),
  gpa_grade: z.string().min(1).max(20),
  subjects: z.array(z.object({ name: z.string().min(1), grade: z.string().min(1) })).default([]),
  certificate_url: z.string().nullable().optional(),
  is_highest: z.boolean().default(false),
});

export const step2Schema = z.object({
  qualifications: z.array(qualificationSchema).min(1, 'At least one qualification is required'),
  experience: z.object({
    has_experience: z.boolean().default(false),
    years_of_experience: z.coerce.number().int().min(0).max(60).optional(),
    description: z.string().max(2000).optional().or(z.literal('')),
    field_of_specialization: z.string().max(100).optional().or(z.literal('')),
  }),
});

export type Step2FormValues = z.infer<typeof step2Schema>;
