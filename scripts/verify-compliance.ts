// scripts/verify-compliance.ts
// Responsibility: Programmatically and deterministically verify all architectural acceptance criteria

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT_DIR = path.resolve(__dirname, "..");
const FRONTEND_DIR = path.join(ROOT_DIR, "frontend");
const BACKEND_DIR = path.join(ROOT_DIR, "backend");
const FRONTEND_SRC = path.join(FRONTEND_DIR, "src");
const BACKEND_SRC = path.join(BACKEND_DIR, "src");

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

// Parse CLI flags
const args = process.argv.slice(2);
const isQuick = args.includes("--quick") || args.includes("-q");
const isHelp = args.includes("--help") || args.includes("-h");
const gateArgIdx = args.indexOf("--gate");
const specificGate =
  gateArgIdx !== -1 && args[gateArgIdx + 1]
    ? parseInt(args[gateArgIdx + 1], 10)
    : null;

if (isHelp) {
  console.log(`
${COLORS.bold}Hospital Management SaaS — Compliance Verification Suite${COLORS.reset}

Usage:
  npx tsx scripts/verify-compliance.ts [options]

Options:
  --quick, -q       Run only static analysis gates (Gates 1-7, 11-15, < 3s)
  --full            Run all 15 gates including builds and typechecks (default)
  --gate <number>   Execute only the specified gate number (1-15)
  --help, -h        Display this help message
`);
  process.exit(0);
}

interface GateResult {
  id: number;
  name: string;
  passed: boolean;
  skipped: boolean;
  violations: string[];
}

const results: GateResult[] = [];

/**
 * Recursively collect files matching specified extensions, ignoring output and cache directories.
 */
function collectFiles(dir: string, extensions: string[]): string[] {
  let files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== "dist" &&
        entry.name !== ".git" &&
        entry.name !== "build"
      ) {
        files = files.concat(collectFiles(fullPath, extensions));
      }
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Remove multi-line block comments while preserving line count/breaks.
 */
function stripBlockComments(content: string): string {
  return content.replace(/\/\*[\s\S]*?\*\//g, (match) =>
    "\n".repeat(match.split("\n").length - 1),
  );
}

/**
 * Run a single verification gate and report results.
 */
function runGate(id: number, name: string, testFn: () => string[]): void {
  if (specificGate !== null && specificGate !== id) {
    return;
  }

  process.stdout.write(`Gate ${id}: ${name}... `);

  const isBuildGate = id === 8 || id === 9 || id === 10;
  if (isQuick && isBuildGate) {
    console.log(`${COLORS.yellow}SKIPPED (--quick)${COLORS.reset}`);
    results.push({ id, name, passed: true, skipped: true, violations: [] });
    return;
  }

  try {
    const violations = testFn();
    if (!violations || violations.length === 0) {
      console.log(`${COLORS.green}PASS${COLORS.reset}`);
      results.push({ id, name, passed: true, skipped: false, violations: [] });
    } else {
      console.log(
        `${COLORS.red}FAIL (${violations.length} violation${violations.length === 1 ? "" : "s"})${COLORS.reset}`,
      );
      violations
        .slice(0, 10)
        .forEach((v) => console.log(`   ${COLORS.red}•${COLORS.reset} ${v}`));
      if (violations.length > 10) {
        console.log(
          `   ${COLORS.dim}... and ${violations.length - 10} more${COLORS.reset}`,
        );
      }
      results.push({ id, name, passed: false, skipped: false, violations });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`${COLORS.red}ERROR${COLORS.reset}`);
    console.log(`   ${COLORS.red}•${COLORS.reset} ${message}`);
    results.push({
      id,
      name,
      passed: false,
      skipped: false,
      violations: [message],
    });
  }
}

console.log(
  `${COLORS.bold}${COLORS.cyan}================================================================${COLORS.reset}`,
);
console.log(
  `${COLORS.bold}${COLORS.cyan}     Hospital SaaS Compliance & Architectural Invariant Suite    ${COLORS.reset}`,
);
console.log(
  `${COLORS.bold}${COLORS.cyan}================================================================${COLORS.reset}`,
);
console.log(
  `Execution Mode: ${isQuick ? "QUICK (Static Gates 1-7)" : specificGate ? `SINGLE GATE (${specificGate})` : "FULL (Gates 1-10)"}\n`,
);

