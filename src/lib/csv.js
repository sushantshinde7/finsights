export const REQUIRED_HEADERS = ["Date", "Category", "Amount", "Type"];
export const MAX_FILE_BYTES = 1024 * 1024; // 1 MB
export const MAX_ROWS = 5000;

const VALID_TYPES = ["income", "expense"];

/* ---------- 1. text → table of cells ----------
   Handles quoted values ("Food, Dining"), escaped quotes ("") and
   both Windows (\r\n) and Unix (\n) line endings. */
export function parseCSV(text) {
  const table = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      table.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }

  if (cell !== "" || row.length > 0) {
    row.push(cell);
    table.push(row);
  }

  return table;
}

const isBlank = (cells) => cells.every((c) => c.trim() === "");

// "2026-02-31" matches the pattern but isn't a real date.
const isRealDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
};

/* ---------- 2. one row → valid transaction, or a reason ---------- */
function checkRow(cells) {
  if (cells.length !== REQUIRED_HEADERS.length) {
    return { error: `expected 4 columns, found ${cells.length}` };
  }

  const [dateRaw, categoryRaw, amountRaw, typeRaw] = cells.map((c) => c.trim());

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateRaw) || !isRealDate(dateRaw)) {
    return { error: `invalid date "${dateRaw}" (use YYYY-MM-DD)` };
  }

  if (!categoryRaw) {
    return { error: "category is empty" };
  }

  if (!/^\d+(\.\d+)?$/.test(amountRaw) || Number(amountRaw) <= 0) {
    return { error: `invalid amount "${amountRaw}"` };
  }

  const type = typeRaw.toLowerCase();
  if (!VALID_TYPES.includes(type)) {
    return { error: `invalid type "${typeRaw}" (use Income or Expense)` };
  }

  return {
    row: {
      date: dateRaw,
      category: categoryRaw,
      amount: Number(amountRaw),
      type,
    },
  };
}

/* ---------- 3. whole file text → result ----------
   { ok: false, error }                  → reject the file
   { ok: true, rows, skipped }           → rows are clean; skipped lists
                                           { row, reason } for each bad one */
export function validateTransactionsCSV(text) {
  const table = parseCSV(text.replace(/^\uFEFF/, "")); // strip Excel's BOM

  const headerIndex = table.findIndex((cells) => !isBlank(cells));
  if (headerIndex === -1) {
    return { ok: false, error: "That file is empty." };
  }

  const header = table[headerIndex].map((c) => c.trim());
  const headerOk =
    header.length === REQUIRED_HEADERS.length &&
    header.every((h, i) => h.toLowerCase() === REQUIRED_HEADERS[i].toLowerCase());

  if (!headerOk) {
    return {
      ok: false,
      error: `The first row must be exactly: ${REQUIRED_HEADERS.join(", ")}.`,
    };
  }

  const rows = [];
  const skipped = [];

  table.slice(headerIndex + 1).forEach((cells, i) => {
    if (isBlank(cells)) return; // blank lines are ignored, not "skipped"

    const rowNumber = headerIndex + i + 2; // line number as seen in the file
    const result = checkRow(cells);

    if (result.error) {
      skipped.push({ row: rowNumber, reason: result.error });
    } else {
      rows.push(result.row);
    }
  });

  if (rows.length > MAX_ROWS) {
    return {
      ok: false,
      error: `That file has too many rows (max ${MAX_ROWS.toLocaleString("en-IN")}).`,
    };
  }

  return { ok: true, rows, skipped };
}

/* ---------- 4. filename → dataset name ---------- */
export function datasetNameFromFile(filename) {
  const name = filename.replace(/\.csv$/i, "").trim().slice(0, 40);
  return name || "Imported Dataset";
}

/* =========================================================
   EXPORT
========================================================= */

const BOM = "\uFEFF"; // lets Excel show non-English characters correctly

// Quote a value if it contains a comma, quote or line break.
// "Food, Dining" → "Food, Dining" (quoted); say "hi" → "say ""hi"""
const escapeCell = (value) => {
  const s = String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function transactionsToCSV(transactions) {
  const lines = [REQUIRED_HEADERS.join(",")];

  transactions.forEach((t) => {
    lines.push(
      [
        t.date,
        t.category,
        t.amount,
        t.type === "income" ? "Income" : "Expense",
      ]
        .map(escapeCell)
        .join(",")
    );
  });

  return BOM + lines.join("\r\n") + "\r\n";
}

// "Personal Finance" → finsights-personal-finance-2026-10-23.csv
export function exportFileName(datasetName, date = new Date()) {
  const slug =
    datasetName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "dataset";

  const pad = (n) => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  return `finsights-${slug}-${day}.csv`;
}

export function downloadCSV(csvText, filename) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* =========================================================
   TEMPLATE
   Built with the same writer as Export, and the dialog's example
   table reads the same rows, so spec and download can't disagree.
========================================================= */

export const TEMPLATE_FILE_NAME = "finsights-import-template.csv";

const TEMPLATE_ROWS = [
  { daysAgo: 4, category: "Salary", amount: 50000, type: "income" },
  { daysAgo: 3, category: "Rent", amount: 15000, type: "expense" },
  { daysAgo: 2, category: "Groceries", amount: 3200, type: "expense" },
  { daysAgo: 1, category: "Freelance", amount: 8000, type: "income" },
  { daysAgo: 0, category: "Utilities", amount: 2100, type: "expense" },
];

const localISODate = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Dates are relative to today, so the imported rows show up under
// filters like "Last 7 days".
export function getTemplateRows(today = new Date()) {
  return TEMPLATE_ROWS.map(({ daysAgo, ...rest }) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return { date: localISODate(d), ...rest };
  });
}

export function downloadTemplate() {
  downloadCSV(transactionsToCSV(getTemplateRows()), TEMPLATE_FILE_NAME);
}