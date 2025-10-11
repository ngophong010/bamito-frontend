import { env } from './env';

// This is the config object for server-side code
export const serverConfig = {
  db: {
    host: env.DB_HOST,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },
  auth: {
    accessKey: env.ACCESS_KEY,
    refreshKey: env.REFRESH_KEY,
  },
  sendgrid: {
    apiKey: env.SENDGRID_API_KEY,
  },
};

// This is the config object for client-side code
export const publicConfig = {
  siteUrl: env.NEXT_PUBLIC_SITE_URL,
  gtmId: env.NEXT_PUBLIC_GTM_ID,
};
