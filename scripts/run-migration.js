const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

// Default Supabase connection string format
const dbUrl = process.env.DATABASE_URL || "postgres://postgres:AASV2005@db.tmdoeuoiknrciwcguhga.supabase.co:5432/postgres";

async function runMigration() {
  console.log("Connecting to PostgreSQL...");
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully!");

    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '0008_approved_participants.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Executing migration 0008_approved_participants.sql...");
    await client.query(sql);
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration error:", err.message);
  } finally {
    await client.end();
  }
}

runMigration();
