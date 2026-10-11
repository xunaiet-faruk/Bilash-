"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, SUPPLIERS, getProductOptions, bulkImportProducts } from "./productApi";

/* ============================================================
   CONFIG
   ============================================================ */
const MAX_ROWS = 1000;
const MAX_BYTES = 5 * 1024 * 1024;
const PAGE_SIZE = 25;

// key = internal (camelCase, same as single form / API payload)
// header = CSV template header, aliases = other names we accept
const COLUMNS = [
  { key: "name", header: "name", required: true, aliases: ["name", "product_name", "title"], note: "Product name" },
  { key: "sku", header: "sku", aliases: ["sku", "code"], note: "Unique code. Leave empty to auto-generate" },
  { key: "category", header: "category", required: true, aliases: ["category"], note: "Must match an existing category" },
  { key: "supplier", header: "supplier", required: true, aliases: ["supplier", "vendor"], note: "Must match an existing supplier" },
  { key: "description", header: "description", aliases: ["description", "details"], note: "Plain text" },
  { key: "costPrice", header: "cost_price", required: true, aliases: ["cost_price", "cost", "costprice"], note: "What you pay, in ৳" },
  { key: "wholesalePrice", header: "wholesale_price", aliases: ["wholesale_price", "wholesale"], note: "For resellers, in ৳" },
  { key: "sellingPrice", header: "selling_price", required: true, aliases: ["selling_price", "price", "sale_price", "sellingprice"], note: "Customer price, in ৳" },
  { key: "stock", header: "stock", required: true, aliases: ["stock", "quantity", "qty"], note: "Whole number" },
  { key: "weight", header: "weight", aliases: ["weight", "weight_kg"], note: "In kg" },
  { key: "tags", header: "tags", aliases: ["tags"], note: "Separate with | or ;" },
  { key: "imageUrl", header: "image_url", aliases: ["image_url", "image"], note: "Public link starting with http" },
];

/* ============================================================
   HELPERS
   ============================================================ */
const normHeader = (h) =>
  String(h ?? "").replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

const clean = (v) => String(v ?? "").trim();

const toNum = (s) => {
  const t = clean(s).replace(/[,৳\s]/g, "");
  return t === "" ? NaN : Number(t);
};

const canonical = (list, value) => list.find((x) => x.toLowerCase() === clean(value).toLowerCase());

const formatSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

const csvEscape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function downloadCsv(filename, lines) {
  // BOM thakle Excel e Bangla/unicode thik dekhay
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadTemplate() {
  downloadCsv("product-template.csv", [
    COLUMNS.map((c) => c.header).join(","),
    [
      "Wireless Mouse", "WM-001", "Accessories", "Tech Hub BD", "Silent click mouse",
      "450", "550", "750", "85", "0.2", "wireless|office", "",
    ].map(csvEscape).join(","),
    [
      "Laptop Stand", "LS-002", "Accessories", "Gadget Store", "Ergonomic aluminium stand",
      "550", "650", "900", "40", "0.8", "", "",
    ].map(csvEscape).join(","),
  ]);
}

/* ---------- File -> records (library gulo dynamic import, tai bundle chhoto thake) ---------- */
async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "csv") {
    const Papa = (await import("papaparse")).default;
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: normHeader,
        complete: (r) => resolve({ headers: r.meta.fields || [], records: r.data }),
        error: reject,
      });
    });
  }

  if (ext === "xlsx" || ext === "xls") {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(await file.arrayBuffer());
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
    const records = json.map((o) =>
      Object.fromEntries(Object.entries(o).map(([k, v]) => [normHeader(k), v]))
    );
    return { headers: Object.keys(records[0] || {}), records };
  }

  throw new Error("Unsupported file type. Upload a .csv, .xlsx or .xls file.");
}

/* ---------- records -> rows ---------- */
function buildRows(headers, records) {
  const present = new Set(headers);
  const missing = COLUMNS.filter((c) => c.required && !c.aliases.some((a) => present.has(a)));
  if (missing.length) {
    throw new Error(
      `Missing required column${missing.length > 1 ? "s" : ""}: ${missing.map((c) => c.header).join(", ")}. Download the template to see the expected format.`
    );
  }
  return records.map((rec, i) => {
    const data = {};
    COLUMNS.forEach((c) => {
      const k = c.aliases.find((a) => a in rec);
      data[c.key] = k ? clean(rec[k]) : "";
    });
    return { id: i, line: i + 2, data }; // line 1 = header
  });
}

