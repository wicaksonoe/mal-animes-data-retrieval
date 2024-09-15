import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const { MYANIMELIST_CLIENT_ID, MYANIMELIST_BASE_API_URL } = { ...process.env } as { [key: string]: string };
