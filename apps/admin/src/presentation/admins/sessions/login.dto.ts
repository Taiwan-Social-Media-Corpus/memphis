import { z } from 'zod';

export const loginAdminSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginAdminDto = z.infer<typeof loginAdminSchema>;
