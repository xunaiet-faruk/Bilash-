"use client";

import { useRef, useState } from "react";

/* ============================================================
   TEMPLATE COLUMNS
   ============================================================ */
const COLUMNS = [
  "name", "sku", "category", "supplier", "description",
  "cost_price", "wholesale_price", "selling_price", "stock", "weight",
];

/* ============================================================
   FAKE PARSED DATA
   🔸 এটা API connect করার পর real parser দিয়ে replace করবা
   ============================================================ */
const FAKE_PARSED_DATA = [
  {
    name: "Wireless Earbuds Pro X",
    sku: "WE-001",
    category: "Electronics",
    supplier: "Tech Hub BD",
    description: "Premium wireless earbuds",
    cost_price: "500",
    wholesale_price: "600",
    selling_price: "850",
    stock: "50",
    weight: "0.3",
  },
  {
    name: "Smart Watch Series 3",
    sku: "SW-003",
    category: "Electronics",
    supplier: "Tech Hub BD",
    description: "Fitness tracking smartwatch",
    cost_price: "1200",
    wholesale_price: "1500",
    selling_price: "1800",
    stock: "30",
    weight: "0.4",
  },
  {
    name: "USB-C Hub 7-in-1",
    sku: "UH-004",
    category: "Accessories",
    supplier: "Gadget Store",
    description: "Multi-port hub",
    cost_price: "800",
    wholesale_price: "1000",
    selling_price: "1200",
    stock: "75",
    weight: "0.5",
  },
  {
    name: "Mechanical Keyboard RGB",
    sku: "MK-005",
    category: "Electronics",
    supplier: "Tech Hub BD",
    description: "Gaming keyboard",
    cost_price: "2200",
    wholesale_price: "2600",
    selling_price: "3200",
    stock: "20",
    weight: "1.2",
  },
  {
    name: "Laptop Stand Aluminum",
    sku: "LS-006",
    category: "Accessories",
    supplier: "Gadget Store",
    description: "Ergonomic stand",
    cost_price: "550",
    wholesale_price: "650",
    selling_price: "900",
    stock: "40",
    weight: "0.8",
  },
  {
    name: "Bluetooth Speaker Mini",
    sku: "BS-007",
    category: "Electronics",
    supplier: "Audio Zone",
    description: "Portable speaker",
    cost_price: "1500",
    wholesale_price: "1700",
    selling_price: "2100",
    stock: "12",
    weight: "0.6",
  },
  {
    name: "Wireless Mouse Silent",
    sku: "WM-008",
    category: "Accessories",
    supplier: "Tech Hub BD",
    description: "Silent click mouse",
    cost_price: "450",
    wholesale_price: "550",
    selling_price: "750",
    stock: "85",
    weight: "0.2",
  },
  // ❌ Invalid rows (errors)
  {
    name: "",
    sku: "US-002",
    category: "",
    supplier: "",
    description: "No name provided",
    cost_price: "800",
    wholesale_price: "",
    selling_price: "1000",
    stock: "",
    weight: "0.5",
  },
  {
    name: "Webcam HD 1080p",
    sku: "WC-009",
    category: "Electronics",
    supplier: "Camera World",
    description: "HD webcam",
    cost_price: "1800",
    wholesale_price: "2000",
    selling_price: "1500",  // ❌ Selling < Cost
    stock: "25",
    weight: "0.3",
  },
  {
    name: "Desk Lamp LED",
    sku: "",
    category: "Home",
    supplier: "Home Decor BD",
    description: "Adjustable lamp",
    cost_price: "800",
    wholesale_price: "950",
    selling_price: "1150",
    stock: "35",
    weight: "",
  },
];

/* ============================================================
   VALIDATION LOGIC
   ============================================================ */
