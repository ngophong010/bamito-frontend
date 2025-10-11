import { z } from 'zod'; // Use Zod for powerful schema validation

// Define the schema for your environment variables
const envSchema = z.object({
  // Server-side variables
  DB_HOST: z.string().min(1),
  DB_USERNAME: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_DATABASE: z.string().min(1),
  ACCESS_KEY: z.string().min(1),
  REFRESH_KEY: z.string().min(1),
  SENDGRID_API_KEY: z.string().min(1),
  
  // Public (client-side) variables
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),
});

// Parse and validate the environment variables
const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    validatedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables.');
}

// Export the validated, type-safe environment variables
export const env = validatedEnv.data;
