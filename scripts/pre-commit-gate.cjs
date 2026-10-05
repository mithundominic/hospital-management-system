// scripts/pre-commit-gate.cjs
// Responsibility: Deterministic Git pre-commit enforcement gate verifying all architectural rules in AGENTS.md

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');
const FRONTEND_SRC = path.join(FRONTEND_DIR, 'src');
const BACKEND_SRC = path.join(BACKEND_DIR, 'src');
const MIGRATIONS_DIR = path.join(BACKEND_DIR, 'migrations');

// Terminal colors
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// CLI Arguments
const args = process.argv.slice(2);
const isAll = args.includes('--all') || args.includes('-a');
const isQuick = args.includes('--quick') || args.includes('-q');
const isHelp = args.includes('--help') || args.includes('-h');
const gateArgIdx = args.indexOf('--gate');
const specificGate = gateArgIdx !== -1 && args[gateArgIdx + 1] ? parseInt(args[gateArgIdx + 1], 10) : null;

if (isHelp) {
  console.log(`
${C.bold}${C.cyan}Hospital Management SaaS — Git Pre-Commit Gate (AGENTS.md Enforcement)${C.reset}

Usage:
  node scripts/pre-commit-gate.cjs [options]

Options:
  (no flags)        Inspect staged files in Git index and run critical gates
  --all, -a         Inspect all source files across the entire codebase
  --quick, -q       Skip full TypeScript compiler execution (Gates 1-17 only)
  --gate <number>   Execute only the specified gate number (1-18)
  --help, -h        Show this help message
`);
  process.exit(0);
}

// Result Tracking
const results = [];

function stripBlockComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, (match) => '\n'.repeat(match.split('\n').length - 1));
}

function collectAllFiles(dir, extensions) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', 'build', '.kiro', '.vscode'].includes(entry.name)) {
        files = files.concat(collectAllFiles(fullPath, extensions));
      }
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

function getStagedFiles() {
  try {
    const stdout = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return stdout
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((f) => path.normalize(f));
  } catch (_) {
    return [];
  }
}

