/* ============================================================
   productApi.js
   👉 API connect korar somoy SHUDHU ei file change korbe.
   Component gulo ei function gulo call kore, fetch kothao nai.
   ============================================================ */

// Fallback / hardcoded lists (API ready hole getProductOptions() replace korbe)
export const CATEGORIES = [
  "Electronics", "Fashion", "Home & Living", "Beauty",
  "Sports", "Books", "Toys", "Grocery", "Accessories", "Home",
];
export const SUPPLIERS = [
  "Tech Hub BD", "Gadget Store", "Camera World", "Home Decor BD", "Audio Zone",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------
   1) Category + supplier list
   Real:
     const res = await fetch("/api/v1/admin/product-options");
     if (!res.ok) throw new Error("Could not load options");
     return res.json(); // { categories: string[], suppliers: string[] }
   ------------------------------------------------------------ */
export async function getProductOptions() {
  await sleep(200);
  return { categories: CATEGORIES, suppliers: SUPPLIERS };
}

/* ------------------------------------------------------------
   2) Single product
   payload = camelCase object, images = File[]
   Real:
     const fd = new FormData();
     fd.append("data", JSON.stringify(payload));
     images.forEach((f) => fd.append("images", f));
     const res = await fetch("/api/v1/admin/products", { method: "POST", body: fd });
     if (!res.ok) throw new Error((await res.json()).message ?? "Could not add product");
     return res.json();
   ------------------------------------------------------------ */
export async function createProduct(payload, images = []) {
  await sleep(1000);
  if (/exists/i.test(payload.sku || "")) throw new Error("A product with this SKU already exists");
  return { id: Date.now(), ...payload };
}

/* ------------------------------------------------------------
   3) Bulk import (chunked: 100 products per request)
   Return shape: { created: number, failed: [{ index, message }] }
   index = products array-er index (chunk-er nay, overall)
   Real (loop-er bhitore, fake block-er jaygay):
     const res = await fetch("/api/v1/admin/products/bulk", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ products: chunk }),
     });
     if (!res.ok) throw new Error((await res.json()).message ?? "Import failed");
     const data = await res.json(); // { created, failed: [{ index, message }] }
     created += data.created;
     data.failed.forEach((f) => failed.push({ index: i + f.index, message: f.message }));
   ------------------------------------------------------------ */
export async function bulkImportProducts(products, { onProgress } = {}) {
  const CHUNK = 100;
  let created = 0;
  const failed = [];

  for (let i = 0; i < products.length; i += CHUNK) {
    const chunk = products.slice(i, i + CHUNK);

    // ---- FAKE (delete when real API is ready) ----
    await sleep(700);
    chunk.forEach((p, j) => {
      if (/exists/i.test(p.sku || "")) failed.push({ index: i + j, message: "SKU already exists" });
      else created += 1;
    });
    // ----------------------------------------------

    onProgress?.(Math.min(i + CHUNK, products.length));
  }
  return { created, failed };
}