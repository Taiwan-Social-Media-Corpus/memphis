// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { z } from 'zod';

const configSchema = z
  .object({
    // system
    NODE_ENV: z.enum(['test', 'development', 'staging', 'production']),
    CLIENT_URL: z.string().url().min(1),
    SERVER_URL: z.string().url().min(1),
    // secret
    ADMIN_TOKEN: z.string().min(1),
    JWK_PUBLIC_X: z.string().min(1),
    JWK_PRIVATE_D: z.string().min(1),
    COOKIE_SECRET: z.string().min(1),
    COOKIE_HMAC_SECRET: z.string().min(1),
    COOKIE_SIGNATURE_SECRET: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    POSTGRES_PORT: z
      .string()
      .min(1)
      .transform((v) => parseInt(v, 10)),
    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.string().min(1),
    REDIS_PASSWORD: z.string().min(1),
    RABBITMQ_DEFAULT_USER: z.string().min(1),
    RABBITMQ_DEFAULT_PASSWORD: z.string().min(1),
    GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
  })
  .transform((env) => ({
    nodeEnv: env.NODE_ENV,
    clientURL: env.CLIENT_URL,
    serverURL: env.SERVER_URL,
    adminToken: env.ADMIN_TOKEN,
    jwkPublicX: env.JWK_PUBLIC_X,
    jwkPrivateD: env.JWK_PRIVATE_D,
    cookieSecret: env.COOKIE_SECRET,
    cookieHmacSecret: env.COOKIE_HMAC_SECRET,
    cookieSignatureSecret: env.COOKIE_SIGNATURE_SECRET,
    pgHost: env.POSTGRES_HOST,
    pgUser: env.POSTGRES_USER,
    pgPassword: env.POSTGRES_PASSWORD,
    pgDB: env.POSTGRES_DB,
    pgPort: env.POSTGRES_PORT,
    redisHost: env.REDIS_HOST,
    redisPort: env.REDIS_PORT,
    redisPassword: env.REDIS_PASSWORD,
    googleOAuthClientId: env.GOOGLE_OAUTH_CLIENT_ID,
    googleOAuthClientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
  }));

export type Config = z.infer<typeof configSchema>;
export const config = configSchema.parse(process.env);
export default () => config;
