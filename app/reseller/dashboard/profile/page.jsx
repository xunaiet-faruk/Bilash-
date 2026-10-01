"use client";

import { useRef, useState } from "react";

/* ==================== FAKE DATA (আপনার structure অক্ষুণ্ণ রাখা হয়েছে) ==================== */
const initialProfile = {
  storeName: "Sadia's Fashion Hub",
  ownerName: "Sadia Islam",
  slug: "sadias-fashion-hub",
  email: "sadia@bilash.io",
  phone: "+880 1712-345678",
  address: "House 12, Road 5, Dhanmondi, Dhaka 1205",
  bio: "Premium fashion & lifestyle products at unbeatable prices. Trusted by 2,000+ happy customers across Bangladesh.",
  avatar: null,
  verified: true,
  joinedAt: "Sep 1, 6",
  // Bank
  bankName: "Dutch-Bangla Bank",
  accountName: "Sadia Islam",
  accountNumber: "1234567890123",
  branchName: "Dhanmondi Branch",
  routingNumber: "090261234",
  // Stats
  stats: {
    rating: 4.8,
    followers: 2340,
    products: 84,
    totalSales: "৳ 48,320",
  },
};

const verificationBadges = [
  { label: "Email Verified", done: true, icon: "✉️" },
  { label: "Phone Verified", done: true, icon: "📱" },
  { label: "NID Verified", done: true, icon: "🆔" },
  { label: "Bank Linked", done: false, icon: "🏦" },
];

const sections = [
  { id: "general", label: "General" },
  { id: "bank", label: "Bank details" },
  { id: "verification", label: "Verification" },
];

