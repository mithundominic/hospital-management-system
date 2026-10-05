// Responsibility: Execute a migration file against Supabase database
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function runMigration(migrationFile) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log(`Running migration: ${migrationFile}`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully');
    console.log('Result:', data);
  } catch (err) {
    console.error('Migration failed with exception:', err);
    process.exit(1);
  }
}

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: node run-migration.js <migration-file>');
  console.error('Example: node run-migration.js 0036_tenant_management_schema.sql');
  process.exit(1);
}

runMigration(migrationFile);
