import { z } from 'zod';

export const step5Schema = z.object({
  guardian_full_name: z.string().min(2).max(200),
  guardian_relationship: z.string().min(1),
  guardian_phone: z.string().min(6).max(20),
  guardian_email: z.string().email().optional().or(z.literal('')),
  guardian_address: z.string().max(500).optional().or(z.literal('')),
  guardian_occupation: z.string().max(100).optional().or(z.literal('')),
  guardian_employer: z.string().max(200).optional().or(z.literal('')),
  emergency_full_name: z.string().min(2).max(200),
  emergency_relationship: z.string().min(1),
  emergency_phone: z.string().min(6).max(20),
  emergency_phone2: z.string().max(20).optional().or(z.literal('')),
  sponsor_type: z.string().min(1),
  sponsor_name: z.string().max(200).optional().or(z.literal('')),
  sponsor_contact: z.string().max(100).optional().or(z.literal('')),
});

export type Step5FormValues = z.infer<typeof step5Schema>;
