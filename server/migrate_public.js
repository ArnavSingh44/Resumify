const pool = require('./db');

async function migrate() {
  try {
    console.log('Starting migration: Adding public sharing columns...');
    
    await pool.query(`
      ALTER TABLE resumes 
      ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS public_id VARCHAR(50) UNIQUE;
    `);
    
    console.log('Migration successful: public_id and is_public fields added.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
