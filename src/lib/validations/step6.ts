import { z } from 'zod';

export const step6Schema = z.object({
  agree: z.literal(true, { errorMap: () => ({ message: 'agree_required' }) }),
  terms: z.literal(true, { errorMap: () => ({ message: 'agree_required' }) }),
});

export type Step6FormValues = z.infer<typeof step6Schema>;
