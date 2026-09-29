// scripts/audit_compliance.cjs
// Responsibility: Comprehensive compliance verification script for all architectural rules in AGENTS.md

const fs = require("fs");
const path = require("path");

function getFiles(dir, exts) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, exts));
    } else if (exts.some((ext) => file.endsWith(ext))) {
      results.push(fullPath);
    }
  });
  return results;
}

const frontendFiles = getFiles("frontend/src", [".ts", ".tsx"]);
const backendFiles = getFiles("backend/src", [".js", ".ts"]);

console.log("=== FULL COMPLIANCE AUDIT ===\n");

// 1. Rule 20: 100-line hard limit on .ts/.tsx files
const over100 = frontendFiles.filter(
  (f) => fs.readFileSync(f, "utf8").split("\n").length > 100,
);
console.log("Rule 20 (Files > 100 lines):", over100.length);
if (over100.length > 0) {
  over100.forEach((f) =>
    console.log(
      "  > " +
        f +
        " (" +
        fs.readFileSync(f, "utf8").split("\n").length +
        " lines)",
    ),
  );
}

// 2. Rule 13: Raw HTML outside components/ui
const rawHtmlTags = [
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
  "ul",
  "ol",
  "li",
  "a",
  "label",
  "strong",
  "em",
  "b",
  "i",
  "form",
  "nav",
  "header",
  "footer",
  "main",
  "section",
  "article",
  "aside",
  "small",
];
const tagRegex = new RegExp(
  "<(\\/?)(" + rawHtmlTags.join("|") + ")(\\s|\\/|>|$)",
  "",
);
const nonUiFiles = frontendFiles.filter(
  (f) => !f.includes(path.join("components", "ui")),
);
let rawHtmlViolations = [];
nonUiFiles.forEach((f) => {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((l, idx) => {
    const trimmed = l.trim();
    if (
      !trimmed.startsWith("//") &&
      !trimmed.startsWith("/*") &&
      !trimmed.startsWith("*")
    ) {
      if (tagRegex.test(trimmed)) {
        rawHtmlViolations.push(f + ":" + (idx + 1) + " " + trimmed);
      }
    }
  });
});
console.log("Rule 13 (Raw HTML outside ui/):", rawHtmlViolations.length);
if (rawHtmlViolations.length > 0) {
  rawHtmlViolations.slice(0, 10).forEach((v) => console.log("  > " + v));
}

// 3. Rule 10: Direct supabase.from / rpc in frontend
let directSupabase = [];
frontendFiles.forEach((f) => {
  const content = fs.readFileSync(f, "utf8");
  if (content.includes("supabase.from(") || content.includes("supabase.rpc(")) {
    directSupabase.push(f);
  }
});
console.log(
  "Rule 10 (Direct Supabase queries in frontend):",
  directSupabase.length,
);

// 4. Rule 19: Single responsibility comment at line 1
let missingHeaders = [];
[...frontendFiles, ...backendFiles].forEach((f) => {
  const firstLine = fs.readFileSync(f, "utf8").split("\n")[0].trim();
  if (!firstLine.startsWith("//") && !firstLine.startsWith("/*")) {
    missingHeaders.push(f);
  }
});
console.log(
  "Rule 19 (Files missing line 1 header comment):",
  missingHeaders.length,
);
if (missingHeaders.length > 0) {
  missingHeaders.forEach((f) => console.log("  > " + f));
}

// 5. Rule 11: Explicit unvalidated any types
let anyViolations = [];
frontendFiles.forEach((f) => {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((l, idx) => {
    const trimmed = l.trim();
    if (
      !trimmed.startsWith("//") &&
      !trimmed.startsWith("/*") &&
      !trimmed.startsWith("*")
    ) {
      if (/(:\s*any\b|<any>|\bas\s+any\b)/.test(trimmed)) {
        anyViolations.push(f + ":" + (idx + 1) + " " + trimmed);
      }
    }
  });
});
console.log(
  "Rule 11 (Unvalidated any types in frontend):",
  anyViolations.length,
);
if (anyViolations.length > 0) {
  anyViolations.forEach((v) => console.log("  > " + v));
}

// 6. Rule 2: Insert-only ledger updates/deletes in backend
const ledgers = [
  "payments",
  "stock_transactions",
  "prescriptions",
  "prescription_items",
  "lab_results",
];
let ledgerViolations = [];
backendFiles.forEach((f) => {
  const content = fs.readFileSync(f, "utf8");
  ledgers.forEach((table) => {
    const updatePattern = "from('" + table + "').update";
    const updatePattern2 = 'from("' + table + '").update';
    const deletePattern = "from('" + table + "').delete";
    const deletePattern2 = 'from("' + table + '").delete';
    if (
      content.includes(updatePattern) ||
      content.includes(updatePattern2) ||
      content.includes(deletePattern) ||
      content.includes(deletePattern2)
    ) {
      ledgerViolations.push(f + " on " + table);
    }
  });
});
console.log(
  "Rule 2 (Insert-only ledger UPDATE/DELETE violations):",
  ledgerViolations.length,
);

console.log("\n=== AUDIT COMPLETE ===");
