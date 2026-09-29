"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const seed = (arr) =>
  arr.map((c) => ({
    ...c,
    subs: c.subs.map((s, i) => ({ id: `${c.id}-s${i}`, ...s })),
  }));

const initialCategories = seed([
  {
    id: "c1",
    name: "Electronics",
    desc: "Audio, phones, wearables and computing accessories.",
    commission: 8,
    active: true,
    requireApproval: false,
    pending: 3,
    revenue: "৳42.8L",
    attributes: 6,
    modifiedBy: "Rafiul S.",
    modifiedAt: "2h ago",
    subs: [
      { name: "Audio", count: 148 },
      { name: "Phones & Accessories", count: 121 },
      { name: "Wearables", count: 76 },
      { name: "Computing", count: 67 },
    ],
  },
  {
    id: "c2",
    name: "Home & Kitchen",
    desc: "Kitchen, lighting and home storage.",
    commission: 10,
    active: true,
    requireApproval: false,
    pending: 2,
    revenue: "৳28.6L",
    attributes: 4,
    modifiedBy: "Sadia I.",
    modifiedAt: "5h ago",
    subs: [
      { name: "Kitchen Tools", count: 102 },
      { name: "Lighting", count: 64 },
      { name: "Storage", count: 71 },
      { name: "Decor", count: 50 },
    ],
  },
  {
    id: "c3",
    name: "Fashion",
    desc: "Clothing and accessories for everyone.",
    commission: 12,
    active: true,
    requireApproval: false,
    pending: 1,
    revenue: "৳35.2L",
    attributes: 5,
    modifiedBy: "Rafiul S.",
    modifiedAt: "1d ago",
    subs: [
      { name: "Men", count: 190 },
      { name: "Women", count: 220 },
      { name: "Accessories", count: 120 },
    ],
  },
  {
    id: "c4",
    name: "Beauty & Health",
    desc: "Skincare, makeup and wellness.",
    commission: 15,
    active: true,
    requireApproval: true,
    pending: 1,
    revenue: "৳18.4L",
    attributes: 3,
    modifiedBy: "Tanvir A.",
    modifiedAt: "2d ago",
    subs: [
      { name: "Skincare", count: 70 },
      { name: "Makeup", count: 58 },
      { name: "Wellness", count: 48 },
    ],
  },
  {
    id: "c5",
    name: "Sports & Outdoor",
    desc: "Fitness, camping and cycling gear.",
    commission: 9,
    active: true,
    requireApproval: false,
    pending: 1,
    revenue: "৳12.8L",
    attributes: 4,
    modifiedBy: "Imran K.",
    modifiedAt: "3d ago",
    subs: [
      { name: "Fitness", count: 44 },
      { name: "Camping", count: 30 },
      { name: "Cycling", count: 20 },
    ],
  },
  {
    id: "c6",
    name: "Toys & Baby",
    desc: "Toys, games and baby care.",
    commission: 10,
    active: true,
    requireApproval: false,
    pending: 0,
    revenue: "৳8.4L",
    attributes: 3,
    modifiedBy: "Sadia I.",
    modifiedAt: "5d ago",
    subs: [
      { name: "Toys", count: 66 },
      { name: "Baby Care", count: 67 },
    ],
  },
  {
    id: "c7",
    name: "Gift Cards",
    desc: "Digital gift cards. Not launched yet.",
    commission: 5,
    active: false,
    requireApproval: true,
    pending: 0,
    revenue: "৳0",
    attributes: 2,
    modifiedBy: "Rafiul S.",
    modifiedAt: "1w ago",
    subs: [],
  },
]);

const PAD = 28;
const ROOT_W = 200,
  ROOT_H = 108;
const CAT_X = PAD + ROOT_W + 96,
  CAT_W = 280,
  CAT_H = 92;
const SUB_X = CAT_X + CAT_W + 96,
  SUB_W = 232,
  SUB_H = 38,
  SUB_GAP = 10;
const BLOCK_GAP = 26,
  GHOST_H = 52;
const CANVAS_W = SUB_X + SUB_W + PAD;