/* ---------- validation ---------- */
function validateRow(d, options, dupSkus) {
  const errors = {};
  const warnings = [];

  if (!d.name) errors.name = "Name is required";

  if (!d.category) errors.category = "Category is required";
  else if (options.categories.length && !canonical(options.categories, d.category))
    errors.category = `Unknown category “${d.category}”`;

  if (!d.supplier) errors.supplier = "Supplier is required";
  else if (options.suppliers.length && !canonical(options.suppliers, d.supplier))
    errors.supplier = `Unknown supplier “${d.supplier}”`;

  const cost = toNum(d.costPrice);
  const sell = toNum(d.sellingPrice);
  const whole = toNum(d.wholesalePrice);

  if (!(cost > 0)) errors.costPrice = "Cost must be above 0";
  if (!(sell > 0)) errors.sellingPrice = "Selling price must be above 0";
  else if (cost > 0 && sell <= cost) errors.sellingPrice = "Selling price must be higher than cost";

  if (d.wholesalePrice !== "") {
    if (!(whole > 0)) errors.wholesalePrice = "Wholesale price must be above 0";
    else if (cost > 0 && sell > 0 && (whole < cost || whole > sell))
      warnings.push("Wholesale price is outside cost–selling range");
  }

  const stock = toNum(d.stock);
  if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number, 0 or more";

  if (d.weight !== "" && !(toNum(d.weight) > 0)) errors.weight = "Weight must be above 0";

  if (d.imageUrl && !/^https?:\/\//i.test(d.imageUrl)) errors.imageUrl = "Image link must start with http";

  if (d.sku && dupSkus.has(d.sku.toLowerCase())) errors.sku = "Duplicate SKU in this file";

  if (cost > 0 && sell > cost && (sell - cost) / sell < 0.15) warnings.push("Margin under 15%");

  return { errors, warnings };
}

/* ---------- row -> API payload (same shape as single form) ---------- */
function toPayload(d, options) {
  return {
    name: d.name,
    sku: d.sku,
    category: canonical(options.categories, d.category) || d.category,
    supplier: canonical(options.suppliers, d.supplier) || d.supplier,
    description: d.description,
    tags: d.tags.split(/[|;]/).map((t) => t.trim()).filter(Boolean),
    costPrice: toNum(d.costPrice),
    wholesalePrice: d.wholesalePrice === "" ? null : toNum(d.wholesalePrice),
    sellingPrice: toNum(d.sellingPrice),
    stock: toNum(d.stock),
    weight: d.weight === "" ? null : toNum(d.weight),
    imageUrl: d.imageUrl || null,
  };
}

/* ============================================================
   ICON
   ============================================================ */
const PATHS = {
  upload: "M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3",
  download: "M12 4v12m0 0l-4-4m4 4l4-4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3",
  check: "M5 13l4 4L19 7",
  alert: "M12 9v4m0 4h.01M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z",
  x: "M6 6l12 12M18 6L6 18",
  file: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
};
function Icon({ name, className = "h-4 w-4", stroke = 2 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} className={className} aria-hidden="true">
      <path d={PATHS[name]} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const btnPrimary =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:cursor-not-allowed disabled:bg-ink/10 disabled:text-ink/35";
const btnSecondary =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink/75 transition-colors hover:bg-brand-cream";

/* ============================================================
   MAIN
   ============================================================ */
export default function BulkImportSection({ onSuccess }) {
  const router = useRouter();
  const [phase, setPhase] = useState("upload"); // upload | parsing | review | importing | done
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]); // [{ id, line, data }]
  const [options, setOptions] = useState({ categories: CATEGORIES, suppliers: SUPPLIERS });
  const [parseError, setParseError] = useState(null);
  const [importError, setImportError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | errors | ready
  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    getProductOptions().then(setOptions).catch(() => {});
  }, []);

  // Import cholar somoy tab close korle warning
  useEffect(() => {
    if (phase !== "importing") return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  /* ---------- validated rows (edit korle auto re-validate) ---------- */
  const checked = useMemo(() => {
    const count = new Map();
    rows.forEach((r) => {
      const s = r.data.sku.toLowerCase();
      if (s) count.set(s, (count.get(s) || 0) + 1);
    });
    const dups = new Set([...count].filter(([, n]) => n > 1).map(([s]) => s));
    return rows.map((r) => {
      const v = validateRow(r.data, options, dups);
      return { ...r, ...v, valid: Object.keys(v.errors).length === 0 };
    });
  }, [rows, options]);

  const readyRows = checked.filter((r) => r.valid);
  const errorRows = checked.filter((r) => !r.valid);

  const visible = checked.filter((r) => (filter === "all" ? true : filter === "errors" ? !r.valid : r.valid));
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = visible.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  /* ---------- actions ---------- */
  const reset = () => {
    setPhase("upload");
    setFile(null);
    setRows([]);
    setResult(null);
    setParseError(null);
    setImportError(null);
    setFilter("all");
    setPage(0);
  };

  const handleFile = async (f) => {
    if (!f) return;
    setParseError(null);

    if (f.size > MAX_BYTES) {
      setParseError(`File is ${formatSize(f.size)}. The limit is 5 MB.`);
      return;
    }
    setFile(f);
    setPhase("parsing");
    try {
      const { headers, records } = await readFile(f);
      if (records.length === 0) throw new Error("The file has no data rows.");
      if (records.length > MAX_ROWS)
        throw new Error(`The file has ${records.length} rows. The limit is ${MAX_ROWS} per import. Split it into smaller files.`);
      const built = buildRows(headers, records);
      setRows(built);
      setFilter("all");
      setPage(0);
      setPhase("review");
    } catch (err) {
      setParseError(err?.message || "Could not read this file.");
      setFile(null);
      setPhase("upload");
    }
  };

  const updateCell = (id, key, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, data: { ...r.data, [key]: value } } : r)));

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleImport = async () => {
    const ready = readyRows;
    const skipped = errorRows.map((r) => ({
      line: r.line,
      name: r.data.name,
      sku: r.data.sku,
      reason: Object.values(r.errors).join("; "),
    }));

    setImportError(null);
    setProgress({ done: 0, total: ready.length });
    setPhase("importing");

    try {
      const res = await bulkImportProducts(
        ready.map((r) => toPayload(r.data, options)),
        { onProgress: (done) => setProgress((p) => ({ ...p, done })) }
      );
      const failed = res.failed.map((f) => ({
        line: ready[f.index]?.line,
        name: ready[f.index]?.data.name,
        sku: ready[f.index]?.data.sku,
        reason: f.message,
      }));
      setResult({ created: res.created, problems: [...skipped, ...failed], skipped: skipped.length, failed: failed.length });
      setPhase("done");
      onSuccess?.(`${res.created} product${res.created === 1 ? "" : "s"} imported`);
    } catch (err) {
      setImportError(err?.message || "Import failed. Nothing was lost, you can try again.");
      setPhase("review");
    }
  };

  const downloadProblems = () =>
    downloadCsv("import-problems.csv", [
      "row,name,sku,reason",
      ...result.problems.map((p) => [p.line, p.name, p.sku, p.reason].map(csvEscape).join(",")),
    ]);

  const stepIndex = { upload: 0, parsing: 0, review: 1, importing: 2, done: 3 }[phase];

  return (
    <div className="flex flex-col gap-6">
      <Stepper current={stepIndex} />

      {/* ================= UPLOAD ================= */}
      {(phase === "upload" || phase === "parsing") && (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-4">
            {parseError && (
              <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{parseError}</p>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />

            {phase === "parsing" ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-white py-20 text-center">
                <span className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-brand-orange" />
                <div>
                  <p className="text-sm font-semibold text-brand-navy">Reading {file?.name}</p>
                  <p className="mt-1 text-xs text-ink/50">Checking every row. This takes a few seconds.</p>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-20 text-center outline-none transition-colors focus-visible:border-brand-orange ${
                  dragging
                    ? "border-brand-orange bg-brand-orange/5"
                    : "border-line bg-white hover:border-brand-orange hover:bg-brand-orange/5"
                }`}
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-orange/10 text-brand-orange">
                  <Icon name="upload" className="h-7 w-7" stroke={1.8} />
                </span>
                <div>
                  <p className="text-base font-semibold text-brand-navy">Drop your file here</p>
                  <p className="mt-1 text-sm text-ink/55">
                    or <span className="font-semibold text-brand-orange">browse from your computer</span>
                  </p>
                </div>
                <p className="text-xs text-ink/45">CSV, XLSX or XLS · up to 5 MB · up to {MAX_ROWS} products</p>
              </div>
            )}
          </div>

          {/* Template + column guide */}
          <aside className="rounded-2xl border border-line bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-line p-4">
              <div>
                <p className="text-sm font-semibold text-brand-navy">Start from the template</p>
                <p className="mt-0.5 text-xs text-ink/55">Open it in Excel or Google Sheets, fill it in, upload it back.</p>
              </div>
            </div>
            <div className="p-4">
              <button type="button" onClick={downloadTemplate} className={`${btnSecondary} w-full`}>
                <Icon name="download" />
                Download template
              </button>
              <ul className="mt-4 flex flex-col divide-y divide-line">
                {COLUMNS.map((c) => (
                  <li key={c.key} className="flex items-start justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold text-ink">{c.header}</p>
                      <p className="text-xs text-ink/50">{c.note}</p>
                    </div>
                    <span
                      className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                        c.required ? "bg-brand-navy text-white" : "bg-ink/5 text-ink/50"
                      }`}
                    >
                      {c.required ? "Required" : "Optional"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      )}

      {/* ================= REVIEW ================= */}
      {phase === "review" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-teal/10 text-brand-teal">
                <Icon name="file" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{file?.name}</p>
                <p className="text-xs text-ink/50">{file ? formatSize(file.size) : ""}</p>
              </div>
            </div>
            <button type="button" onClick={reset} className="cursor-pointer text-sm font-semibold text-brand-orange hover:underline">
              Choose a different file
            </button>
          </div>

          {/* Summary strip */}
          <dl className="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-white">
            <div className="p-4">
              <dt className="text-xs text-ink/55">Rows found</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">{rows.length}</dd>
            </div>
            <div className="p-4">
              <dt className="text-xs text-ink/55">Ready to import</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-teal">{readyRows.length}</dd>
            </div>
            <div className="p-4">
              <dt className="text-xs text-ink/55">Need fixing</dt>
              <dd className={`mt-1 text-2xl font-bold tabular-nums ${errorRows.length ? "text-red-600" : "text-ink"}`}>
                {errorRows.length}
              </dd>
            </div>
          </dl>

          {importError && (
            <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{importError}</p>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="flex gap-1" role="tablist" aria-label="Filter rows">
                {[
                  ["all", `All (${rows.length})`],
                  ["errors", `Need fixing (${errorRows.length})`],
                  ["ready", `Ready (${readyRows.length})`],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={filter === id}
                    onClick={() => { setFilter(id); setPage(0); }}
                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      filter === id ? "bg-brand-navy text-white" : "text-ink/60 hover:bg-brand-cream"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink/50">Click any cell to fix it. Rows re-check as you type.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="bg-brand-cream text-left text-xs font-semibold text-ink/60">
                  <tr>
                    <th className="w-14 px-3 py-2.5">Row</th>
                    <th className="px-1 py-2.5">Name</th>
                    <th className="px-1 py-2.5">SKU</th>
                    <th className="px-1 py-2.5">Category</th>
                    <th className="px-1 py-2.5">Supplier</th>
                    <th className="px-1 py-2.5 text-right">Cost</th>
                    <th className="px-1 py-2.5 text-right">Selling</th>
                    <th className="px-1 py-2.5 text-right">Stock</th>
                    <th className="px-3 py-2.5">Issues</th>
                    <th className="w-10 px-2 py-2.5"><span className="sr-only">Remove</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-12 text-center text-sm text-ink/50">
                        {filter === "errors" ? "No rows need fixing. You're good to import." : "No rows to show."}
                      </td>
                    </tr>
                  )}
                  {pageRows.map((r) => (
                    <tr key={r.id} className={r.valid ? "" : "bg-red-50/40"}>
                      <td className="px-3 py-1.5 text-xs tabular-nums text-ink/45">{r.line}</td>
                      <Cell row={r} k="name" onChange={updateCell} wide />
                      <Cell row={r} k="sku" onChange={updateCell} mono />
                      <Cell row={r} k="category" onChange={updateCell} list="bulk-categories" />
                      <Cell row={r} k="supplier" onChange={updateCell} list="bulk-suppliers" />
                      <Cell row={r} k="costPrice" onChange={updateCell} right />
                      <Cell row={r} k="sellingPrice" onChange={updateCell} right />
                      <Cell row={r} k="stock" onChange={updateCell} right />
                      <td className="px-3 py-1.5 text-xs">
                        {Object.values(r.errors).map((m, i) => (
                          <p key={i} className="text-red-600">{m}</p>
                        ))}
                        {r.warnings.map((m, i) => (
                          <p key={i} className="text-brand-orange-dark">{m}</p>
                        ))}
                        {r.valid && r.warnings.length === 0 && (
                          <span className="inline-flex items-center gap-1 text-brand-teal">
                            <Icon name="check" className="h-3 w-3" stroke={3} /> OK
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1.5">
                        <button
                          type="button"
                          onClick={() => removeRow(r.id)}
                          aria-label={`Remove row ${r.line}`}
                          className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-ink/35 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="x" className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <datalist id="bulk-categories">{options.categories.map((c) => <option key={c} value={c} />)}</datalist>
            <datalist id="bulk-suppliers">{options.suppliers.map((s) => <option key={s} value={s} />)}</datalist>

            {pageCount > 1 && (
              <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-ink/60">
                <span>
                  Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, visible.length)} of {visible.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={safePage === 0}
                    onClick={() => setPage(safePage - 1)}
                    aria-label="Previous page"
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-line hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon name="left" />
                  </button>
                  <span className="px-2 tabular-nums">{safePage + 1} / {pageCount}</span>
                  <button
                    type="button"
                    disabled={safePage >= pageCount - 1}
                    onClick={() => setPage(safePage + 1)}
                    aria-label="Next page"
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-line hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon name="right" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-lg">
            <div className="text-sm">
              <p className="font-semibold text-brand-navy">
                Import {readyRows.length} of {rows.length} products
              </p>
              {errorRows.length > 0 && (
                <p className="text-xs text-ink/55">
                  {errorRows.length} row{errorRows.length > 1 ? "s" : ""} with errors will be skipped.{" "}
                  <button type="button" onClick={() => { setFilter("errors"); setPage(0); }} className="cursor-pointer font-semibold text-brand-orange hover:underline">
                    Review them
                  </button>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={reset} className={btnSecondary}>Cancel</button>
              <button type="button" onClick={handleImport} disabled={readyRows.length === 0} className={btnPrimary}>
                Import {readyRows.length} product{readyRows.length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= IMPORTING ================= */}
      {phase === "importing" && (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-line bg-white px-8 py-16 text-center">
          <p className="text-base font-semibold text-brand-navy">Importing products</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-brand-orange transition-all duration-500"
              style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
          <p className="text-sm tabular-nums text-ink/60">
            {progress.done} of {progress.total}
          </p>
          <p className="text-xs text-ink/45">Keep this page open until it finishes.</p>
        </div>
      )}

      {/* ================= DONE ================= */}
      {phase === "done" && result && (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-2xl border border-line bg-white px-8 py-14 text-center">
          <span className={`grid h-14 w-14 place-items-center rounded-full text-white ${result.created > 0 ? "bg-brand-teal" : "bg-red-500"}`}>
            <Icon name={result.created > 0 ? "check" : "alert"} className="h-7 w-7" stroke={2.5} />
          </span>
          <div>
            <p className="text-xl font-bold text-brand-navy">
              {result.created > 0
                ? `${result.created} product${result.created === 1 ? "" : "s"} imported`
                : "No products were imported"}
            </p>
            {result.problems.length > 0 && (
              <p className="mt-1.5 text-sm text-ink/60">
                {result.skipped > 0 && `${result.skipped} skipped because of errors`}
                {result.skipped > 0 && result.failed > 0 && " · "}
                {result.failed > 0 && `${result.failed} rejected by the server`}
              </p>
            )}
          </div>

          {result.problems.length > 0 && (
            <button type="button" onClick={downloadProblems} className={btnSecondary}>
              <Icon name="download" />
              Download problem rows
            </button>
          )}

          <div className="flex flex-wrap justify-center gap-3 border-t border-line pt-6 w-full">
            <button type="button" onClick={reset} className={btnSecondary}>Import another file</button>
            <button type="button" onClick={() => router.push("/admin/dashboard/products")} className={btnPrimary}>
              View products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Stepper (ekta sequence, tai number thik ache)
   ============================================================ */
function Stepper({ current }) {
  const steps = ["Upload file", "Review rows", "Import"];
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3 last:flex-none">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                done ? "bg-brand-teal text-white" : active ? "bg-brand-navy text-white" : "bg-ink/10 text-ink/45"
              }`}
            >
              {done ? <Icon name="check" className="h-3.5 w-3.5" stroke={3} /> : i + 1}
            </span>
            <span className={`text-sm font-semibold ${active ? "text-brand-navy" : done ? "text-ink/70" : "text-ink/40"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <span className={`h-px flex-1 ${done ? "bg-brand-teal" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

/* ============================================================
   Editable table cell
   ============================================================ */
function Cell({ row, k, onChange, right, mono, wide, list }) {
  const err = row.errors[k];
  return (
    <td className="px-1 py-1.5">
      <input
        value={row.data[k]}
        list={list}
        onChange={(e) => onChange(row.id, k, e.target.value)}
        title={err}
        aria-invalid={!!err}
        placeholder={err ? "Missing" : ""}
        className={`w-full rounded-md border bg-transparent px-2 py-1.5 text-sm text-ink outline-none transition-colors placeholder:text-red-400 focus:border-brand-orange focus:bg-white ${
          err ? "border-red-300 bg-red-50" : "border-transparent hover:border-line"
        } ${right ? "text-right tabular-nums" : ""} ${mono ? "font-mono text-xs" : ""} ${wide ? "min-w-[180px]" : "min-w-[90px]"}`}
      />
    </td>
  );
}