/* ==================== COMPONENT ==================== */
export default function ResellerProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialProfile);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const refs = { general: useRef(null), bank: useRef(null), verification: useRef(null) };

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const handleCancel = () => { setFormData(profile); setIsEditing(false); };

  const jumpTo = (id) => {
    setActiveSection(id);
    refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const initials = profile.storeName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl text-[var(--color-ink)]">
      {saved && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[var(--color-brand-navy)] px-4 py-2.5 text-sm font-medium text-white shadow-xl">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-brand-teal)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="h-3 w-3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          Profile updated
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* ========== LEFT: sticky identity card ========== */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white">
            <div className="flex flex-col items-center p-6 text-center">
              <div className="relative">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-[var(--color-brand-navy)] text-2xl font-bold text-white">{initials}</div>
                {profile.verified && (
                  <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[var(--color-brand-teal)] text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-lg font-semibold leading-tight">{profile.storeName}</h1>
              <p className="text-xs text-[var(--color-ink)]/45">@{profile.slug}</p>

              <p className="mt-3 flex items-center gap-1 text-sm">
                <span className="text-[var(--color-brand-orange)]">★</span>
                <span className="font-semibold">{profile.stats.rating}</span>
                <span className="text-[var(--color-ink)]/40">· {profile.stats.followers.toLocaleString()} followers</span>
              </p>

              <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink)]/55">{profile.bio}</p>

              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="mt-4 w-full cursor-pointer rounded-xl bg-[var(--color-brand-orange)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-orange-dark)]">
                  Edit profile
                </button>
              ) : (
                <div className="mt-4 flex w-full gap-2">
                  <button onClick={handleCancel} className="flex-1 cursor-pointer rounded-xl border border-[var(--color-line)] py-2.5 text-sm font-medium hover:border-[var(--color-ink)]">Cancel</button>
                  <button onClick={handleSave} className="flex-1 cursor-pointer rounded-xl bg-[var(--color-brand-teal)] py-2.5 text-sm font-semibold text-white hover:opacity-90">Save</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
              {[["Products", profile.stats.products], ["Total sales", profile.stats.totalSales]].map(([k, v]) => (
                <div key={k} className="px-4 py-3 text-center">
                  <p className="text-sm font-semibold tabular-nums">{v}</p>
                  <p className="text-[11px] text-[var(--color-ink)]/45">{k}</p>
                </div>
              ))}
            </div>

            <p className="border-t border-[var(--color-line)] px-5 py-3 text-center text-[11px] text-[var(--color-ink)]/40">Reseller since {profile.joinedAt}</p>
          </div>

          {/* section nav */}
          <nav className="mt-4 flex gap-1 overflow-x-auto rounded-2xl border border-[var(--color-line)] bg-white p-1 lg:flex-col lg:overflow-visible">
            {sections.map((s) => (
              <button key={s.id} onClick={() => jumpTo(s.id)} className={"shrink-0 cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors " + (activeSection === s.id ? "bg-[var(--color-brand-navy)] text-white" : "text-[var(--color-ink)]/60 hover:bg-[var(--color-ink)]/5")}>
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ========== RIGHT: content ========== */}
        <div className="min-w-0 space-y-6">
          {/* GENERAL */}
          <section ref={refs.general} className="scroll-mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <h2 className="text-base font-semibold">General information</h2>
            <p className="mt-0.5 text-sm text-[var(--color-ink)]/55">Visible to customers on your storefront.</p>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Store name" value={formData.storeName} editing={isEditing} onChange={(v) => handleChange("storeName", v)} />
              <Field label="Owner name" value={formData.ownerName} editing={isEditing} onChange={(v) => handleChange("ownerName", v)} />
              <Field label="Email" value={formData.email} editing={isEditing} onChange={(v) => handleChange("email", v)} type="email" />
              <Field label="Phone" value={formData.phone} editing={isEditing} onChange={(v) => handleChange("phone", v)} />
              <div className="sm:col-span-2"><Field label="Address" value={formData.address} editing={isEditing} onChange={(v) => handleChange("address", v)} /></div>
              <div className="sm:col-span-2"><Field label="Store bio" value={formData.bio} editing={isEditing} onChange={(v) => handleChange("bio", v)} textarea /></div>
            </div>
          </section>

          {/* BANK */}
          <section ref={refs.bank} className="scroll-mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">Bank details</h2>
                <p className="mt-0.5 text-sm text-[var(--color-ink)]/55">Commission payouts are sent here.</p>
              </div>
              <p className="shrink-0 rounded-full bg-[var(--color-brand-cream)] px-3 py-1 text-xs font-medium text-[var(--color-ink)]/60">
                Ending in {profile.accountNumber.slice(-4)}
              </p>
            </div>

            <dl className="mt-5 divide-y divide-[var(--color-line)] rounded-xl border border-[var(--color-line)]">
              {[
                ["bankName", "Bank name"], ["accountName", "Account holder"], ["accountNumber", "Account number"],
                ["branchName", "Branch name"], ["routingNumber", "Routing number"],
              ].map(([key, label]) => (
                <div key={key} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <dt className="shrink-0 text-xs font-medium text-[var(--color-ink)]/45 sm:w-40">{label}</dt>
                  <dd className="sm:flex-1 sm:text-right">
                    {isEditing ? (
                      <input value={formData[key]} onChange={(e) => handleChange(key, e.target.value)} className="w-full rounded-lg border border-[var(--color-line)] px-3 py-1.5 text-sm outline-none focus:border-[var(--color-brand-navy)] sm:w-64 sm:text-right" />
                    ) : (
                      <span className="text-sm font-medium">{profile[key]}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-[var(--color-ink)]/40">Changing these details may delay your next payout for verification.</p>
          </section>

          {/* VERIFICATION */}
          <section ref={refs.verification} className="scroll-mt-6 rounded-2xl border border-[var(--color-line)] bg-white p-6">
            <h2 className="text-base font-semibold">Verification</h2>
            <p className="mt-0.5 text-sm text-[var(--color-ink)]/55">Complete every step to unlock faster payouts.</p>

            <ol className="mt-5">
              {verificationBadges.map((v, idx) => (
                <li key={v.label} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <span className={"grid h-9 w-9 shrink-0 place-items-center rounded-full text-base " + (v.done ? "bg-[var(--color-brand-teal)]/12" : "bg-[var(--color-ink)]/[0.05]")}>{v.icon}</span>
                    {idx < verificationBadges.length - 1 && <span className="w-px flex-1 bg-[var(--color-line)]" />}
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 pb-6">
                    <div>
                      <p className="text-sm font-medium">{v.label}</p>
                      <p className={"text-xs " + (v.done ? "text-[var(--color-brand-teal)]" : "text-[var(--color-ink)]/40")}>{v.done ? "Verified" : "Not verified yet"}</p>
                    </div>
                    {v.done ? (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-brand-teal)] text-xs text-white">✓</span>
                    ) : (
                      <button className="shrink-0 cursor-pointer rounded-lg border border-[var(--color-brand-orange)] px-3 py-1.5 text-xs font-semibold text-[var(--color-brand-orange)] transition-colors hover:bg-[var(--color-brand-orange)] hover:text-white">
                        Verify now
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ==================== REUSABLE FIELD ==================== */
function Field({ label, value, editing, onChange, type = "text", textarea = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--color-ink)]/45">{label}</label>
      {editing ? (
        textarea ? (
          <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full resize-none rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]" />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-[var(--color-line)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-brand-navy)]" />
        )
      ) : (
        <p className="text-sm font-medium text-[var(--color-ink)]">{value || <span className="font-normal text-[var(--color-ink)]/35">—</span>}</p>
      )}
    </div>
  );
}