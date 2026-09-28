// Quick script to apply migration 0016
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const migrationSQL = fs.readFileSync(
  path.join(__dirname, 'migrations', '0016_fix_memberships_rls.sql'),
  'utf8'
);

async function applyMigration() {
  console.log('Applying migration 0016: Fix Memberships RLS...');
  
  // Split by semicolon and execute each statement
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const statement of statements) {
    console.log(`Executing: ${statement.substring(0, 80)}...`);
    const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  }
  
  console.log('✅ Migration 0016 applied successfully!');
}

applyMigration();