function getDeletedStagedFiles() {
  try {
    const stdout = execSync('git diff --cached --name-only --diff-filter=D', {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return stdout
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((f) => path.normalize(f));
  } catch (_) {
    return [];
  }
}

function getFileContent(relPath) {
  // If reading staged file in git, fetch exact staged index content
  const gitPath = relPath.replace(/\\/g, '/');
  try {
    return execSync(`git show :${gitPath}`, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch (_) {
    const fullPath = path.resolve(ROOT_DIR, relPath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    return '';
  }
}

// Determine target files to check
const stagedFiles = getStagedFiles();
const deletedStagedFiles = getDeletedStagedFiles();
const checkAll = isAll || stagedFiles.length === 0;

function filterFiles(matcher) {
  if (checkAll) {
    const all = [
      ...collectAllFiles(FRONTEND_SRC, ['.ts', '.tsx']),
      ...collectAllFiles(BACKEND_SRC, ['.ts', '.js']),
      ...collectAllFiles(MIGRATIONS_DIR, ['.sql']),
    ].map((f) => path.relative(ROOT_DIR, f));
    return all.filter(matcher);
  }
  return stagedFiles.filter(matcher);
}

function runGate(id, name, testFn) {
  if (specificGate !== null && specificGate !== id) return;

  process.stdout.write(`Gate ${String(id).padStart(2, '0')}: ${name}... `);

  const isBuildGate = id === 18;
  if (isQuick && isBuildGate) {
    console.log(`${C.yellow}SKIPPED (--quick)${C.reset}`);
    results.push({ id, name, passed: true, skipped: true, violations: [] });
    return;
  }

  try {
    const violations = testFn();
    if (!violations || violations.length === 0) {
      console.log(`${C.green}PASS${C.reset}`);
      results.push({ id, name, passed: true, skipped: false, violations: [] });
    } else {
      console.log(`${C.red}FAIL (${violations.length} violation${violations.length === 1 ? '' : 's'})${C.reset}`);
      violations.slice(0, 10).forEach((v) => console.log(`   ${C.red}•${C.reset} ${v}`));
      if (violations.length > 10) {
        console.log(`   ${C.dim}... and ${violations.length - 10} more${C.reset}`);
      }
      results.push({ id, name, passed: false, skipped: false, violations });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`${C.red}ERROR${C.reset}`);
    console.log(`   ${C.red}•${C.reset} ${message}`);
    results.push({ id, name, passed: false, skipped: false, violations: [message] });
  }
}

console.log(`${C.bold}${C.cyan}================================================================${C.reset}`);
console.log(`${C.bold}${C.cyan}     Hospital SaaS Pre-Commit Gate Suite (AGENTS.md Invariants) ${C.reset}`);
console.log(`${C.bold}${C.cyan}================================================================${C.reset}`);
console.log(`Mode: ${checkAll ? 'ALL FILES' : `STAGED FILES (${stagedFiles.length} file${stagedFiles.length === 1 ? '' : 's'})`}${isQuick ? ' [QUICK]' : ''}\n`);

// -------------------------------------------------------------
// GATE 1: Rule 20 - 100-line hard limit on .ts/.tsx files
// -------------------------------------------------------------
runGate(1, 'Rule 20 (<= 100 lines per .ts/.tsx file)', () => {
  const violations = [];
  const files = filterFiles((f) => (f.startsWith('frontend') || f.startsWith('backend')) && (f.endsWith('.ts') || f.endsWith('.tsx')));
  for (const f of files) {
    const content = getFileContent(f);
    const lineCount = content.split(/\r?\n/).length;
    if (lineCount > 100) {
      violations.push(`${f} has ${lineCount} lines (exceeds 100-line hard limit)`);
    }
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 2: Rule 13 - 0 raw HTML elements outside components/ui/
// -------------------------------------------------------------
runGate(2, 'Rule 13 (0 raw HTML outside frontend/src/components/ui/)', () => {
  const violations = [];
  const uiNormalized = path.normalize('frontend/src/components/ui');
  const files = filterFiles((f) => f.startsWith('frontend') && f.endsWith('.tsx') && !f.includes(uiNormalized));

  const forbiddenTags = [
    'div', 'span', 'p', 'button', 'input', 'select', 'textarea',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'form', 'label', 'ul', 'ol', 'li', 'a', 'img',
    'header', 'nav', 'footer', 'section', 'main', 'aside', 'svg',
    'strong', 'em', 'b', 'i', 'small', 'article',
  ];
  const openTagPattern = new RegExp(`<(${forbiddenTags.join('|')})([\\s/>])`);
  const closeTagPattern = new RegExp(`</(${forbiddenTags.join('|')})>`);

  for (const f of files) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    const lines = cleaned.split(/\r?\n/);
    lines.forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      const openMatch = codeOnly.match(openTagPattern);
      const closeMatch = codeOnly.match(closeTagPattern);
      const match = openMatch || closeMatch;
      if (match) {
        violations.push(`${f}:${idx + 1} contains raw <${match[1]}> tag (use components/ui/ primitive)`);
      }
    });
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 3: Rule 10 - 0 direct Supabase calls in frontend
// -------------------------------------------------------------
runGate(3, 'Rule 10 (0 direct supabase.from() / .rpc() in frontend)', () => {
  const violations = [];
  const files = filterFiles((f) => f.startsWith('frontend') && (f.endsWith('.ts') || f.endsWith('.tsx')));
  const pattern = /\bsupabase\s*\.\s*(from|rpc)\s*\(/;

  for (const f of files) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    const lines = cleaned.split(/\r?\n/);
    lines.forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (pattern.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} direct Supabase client call (use api client)`);
      }
    });
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 4: Rule 11 & Section 13 - Type safety (0 unvalidated any & 0 @ts-ignore)
// -------------------------------------------------------------
runGate(4, 'Rule 11 & Sec 13 (0 unvalidated any & 0 @ts-ignore/@ts-nocheck)', () => {
  const violations = [];
  const files = filterFiles((f) => (f.startsWith('frontend') || f.startsWith('backend')) && (f.endsWith('.ts') || f.endsWith('.tsx')));
  const anyPattern = /(:\s*any\b|\bas\s+any\b|<any>|\bany\[\]|Array<any>|Promise<any>)/;

  for (const f of files) {
    const rawContent = getFileContent(f);
    const rawLines = rawContent.split(/\r?\n/);
    rawLines.forEach((line, idx) => {
      if (line.includes('@ts-ignore') || line.includes('@ts-nocheck')) {
        violations.push(`${f}:${idx + 1} contains forbidden @ts-ignore or @ts-nocheck directive`);
      }
    });

    const cleaned = stripBlockComments(rawContent);
    const lines = cleaned.split(/\r?\n/);
    lines.forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (anyPattern.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} contains unvalidated 'any' type`);
      }
    });
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 5: Rule 19 - Single-responsibility header in all source files
// -------------------------------------------------------------
runGate(5, 'Rule 19 (Single-responsibility header in all source files)', () => {
  const violations = [];
  const files = filterFiles((f) => {
    if (!f.startsWith('frontend' + path.sep + 'src') && !f.startsWith('backend' + path.sep + 'src')) return false;
    return f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js');
  });

  for (const f of files) {
    const content = getFileContent(f);
    const lines = content.split(/\r?\n/).slice(0, 3);
    const hasHeader = lines.some((l) => l.trim().startsWith('//') && l.includes('Responsibility:'));
    if (!hasHeader) {
      violations.push(`${f} missing '// Responsibility:' header in lines 1-3`);
    }
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 6: Rule 17 - 0 process.env outside centralized config
// -------------------------------------------------------------
runGate(6, 'Rule 17 (0 process.env outside centralized config)', () => {
  const violations = [];
  const backendConfig = path.normalize('backend/src/config/env');
  const frontendConfig = path.normalize('frontend/src/lib/config.ts');
  const frontendEnvConfig = path.normalize('frontend/src/config/env');

  const backendFiles = filterFiles((f) => f.startsWith('backend' + path.sep + 'src') && (f.endsWith('.ts') || f.endsWith('.js')) && !f.startsWith(backendConfig));
  for (const f of backendFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (/\bprocess\.env\b/.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} accesses process.env directly (use backend/src/config/env)`);
      }
    });
  }

  const frontendFiles = filterFiles((f) => f.startsWith('frontend' + path.sep + 'src') && (f.endsWith('.ts') || f.endsWith('.tsx')) && f !== frontendConfig && !f.startsWith(frontendEnvConfig));
  for (const f of frontendFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (/\b(process\.env|import\.meta\.env)\b/.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} accesses environment directly (use frontend/src/lib/config.ts)`);
      }
    });
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 7: Rule 2 - 0 UPDATE/DELETE targeting insert-only ledgers
// -------------------------------------------------------------
runGate(7, 'Rule 2 (0 UPDATE/DELETE on insert-only ledgers)', () => {
  const violations = [];
  const ledgers = ['payments', 'stock_transactions', 'prescriptions', 'prescription_items', 'lab_results'];
  const tableRegex = new RegExp(`\\.from\\s*\\(\\s*['"](${ledgers.join('|')})['"]\\s*\\)`);
  const sqlUpdateDeleteRegex = new RegExp(`\\b(UPDATE|DELETE\\s+FROM)\\s+(${ledgers.join('|')})\\b`, 'i');
  const sqlPolicyRegex = new RegExp(`\\bCREATE\\s+POLICY\\b[^\n]*\\bFOR\\s+(UPDATE|DELETE)\\s+ON\\s+(${ledgers.join('|')})\\b`, 'i');

  const sqlFiles = filterFiles((f) => f.startsWith('backend' + path.sep + 'migrations') && f.endsWith('.sql'));
  for (const f of sqlFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/--.*$/, '');
      if (sqlUpdateDeleteRegex.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} direct SQL UPDATE/DELETE on ledger table`);
      }
      if (sqlPolicyRegex.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} defines UPDATE/DELETE RLS policy on insert-only ledger`);
      }
    });
  }

  const codeFiles = filterFiles((f) => f.startsWith('backend' + path.sep + 'src') && (f.endsWith('.ts') || f.endsWith('.js')));
  for (const f of codeFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    const lines = cleaned.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\/\/.*$/, '');
      if (tableRegex.test(line)) {
        const snippet = lines.slice(i, Math.min(lines.length, i + 10)).map((l) => l.replace(/\/\/.*$/, '')).join(' ');
        if (/\.(update|delete)\s*\(/.test(snippet)) {
          violations.push(`${f}:${i + 1} calls .update() or .delete() on insert-only ledger`);
        }
      }
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 8: Rule 3 - Hospital-agnostic patients & insurance policies
// -------------------------------------------------------------
runGate(8, 'Rule 3 (Hospital-agnostic patients & insurance_policies)', () => {
  const violations = [];
  const agnosticTables = ['patients', 'insurance_policies'];
  const sqlAddColRegex = new RegExp(`\\bALTER\\s+TABLE\\s+(${agnosticTables.join('|')})\\s+ADD\\s+COLUMN\\s+hospital_id\\b`, 'i');

  const sqlFiles = filterFiles((f) => f.startsWith('backend' + path.sep + 'migrations') && f.endsWith('.sql'));
  for (const f of sqlFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/--.*$/, '');
      if (sqlAddColRegex.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} adds hospital_id to hospital-agnostic table`);
      }
    });
  }

  const codeFiles = filterFiles((f) => (f.startsWith('backend' + path.sep + 'src') || f.startsWith('frontend' + path.sep + 'src')) && (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')));
  for (const f of codeFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    const lines = cleaned.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].replace(/\/\/.*$/, '');
      if (/\.from\s*\(\s*['"]patients['"]\s*\)/.test(line)) {
        const snippet = lines.slice(i, Math.min(lines.length, i + 8)).join(' ');
        if (/\.eq\s*\(\s*['"]hospital_id['"]/.test(snippet)) {
          violations.push(`${f}:${i + 1} queries patients directly by hospital_id (use patient_registrations)`);
        }
      }
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 9: Rule 4 - Permission naming format (domain.action)
// -------------------------------------------------------------
runGate(9, 'Rule 4 (Permission naming format domain.action)', () => {
  const violations = [];
  const permCallRegex = /\brequire(?:Hospital|Platform)?Permission\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  const permFormat = /^[a-z0-9_]+\.[a-z0-9_]+$/;

  const codeFiles = filterFiles((f) => (f.startsWith('backend') || f.startsWith('frontend')) && (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')));
  for (const f of codeFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    const lines = cleaned.split(/\r?\n/);
    lines.forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      let match;
      while ((match = permCallRegex.exec(codeOnly)) !== null) {
        const perm = match[1];
        if (!permFormat.test(perm)) {
          violations.push(`${f}:${idx + 1} invalid permission key '${perm}' (must be domain.action)`);
        }
      }
    });
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 10: Rule 5 - No role inheritance
// -------------------------------------------------------------
runGate(10, 'Rule 5 (role_inheritance table must remain empty)', () => {
  const violations = [];
  const sqlFiles = filterFiles((f) => f.startsWith('backend' + path.sep + 'migrations') && f.endsWith('.sql'));
  for (const f of sqlFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/--.*$/, '');
      if (/\bINSERT\s+INTO\s+role_inheritance\b/i.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} inserts into role_inheritance (Rule 5 violation)`);
      }
    });
  }

  const codeFiles = filterFiles((f) => f.startsWith('backend' + path.sep + 'src') && (f.endsWith('.ts') || f.endsWith('.js')));
  for (const f of codeFiles) {
    const content = getFileContent(f);
    if (/from\s*\(\s*['"]role_inheritance['"]\s*\)\s*\.\s*insert/i.test(content)) {
      violations.push(`${f} inserts into role_inheritance`);
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 11: Rule 7 & 24 - Service Layer Isolation (Backend & Frontend)
// -------------------------------------------------------------
runGate(11, 'Rule 7 & 24 (Service layer isolation: 0 direct DB in routes, 0 direct API in components)', () => {
  const violations = [];
  const routesDir = path.normalize('backend/src/routes');
  const routeFiles = filterFiles((f) => f.startsWith(routesDir) && (f.endsWith('.ts') || f.endsWith('.js')));
  for (const f of routeFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (/\.(supabase|from)\s*\.\s*from\(/.test(codeOnly) || /req\.supabase\.from\(/.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} direct database query in route (delegate to service)`);
      }
    });
  }

  const servicesDir = path.normalize('frontend/src/services');
  const apiFile = path.normalize('frontend/src/lib/api.ts');
  const frontendFiles = filterFiles((f) => f.startsWith('frontend' + path.sep + 'src') && (f.endsWith('.ts') || f.endsWith('.tsx')) && !f.startsWith(servicesDir) && f !== apiFile);
  for (const f of frontendFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      const match = codeOnly.match(/\bapi\s*\.\s*(get|post|put|patch|delete)\b/);
      if (match) {
        violations.push(`${f}:${idx + 1} direct api.${match[1]}() call in component/hook (delegate to service)`);
      }
    });
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 12: Rule 15 - 0 getAdminClient() in route controllers
// -------------------------------------------------------------
runGate(12, 'Rule 15 (0 getAdminClient() in route controllers)', () => {
  const violations = [];
  const routesDir = path.normalize('backend/src/routes');
  const routeFiles = filterFiles((f) => f.startsWith(routesDir) && (f.endsWith('.ts') || f.endsWith('.js')));
  for (const f of routeFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (/\bgetAdminClient\s*\(/.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} calls getAdminClient() in route (use req.supabase)`);
      }
    });
  }
  return violations;
});

// -------------------------------------------------------------
// GATE 13: Rule 18 & 14 - Configuration-driven rendering & table headers
// -------------------------------------------------------------
runGate(13, 'Rule 18 & 14 (Configuration-driven badges and table headers)', () => {
  const violations = [];
  const allowedHeaders = [
    path.normalize('frontend/src/components/common/DataTableHeader.tsx'),
    path.normalize('frontend/src/components/common/SkeletonTable.tsx'),
  ];
  const tsxFiles = filterFiles((f) => f.startsWith('frontend' + path.sep + 'src') && f.endsWith('.tsx'));

  for (const f of tsxFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);

    if (/<Badge\s+[^>]*variant=\{[^}]*\?[^}]*:[^}]*\}/.test(cleaned)) {
      violations.push(`${f} contains inline ternary conditional in <Badge variant={...}>`);
    }

    if (/\b(const|let|var)\s+(statusVariants|typeVariantMap|statusBadgeMap|roleBadgeVariants|memberStatusBadgeMap)\b/.test(cleaned)) {
      violations.push(`${f} defines local ad-hoc status badge mapping (import from centralized config)`);
    }

    if (!allowedHeaders.includes(f) && cleaned.includes('<TableHead')) {
      violations.push(`${f} contains hardcoded <TableHead> (use DataTableHeader component)`);
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 14: Rule 22 - Functional components only (0 class components)
// -------------------------------------------------------------
runGate(14, 'Rule 22 (Functional components only, 0 class components)', () => {
  const violations = [];
  const errorBoundary = path.normalize('frontend/src/components/common/ErrorBoundary.tsx');
  const tsxFiles = filterFiles((f) => f.startsWith('frontend' + path.sep + 'src') && f.endsWith('.tsx') && f !== errorBoundary);

  for (const f of tsxFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (/\bclass\s+\w+\s+extends\s+(React\.)?(Component|PureComponent)\b/.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} defines class component (only ErrorBoundary may be a class)`);
      }
    });
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 15: Rule 25 - React Fast Refresh compatibility
// -------------------------------------------------------------
runGate(15, 'Rule 25 (Fast Refresh: no export type { in components/contexts)', () => {
  const violations = [];
  const targetFiles = filterFiles((f) => (f.includes(path.normalize('frontend/src/contexts')) || f.includes(path.normalize('frontend/src/components'))) && (f.endsWith('.ts') || f.endsWith('.tsx')));

  for (const f of targetFiles) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    cleaned.split(/\r?\n/).forEach((line, idx) => {
      const codeOnly = line.replace(/\/\/.*$/, '');
      if (/export\s+type\s*(\{|\*)/.test(codeOnly)) {
        violations.push(`${f}:${idx + 1} re-exports type with 'export type {' (breaks Fast Refresh)`);
      }
    });
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 16: Section 13 Antipattern - Prop naming convention (onX, not handleX)
// -------------------------------------------------------------
runGate(16, 'Section 13 Antipattern (Prop naming: handleX forbidden in interfaces)', () => {
  const violations = [];
  const files = filterFiles((f) => (f.startsWith('frontend') || f.startsWith('backend')) && (f.endsWith('.ts') || f.endsWith('.tsx')));
  const interfaceRegex = /interface\s+\w+[^{]*\{([^}]+)\}/g;

  for (const f of files) {
    const content = getFileContent(f);
    const cleaned = stripBlockComments(content);
    let match;
    while ((match = interfaceRegex.exec(cleaned)) !== null) {
      const body = match[1];
      const bodyLines = body.split(/\r?\n/);
      bodyLines.forEach((line) => {
        const propMatch = line.match(/^\s*(handle[A-Z]\w*)\??\s*:/);
        if (propMatch) {
          violations.push(`${f} defines interface prop '${propMatch[1]}' (use onX instead of handleX)`);
        }
      });
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 17: Rule 1 - Sequential, collision-free, immutable migrations
// -------------------------------------------------------------
runGate(17, 'Rule 1 (Sequential, collision-free, immutable database migrations)', () => {
  const violations = [];

  // Check for deleted migrations in staged changes
  const deletedMigrations = deletedStagedFiles.filter((f) => f.startsWith('backend' + path.sep + 'migrations') && f.endsWith('.sql'));
  if (deletedMigrations.length > 0) {
    deletedMigrations.forEach((f) => violations.push(`Committed migration ${f} was deleted (migrations are immutable)`));
  }

  // Check baseline immutable migrations (0001 through 0015)
  const stagedMigrations = stagedFiles.filter((f) => f.startsWith('backend' + path.sep + 'migrations') && f.endsWith('.sql'));
  for (const f of stagedMigrations) {
    const basename = path.basename(f);
    const m = basename.match(/^(\d{4})_/);
    if (m && parseInt(m[1], 10) <= 15) {
      violations.push(`Migration ${basename} is in the immutable baseline (0001-0015) and must never be edited`);
    }
  }

  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return ['backend/migrations directory not found'];
  }

  // Check all migration files for naming, duplicates, and sequence gaps
  const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
  const seenNumbers = new Map();
  const numbers = [];

  for (const file of migrationFiles) {
    const match = file.match(/^(\d{4})_(.+)\.sql$/);
    if (!match) {
      violations.push(`Migration ${file} must follow standard 4-digit naming format (NNNN_description.sql)`);
      continue;
    }
    const num = parseInt(match[1], 10);
    if (seenNumbers.has(num)) {
      violations.push(`Duplicate migration number ${match[1]}: both '${seenNumbers.get(num)}' and '${file}' share sequence number`);
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
      violations.push(`Migration sequence gap: expected #${String(expected).padStart(4, '0')} but found #${String(actual).padStart(4, '0')} (${seenNumbers.get(actual)})`);
      break;
    }
  }

  return violations;
});

// -------------------------------------------------------------
// GATE 18: Stage 4 Verification Gate - TypeScript Typechecks
// -------------------------------------------------------------
runGate(18, 'Stage 4 Gate (TypeScript typecheck - Backend & Frontend)', () => {
  const violations = [];
  const hasBackendStaged = checkAll || stagedFiles.some((f) => f.startsWith('backend'));
  const hasFrontendStaged = checkAll || stagedFiles.some((f) => f.startsWith('frontend'));

  // Backend typecheck
  if (hasBackendStaged) {
    try {
      execSync('npm run typecheck', {
        cwd: BACKEND_DIR,
        stdio: 'pipe',
        encoding: 'utf8',
      });
    } catch (err) {
      const msg = (err.stderr || err.stdout || err.message || '').toString().trim();
      const lines = msg.split(/\r?\n/).filter(Boolean);
      if (checkAll) {
        violations.push(`Backend typecheck failed:\n${lines.slice(0, 5).join('\n')}`);
      } else {
        const stagedBackendErrors = lines.filter((l) => stagedFiles.some((sf) => l.includes(path.relative(BACKEND_DIR, sf)) || l.includes(sf)));
        if (stagedBackendErrors.length > 0 || stagedFiles.some((f) => f.startsWith('backend' + path.sep + 'src'))) {
          violations.push(`Backend typecheck failed for staged changes:\n${lines.slice(0, 5).join('\n')}`);
        }
      }
    }
  }

  // Frontend typecheck
  if (hasFrontendStaged) {
    try {
      execSync('npx tsc --noEmit', {
        cwd: FRONTEND_DIR,
        stdio: 'pipe',
        encoding: 'utf8',
      });
    } catch (err) {
      const msg = (err.stderr || err.stdout || err.message || '').toString().trim();
      const lines = msg.split(/\r?\n/).filter(Boolean);
      if (checkAll) {
        violations.push(`Frontend typecheck failed:\n${lines.slice(0, 5).join('\n')}`);
      } else {
        const stagedFrontendErrors = lines.filter((l) => stagedFiles.some((sf) => l.includes(path.relative(FRONTEND_DIR, sf)) || l.includes(sf)));
        if (stagedFrontendErrors.length > 0 || stagedFiles.some((f) => f.startsWith('frontend' + path.sep + 'src'))) {
          violations.push(`Frontend typecheck failed for staged changes:\n${lines.slice(0, 5).join('\n')}`);
        }
      }
    }
  }

  return violations;
});

// -------------------------------------------------------------
// Summary and Exit Code
// -------------------------------------------------------------
console.log(`\n${C.cyan}-------------------------------------------------------------${C.reset}`);
const failed = results.filter((r) => !r.passed);
const executed = results.filter((r) => !r.skipped);

if (failed.length === 0) {
  console.log(`${C.bold}${C.green}✔ ALL ${executed.length} VERIFICATION GATES PASSED! Commit approved.${C.reset}`);
  if (isQuick) {
    console.log(`${C.yellow}Note: Ran in QUICK mode (Gate 18 skipped).${C.reset}`);
  }
  process.exit(0);
} else {
  console.log(`${C.bold}${C.red}✖ ${failed.length} OF ${executed.length} EXECUTED GATES FAILED! Commit blocked.${C.reset}`);
  console.log(`${C.yellow}Fix the violations above according to AGENTS.md before committing.${C.reset}\n`);
  failed.forEach((f) => {
    console.log(`  ${C.red}[Gate ${String(f.id).padStart(2, '0')}] ${f.name} — ${f.violations.length} violation(s)${C.reset}`);
  });
  process.exit(1);
}
