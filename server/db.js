const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Use DATABASE_URL (Supabase pooler) if provided — required for Vercel serverless.
// In Supabase dashboard: Project Settings → Database → Connection Pooling → "Transaction" mode URL (port 6543)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'resume_builder',
      ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false,
    });

module.exports = pool;
