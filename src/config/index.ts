import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load from backend root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Also check process.cwd()
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const cleanString = (val?: string) => (val ? val.replace(/^["']|["']$/g, '').trim() : '');

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  database_url: cleanString(process.env.DATABASE_URL),
  cloudinary: {
    cloud_name: cleanString(process.env.CLOUDINARY_CLOUD_NAME),
    api_key: cleanString(process.env.CLOUDINARY_API_KEY),
    api_secret: cleanString(process.env.CLOUDINARY_API_SECRET),
  },
};