const totalOf = (c) => c.subs.reduce((s, x) => s + x.count, 0);
const curve = (x1, y1, x2, y2) =>
  `M${x1},${y1} C${x1 + 48},${y1} ${x2 - 48},${y2} ${x2},${y2}`;

const Ico = ({ d, className = "h-4 w-4", sw = 2 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    className={className}
  >
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
  store: "M4 9V5h16v4M4 9l1 11h14l1-11M4 9h16M9 21v-6h6v6",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  clock: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  tag: "M20.6 12.3 12.7 20.2a1.5 1.5 0 0 1-2.1 0l-6.8-6.8a1.5 1.5 0 0 1 0-2.1L11.8 3.4H19a1.6 1.6 0 0 1 1.6 1.6z",
  info: "M12 16v-4M12 8h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  externalLink:
    "M14 4h6v6M20 4l-9 9M19 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",
};

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

const emptyDraft = {
  name: "",
  desc: "",
  commission: 10,
  active: true,
  requireApproval: false,
};

const Page = () => {
  const [cats, setCats] = useState(initialCategories);
  const [expanded, setExpanded] = useState({});
  const [selection, setSelection] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [query, setQuery] = useState("");
  const [scale, setScale] = useState(1);
  const [addingSub, setAddingSub] = useState(null);
  const [subText, setSubText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState(null);
  const canvasRef = useRef(null);

  const flash = (m) => setToast(m);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setConfirmDelete(false);
  }, [selection]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelection(null);
        setAddingSub(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isOpen = (id) => expanded[id] !== false;
  const q = query.trim().toLowerCase();
  const catMatch = (c) =>
    !q ||
    c.name.toLowerCase().includes(q) ||
    c.subs.some((s) => s.name.toLowerCase().includes(q));
  const subMatch = (s) => !q || s.name.toLowerCase().includes(q);

  const layout = useMemo(() => {
    let y = PAD;
    const blocks = cats.map((c) => {
      const rows = isOpen(c.id) ? c.subs.length + 1 : 0;
      const subsH = rows ? rows * SUB_H + (rows - 1) * SUB_GAP : 0;
      const inner = Math.max(CAT_H, subsH);
      const b = {
        c,
        top: y,
        inner,
        subsH,
        cy: y + inner / 2,
        subsTop: y + (inner - subsH) / 2,
      };
      y += inner + BLOCK_GAP;
      return b;
    });
    const ghostTop = y;
    const ghostCy = ghostTop + GHOST_H / 2;
    const H = ghostTop + GHOST_H + PAD;
    const lastBottom = blocks.length
      ? blocks[blocks.length - 1].top + blocks[blocks.length - 1].inner
      : PAD + ROOT_H;
    const rootCy = (PAD + lastBottom) / 2;
    return { blocks, ghostTop, ghostCy, H, rootCy };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats, expanded]);

  const stats = useMemo(
    () => ({
      cats: cats.filter((c) => c.active).length,
      totalCats: cats.length,
      subs: cats.reduce((s, c) => s + c.subs.length, 0),
      products: cats.reduce((s, c) => s + totalOf(c), 0),
      pending: cats.reduce((s, c) => s + c.pending, 0),
      hidden: cats.filter((c) => !c.active).length,
    }),
    [cats]
  );
  const grand = Math.max(1, stats.products);

  const updateCat = (id, patch) =>
    setCats((cur) => cur.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const updateSub = (catId, subId, patch) =>
    setCats((cur) =>
      cur.map((c) =>
        c.id === catId
          ? {
              ...c,
              subs: c.subs.map((s) =>
                s.id === subId ? { ...s, ...patch } : s
              ),
            }
          : c
      )
    );

  const addSub = (c) => {
    const name = subText.trim();
    if (!name) return;
    if (c.subs.some((s) => s.name.toLowerCase() === name.toLowerCase()))
      return flash("That subcategory already exists");
    const sub = { id: `s${Date.now()}`, name, count: 0 };
    updateCat(c.id, { subs: [...c.subs, sub] });
    setSubText("");
    setAddingSub(null);
    flash(`Added "${name}"`);
  };

  const createCat = () => {
    const name = draft.name.trim();
    if (!name) return flash("Name is required");
    if (cats.some((c) => c.name.toLowerCase() === name.toLowerCase()))
      return flash("That name already exists");
    const id = `c${Date.now()}`;
    setCats((cur) => [
      ...cur,
      {
        id,
        ...draft,
        name,
        pending: 0,
        revenue: "৳0",
        attributes: 3,
        modifiedBy: "You",
        modifiedAt: "just now",
        subs: [],
      },
    ]);
    setSelection({ type: "cat", id });
    setDraft(emptyDraft);
    flash(`Category "${name}" created`);
  };

  const deleteCat = (c) => {
    setCats((cur) => cur.filter((x) => x.id !== c.id));
    setSelection(null);
    flash(`Deleted "${c.name}"`);
  };

  const deleteSub = (c, s) => {
    updateCat(c.id, { subs: c.subs.filter((x) => x.id !== s.id) });
    setSelection(null);
    flash(`Deleted "${s.name}"`);
  };

  const moveSub = (from, s, toId) => {
    setCats((cur) =>
      cur.map((c) =>
        c.id === from.id
          ? { ...c, subs: c.subs.filter((x) => x.id !== s.id) }
          : c.id === toId
          ? { ...c, subs: [...c.subs, s] }
          : c
      )
    );
    setSelection({ type: "sub", catId: toId, subId: s.id });
    flash(`Moved "${s.name}"`);
  };

  const selCat =
    selection && selection.type !== "new"
      ? cats.find((c) => c.id === (selection.id || selection.catId))
      : null;
  const selSub =
    selection?.type === "sub" && selCat
      ? selCat.subs.find((s) => s.id === selection.subId)
      : null;
  const dupName =
    selection?.type === "cat" &&
    selCat &&
    cats.some(
      (c) =>
        c.id !== selCat.id &&
        c.name.trim().toLowerCase() === selCat.name.trim().toLowerCase()
    );
  const newErr = !draft.name.trim()
    ? "Name is required"
    : cats.some((c) => c.name.toLowerCase() === draft.name.trim().toLowerCase())
    ? "This name already exists"
    : "";

  const catSelected = (c) => selCat?.id === c.id && selection?.type === "cat";
  const inSelectedCat = (c) => selCat?.id === c.id;
  const inspectorOpen = !!selection;

  const handleDeleteClick = () => {
    if (selection?.type === "cat" && selCat) setConfirmDelete(true);
    else if (selection?.type === "sub" && selCat && selSub)
      setConfirmDelete(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 text-[var(--color-ink)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink)]/60">
            Your whole marketplace structure on one map. Click any node to edit
            it, changes save instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block">
            <Ico
              d={I.search}
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink)]/35"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a category…"
              className="w-56 rounded-xl border border-[var(--color-line)] bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-[var(--color-ink)]/35 focus:border-[var(--color-brand-navy)]"
            />
          </label>
          <div className="flex items-center rounded-xl border border-[var(--color-line)] bg-white">
            <button
              onClick={() => setScale((s) => Math.max(0.6, +(s - 0.1).toFixed(1)))}
              aria-label="Zoom out"
              className="grid h-9 w-9 cursor-pointer place-items-center text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]"
            >
              <Ico d={I.minus} />
            </button>
            <span className="w-11 text-center text-xs font-medium tabular-nums">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(1.2, +(s + 0.1).toFixed(1)))}
              aria-label="Zoom in"
              className="grid h-9 w-9 cursor-pointer place-items-center text-[var(--color-ink)]/60 hover:text-[var(--color-ink)]"
            >
              <Ico d={I.plus} />
            </button>
          </div>
          <button
            onClick={() => {
              const all = cats.every((c) => isOpen(c.id));
              setExpanded(Object.fromEntries(cats.map((c) => [c.id, !all])));
            }}
            className="cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2 text-sm font-medium hover:border-[var(--color-ink)]"
          >
            {cats.every((c) => isOpen(c.id)) ? "Collapse all" : "Expand all"}
          </button>
          <button
            onClick={() => {
              setDraft(emptyDraft);
              setSelection({ type: "new" });
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--color-brand-orange)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-orange-dark)]"
          >
            <Ico d={I.plus} /> Add category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Active Categories",
            value: stats.cats,
            sub: `${stats.hidden} hidden`,
          },
          { label: "Subcategories", value: stats.subs, sub: "across all" },
          {
            label: "Total Products",
            value: stats.products.toLocaleString(),
            sub: "live in catalog",
          },
          {
            label: "Pending Review",
            value: stats.pending,
            sub: "needs attention",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--color-line)] bg-white p-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
              {s.label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[var(--color-ink)]">
              {s.value}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--color-ink)]/40">
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      <div
        className={
          inspectorOpen ? "grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]" : ""
        }
      >
        <div
          ref={canvasRef}
          className="overflow-auto rounded-2xl"
          style={{ maxHeight: "72vh" }}
        >
          <div style={{ width: CANVAS_W * scale, height: layout.H * scale }}>
            <div
              className="relative origin-top-left"
              style={{
                width: CANVAS_W,
                height: layout.H,
                transform: `scale(${scale})`,
              }}
            >
              <svg
                className="pointer-events-none absolute inset-0"
                width={CANVAS_W}
                height={layout.H}
              >
                {layout.blocks.map((b) => {
                  const active = inSelectedCat(b.c);
                  const dim = q && !catMatch(b.c);
                  return (
                    <g key={b.c.id} opacity={dim ? 0.25 : 1}>
                      <path
                        d={curve(PAD + ROOT_W, layout.rootCy, CAT_X, b.cy)}
                        fill="none"
                        stroke={
                          active
                            ? "var(--color-brand-navy)"
                            : "var(--color-ink)"
                        }
                        strokeOpacity={active ? 1 : 0.18}
                        strokeWidth={active ? 2 : 1.5}
                        strokeDasharray={b.c.active ? undefined : "5 5"}
                      />
                      {isOpen(b.c.id) &&
                        Array.from({ length: b.c.subs.length + 1 }).map(
                          (_, j) => {
                            const sy =
                              b.subsTop + j * (SUB_H + SUB_GAP) + SUB_H / 2;
                            const ghost = j === b.c.subs.length;
                            return (
                              <path
                                key={j}
                                d={curve(CAT_X + CAT_W, b.cy, SUB_X, sy)}
                                fill="none"
                                stroke={
                                  active && !ghost
                                    ? "var(--color-brand-navy)"
                                    : "var(--color-ink)"
                                }
                                strokeOpacity={
                                  active && !ghost ? 0.8 : ghost ? 0.1 : 0.15
                                }
                                strokeWidth={active && !ghost ? 1.75 : 1.25}
                                strokeDasharray={ghost ? "3 5" : undefined}
                              />
                            );
                          }
                        )}
                    </g>
                  );
                })}
                <path
                  d={curve(PAD + ROOT_W, layout.rootCy, CAT_X, layout.ghostCy)}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeOpacity="0.12"
                  strokeWidth="1.25"
                  strokeDasharray="3 5"
                />
              </svg>

              <div
                className="absolute flex flex-col justify-center rounded-2xl bg-[var(--color-brand-navy)] px-4 text-white shadow-lg"
                style={{
                  left: PAD,
                  top: layout.rootCy - ROOT_H / 2,
                  width: ROOT_W,
                  height: ROOT_H,
                }}
              >
                <div className="flex items-center gap-2">
                  <Ico
                    d={I.store}
                    className="h-4 w-4 text-[var(--color-brand-orange)]"
                  />
                  <span className="text-sm font-semibold">Marketplace</span>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums">
                  {stats.products.toLocaleString()}
                </p>
                <p className="text-[11px] text-white/55">
                  {stats.cats} active · {stats.subs} subs
                </p>
              </div>

              {layout.blocks.map((b) => {
                const c = b.c;
                const total = totalOf(c);
                const dim = q && !catMatch(c);
                const hit = q && c.name.toLowerCase().includes(q);
                const pct = Math.round((total / grand) * 100);
                return (
                  <div key={c.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelection({ type: "cat", id: c.id })}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        setSelection({ type: "cat", id: c.id })
                      }
                      className={
                        "group absolute cursor-pointer rounded-xl border bg-white p-3 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--color-brand-navy)]/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)]/30 " +
                        (catSelected(c)
                          ? "border-[var(--color-brand-navy)] ring-2 ring-[var(--color-brand-navy)]/25 "
                          : hit
                          ? "border-[var(--color-brand-orange)] ring-2 ring-[var(--color-brand-orange)]/25 "
                          : "border-[var(--color-line)] ") +
                        (c.active ? "" : "border-dashed ") +
                        (dim ? "opacity-30" : "")
                      }
                      style={{
                        left: CAT_X,
                        top: b.cy - CAT_H / 2,
                        width: CAT_W,
                        height: CAT_H,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={
                            "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-bold " +
                            (c.active
                              ? "bg-[var(--color-brand-navy)] text-white"
                              : "bg-[var(--color-ink)]/10 text-[var(--color-ink)]/40")
                          }
                        >
                          {(c.name || "?")[0]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {c.name || "Untitled"}
                          </p>
                          <p className="truncate text-[11px] text-[var(--color-ink)]/50">
                            {total.toLocaleString()} products · {c.commission}%
                            fee
                            {!c.active && " · Hidden"}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded((cur) => ({
                              ...cur,
                              [c.id]: !isOpen(c.id),
                            }));
                          }}
                          aria-label={isOpen(c.id) ? "Collapse" : "Expand"}
                          className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md text-[var(--color-ink)]/45 hover:bg-[var(--color-ink)]/5"
                        >
                          <Ico
                            d={I.chevron}
                            className={
                              "h-4 w-4 transition-transform " +
                              (isOpen(c.id) ? "-rotate-90" : "")
                            }
                          />
                        </button>
                      </div>
                      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--color-ink)]/[0.07]">
                        <div
                          className="h-full rounded-full bg-[var(--color-brand-navy)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-[var(--color-ink)]/40">
                        <span>{pct}% of catalog</span>
                        <span>{c.revenue}</span>
                      </div>
                      {c.pending > 0 && (
                        <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--color-brand-orange)] px-1 text-[10px] font-bold text-white">
                          {c.pending}
                        </span>
                      )}
                    </div>

                    {isOpen(c.id) && (
                      <>
                        {c.subs.map((s, j) => {
                          const sel =
                            selection?.type === "sub" &&
                            selection.subId === s.id;
                          const sHit = q && s.name.toLowerCase().includes(q);
                          const sDim = q && !subMatch(s);
                          return (
                            <div
                              key={s.id}
                              role="button"
                              tabIndex={0}
                              onClick={() =>
                                setSelection({
                                  type: "sub",
                                  catId: c.id,
                                  subId: s.id,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                setSelection({
                                  type: "sub",
                                  catId: c.id,
                                  subId: s.id,
                                })
                              }
                              className={
                                "absolute flex cursor-pointer items-center justify-between gap-2 rounded-full border bg-white px-4 text-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--color-brand-navy)]/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-navy)]/30 " +
                                (sel
                                  ? "border-[var(--color-brand-navy)] ring-2 ring-[var(--color-brand-navy)]/25 "
                                  : sHit
                                  ? "border-[var(--color-brand-orange)] ring-2 ring-[var(--color-brand-orange)]/25 "
                                  : "border-[var(--color-line)] ") +
                                (sDim ? "opacity-30" : "")
                              }
                              style={{
                                left: SUB_X,
                                top: b.subsTop + j * (SUB_H + SUB_GAP),
                                width: SUB_W,
                                height: SUB_H,
                              }}
                            >
                              <span className="truncate">
                                {s.name || "Untitled"}
                              </span>
                              <span className="shrink-0 text-xs tabular-nums text-[var(--color-ink)]/45">
                                {s.count}
                              </span>
                            </div>
                          );
                        })}

                        <div
                          className="absolute"
                          style={{
                            left: SUB_X,
                            top: b.subsTop + c.subs.length * (SUB_H + SUB_GAP),
                            width: SUB_W,
                            height: SUB_H,
                          }}
                        >
                          {addingSub === c.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                addSub(c);
                              }}
                              className="flex h-full items-center rounded-full border border-[var(--color-brand-navy)] bg-white pl-4 pr-1"
                            >
                              <input
                                autoFocus
                                value={subText}
                                onChange={(e) => setSubText(e.target.value)}
                                onBlur={() => !subText && setAddingSub(null)}
                                placeholder="Name, then Enter"
                                className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-ink)]/35"
                              />
                              <button
                                type="submit"
                                aria-label="Add"
                                className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full bg-[var(--color-brand-navy)] text-white"
                              >
                                <Ico d={I.check} className="h-3.5 w-3.5" />
                              </button>
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                setAddingSub(c.id);
                                setSubText("");
                              }}
                              className="flex h-full w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-dashed border-[var(--color-ink)]/25 text-xs font-medium text-[var(--color-ink)]/45 transition-colors hover:border-[var(--color-brand-navy)] hover:text-[var(--color-brand-navy)]"
                            >
                              <Ico d={I.plus} className="h-3.5 w-3.5" />
                              Add subcategory
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => {
                  setDraft(emptyDraft);
                  setSelection({ type: "new" });
                }}
                className="absolute flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-ink)]/25 text-sm font-medium text-[var(--color-ink)]/45 transition-colors hover:border-[var(--color-brand-navy)] hover:text-[var(--color-brand-navy)]"
                style={{
                  left: CAT_X,
                  top: layout.ghostTop,
                  width: CAT_W,
                  height: GHOST_H,
                }}
              >
                <Ico d={I.plus} /> Add category
              </button>
            </div>
          </div>
        </div>

        {inspectorOpen && (
          <>
            <div
              onClick={() => setSelection(null)}
              className="fixed inset-0 z-30 bg-[var(--color-brand-navy)]/40 lg:hidden"
            />
            <aside className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-[var(--color-line)] bg-white shadow-2xl lg:sticky lg:top-4 lg:z-auto lg:max-h-[72vh] lg:self-start lg:rounded-2xl lg:shadow-none">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-line)] bg-white px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--color-ink)]/45">
                    {selection.type === "new"
                      ? "New category"
                      : selection.type === "cat"
                      ? "Category"
                      : `Subcategory in ${selCat?.name}`}
                  </p>
                  <h2 className="truncate text-base font-semibold">
                    {selection.type === "new"
                      ? draft.name || "Untitled"
                      : selection.type === "cat"
                      ? selCat?.name || "Untitled"
                      : selSub?.name || "Untitled"}
                  </h2>
                  {selection.type !== "new" && (
                    <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[var(--color-ink)]/40">
                      <Ico d={I.clock} className="h-3 w-3" />
                      Edited {selCat?.modifiedAt} by {selCat?.modifiedBy}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {selection.type !== "new" && (
                    <button
                      onClick={handleDeleteClick}
                      aria-label="Delete"
                      className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-rose-500 hover:bg-rose-50"
                    >
                      <Ico d={I.trash} />
                    </button>
                  )}
                  <button
                    onClick={() => setSelection(null)}
                    aria-label="Close"
                    className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--color-ink)]/55 hover:bg-[var(--color-ink)]/5"
                  >
                    <Ico d={I.x} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5">
                {selection.type === "new" && (
                  <>
                    <label className="block">
                      <span className="text-sm font-medium">Name</span>
                      <input
                        autoFocus
                        value={draft.name}
                        onChange={(e) =>
                          setDraft({ ...draft, name: e.target.value })
                        }
                        placeholder="e.g. Pet Supplies"
                        className="mt-1.5 w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">Description</span>
                      <textarea
                        value={draft.desc}
                        onChange={(e) =>
                          setDraft({ ...draft, desc: e.target.value })
                        }
                        rows={2}
                        className="mt-1.5 w-full resize-none rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]"
                      />
                    </label>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">Commission</span>
                        <span className="text-lg font-semibold tabular-nums">
                          {draft.commission}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={draft.commission}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            commission: Number(e.target.value),
                          })
                        }
                        className="mt-2 w-full cursor-pointer accent-[var(--color-brand-orange)]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Visible to customers
                      </span>
                      <Toggle
                        on={draft.active}
                        onChange={() =>
                          setDraft({ ...draft, active: !draft.active })
                        }
                        label="Visible"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Require approval
                      </span>
                      <Toggle
                        on={draft.requireApproval}
                        onChange={() =>
                          setDraft({
                            ...draft,
                            requireApproval: !draft.requireApproval,
                          })
                        }
                        label="Require approval"
                      />
                    </div>
                    {draft.name && newErr && (
                      <p className="text-sm font-medium text-[var(--color-brand-orange-dark)]">
                        {newErr}
                      </p>
                    )}
                    <button
                      onClick={createCat}
                      disabled={!!newErr}
                      className="w-full cursor-pointer rounded-xl bg-[var(--color-brand-orange)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-orange-dark)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Create category
                    </button>
                  </>
                )}

                {selection.type === "cat" && selCat && (
                  <>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        ["Products", totalOf(selCat).toLocaleString()],
                        [
                          "Share",
                          `${Math.round((totalOf(selCat) / grand) * 100)}%`,
                        ],
                        ["Pending", selCat.pending],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="rounded-xl bg-[var(--color-brand-cream)] py-2.5"
                        >
                          <p className="text-base font-semibold tabular-nums">
                            {v}
                          </p>
                          <p className="text-[11px] text-[var(--color-ink)]/50">
                            {k}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-[var(--color-line)] bg-white p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                          Revenue
                        </p>
                        <p className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink)]">
                          {selCat.revenue}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--color-line)] bg-white p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]/45">
                          Attributes
                        </p>
                        <p className="mt-1 text-base font-bold tabular-nums text-[var(--color-ink)]">
                          {selCat.attributes}
                        </p>
                      </div>
                    </div>

                    {selCat.pending > 0 && (
                      <a
                        href="/catalog"
                        className="block rounded-xl border border-[var(--color-brand-orange)]/40 bg-[var(--color-brand-orange)]/8 px-4 py-2.5 text-center text-sm font-medium text-[var(--color-brand-orange-dark)] hover:bg-[var(--color-brand-orange)]/15"
                      >
                        Review {selCat.pending} pending product
                        {selCat.pending > 1 ? "s" : ""} →
                      </a>
                    )}

                    <label className="block">
                      <span className="text-sm font-medium">Name</span>
                      <input
                        value={selCat.name}
                        onChange={(e) =>
                          updateCat(selCat.id, { name: e.target.value })
                        }
                        className="mt-1.5 w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]"
                      />
                      {dupName && (
                        <span className="mt-1 block text-xs font-medium text-[var(--color-brand-orange-dark)]">
                          Another category already uses this name
                        </span>
                      )}
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium">Description</span>
                      <textarea
                        value={selCat.desc}
                        onChange={(e) =>
                          updateCat(selCat.id, { desc: e.target.value })
                        }
                        rows={2}
                        className="mt-1.5 w-full resize-none rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]"
                      />
                    </label>

                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">Commission</span>
                        <span className="text-lg font-semibold tabular-nums">
                          {selCat.commission}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={selCat.commission}
                        onChange={(e) =>
                          updateCat(selCat.id, {
                            commission: Number(e.target.value),
                          })
                        }
                        className="mt-2 w-full cursor-pointer accent-[var(--color-brand-orange)]"
                      />
                    </div>

                    <div className="divide-y divide-[var(--color-line)] rounded-xl border border-[var(--color-line)]">
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">
                            Visible to customers
                          </p>
                          <p className="text-xs text-[var(--color-ink)]/45">
                            Hidden = dashed on the map
                          </p>
                        </div>
                        <Toggle
                          on={selCat.active}
                          onChange={() =>
                            updateCat(selCat.id, { active: !selCat.active })
                          }
                          label="Visible"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">
                            Require approval
                          </p>
                          <p className="text-xs text-[var(--color-ink)]/45">
                            For sensitive items
                          </p>
                        </div>
                        <Toggle
                          on={selCat.requireApproval}
                          onChange={() =>
                            updateCat(selCat.id, {
                              requireApproval: !selCat.requireApproval,
                            })
                          }
                          label="Require approval"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() =>
                          flash(
                            `Storefront preview for "${selCat.name}" — coming soon`
                          )
                        }
                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white py-2.5 text-xs font-medium text-[var(--color-ink)]/70 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                      >
                        <Ico d={I.eye} className="h-3.5 w-3.5" /> Preview
                      </button>
                      <button
                        onClick={() =>
                          flash(
                            `Editing ${selCat.attributes} attributes for "${selCat.name}"`
                          )
                        }
                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white py-2.5 text-xs font-medium text-[var(--color-ink)]/70 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                      >
                        <Ico d={I.tag} className="h-3.5 w-3.5" /> Attributes
                      </button>
                      <a
                        href={`/admin/dashboard/categories/${selCat.id}`}
                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[var(--color-line)] bg-white py-2.5 text-xs font-medium text-[var(--color-ink)]/70 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                      >
                        <Ico d={I.externalLink} className="h-3.5 w-3.5" /> Full
                      </a>
                    </div>

                    <p className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]/45">
                      <Ico
                        d={I.check}
                        className="h-3.5 w-3.5 text-[var(--color-brand-teal)]"
                      />{" "}
                      All changes saved
                    </p>

                    <div className="border-t border-[var(--color-line)] pt-4">
                      {confirmDelete ? (
                        <div className="space-y-2">
                          <p className="text-xs text-[var(--color-ink)]/60">
                            {totalOf(selCat) > 0
                              ? `${totalOf(
                                  selCat
                                )} products will be moved to Uncategorized.`
                              : "This category will be permanently deleted."}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmDelete(false)}
                              className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] py-2.5 text-sm font-medium text-[var(--color-ink)]/70 hover:bg-[var(--color-ink)]/5"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => deleteCat(selCat)}
                              className="flex-1 cursor-pointer rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                              Yes, delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <Ico d={I.trash} /> Delete category
                        </button>
                      )}
                    </div>
                  </>
                )}

                {selection.type === "sub" && selCat && selSub && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-xl bg-[var(--color-brand-cream)] py-2.5">
                        <p className="text-base font-semibold tabular-nums">
                          {selSub.count}
                        </p>
                        <p className="text-[11px] text-[var(--color-ink)]/50">
                          Products
                        </p>
                      </div>
                      <div className="rounded-xl bg-[var(--color-brand-cream)] py-2.5">
                        <p className="text-base font-semibold tabular-nums">
                          {totalOf(selCat)
                            ? Math.round((selSub.count / totalOf(selCat)) * 100)
                            : 0}
                          %
                        </p>
                        <p className="text-[11px] text-[var(--color-ink)]/50">
                          Of {selCat.name}
                        </p>
                      </div>
                    </div>

                    <label className="block">
                      <span className="text-sm font-medium">Name</span>
                      <input
                        value={selSub.name}
                        onChange={(e) =>
                          updateSub(selCat.id, selSub.id, {
                            name: e.target.value,
                          })
                        }
                        className="mt-1.5 w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-medium">Belongs to</span>
                      <select
                        value={selCat.id}
                        onChange={(e) => moveSub(selCat, selSub, e.target.value)}
                        className="mt-1.5 w-full cursor-pointer rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]"
                      >
                        {cats.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <span className="mt-1 block text-xs text-[var(--color-ink)]/45">
                        Change this to move the subcategory and its products.
                      </span>
                    </label>

                    <p className="flex items-center gap-1.5 text-xs text-[var(--color-ink)]/45">
                      <Ico
                        d={I.check}
                        className="h-3.5 w-3.5 text-[var(--color-brand-teal)]"
                      />{" "}
                      All changes saved
                    </p>

                    <div className="border-t border-[var(--color-line)] pt-4">
                      {confirmDelete ? (
                        <div className="space-y-2">
                          <p className="text-xs text-[var(--color-ink)]/60">
                            {selSub.count > 0
                              ? `${selSub.count} products will be moved to Uncategorized.`
                              : "This subcategory will be permanently deleted."}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setConfirmDelete(false)}
                              className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] py-2.5 text-sm font-medium text-[var(--color-ink)]/70 hover:bg-[var(--color-ink)]/5"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => deleteSub(selCat, selSub)}
                              className="flex-1 cursor-pointer rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                              Yes, delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <Ico d={I.trash} /> Delete subcategory
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </aside>
          </>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[var(--color-brand-navy)] px-5 py-2.5 text-sm text-white shadow-2xl">
          <Ico
            d={I.check}
            className="h-4 w-4 text-[var(--color-brand-teal)]"
          />{" "}
          {toast}
        </div>
      )}
    </div>
  );
};

export default Page;