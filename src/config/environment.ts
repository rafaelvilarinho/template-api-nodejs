import {config} from "dotenv"

config()

type Environment = {
  STAGE: string;
  PORT: number;
  MONGODB_URI: string;
  MONGODB_DATABASE: string;
  TOKEN_SECRET: string;
  MAILING_HOST: string;
  MAILING_PORT: number;
  MAILING_USER: string;
  MAILING_PASS: string;
  MAILING_SECURE: boolean;
  MAILING_USER_NAME: string;
  MAILING_USER_EMAIL: string;
  MAILING_TESTER_NAME: string;
  MAILING_TESTER_EMAIL: string;
}

export const environment: Environment = {
  STAGE: process.env.STAGE || 'dev',
  PORT: parseInt(process.env.PORT || '8001'),
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || '',
  TOKEN_SECRET: process.env.TOKEN_SECRET || '',
  MAILING_HOST: process.env.MAILING_HOST || '',
  MAILING_PORT: parseInt(process.env.MAILING_PORT || '587'),
  MAILING_USER: process.env.MAILING_USER || '',
  MAILING_PASS: process.env.MAILING_PASS || '',
  MAILING_SECURE: process.env.MAILING_SECURE === 'true',
  MAILING_USER_NAME: process.env.MAILING_USER_NAME || '',
  MAILING_USER_EMAIL: process.env.MAILING_USER_EMAIL || '',
  MAILING_TESTER_NAME: process.env.MAILING_TESTER_NAME || '',
  MAILING_TESTER_EMAIL: process.env.MAILING_TESTER_EMAIL || '',
}

export function isDev(): boolean {
  return environment.STAGE === 'development'
}

export function isBeta(): boolean {
  return environment.STAGE === 'beta'
}

export function isProduction(): boolean {
  return environment.STAGE === 'production'
}