function validateRow(row) {
  const errors = [];

  if (!row.name?.trim()) errors.push("Name is required");
  if (!row.category?.trim()) errors.push("Category is required");
  if (!row.supplier?.trim()) errors.push("Supplier is required");

  const cost = Number(row.cost_price);
  const selling = Number(row.selling_price);

  if (!cost || cost <= 0) errors.push("Cost price must be > 0");
  if (!selling || selling <= 0) errors.push("Selling price must be > 0");
  if (cost > 0 && selling > 0 && selling <= cost)
    errors.push("Selling price must be higher than cost");

  if (row.stock === "" || isNaN(Number(row.stock)) || Number(row.stock) < 0)
    errors.push("Stock must be a valid number");

  if (row.weight && (isNaN(Number(row.weight)) || Number(row.weight) <= 0))
    errors.push("Weight must be positive");

  return {
    ...row,
    _valid: errors.length === 0,
    _errors: errors,
  };
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function BulkImportSection({ onSuccess }) {
  const [phase, setPhase] = useState("upload"); // upload | parsing | preview | importing | done
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setPhase("parsing");

    /* ============================================================
       🔸 FAKE PARSING
       Real CSV/Excel parse এখানে বসবে (papaparse / xlsx library দিয়ে)

       Example real code:
       Papa.parse(f, {
         header: true,
         skipEmptyLines: true,
         complete: (result) => {
           const validated = result.data.map(validateRow);
           setRows(validated);
           setPhase("preview");
         },
       });
       ============================================================ */
    setTimeout(() => {
      const validated = FAKE_PARSED_DATA.map(validateRow);
      setRows(validated);
      setPhase("preview");
    }, 900);
  };

  const downloadTemplate = () => {
    const csv = [
      COLUMNS.join(","),
      "Wireless Mouse,WM-001,Electronics,Tech Hub BD,500,600,850,50,0.3",
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-template.csv";
    a.click();
  };

  const validRows = rows.filter((r) => r._valid);
  const invalidRows = rows.filter((r) => !r._valid);

  const handleImport = async () => {
    setPhase("importing");

    /* ============================================================
       🔸 FAKE IMPORT
       Real API call এখানে বসবে:
       await fetch("/api/v1/admin/products/bulk", {
         method: "POST",
         body: JSON.stringify({ products: validRows }),
       });
       ============================================================ */
    await new Promise((r) => setTimeout(r, 1500));

    setPhase("done");
    onSuccess?.(`${validRows.length} products imported successfully`);

    // Reset after showing success
    setTimeout(() => {
      setPhase("upload");
      setFile(null);
      setRows([]);
    }, 3000);
  };

  /* ============================================================
     UPLOAD PHASE
     ============================================================ */
  if (phase === "upload") {
    return (
      <div className="flex flex-col gap-6">
        {/* Instructions */}
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/50 p-5">
          <p className="text-sm font-bold text-[var(--color-ink)]">
            📋 How it works
          </p>
          <ol className="mt-3 space-y-2 text-xs text-[var(--color-ink)]/70">
            <li className="flex gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[10px] font-bold text-white">
                1
              </span>
              Download the CSV template
            </li>
            <li className="flex gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[10px] font-bold text-white">
                2
              </span>
              Fill in your products (Excel or Google Sheets)
            </li>
            <li className="flex gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-brand-navy)] text-[10px] font-bold text-white">
                3
              </span>
              Upload the CSV — we'll validate before importing
            </li>
          </ol>
        </div>

        {/* Template download */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--color-line)] p-5">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--color-brand-teal)]/10 text-2xl">
              📄
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                Product Template
              </p>
              <p className="text-xs text-[var(--color-ink)]/55">
                CSV with all required columns
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={downloadTemplate}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
          >
            ⬇ Download CSV
          </button>
        </div>

        {/* Upload zone */}
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
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[var(--color-line)] bg-[var(--color-brand-cream)]/30 py-14 text-center transition-colors hover:border-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange)]/5"
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[var(--color-brand-orange)]/20 to-[var(--color-brand-orange-dark)]/10 text-3xl">
            📤
          </span>
          <div>
            <p className="text-base font-semibold text-[var(--color-ink)]">
              Drop your CSV file here
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink)]/55">
              or{" "}
              <span className="font-semibold text-[var(--color-brand-orange)]">
                click to browse
              </span>
            </p>
          </div>
          <p className="text-xs text-[var(--color-ink)]/40">
            Supported: CSV, XLSX, XLS · Max 5MB · Up to 1000 products
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     PARSING PHASE
     ============================================================ */
  if (phase === "parsing") {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <span className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--color-line)] border-t-[var(--color-brand-orange)]" />
        <div>
          <p className="text-base font-bold text-[var(--color-ink)]">
            Parsing file...
          </p>
          <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
            Validating {file?.name}
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     PREVIEW PHASE
     ============================================================ */
  if (phase === "preview") {
    return (
      <div className="flex flex-col gap-6">
        {/* File info */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-brand-teal)]/10 text-xl">
              📄
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {file?.name || "products.csv"}
              </p>
              <p className="text-xs text-[var(--color-ink)]/55">
                {rows.length} rows detected
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase("upload");
              setFile(null);
              setRows([]);
            }}
            className="cursor-pointer text-xs font-semibold text-[var(--color-brand-orange)] hover:underline"
          >
            Change file
          </button>
        </div>

        {/* Validation summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[var(--color-brand-teal)]/30 bg-[var(--color-brand-teal)]/5 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-teal)]">
              ✓ Ready to import
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
              {validRows.length}
            </p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red-700">
              ⚠ With errors
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--color-ink)]">
              {invalidRows.length}
            </p>
          </div>
        </div>

        {/* Preview table */}
        <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-[var(--color-brand-cream)]">
                <tr>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/55">
                    Status
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/55">
                    Name
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/55">
                    SKU
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/55">
                    Category
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/55">
                    Cost
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/55">
                    Selling
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink)]/55">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-line)] bg-white">
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className={r._valid ? "" : "bg-red-50/50"}
                    title={!r._valid ? r._errors.join(" · ") : undefined}
                  >
                    <td className="px-3 py-2.5">
                      {r._valid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-teal)]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--color-brand-teal)]">
                          ✓ Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                          ⚠ {r._errors.length} error{r._errors.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-[var(--color-ink)]">
                      {r.name || <span className="text-red-500">Missing</span>}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-[var(--color-ink)]/60">
                      {r.sku || "—"}
                    </td>
                    <td className="px-3 py-2.5 text-[var(--color-ink)]/70">
                      {r.category || <span className="text-red-500">Missing</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-[var(--color-ink)]/70">
                      ৳{r.cost_price || "0"}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-[var(--color-ink)]">
                      ৳{r.selling_price || "0"}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-[var(--color-ink)]/70">
                      {r.stock || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error details (if any) */}
        {invalidRows.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-800">
              ⚠ {invalidRows.length} row{invalidRows.length > 1 ? "s" : ""} will be skipped
            </p>
            <ul className="mt-3 space-y-2 text-xs text-red-700">
              {invalidRows.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold">
                    Row {rows.indexOf(r) + 2}:
                  </span>
                  <span>{r._errors.join(", ")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-line)] pt-5">
          <p className="text-xs text-[var(--color-ink)]/55">
            Import <span className="font-bold text-[var(--color-ink)]">{validRows.length}</span> of{" "}
            {rows.length} rows
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPhase("upload");
                setFile(null);
                setRows([]);
              }}
              className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleImport}
              disabled={validRows.length === 0}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
            >
              ✓ Import {validRows.length} Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     IMPORTING PHASE
     ============================================================ */
  if (phase === "importing") {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <span className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--color-line)] border-t-[var(--color-brand-orange)]" />
        <div>
          <p className="text-base font-bold text-[var(--color-ink)]">
            Importing products...
          </p>
          <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
            Please wait — do not close this page
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     DONE PHASE
     ============================================================ */
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-[var(--color-brand-teal)]/20" />
        <div className="relative grid h-20 w-20 place-items-center rounded-full bg-[var(--color-brand-teal)] text-white shadow-xl shadow-teal-500/30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-10 w-10">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div>
        <p className="text-xl font-bold text-[var(--color-ink)]">
          Import Complete!
        </p>
        <p className="mt-1.5 text-sm text-[var(--color-ink)]/55">
          {validRows.length} product{validRows.length > 1 ? "s" : ""} added successfully
          {invalidRows.length > 0 && (
            <>
              {" "}
              · {invalidRows.length} skipped
            </>
          )}
        </p>
      </div>
    </div>
  );
}