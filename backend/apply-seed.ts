// Responsibility: Execute comprehensive demo seed data migration using Supabase RPC
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

const executeStatements = async (statements: string[]): Promise<void> => {
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = `${statements[i]};`;
    const { error: stmtError } = await supabase.rpc("exec_sql", { sql_query: statement });

    if (stmtError) {
      errorCount++;
      if (errorCount <= 5) {
        console.log(`  ⚠️  Statement ${i + 1}: ${stmtError.message.substring(0, 80)}...`);
      }
    } else {
      successCount++;
      if ((i + 1) % 20 === 0) {
        console.log(`  ✓ Processed ${i + 1}/${statements.length} statements...`);
      }
    }
  }

  console.log(`\n📊 Migration Summary: ✅ ${successCount} successful, ⚠️ ${errorCount} failed\n`);
};

const applySeedData = async (): Promise<void> => {
  console.log("🌱 Starting seed data application...\n");
  const sqlPath = path.join(__dirname, "migrations", "0020_seed_comprehensive_demo_data.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf8");

  const { data, error } = await supabase.rpc("exec_sql", { sql_query: sqlContent });

  if (error) {
    console.error("❌ Error executing single SQL batch:", error.message);
    console.log("\n🔄 Executing statement-by-statement fallback...\n");

    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 10 && !s.startsWith("--"));

    await executeStatements(statements);
  } else {
    console.log("✅ Migration applied successfully!", data);
  }

  console.log("✨ Done! Database now has comprehensive demo data.\n");
};

void applySeedData().catch((err: Error) => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
