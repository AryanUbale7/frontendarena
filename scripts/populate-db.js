const { createClient } = require('@supabase/supabase-js');
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const WebSocket = require('ws');

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

async function seed() {
  const emails = JSON.parse(fs.readFileSync(path.join(__dirname, 'unstop_emails.json'), 'utf8'));
  console.log(`Seeding ${emails.length} emails into approved_participants...`);

  const chunkSize = 200;
  let successCount = 0;

  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize).map(email => ({
      email: email.trim().toLowerCase(),
      registered: false
    }));

    const { data, error } = await supabase
      .from('approved_participants')
      .upsert(chunk, { onConflict: 'email', ignoreDuplicates: true })
      .select();

    if (error) {
      console.error(`Error in chunk ${i}:`, error.message);
    } else if (data) {
      successCount += data.length;
      console.log(`Chunk ${i / chunkSize + 1}: Upserted ${data.length} emails`);
    }
  }

  console.log(`Finished! Total approved emails seeded: ${successCount}`);
}

seed().catch(console.error);
