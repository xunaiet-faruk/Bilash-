"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ============================================================
   SEED DATA
   ============================================================ */
const seed = (arr) =>
  arr.map((c) => ({
    ...c,
    subs: c.subs.map((s, i) => ({ id: `${c.id}-s${i}`, ...s })),
  }));

const initialCategories = seed([
  {
    id: "c1", name: "Electronics",
    desc: "Audio, phones, wearables and computing accessories.",
    commission: 8, active: true, requireApproval: false,
    pending: 3, revenue: 4280000, attributes: 6,
    modifiedBy: "Rafiul S.", modifiedAt: "2h ago",
    subs: [
      { name: "Audio", count: 148 },
      { name: "Phones & Accessories", count: 121 },
      { name: "Wearables", count: 76 },
      { name: "Computing", count: 67 },
    ],
  },
  {
    id: "c2", name: "Home & Kitchen",
    desc: "Kitchen, lighting and home storage.",
    commission: 10, active: true, requireApproval: false,
    pending: 2, revenue: 2860000, attributes: 4,
    modifiedBy: "Sadia I.", modifiedAt: "5h ago",
    subs: [
      { name: "Kitchen Tools", count: 102 },
      { name: "Lighting", count: 64 },
      { name: "Storage", count: 71 },
      { name: "Decor", count: 50 },
    ],
  },
  {
    id: "c3", name: "Fashion",
    desc: "Clothing and accessories for everyone.",
    commission: 12, active: true, requireApproval: false,
    pending: 1, revenue: 3520000, attributes: 5,
    modifiedBy: "Rafiul S.", modifiedAt: "1d ago",
    subs: [
      { name: "Men", count: 190 },
      { name: "Women", count: 220 },
      { name: "Accessories", count: 120 },
    ],
  },
  {
    id: "c4", name: "Beauty & Health",
    desc: "Skincare, makeup and wellness.",
    commission: 15, active: true, requireApproval: true,
    pending: 1, revenue: 1840000, attributes: 3,
    modifiedBy: "Tanvir A.", modifiedAt: "2d ago",
    subs: [
      { name: "Skincare", count: 70 },
      { name: "Makeup", count: 58 },
      { name: "Wellness", count: 48 },
    ],
  },
  {
    id: "c5", name: "Sports & Outdoor",
    desc: "Fitness, camping and cycling gear.",
    commission: 9, active: true, requireApproval: false,
    pending: 1, revenue: 1280000, attributes: 4,
    modifiedBy: "Imran K.", modifiedAt: "3d ago",
    subs: [
      { name: "Fitness", count: 44 },
      { name: "Camping", count: 30 },
      { name: "Cycling", count: 20 },
    ],
  },
  {
    id: "c6", name: "Toys & Baby",
    desc: "Toys, games and baby care.",
    commission: 10, active: true, requireApproval: false,
    pending: 0, revenue: 840000, attributes: 3,
    modifiedBy: "Sadia I.", modifiedAt: "5d ago",
    subs: [
      { name: "Toys", count: 66 },
      { name: "Baby Care", count: 67 },
    ],
  },
  {
    id: "c7", name: "Gift Cards",
    desc: "Digital gift cards. Not launched yet.",
    commission: 5, active: false, requireApproval: true,
    pending: 0, revenue: 0, attributes: 2,
    modifiedBy: "Rafiul S.", modifiedAt: "1w ago",
    subs: [],
  },
]);

/* ============================================================
   HELPERS
   ============================================================ */
