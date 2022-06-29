import {config} from "dotenv"

config()

type Environment = {
  PORT: number;
  MONGODB_URI: string;
  MONGODB_DATABASE: string;
  TOKEN_SECRET: string;
}

export const environment: Environment = {
  PORT: parseInt(process.env.PORT || ''),
  MONGODB_URI: process.env.MONGODB_URI || '',
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || '',
  TOKEN_SECRET: process.env.TOKEN_SECRET || '',
}