import { z } from 'zod';

const baseFields = {
  institution_name: z.string().min(2).max(200),
  graduation_year: z.coerce.number().int().min(1960).max(new Date().getFullYear() + 1),
  certificate_url: z.string().nullable().optional(),
  is_highest: z.boolean().default(false),
};

const gceALevelSubjectSchema = z.object({
  name: z.string().min(1),
  grade: z.enum(['A', 'B', 'C', 'D', 'E']),
});

// 'a_level' (GCE A-Level) and 'bacc' (Baccalauréat) are the two qualifying
// credentials ZTF accepts; each has its own grading shape. Other
// qualification types (o_level, hnd_cert, degree) just need a general grade.
export const qualificationSchema = z.discriminatedUnion('qualification_type', [
  z.object({
    qualification_type: z.literal('a_level'),
    ...baseFields,
    subjects: z
      .array(gceALevelSubjectSchema)
      .min(2, 'You must have passed at least 2 GCE A-Level subjects to qualify')
      .max(5, 'Maximum 5 subjects allowed for GCE A-Level'),
    gpa_grade: z.string().optional().or(z.literal('')),
    bacc_series: z.string().optional(),
  }),
  z.object({
    qualification_type: z.literal('bacc'),
    ...baseFields,
    bacc_series: z.enum(['A', 'B', 'C', 'D', 'E', 'F1', 'F2', 'F3', 'F4', 'F5', 'G', 'H']),
    gpa_grade: z.string().min(1, 'Average is required'),
    subjects: z.array(gceALevelSubjectSchema).default([]),
  }),
  z.object({
    qualification_type: z.enum(['o_level', 'hnd_cert', 'degree']),
    ...baseFields,
    gpa_grade: z.string().min(1).max(20),
    subjects: z.array(gceALevelSubjectSchema).default([]),
    bacc_series: z.string().optional(),
  }),
]);

export const step2Schema = z.object({
  qualifications: z
    .array(qualificationSchema)
    .min(1, 'At least one qualification is required')
    .refine((quals) => quals.some((q) => q.qualification_type === 'a_level' || q.qualification_type === 'bacc'), {
      message: 'You must hold a passing GCE A-Level or Baccalauréat (or recognized equivalent) to register',
    }),
  experience: z.object({
    has_experience: z.boolean().default(false),
    years_of_experience: z.coerce.number().int().min(0).max(60).optional(),
    description: z.string().max(2000).optional().or(z.literal('')),
    field_of_specialization: z.string().max(100).optional().or(z.literal('')),
  }),
});

export type Step2FormValues = z.infer<typeof step2Schema>;