const fmtTk = (n) => {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(1)}K`;
  return `৳${n}`;
};

const totalOf = (c) => c.subs.reduce((s, x) => s + x.count, 0);

/* ============================================================
   ICONS
   ============================================================ */
const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={className}>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const I = {
  search: "M21 21l-4.3-4.3M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  chevron: "M6 9l6 6 6-6",
  x: "M6 18L18 6M6 6l12 12",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  check: "M5 13l4 4L19 7",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
};

/* ============================================================
   TOGGLE
   ============================================================ */
const Toggle = ({ on, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={
      "relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors " +
      (on ? "bg-[var(--color-brand-teal)]" : "bg-[var(--color-ink)]/20")
    }
  >
    <span
      className={
        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all " +
        (on ? "left-[22px]" : "left-0.5")
      }
    />
  </button>
);

/* ============================================================
   MAIN
   ============================================================ */
export default function CategoriesPage() {
  const [cats, setCats] = useState(initialCategories);
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(initialCategories.map((c) => [c.id, true]))
  );
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [addingSubTo, setAddingSubTo] = useState(null);
  const [subText, setSubText] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [newDraft, setNewDraft] = useState({ name: "", desc: "", commission: 10 });

  const flash = (m) => setToast(m);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const selected = cats.find((c) => c.id === selectedId) || null;

  /* ---------- filtered ---------- */
  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!q) return cats;
    return cats
      .map((c) => {
        const catHit = c.name.toLowerCase().includes(q);
        const subHits = c.subs.filter((s) => s.name.toLowerCase().includes(q));
        if (!catHit && subHits.length === 0) return null;
        return { ...c, subs: catHit ? c.subs : subHits, _catHit: catHit };
      })
      .filter(Boolean);
  }, [cats, q]);

  /* ---------- stats ---------- */
  const stats = useMemo(
    () => ({
      cats: cats.filter((c) => c.active).length,
      totalCats: cats.length,
      subs: cats.reduce((s, c) => s + c.subs.length, 0),
      products: cats.reduce((s, c) => s + totalOf(c), 0),
      pending: cats.reduce((s, c) => s + c.pending, 0),
    }),
    [cats]
  );

  /* ---------- actions ---------- */
  const toggleExpand = (id) =>
    setExpanded((cur) => ({ ...cur, [id]: !cur[id] }));

  const updateCat = (id, patch) =>
    setCats((cur) => cur.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const updateSub = (catId, subId, patch) =>
    setCats((cur) =>
      cur.map((c) =>
        c.id === catId
          ? { ...c, subs: c.subs.map((s) => (s.id === subId ? { ...s, ...patch } : s)) }
          : c
      )
    );

  const addCategory = () => {
    const name = newDraft.name.trim();
    if (!name) return flash("Name is required");
    if (cats.some((c) => c.name.toLowerCase() === name.toLowerCase()))
      return flash("That name already exists");

    const id = `c${Date.now()}`;
    const newCat = {
      id,
      name,
      desc: newDraft.desc.trim(),
      commission: newDraft.commission,
      active: true,
      requireApproval: false,
      pending: 0,
      revenue: 0,
      attributes: 0,
      modifiedBy: "You",
      modifiedAt: "just now",
      subs: [],
    };
    setCats((cur) => [...cur, newCat]);
    setExpanded((cur) => ({ ...cur, [id]: true }));
    setNewDraft({ name: "", desc: "", commission: 10 });
    setIsNew(false);
    setSelectedId(id);
    flash(`Category "${name}" created`);
  };

  const addSub = (catId) => {
    const name = subText.trim();
    if (!name) return;
    const cat = cats.find((c) => c.id === catId);
    if (cat.subs.some((s) => s.name.toLowerCase() === name.toLowerCase()))
      return flash("That subcategory already exists");

    const sub = { id: `s${Date.now()}`, name, count: 0 };
    updateCat(catId, { subs: [...cat.subs, sub] });
    setSubText("");
    setAddingSubTo(null);
    flash(`Added "${name}"`);
  };

  const deleteCategory = (id) => {
    setCats((cur) => cur.filter((c) => c.id !== id));
    setConfirmDelete(null);
    setSelectedId(null);
    flash("Category deleted");
  };

  const deleteSub = (catId, subId) => {
    const cat = cats.find((c) => c.id === catId);
    updateCat(catId, { subs: cat.subs.filter((s) => s.id !== subId) });
    setConfirmDelete(null);
    flash("Subcategory deleted");
  };

  const expandAll = () =>
    setExpanded(Object.fromEntries(cats.map((c) => [c.id, true])));
  const collapseAll = () =>
    setExpanded(Object.fromEntries(cats.map((c) => [c.id, false])));

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5">
      {/* ============ HEADER ============ */}
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-brand-orange)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]/45">
              Marketplace Structure
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Click a category to expand, edit or add subcategories. Changes save instantly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={expandAll}
            className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-ink)]/40 hover:bg-[var(--color-brand-cream)]"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-ink)]/40 hover:bg-[var(--color-brand-cream)]"
          >
            Collapse all
          </button>
          <button
            onClick={() => {
              setIsNew(true);
              setSelectedId(null);
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40"
          >
            <Ico d={I.plus} className="h-3.5 w-3.5" />
            Add category
          </button>
        </div>
      </header>

      {/* ============ STATS ============ */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Categories", value: stats.totalCats, sub: `${stats.cats} active`, accent: "orange" },
          { label: "Subcategories", value: stats.subs, sub: "across all", accent: "teal" },
          { label: "Products", value: stats.products.toLocaleString(), sub: "live in catalog", accent: "navy" },
          { label: "Pending", value: stats.pending, sub: "need review", accent: "rose" },
        ].map((s) => {
          const accents = {
            orange: "text-[var(--color-brand-orange)]",
            teal: "text-[var(--color-brand-teal)]",
            navy: "text-[var(--color-brand-navy)]",
            rose: "text-rose-600",
          };
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-[var(--color-line)] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                {s.label}
              </p>
              <p className={`mt-1.5 text-2xl font-bold tabular-nums ${accents[s.accent]}`}>
                {s.value}
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--color-ink)]/40">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ============ MAIN GRID ============ */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* ================= LEFT: TREE LIST ================= */}
        <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
          {/* Search bar */}
          <div className="border-b border-[var(--color-line)] p-3">
            <div className="relative">
              <Ico
                d={I.search}
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/40"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories or subcategories..."
                className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-brand-cream)]/40 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-orange)] focus:bg-white focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/5"
                >
                  <Ico d={I.x} className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[680px] overflow-y-auto p-3">
            {visible.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-3xl">🔍</p>
                <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
                  No categories found
                </p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/50">
                  Try a different search term
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {visible.map((c) => {
                  const isExpanded = expanded[c.id] !== false;
                  const isSelected = selectedId === c.id;
                  const total = totalOf(c);
                  const catHit = c._catHit;

                  return (
                    <li
                      key={c.id}
                      className={`overflow-hidden rounded-xl border transition-all ${
                        isSelected
                          ? "border-[var(--color-brand-orange)] shadow-md ring-2 ring-[var(--color-brand-orange)]/15"
                          : "border-[var(--color-line)] hover:border-[var(--color-ink)]/20"
                      } ${!c.active ? "bg-[var(--color-brand-cream)]/40" : "bg-white"}`}
                    >
                      {/* ============ CATEGORY ROW ============ */}
                      <div className="flex items-center gap-3 p-3">
                        {/* Color dot / icon */}
                        <button
                          onClick={() => toggleExpand(c.id)}
                          className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg transition-all ${
                            isExpanded
                              ? "bg-[var(--color-brand-navy)] text-white"
                              : "bg-[var(--color-brand-cream)] text-[var(--color-ink)]/60"
                          }`}
                        >
                          <Ico
                            d={I.chevron}
                            className={`h-4 w-4 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                          />
                        </button>

                        {/* Info */}
                        <button
                          onClick={() => {
                            setSelectedId(c.id);
                            setIsNew(false);
                          }}
                          className="min-w-0 flex-1 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2">
                            <p
                              className={`truncate text-sm font-bold ${
                                catHit && q
                                  ? "text-[var(--color-brand-orange)]"
                                  : "text-[var(--color-ink)]"
                              }`}
                            >
                              {c.name}
                            </p>
                            {!c.active && (
                              <span className="shrink-0 rounded-full bg-[var(--color-ink)]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--color-ink)]/60">
                                Hidden
                              </span>
                            )}
                            {c.requireApproval && (
                              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                                Approval
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-[var(--color-ink)]/55">
                            {c.subs.length} subcategories · {total} products · {c.commission}% fee
                          </p>
                        </button>

                        {/* Stats pill */}
                        <div className="hidden items-center gap-2 sm:flex">
                          {c.pending > 0 && (
                            <span className="rounded-full bg-[var(--color-brand-orange)] px-2 py-0.5 text-[10px] font-bold text-white">
                              {c.pending} new
                            </span>
                          )}
                          <span className="rounded-lg bg-[var(--color-brand-cream)] px-2 py-1 text-[10px] font-bold tabular-nums text-[var(--color-ink)]/70">
                            {fmtTk(c.revenue)}
                          </span>
                        </div>
                      </div>

                      {/* ============ SUBCATEGORY LIST ============ */}
                      {isExpanded && (
                        <div className="border-t border-[var(--color-line)] bg-[var(--color-brand-cream)]/30 px-3 pb-3 pt-2">
                          {c.subs.length === 0 && addingSubTo !== c.id && (
                            <p className="py-2 text-center text-xs text-[var(--color-ink)]/45">
                              No subcategories yet
                            </p>
                          )}

                          <ul className="flex flex-col gap-1.5">
                            {c.subs.map((s) => (
                              <li
                                key={s.id}
                                className="group flex items-center gap-2 rounded-lg bg-white px-3 py-2 transition-all hover:shadow-sm"
                              >
                                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[var(--color-brand-cream)] text-[10px] font-bold text-[var(--color-ink)]/60">
                                  {s.name[0]}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-ink)]">
                                  {s.name}
                                </span>
                                <span className="shrink-0 text-xs tabular-nums text-[var(--color-ink)]/50">
                                  {s.count} products
                                </span>
                                <button
                                  onClick={() => setConfirmDelete({ type: "sub", catId: c.id, subId: s.id, name: s.name })}
                                  className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-md text-[var(--color-ink)]/30 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                                  aria-label={`Delete ${s.name}`}
                                >
                                  <Ico d={I.trash} className="h-3 w-3" />
                                </button>
                              </li>
                            ))}
                          </ul>

                          {/* Add subcategory */}
                          {addingSubTo === c.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                addSub(c.id);
                              }}
                              className="mt-2 flex items-center gap-2 rounded-lg border-2 border-[var(--color-brand-orange)] bg-white pl-3 pr-1"
                            >
                              <input
                                autoFocus
                                value={subText}
                                onChange={(e) => setSubText(e.target.value)}
                                onBlur={() => !subText && setAddingSubTo(null)}
                                placeholder="Subcategory name, then Enter"
                                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--color-ink)]/35"
                              />
                              <button
                                type="submit"
                                className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md bg-[var(--color-brand-orange)] text-white"
                              >
                                <Ico d={I.check} className="h-3.5 w-3.5" />
                              </button>
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                setAddingSubTo(c.id);
                                setSubText("");
                              }}
                              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-[var(--color-ink)]/15 py-2 text-xs font-medium text-[var(--color-ink)]/45 transition-colors hover:border-[var(--color-brand-orange)]/40 hover:text-[var(--color-brand-orange)]"
                            >
                              <Ico d={I.plus} className="h-3 w-3" />
                              Add subcategory
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ================= RIGHT: EDIT PANEL ================= */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          {isNew ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
              <div className="border-b border-[var(--color-line)] bg-gradient-to-br from-[var(--color-brand-orange)]/5 to-transparent p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-orange)]">
                      New Category
                    </p>
                    <h2 className="mt-1 text-base font-bold text-[var(--color-ink)]">
                      Create a category
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsNew(false)}
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/40 hover:bg-[var(--color-ink)]/5"
                  >
                    <Ico d={I.x} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <Field label="Category name" required>
                  <input
                    autoFocus
                    value={newDraft.name}
                    onChange={(e) => setNewDraft({ ...newDraft, name: e.target.value })}
                    placeholder="e.g. Pet Supplies"
                    className="w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    rows={3}
                    value={newDraft.desc}
                    onChange={(e) => setNewDraft({ ...newDraft, desc: e.target.value })}
                    placeholder="Short description of this category"
                    className="w-full resize-none rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
                  />
                </Field>

                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">
                      Commission rate
                    </span>
                    <span className="text-lg font-bold tabular-nums text-[var(--color-brand-orange)]">
                      {newDraft.commission}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={newDraft.commission}
                    onChange={(e) =>
                      setNewDraft({ ...newDraft, commission: Number(e.target.value) })
                    }
                    className="mt-2 w-full cursor-pointer"
                    style={{
                      appearance: "none",
                      height: "6px",
                      borderRadius: "9999px",
                      background: `linear-gradient(to right, var(--color-brand-orange) 0%, var(--color-brand-orange) ${(newDraft.commission / 30) * 100}%, var(--color-line) ${(newDraft.commission / 30) * 100}%, var(--color-line) 100%)`,
                    }}
                  />
                </div>

                <button
                  onClick={addCategory}
                  disabled={!newDraft.name.trim()}
                  className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[var(--color-ink)]/10 disabled:text-[var(--color-ink)]/30 disabled:shadow-none disabled:hover:translate-y-0"
                >
                  Create category
                </button>
              </div>
            </div>
          ) : selected ? (
            <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
              {/* Header */}
              <div className="relative border-b border-[var(--color-line)] bg-gradient-to-br from-[var(--color-brand-navy)] to-[var(--color-brand-navy-light,#1e293b)] p-5 text-white">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--color-brand-orange)]/20 blur-2xl" />

                <div className="relative flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Category
                    </p>
                    <h2 className="mt-1 truncate text-lg font-bold">
                      {selected.name}
                    </h2>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
                      <Ico d={I.clock} className="h-3 w-3" />
                      Edited {selected.modifiedAt} by {selected.modifiedBy}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg text-white/60 hover:bg-white/10"
                    aria-label="Close"
                  >
                    <Ico d={I.x} />
                  </button>
                </div>

                {/* Mini stats */}
                <div className="relative mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur">
                    <p className="text-[9px] uppercase tracking-wider text-white/55">
                      Products
                    </p>
                    <p className="mt-0.5 text-base font-bold tabular-nums">
                      {totalOf(selected)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur">
                    <p className="text-[9px] uppercase tracking-wider text-white/55">
                      Subs
                    </p>
                    <p className="mt-0.5 text-base font-bold tabular-nums">
                      {selected.subs.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2.5 backdrop-blur">
                    <p className="text-[9px] uppercase tracking-wider text-white/55">
                      Revenue
                    </p>
                    <p className="mt-0.5 text-base font-bold tabular-nums text-[var(--color-brand-orange)]">
                      {fmtTk(selected.revenue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-[600px] space-y-5 overflow-y-auto p-5">
                {/* Pending alert */}
                {selected.pending > 0 && (
                  <a
                    href="/admin/dashboard/catalog"
                    className="flex items-center gap-3 rounded-xl border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/5 p-3 transition-colors hover:bg-[var(--color-brand-orange)]/10"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--color-brand-orange)] text-white">
                      <Ico d={I.clock} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[var(--color-ink)]">
                        {selected.pending} pending product{selected.pending > 1 ? "s" : ""}
                      </p>
                      <p className="text-[11px] text-[var(--color-ink)]/55">
                        Tap to review and approve
                      </p>
                    </div>
                    <Ico d={I.chevron} className="h-4 w-4 shrink-0 -rotate-90 text-[var(--color-brand-orange)]" />
                  </a>
                )}

                <Field label="Category name" required>
                  <input
                    value={selected.name}
                    onChange={(e) => updateCat(selected.id, { name: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    rows={3}
                    value={selected.desc}
                    onChange={(e) => updateCat(selected.id, { desc: e.target.value })}
                    className="w-full resize-none rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[var(--color-brand-orange)]/20"
                  />
                </Field>

                {/* ===== View Products link ===== */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/admin/dashboard/categories/${selected.id}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-brand-orange)] to-[var(--color-brand-orange-dark)] py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Ico d={I.folder} className="h-3.5 w-3.5" />
                    View {totalOf(selected)} products
                  </Link>
                  <a
                    href={`/admin/dashboard/catalog?category=${selected.id}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white py-2.5 text-xs font-semibold text-[var(--color-ink)]/70 transition-colors hover:bg-[var(--color-brand-cream)]"
                  >
                    <Ico d={I.edit} className="h-3.5 w-3.5" />
                    Manage
                  </a>
                </div>

                {/* Commission */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">
                      Commission rate
                    </span>
                    <span className="text-lg font-bold tabular-nums text-[var(--color-brand-orange)]">
                      {selected.commission}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={selected.commission}
                    onChange={(e) =>
                      updateCat(selected.id, { commission: Number(e.target.value) })
                    }
                    className="mt-2 w-full cursor-pointer"
                    style={{
                      appearance: "none",
                      height: "6px",
                      borderRadius: "9999px",
                      background: `linear-gradient(to right, var(--color-brand-orange) 0%, var(--color-brand-orange) ${(selected.commission / 30) * 100}%, var(--color-line) ${(selected.commission / 30) * 100}%, var(--color-line) 100%)`,
                    }}
                  />
                  <p className="mt-1.5 text-[11px] text-[var(--color-ink)]/45">
                    Platform fee per order in this category
                  </p>
                </div>

                {/* Toggles */}
                <div className="divide-y divide-[var(--color-line)] rounded-xl border border-[var(--color-line)]">
                  <div className="flex items-center justify-between gap-3 p-3.5">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-ink)]">
                        Visible to customers
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--color-ink)]/50">
                        Hide without deleting
                      </p>
                    </div>
                    <Toggle
                      on={selected.active}
                      onChange={() =>
                        updateCat(selected.id, { active: !selected.active })
                      }
                      label="Visible"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3.5">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-ink)]">
                        Require approval
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--color-ink)]/50">
                        Products need review before going live
                      </p>
                    </div>
                    <Toggle
                      on={selected.requireApproval}
                      onChange={() =>
                        updateCat(selected.id, {
                          requireApproval: !selected.requireApproval,
                        })
                      }
                      label="Require approval"
                    />
                  </div>
                </div>

                {/* Delete */}
                <div className="border-t border-[var(--color-line)] pt-4">
                  {confirmDelete?.type === "cat" && confirmDelete.id === selected.id ? (
                    <div className="space-y-2 rounded-xl bg-rose-50 p-3">
                      <p className="text-xs font-medium text-rose-700">
                        {totalOf(selected) > 0
                          ? `${totalOf(selected)} products will move to Uncategorized.`
                          : "This category will be permanently deleted."}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="flex-1 cursor-pointer rounded-lg border border-[var(--color-line)] bg-white py-2 text-xs font-semibold text-[var(--color-ink)]/70"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteCategory(selected.id)}
                          className="flex-1 cursor-pointer rounded-lg bg-rose-600 py-2 text-xs font-bold text-white hover:bg-rose-700"
                        >
                          Yes, delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete({ type: "cat", id: selected.id })}
                      className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-200 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      <Ico d={I.trash} className="h-3.5 w-3.5" />
                      Delete category
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--color-line)] bg-white p-8 text-center">
              <span className="grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-[var(--color-brand-cream)] text-2xl">
                👈
              </span>
              <p className="mt-3 text-sm font-semibold text-[var(--color-ink)]">
                Select a category
              </p>
              <p className="mt-1 text-xs text-[var(--color-ink)]/50">
                Click a category on the left to view details and edit
              </p>
              <button
                onClick={() => setIsNew(true)}
                className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-semibold text-[var(--color-ink)]/70 transition-colors hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)]"
              >
                <Ico d={I.plus} className="h-3 w-3" />
                Or create new
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============ CONFIRM MODAL (only for sub delete) ============ */}
      {confirmDelete?.type === "sub" && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-brand-navy)]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                <Ico d={I.trash} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-[var(--color-ink)]">
                  Delete subcategory?
                </p>
                <p className="mt-1 text-xs text-[var(--color-ink)]/60">
                  <span className="font-semibold">{confirmDelete.name}</span> will be removed. Products will move to Uncategorized.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] py-2.5 text-sm font-semibold text-[var(--color-ink)]/70"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSub(confirmDelete.catId, confirmDelete.subId)}
                className="flex-1 cursor-pointer rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ TOAST ============ */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[var(--color-brand-navy)] px-5 py-2.5 text-sm text-white shadow-2xl">
          <Ico d={I.check} className="h-4 w-4 text-[var(--color-brand-teal)]" />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FIELD COMPONENT
   ============================================================ */
function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-ink)]/55">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}