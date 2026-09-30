// Responsibility: Apply database migration 0016 for memberships RLS policy
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const migrationPath = path.join(__dirname, "migrations", "0016_fix_memberships_rls.sql");
const migrationSQL = fs.readFileSync(migrationPath, "utf8");

const applyMigration = async (): Promise<void> => {
  console.log("Applying migration 0016: Fix Memberships RLS...");

  const statements = migrationSQL
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0 && !statement.startsWith("--"));

  for (const statement of statements) {
    console.log(`Executing: ${statement.substring(0, 80)}...`);
    const { error } = await supabase.rpc("exec_sql", { sql_query: statement });

    if (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  }

  console.log("✅ Migration 0016 applied successfully!");
};

void applyMigration();
