import { z } from 'zod';

export const documentItemSchema = z.object({
  document_type: z.string().min(1),
  document_name: z.string().min(1),
  file_url: z.string().min(1),
  file_size: z.number(),
  mime_type: z.string(),
  is_required: z.boolean(),
});

export const step4Schema = z.object({
  documents: z.array(documentItemSchema),
});

export type Step4FormValues = z.infer<typeof step4Schema>;
