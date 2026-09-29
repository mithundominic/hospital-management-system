// scripts/adversarial_challenge_3_2.cjs
// Responsibility: Programmatic adversarial challenge runner for Rule 2, Rule 7, Rule 15, and Rule 3 invariants

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const BACKEND_SRC = path.join(ROOT_DIR, "backend", "src");
const MIGRATIONS_DIR = path.join(ROOT_DIR, "backend", "migrations");
const TYPES_DIR = path.join(BACKEND_SRC, "types");
const ROUTES_DIR = path.join(BACKEND_SRC, "routes");

function collectFiles(dir, extensions) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", "dist", ".git", "build"].includes(entry.name)) {
        files = files.concat(collectFiles(fullPath, extensions));
      }
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripComments(content) {
  // Strip block comments preserving newlines
  const withoutBlock = content.replace(/\/\*[\s\S]*?\*\//g, (m) => "\n".repeat(m.split("\n").length - 1));
  // Strip line comments
  return withoutBlock.split(/\r?\n/).map(line => line.replace(/\/\/.*$/, "").replace(/--.*$/, "")).join("\n");
}

let totalChallenges = 0;
let passedChallenges = 0;
const failureLog = [];

function assertChallenge(name, testFn) {
  totalChallenges++;
  try {
    const violations = testFn();
    if (!violations || violations.length === 0) {
      console.log(`[PASS] ${name}`);
      passedChallenges++;
    } else {
      console.error(`[FAIL] ${name}: ${violations.length} violation(s) found`);
      violations.forEach((v) => console.error(`  -> ${v}`));
      failureLog.push({ name, violations });
    }
  } catch (err) {
    console.error(`[ERROR] ${name}: ${err.message}`);
    failureLog.push({ name, violations: [err.message] });
  }
}

console.log("==================================================================");
console.log("CHALLENGER 3.2: Adversarial Audit of Ledgers & Service Isolation");
console.log("==================================================================\n");

// -------------------------------------------------------------
// CHALLENGE 1: Rule 2 (Insert-Only Ledgers)
// -------------------------------------------------------------
const ledgerTables = [
  "payments",
  "stock_transactions",
  "prescriptions",
  "prescription_items",
  "lab_results",
];

assertChallenge("Rule 2.1: Zero UPDATE or DELETE policies on ledger tables in SQL migrations", () => {
  const violations = [];
  const migrationFiles = collectFiles(MIGRATIONS_DIR, [".sql"]);
  for (const file of migrationFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const code = stripComments(raw);
    for (const table of ledgerTables) {
      const updatePolicyRegex = new RegExp(`create\\s+policy\\s+\\w+\\s+on\\s+${table}\\s+for\\s+update`, "i");
      const deletePolicyRegex = new RegExp(`create\\s+policy\\s+\\w+\\s+on\\s+${table}\\s+for\\s+delete`, "i");
      const allPolicyRegex = new RegExp(`create\\s+policy\\s+\\w+\\s+on\\s+${table}\\s+for\\s+all`, "i");
      if (updatePolicyRegex.test(code)) violations.push(`${path.basename(file)} defines FOR UPDATE policy on ledger table '${table}'`);
      if (deletePolicyRegex.test(code)) violations.push(`${path.basename(file)} defines FOR DELETE policy on ledger table '${table}'`);
      if (allPolicyRegex.test(code)) violations.push(`${path.basename(file)} defines FOR ALL policy on ledger table '${table}'`);
    }
  }
  return violations;
});

assertChallenge("Rule 2.2: Zero .update() or .delete() method calls on ledger tables in backend source", () => {
  const violations = [];
  const backendFiles = collectFiles(BACKEND_SRC, [".ts", ".js"]);
  for (const file of backendFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const code = stripComments(raw);
    for (const table of ledgerTables) {
      // Look for .from('ledger').update( or .delete(
      const chainedRegex = new RegExp(`\\.from\\s*\\(\\s*['"]${table}['"]\\s*\\)[\\s\\S]{0,100}?\\.(update|delete)\\s*\\(`, "g");
      if (chainedRegex.test(code)) {
        violations.push(`${path.relative(ROOT_DIR, file)} calls .update() or .delete() on ledger table '${table}'`);
      }
    }
  }
  return violations;
});

assertChallenge("Rule 2.3: Zero raw SQL UPDATE/DELETE strings on ledger tables across backend code", () => {
  const violations = [];
  const backendFiles = collectFiles(BACKEND_SRC, [".ts", ".js"]);
  for (const file of backendFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const code = stripComments(raw);
    for (const table of ledgerTables) {
      const sqlRegex = new RegExp(`\\b(UPDATE|DELETE\\s+FROM)\\s+${table}\\b`, "i");
      if (sqlRegex.test(code)) {
        violations.push(`${path.relative(ROOT_DIR, file)} contains direct SQL mutation on ledger table '${table}'`);
      }
    }
  }
  return violations;
});

assertChallenge("Rule 2.4: Zero DELETE routes or UPDATE routes targeting ledger entities in HTTP routes", () => {
  const violations = [];
  const routeFiles = collectFiles(ROUTES_DIR, [".ts", ".js"]);
  for (const file of routeFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const code = stripComments(raw);
    if (/\.delete\s*\(/.test(code)) {
      violations.push(`${path.relative(ROOT_DIR, file)} defines a router.delete() endpoint`);
    }
  }
  return violations;
});

// -------------------------------------------------------------
// CHALLENGE 2: Rule 7 (Service Layer Isolation)
// -------------------------------------------------------------
assertChallenge("Rule 7.1: Zero direct database queries (.from, .rpc) in backend route controllers", () => {
  const violations = [];
  const routeFiles = collectFiles(ROUTES_DIR, [".ts", ".js"]);
  for (const file of routeFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const code = stripComments(raw);
    if (/\.(supabase|client)\s*\.\s*(from|rpc)\s*\(/.test(code) || /supabaseClient\.(from|rpc)\s*\(/.test(code)) {
      violations.push(`${path.relative(ROOT_DIR, file)} executes direct database query`);
    }
    if (/\.from\s*\(\s*['"]/.test(code)) {
      violations.push(`${path.relative(ROOT_DIR, file)} contains direct .from() table query`);
    }
    if (/\.rpc\s*\(\s*['"]/.test(code)) {
      violations.push(`${path.relative(ROOT_DIR, file)} contains direct .rpc() function call`);
    }
  }
  return violations;
});

assertChallenge("Rule 7.2: Every route handler delegates to services/ module", () => {
  const violations = [];
  const routeFiles = collectFiles(ROUTES_DIR, [".ts"]).filter(f => !f.endsWith(".handlers.ts"));
  for (const file of routeFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const hasServiceImport = /from\s+['"]\.\.?\/(services|routes\/[\w.]+handlers)['"]/.test(raw) ||
                             /from\s+['"]\.\.?\/services\/[\w/]+['"]/.test(raw);
    if (!hasServiceImport) {
      violations.push(`${path.relative(ROOT_DIR, file)} does not import from services/ or handlers`);
    }
  }
  return violations;
});

// -------------------------------------------------------------
// CHALLENGE 3: Rule 15 (Per-Request Client & RLS)
// -------------------------------------------------------------
assertChallenge("Rule 15.1: Zero getAdminClient() or adminClient references in HTTP route controllers", () => {
  const violations = [];
  const routeFiles = collectFiles(ROUTES_DIR, [".ts", ".js"]);
  for (const file of routeFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const code = stripComments(raw);
    if (/\b(adminClient|getAdminClient)\b/.test(code)) {
      violations.push(`${path.relative(ROOT_DIR, file)} accesses adminClient directly`);
    }
  }
  return violations;
});

assertChallenge("Rule 15.2: Per-request authenticated userClient factory used in auth middleware", () => {
  const violations = [];
  const authMiddlewareFile = path.join(BACKEND_SRC, "middleware", "auth.ts");
  if (!fs.existsSync(authMiddlewareFile)) {
    violations.push("auth.ts middleware file not found");
    return violations;
  }
  const raw = fs.readFileSync(authMiddlewareFile, "utf8");
  if (!raw.includes("userClient(token)")) {
    violations.push("auth.ts does not instantiate userClient(token) per request");
  }
  if (!raw.includes("authReq.supabase = userClient(token)")) {
    violations.push("auth.ts does not attach userClient to authReq.supabase");
  }
  return violations;
});

// -------------------------------------------------------------
// CHALLENGE 4: Rule 3 & Database Invariants
// -------------------------------------------------------------
assertChallenge("Rule 3.1: Patients table has exactly 0 hospital_id columns in all SQL migrations", () => {
  const violations = [];
  const migrationFiles = collectFiles(MIGRATIONS_DIR, [".sql"]);
  for (const file of migrationFiles) {
    const raw = fs.readFileSync(file, "utf8");
    // Check create table patients
    const createPatientMatch = raw.match(/create\s+table\s+patients\s*\(([\s\S]*?)\);/i);
    if (createPatientMatch) {
      if (/\bhospital_id\b/i.test(createPatientMatch[1])) {
        violations.push(`${path.basename(file)} includes hospital_id in create table patients`);
      }
    }
    // Check alter table patients add column hospital_id
    if (/alter\s+table\s+patients\s+add\s+column[^\n;]*hospital_id/i.test(raw)) {
      violations.push(`${path.basename(file)} adds hospital_id to patients table`);
    }
  }
  return violations;
});

assertChallenge("Rule 3.2: Insurance_policies table has exactly 0 hospital_id columns in all SQL migrations", () => {
  const violations = [];
  const migrationFiles = collectFiles(MIGRATIONS_DIR, [".sql"]);
  for (const file of migrationFiles) {
    const raw = fs.readFileSync(file, "utf8");
    const createPolicyMatch = raw.match(/create\s+table\s+insurance_policies\s*\(([\s\S]*?)\);/i);
    if (createPolicyMatch) {
      if (/\bhospital_id\b/i.test(createPolicyMatch[1])) {
        violations.push(`${path.basename(file)} includes hospital_id in create table insurance_policies`);
      }
    }
    if (/alter\s+table\s+insurance_policies\s+add\s+column[^\n;]*hospital_id/i.test(raw)) {
      violations.push(`${path.basename(file)} adds hospital_id to insurance_policies table`);
    }
  }
  return violations;
});

assertChallenge("Rule 3.3: TypeScript interfaces Patient and InsurancePolicy have zero hospital_id properties", () => {
  const violations = [];
  const patientTypeFile = path.join(TYPES_DIR, "core.types.ts");
  if (fs.existsSync(patientTypeFile)) {
    const raw = fs.readFileSync(patientTypeFile, "utf8");
    const patientMatch = raw.match(/export\s+interface\s+Patient\s*\{([\s\S]*?)\}/);
    if (patientMatch && /\bhospital_id\b/.test(patientMatch[1])) {
      violations.push("core.types.ts: Patient interface contains hospital_id");
    }
  }
  const billingTypeFile = path.join(TYPES_DIR, "billing.types.ts");
  if (fs.existsSync(billingTypeFile)) {
    const raw = fs.readFileSync(billingTypeFile, "utf8");
    const policyMatch = raw.match(/export\s+interface\s+InsurancePolicy\s*\{([\s\S]*?)\}/);
    if (policyMatch && /\bhospital_id\b/.test(policyMatch[1])) {
      violations.push("billing.types.ts: InsurancePolicy interface contains hospital_id");
    }
  }
  return violations;
});

assertChallenge("Database Invariant: Migrations 0001 through 0016 exist in contiguous numerical sequence with 0 gaps", () => {
  const violations = [];
  const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith(".sql")).sort();
  if (migrationFiles.length !== 16) {
    violations.push(`Expected exactly 16 migration files, found ${migrationFiles.length}`);
  }
  for (let i = 1; i <= 16; i++) {
    const prefix = String(i).padStart(4, "0");
    const match = migrationFiles.find(f => f.startsWith(prefix));
    if (!match) {
      violations.push(`Missing migration file with prefix ${prefix}`);
    }
  }
  return violations;
});

console.log("\n==================================================================");
console.log(`SUMMARY: ${passedChallenges}/${totalChallenges} Challenges Passed`);
console.log("==================================================================");

if (failureLog.length > 0) {
  console.log(`\nVERDICT: REJECT (${failureLog.length} failures)`);
  process.exit(1);
} else {
  console.log("\nVERDICT: APPROVE (100% Invariants strictly enforced)");
  process.exit(0);
}
