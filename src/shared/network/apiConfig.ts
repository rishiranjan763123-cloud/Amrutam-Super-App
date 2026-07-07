import { Platform } from 'react-native';

type Env = 'development' | 'staging' | 'production';

const ENV: Env = (process.env.APP_ENV as Env) || 'development';

const BASE_URLS: Record<Env, string> = {
  development: 'https://mock-api.amrutam.dev',
  staging: 'https://staging-api.amrutam.com',
  production: 'https://api.amrutam.com',
};

export const apiConfig = {
  env: ENV,
  baseUrl: BASE_URLS[ENV],
  timeout: 15000,
  maxRetries: 2,
  platform: Platform.OS,
  isDev: ENV === 'development',
};