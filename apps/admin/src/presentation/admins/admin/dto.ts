import { z } from 'zod';
import { config } from '@memphis/config';

export const createAdminSchema = z
  .object({
    firstName: z.string().min(1, 'Required').max(255),
    lastName: z.string().min(1, 'Required').max(255),
    email: z.string().email('Invalid email').min(1, 'Required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    token: z.string().min(1, 'Required'),
  })
  .superRefine((data, ctx) => {
    if (data.token !== config.adminToken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid token',
        path: ['token'],
      });
    }

    if (data.password.match(/(?=.*[A-Z])/) === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one uppercase letter',
        path: ['password'],
      });
    }

    if (data.password.match(/(?=.*[a-z])/) === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one lowercase letter',
        path: ['password'],
      });
    }

    if (data.password.match(/(?=.*\d)/) === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one digit',
        path: ['password'],
      });
    }
  });

export type CreateAdminDto = z.infer<typeof createAdminSchema>;
