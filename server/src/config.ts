import { config } from 'dotenv'

config();

export const NODE_ENV = process.env.NODE_ENV;
export const MONGODB_URL = process.env.MONGODB_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const PORT = process.env.PORT;
export const GROQ_API_KEY = process.env.GROQ_API_KEY;