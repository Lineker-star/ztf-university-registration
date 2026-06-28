import { z } from 'zod';

export const step1Schema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  date_of_birth: z
    .string()
    .min(1)
    .refine((val) => new Date(val) < new Date(), { message: 'future_date' }),
  place_of_birth: z.string().min(2).max(100),
  gender: z.enum(['male', 'female', 'other']),
  nationality: z.string().min(2).max(100),
  national_id: z.string().min(3).max(50),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  address: z.string().min(5),
  city: z.string().min(2).max(100),
  region: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  marital_status: z.string().min(1),
  religion: z.string().max(50).optional().or(z.literal('')),
  passport_photo_url: z.string().nullable().optional(),
});

export type Step1FormValues = z.infer<typeof step1Schema>;