// -------------------------------------------------------------
// GATE 1: Rule 20 - 0 .ts/.tsx files > 100 lines
// -------------------------------------------------------------
runGate(1, "Rule 20 (<= 100 lines per source file)", () => {
  const violations: string[] = [];
  const files = [
    ...collectFiles(FRONTEND_SRC, [".ts", ".tsx"]),
    ...collectFiles(BACKEND_SRC, [".ts", ".js"]),
  ];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/).length;
    if (lines > 100) {
      violations.push(
        `${path.relative(ROOT_DIR, file)} has ${lines} lines (> 100 limit)`,
      );
    }
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 2: Rule 13 - 0 raw HTML elements outside components/ui/
// -------------------------------------------------------------
runGate(2, "Rule 13 (0 raw HTML outside components/ui/)", () => {
  const violations: string[] = [];
  const uiDir = path.resolve(FRONTEND_SRC, "components", "ui");
  const files = collectFiles(FRONTEND_SRC, [".tsx"]).filter((f) => {
    const resolved = path.resolve(f);
    return !resolved.startsWith(uiDir + path.sep) && resolved !== uiDir;
  });

  const forbiddenTags = [
    "div",
    "span",
    "p",
    "button",
    "input",
    "select",
    "textarea",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "form",
    "label",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "header",
    "nav",
    "footer",
    "section",
    "main",
    "aside",
    "svg",
  ];
  const openTagPattern = new RegExp(`<(${forbiddenTags.join("|")})([\\s/>])`);
  const closeTagPattern = new RegExp(`</(${forbiddenTags.join("|")})>`);

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const cleanedContent = stripBlockComments(content);
    const lines = cleanedContent.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const cleaned = line.replace(/\/\/.*$/, "");
      const openMatch = cleaned.match(openTagPattern);
      const closeMatch = cleaned.match(closeTagPattern);
      const match = openMatch || closeMatch;
      if (match) {
        violations.push(
          `${path.relative(ROOT_DIR, file)}:${idx + 1} contains raw <${match[1]}>`,
        );
      }
    });
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 3: Rule 10 - 0 direct Supabase calls in frontend
// -------------------------------------------------------------
runGate(3, "Rule 10 (0 direct supabase.from() / .rpc() in frontend)", () => {
  const violations: string[] = [];
  const files = collectFiles(FRONTEND_SRC, [".ts", ".tsx"]);
  const supabaseCallPattern = /\bsupabase\s*\.\s*(from|rpc)\s*\(/;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const cleanedContent = stripBlockComments(content);
    const lines = cleanedContent.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const cleaned = line.replace(/\/\/.*$/, "");
      if (supabaseCallPattern.test(cleaned)) {
        violations.push(
          `${path.relative(ROOT_DIR, file)}:${idx + 1} direct Supabase client call`,
        );
      }
    });
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 4: Rule 11 - 0 unvalidated any types
// -------------------------------------------------------------
runGate(4, "Rule 11 (0 unvalidated any types in TS files)", () => {
  const violations: string[] = [];
  const files = [
    ...collectFiles(FRONTEND_SRC, [".ts", ".tsx"]),
    ...collectFiles(BACKEND_SRC, [".ts"]),
  ];
  const anyPattern =
    /(:\s*any\b|\bas\s+any\b|<any>|\bany\[\]|Array<any>|Promise<any>)/;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const cleanedContent = stripBlockComments(content);
    const lines = cleanedContent.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const cleaned = line.replace(/\/\/.*$/, "");
      if (anyPattern.test(cleaned)) {
        violations.push(
          `${path.relative(ROOT_DIR, file)}:${idx + 1} contains unvalidated 'any' type`,
        );
      }
    });
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 5: Rule 19 - 0 files missing responsibility comment
// -------------------------------------------------------------
runGate(5, "Rule 19 (Single-responsibility header in all files)", () => {
  const violations: string[] = [];
  const files = [
    ...collectFiles(FRONTEND_SRC, [".ts", ".tsx"]),
    ...collectFiles(BACKEND_SRC, [".ts", ".js"]),
  ];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);
    const line1 = lines[0] || "";
    const line2 = lines[1] || "";
    const hasResponsibility =
      line1.includes("Responsibility:") || line2.includes("Responsibility:");
    if (!hasResponsibility) {
      violations.push(
        `${path.relative(ROOT_DIR, file)} missing '// Responsibility:' header`,
      );
    }
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 6: Rule 17 - 0 process.env outside centralized config
// -------------------------------------------------------------
runGate(6, "Rule 17 (0 process.env outside centralized config)", () => {
  const violations: string[] = [];
  const allowedBackendConfigs = [
    path.resolve(BACKEND_SRC, "config", "env.ts"),
    path.resolve(BACKEND_SRC, "config", "env.js"),
  ];
  const backendFiles = collectFiles(BACKEND_SRC, [".ts", ".js"]).filter(
    (f) => !allowedBackendConfigs.includes(path.resolve(f)),
  );

  for (const file of backendFiles) {
    const content = fs.readFileSync(file, "utf8");
    const cleanedContent = stripBlockComments(content);
    const lines = cleanedContent.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const cleaned = line.replace(/\/\/.*$/, "");
      if (/\bprocess\.env\b/.test(cleaned)) {
        violations.push(
          `${path.relative(ROOT_DIR, file)}:${idx + 1} accesses process.env directly`,
        );
      }
    });
  }

  const allowedFrontendConfig = path.resolve(FRONTEND_SRC, "lib", "config.ts");
  const frontendFiles = collectFiles(FRONTEND_SRC, [".ts", ".tsx"]).filter(
    (f) => path.resolve(f) !== allowedFrontendConfig,
  );

  for (const file of frontendFiles) {
    const content = fs.readFileSync(file, "utf8");
    const cleanedContent = stripBlockComments(content);
    const lines = cleanedContent.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const cleaned = line.replace(/\/\/.*$/, "");
      if (/\b(process\.env|import\.meta\.env)\b/.test(cleaned)) {
        violations.push(
          `${path.relative(ROOT_DIR, file)}:${idx + 1} accesses environment directly`,
        );
      }
    });
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 7: Rule 2 - 0 UPDATE/DELETE targeting insert-only ledgers
// -------------------------------------------------------------
runGate(7, "Rule 2 (0 UPDATE/DELETE queries on insert-only ledgers)", () => {
  const violations: string[] = [];
  const ledgerTables = [
    "payments",
    "stock_transactions",
    "prescriptions",
    "prescription_items",
    "lab_results",
  ];
  const backendFiles = collectFiles(BACKEND_SRC, [".ts", ".js"]);

  const tableRegex = new RegExp(
    `\\.from\\s*\\(\\s*['"](${ledgerTables.join("|")})['"]\\s*\\)`,
  );
  const sqlRegex = new RegExp(
    `\\b(UPDATE|DELETE\\s+FROM)\\s+(${ledgerTables.join("|")})\\b`,
    "i",
  );

  for (const file of backendFiles) {
    const content = fs.readFileSync(file, "utf8");
    const cleanedContent = stripBlockComments(content);

    if (sqlRegex.test(cleanedContent)) {
      violations.push(
        `${path.relative(ROOT_DIR, file)} contains direct SQL UPDATE/DELETE on ledger table`,
      );
    }

    const lines = cleanedContent.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.replace(/\/\/.*$/, "") || "";
      if (tableRegex.test(line)) {
        const snippet = lines
          .slice(i, Math.min(lines.length, i + 10))
          .map((l) => l.replace(/\/\/.*$/, ""))
          .join(" ");
        if (/\.(update|delete)\s*\(/.test(snippet)) {
          violations.push(
            `${path.relative(ROOT_DIR, file)}:${i + 1} calls .update() or .delete() on insert-only ledger`,
          );
        }
      }
    }
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 8: Backend typecheck exits 0
// -------------------------------------------------------------
runGate(8, "Backend typecheck (npm run typecheck)", () => {
  try {
    execSync("npm run typecheck", {
      cwd: BACKEND_DIR,
      stdio: "pipe",
      encoding: "utf8",
    });
    return [];
  } catch (err: unknown) {
    const output = (err instanceof Error ? (err as { stdout?: string; stderr?: string }).stderr || (err as { stdout?: string }).stdout || err.message : String(err)).toString();
    return [
      output.trim() || "Backend typecheck failed with non-zero exit code",
    ];
  }
});

// -------------------------------------------------------------
// GATE 9: Frontend typecheck exits 0
// -------------------------------------------------------------
runGate(9, "Frontend typecheck (npx tsc --noEmit)", () => {
  try {
    execSync("npx tsc --noEmit", {
      cwd: FRONTEND_DIR,
      stdio: "pipe",
      encoding: "utf8",
    });
    return [];
  } catch (err: unknown) {
    const output = (err instanceof Error ? (err as { stdout?: string; stderr?: string }).stderr || (err as { stdout?: string }).stdout || err.message : String(err)).toString();
    return [
      output.trim() || "Frontend typecheck failed with non-zero exit code",
    ];
  }
});

// -------------------------------------------------------------
// GATE 10: Frontend build exits 0 and creates bundle
// -------------------------------------------------------------
runGate(10, "Frontend build (npm run build)", () => {
  try {
    const distPath = path.join(FRONTEND_DIR, "dist");
    if (fs.existsSync(distPath)) {
      try {
        fs.rmSync(distPath, { recursive: true, force: true });
      } catch (_) {}
    }
    execSync("npm run build", {
      cwd: FRONTEND_DIR,
      stdio: "pipe",
      encoding: "utf8",
    });
    const distIndex = path.join(FRONTEND_DIR, "dist", "index.html");
    if (!fs.existsSync(distIndex)) {
      return ["Build succeeded but frontend/dist/index.html was not generated"];
    }
    return [];
  } catch (err: unknown) {
    const output = (err instanceof Error ? (err as { stdout?: string; stderr?: string }).stderr || (err as { stdout?: string }).stdout || err.message : String(err)).toString();
    return [output.trim() || "Frontend build failed with non-zero exit code"];
  }
});

// -------------------------------------------------------------
// GATE 11: Rule 18 (Status badge configurations)
// -------------------------------------------------------------
runGate(11, "Rule 18 (Configuration-driven status badges)", () => {
  const violations: string[] = [];
  const tsxFiles = collectFiles(FRONTEND_SRC, [".tsx"]);

  for (const file of tsxFiles) {
    const relPath = path.relative(ROOT_DIR, file);
    const content = fs.readFileSync(file, "utf8");
    const cleaned = stripBlockComments(content);

    if (/<Badge\s+[^>]*variant=\{[^}]*\?[^}]*:[^}]*\}/.test(cleaned)) {
      violations.push(
        `${relPath} contains inline ternary conditional in <Badge variant={...}>`,
      );
    }

    if (
      /\b(const|let|var)\s+(statusVariants|typeVariantMap|statusBadgeMap|roleBadgeVariants|memberStatusBadgeMap)\b/.test(
        cleaned,
      )
    ) {
      violations.push(
        `${relPath} defines local ad-hoc status badge mapping instead of importing centralized config`,
      );
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 12: Rule 18 / Rule 14 (Configuration-driven table headers)
// -------------------------------------------------------------
runGate(12, "Rule 18 & 14 (Configuration-driven table headers)", () => {
  const violations: string[] = [];
  const tsxFiles = collectFiles(FRONTEND_SRC, [".tsx"]);

  const allowedFiles = [
    path.normalize("frontend/src/components/common/DataTableHeader.tsx"),
    path.normalize("frontend/src/components/common/SkeletonTable.tsx"),
  ];

  for (const file of tsxFiles) {
    const rel = path.normalize(path.relative(ROOT_DIR, file));
    if (allowedFiles.includes(rel)) continue;

    const content = fs.readFileSync(file, "utf8");
    if (content.includes("<TableHead")) {
      violations.push(
        `${rel} contains hardcoded <TableHead> elements instead of using DataTableHeader`,
      );
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 13: Rule 7 (Service Layer Isolation: 0 direct DB queries in routes)
// -------------------------------------------------------------
runGate(
  13,
  "Rule 7 (Service Layer Isolation: 0 direct DB queries in routes)",
  () => {
    const violations: string[] = [];
    const routeFiles = collectFiles(path.join(BACKEND_SRC, "routes"), [
      ".ts",
      ".js",
    ]);

    for (const file of routeFiles) {
      const content = fs.readFileSync(file, "utf8");
      const cleaned = stripBlockComments(content);
      const lines = cleaned.split(/\r?\n/);
      lines.forEach((line, idx) => {
        const codeOnly = line.replace(/\/\/.*$/, "");
        if (/\.supabase\s*\.\s*from\(/.test(codeOnly)) {
          violations.push(
            `${path.relative(ROOT_DIR, file)}:${idx + 1} contains direct supabase.from() call`,
          );
        }
      });
    }

    return violations;
  },
);

// -------------------------------------------------------------
// GATE 14: Rule 7 & 24 (Frontend Service Isolation: 0 direct api calls in hooks/components)
// -------------------------------------------------------------
runGate(
  14,
  "Rule 7 & 24 (Frontend Service Isolation: 0 direct api calls in hooks/components)",
  () => {
    const violations: string[] = [];
    const servicesDir = path.resolve(FRONTEND_SRC, "services");
    const apiFile = path.resolve(FRONTEND_SRC, "lib", "api.ts");
    const files = collectFiles(FRONTEND_SRC, [".ts", ".tsx"]).filter((f) => {
      const resolved = path.resolve(f);
      return (
        !resolved.startsWith(servicesDir + path.sep) &&
        resolved !== servicesDir &&
        resolved !== apiFile
      );
    });

    for (const file of files) {
      const content = fs.readFileSync(file, "utf8");
      const cleaned = stripBlockComments(content);
      const lines = cleaned.split(/\r?\n/);
      lines.forEach((line, idx) => {
        const codeOnly = line.replace(/\/\/.*$/, "");
        const match = codeOnly.match(
          /\bapi\s*\.\s*(get|post|put|patch|delete)\b/,
        );
        if (match) {
          violations.push(
            `${path.relative(ROOT_DIR, file)}:${idx + 1} contains direct api.${match[1]}() call`,
          );
        }
      });
    }

    return violations;
  },
);

// -------------------------------------------------------------
// GATE 15: Rule 1 (Sequential, Collision-Free Database Migrations)
// -------------------------------------------------------------
runGate(
  15,
  "Rule 1 (Sequential, collision-free database migrations)",
  () => {
    const violations: string[] = [];
    const migrationsDir = path.join(BACKEND_DIR, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      return ["Migrations directory backend/migrations not found"];
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const seenNumbers = new Map<number, string>();
    const numbers: number[] = [];

    for (const file of files) {
      const match = file.match(/^(\d{4})_(.+)\.sql$/);
      if (!match) {
        violations.push(
          `Migration ${file} does not follow standard 4-digit naming format (NNNN_description.sql)`,
        );
        continue;
      }

      const num = parseInt(match[1]!, 10);
      if (seenNumbers.has(num)) {
        violations.push(
          `Duplicate migration number ${match[1]}: both '${seenNumbers.get(num)}' and '${file}' share the same sequence number`,
        );
      } else {
        seenNumbers.set(num, file);
        numbers.push(num);
      }
    }

    // Verify continuous sequence starting from 1
    for (let i = 0; i < numbers.length; i++) {
      const expected = i + 1;
      const actual = numbers[i];
      if (actual !== expected) {
        violations.push(
          `Migration sequence gap: expected #${String(expected).padStart(4, "0")} but found #${String(actual).padStart(4, "0")} (${seenNumbers.get(actual!)})`,
        );
        break; // Stop after reporting first sequence gap to prevent cascading noise
      }
    }

    return violations;
  },
);

// -------------------------------------------------------------
// Results Summary
// -------------------------------------------------------------
console.log(
  `\n${COLORS.cyan}-------------------------------------------------------------${COLORS.reset}`,
);
const failed = results.filter((r) => !r.passed);
const executed = results.filter((r) => !r.skipped);

if (failed.length === 0) {
  console.log(
    `${COLORS.bold}${COLORS.green}✔ ALL ${executed.length} VERIFICATION GATES PASSED!${COLORS.reset}`,
  );
  if (isQuick) {
    console.log(
      `${COLORS.yellow}Note: Ran in QUICK mode (Gates 1-7). Full suite requires Gates 8-10.${COLORS.reset}`,
    );
  }
  process.exit(0);
} else {
  console.log(
    `${COLORS.bold}${COLORS.red}✖ ${failed.length} OF ${executed.length} EXECUTED GATES FAILED${COLORS.reset}`,
  );
  failed.forEach((f) => {
    console.log(
      `  ${COLORS.red}[Gate ${f.id}] ${f.name} — ${f.violations.length} violation(s)${COLORS.reset}`,
    );
  });
  process.exit(1);
}
