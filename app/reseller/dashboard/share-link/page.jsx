"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  MessageCircle,
  Send,
  Mail,
  Link2,
  Image,
  Sparkles,
  QrCode,
  TrendingUp,
  Percent,
  Share2,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Share,
} from "lucide-react";

const product = {
  id: "prod_8821",
  name: "Wireless Earbuds Pro X",
  price: 1199,
  sold: 342,
  images: [
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  ],
};

const initialShareData = {
  shortUrl: "share.bilash.io/8kq2Lx",
  fullUrl: "https://e-commarse-three.vercel.app/s/8kq2Lx",
  commission: { rate: 15, amount: 180, currency: "৳" },
  clicks: 214,
  channels: {
    facebook: "https://www.facebook.com/sharer/sharer.php?u=https://e-commarse-three.vercel.app/s/8kq2Lx",
    whatsapp: "https://wa.me/?text=Check%20this%20out%20https://e-commarse-three.vercel.app/s/8kq2Lx",
    telegram: "https://t.me/share/url?url=https://e-commarse-three.vercel.app/s/8kq2Lx",
    twitter: "https://twitter.com/intent/tweet?url=https://e-commarse-three.vercel.app/s/8kq2Lx",
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=https://e-commarse-three.vercel.app/s/8kq2Lx",
    pinterest: "https://pinterest.com/pin/create/button/?url=https://e-commarse-three.vercel.app/s/8kq2Lx",
    email: "mailto:?subject=Check this out&body=https://e-commarse-three.vercel.app/s/8kq2Lx",
    direct: "https://e-commarse-three.vercel.app/s/8kq2Lx",
  },
};

const analyticsData = [
  { channel: "Facebook", clicks: 112, sales: 5, earnings: "৳900", status: "Top Performing" },
  { channel: "WhatsApp", clicks: 68, sales: 3, earnings: "৳540", status: "Good" },
  { channel: "Telegram", clicks: 24, sales: 1, earnings: "৳180", status: "Moderate" },
  { channel: "Direct Link", clicks: 10, sales: 0, earnings: "৳0", status: "New" },
];

const channels = [
  { key: "facebook", label: "Facebook", icon: Share2, color: "#1877F2" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
  { key: "telegram", label: "Telegram", icon: Send, color: "#229ED9" },
  { key: "twitter", label: "Twitter / X", icon: Share, color: "#1DA1F2" },
  { key: "linkedin", label: "LinkedIn", icon: Globe, color: "#0A66C2" },
  { key: "pinterest", label: "Pinterest", icon: Image, color: "#E60023" },
  { key: "email", label: "Email", icon: Mail, color: "#EA4335" },
  { key: "direct", label: "Direct Link", icon: Link2, color: "#12203D" },
];

export default function ShareLinkCard() {
  const [data, setData] = useState(initialShareData);
  const [spinning, setSpinning] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % product.images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const copy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
  };

  const regenerate = () => {
    setSpinning(true);
    setTimeout(() => {
      const code = Math.random().toString(36).slice(2, 8);
      setData((d) => ({
        ...d,
        shortUrl: `share.bilash.io/${code}`,
        fullUrl: `https://e-commarse-three.vercel.app/s/${code}`,
      }));
      setSpinning(false);
    }, 700);
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-4 md:p-6 font-sans">
      <div className="mb-6 rounded-2xl bg-[#FFF9F2] p-5 border border-[#E7E1D6]">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="h-5 w-5 text-[#FF5A1F]" />
          <h2 className="text-base font-bold text-[#12203D]">
            How to Share & Earn in 3 Easy Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#1B1F27]">
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E7E1D6]/60 shadow-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#12203D] text-[10px] font-bold text-white">
              1
            </span>
            <p>Select your favorite social media platform from below.</p>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E7E1D6]/60 shadow-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF5A1F] text-[10px] font-bold text-white">
              2
            </span>
            <p>Copy your personal tracking link and send it to customers.</p>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#E7E1D6]/60 shadow-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0FA98A] text-[10px] font-bold text-white">
              3
            </span>
            <p>Earn ৳180 commission for every successful sale!</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E7E1D6] bg-white p-6 md:p-8 shadow-xl shadow-[#12203D]/5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E1D6] pb-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF5A1F]/10 text-[#FF5A1F]">
              <Share2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#12203D]">
                Reseller Link Generator
              </h3>
              <p className="text-xs text-[#1B1F27]/60">
                Create custom referral links with automatic tracking
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowQr(!showQr)}
            className="flex items-center gap-1.5 rounded-xl border border-[#E7E1D6] bg-[#FFF9F2] px-3 py-2 text-xs font-semibold text-[#12203D] transition-all hover:border-[#FF5A1F] hover:bg-[#FF5A1F]/5"
          >
            <QrCode className="h-4 w-4 text-[#FF5A1F]" />
            {showQr ? "Hide QR" : "Show QR"}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-[#E7E1D6] bg-[#FFF9F2] p-3">
              <div className="relative h-48 w-full overflow-hidden rounded-xl">
                <img
                  src={product.images[currentSlide]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
                />
                
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (prev) => (prev - 1 + product.images.length) % product.images.length
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 text-[#12203D] shadow-md hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % product.images.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 text-[#12203D] shadow-md hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {product.images.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        currentSlide === index
                          ? "w-4 bg-[#FF5A1F]"
                          : "w-1.5 bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#0FA98A]/10 px-2 py-0.5 text-[10px] font-bold text-[#0FA98A]">
                  <Sparkles className="h-3 w-3" /> Active Campaign
                </span>
                <h4 className="mt-1 text-sm font-bold text-[#12203D]">
                  {product.name}
                </h4>
                <div className="mt-1 flex items-center justify-between text-xs text-[#1B1F27]/70">
                  <span>Price: ৳{product.price.toLocaleString()}</span>
                  <span>Sold: {product.sold} units</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#12203D] to-[#1C2F52] p-4 text-white shadow-md">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#FFF9F2]/70">
                  Your Earnings
                </p>
                <p className="text-2xl font-extrabold text-[#FF5A1F]">
                  {data.commission.currency}
                  {data.commission.amount}{" "}
                  <span className="text-xs font-normal text-white/80">/ per sale</span>
                </p>
              </div>
              <div className="rounded-xl bg-[#FF5A1F] px-3 py-1.5 text-xs font-bold text-white">
                {data.commission.rate}% Commission
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-[#12203D] mb-1.5">
                Your Personal Tracking Link:
              </label>
              <div className="flex items-center rounded-xl border-2 border-[#12203D]/10 bg-[#FFF9F2] p-1.5 pl-3 focus-within:border-[#FF5A1F]">
                <input
                  type="text"
                  readOnly
                  value={data.shortUrl}
                  className="w-full bg-transparent text-xs font-bold text-[#12203D] focus:outline-none"
                />
                <button
                  onClick={() => copy(data.fullUrl, "main")}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    copiedKey === "main"
                      ? "bg-[#0FA98A] text-white"
                      : "bg-[#FF5A1F] text-white hover:bg-[#E04713]"
                  }`}
                >
                  {copiedKey === "main" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedKey === "main" ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#12203D]">
                  Instant Share:
                </p>
                <button
                  onClick={regenerate}
                  className="flex items-center gap-1 text-xs font-medium text-[#FF5A1F] hover:underline"
                >
                  <RefreshCw className={`h-3 w-3 ${spinning ? "animate-spin" : ""}`} />
                  New Link
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {channels.map(({ key, label, icon: Icon, color }) => {
                  const RenderIcon = Icon || Share2;
                  return (
                    <a
                      key={key}
                      href={data.channels[key]}
                      target={key === "email" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1 rounded-xl border border-[#E7E1D6] bg-white p-2 text-center transition-all hover:border-[#FF5A1F] hover:shadow-sm"
                    >
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: color }}
                      >
                        <RenderIcon className="h-4 w-4" />
                      </span>
                      <span className="text-[10px] font-semibold text-[#12203D]">
                        {label.split(" ")[0]}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {showQr && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-[#E7E1D6] bg-[#FFF9F2] p-6 text-center animate-fadeIn">
            <div className="rounded-xl border border-[#E7E1D6] bg-white p-3 shadow-inner">
              <div className="grid h-32 w-32 grid-cols-8 gap-1 bg-white p-1">
                {[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1].map((c, i) => (
                  <span key={i} className={c ? "bg-[#12203D] rounded-[1px]" : "bg-transparent"} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-xs font-bold text-[#12203D]">
              Ask your customer to scan this QR code directly
            </p>
          </div>
        )}

        <div className="mt-8 border-t border-[#E7E1D6] pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-[#12203D]">
                Platform Share Performance
              </h4>
              <p className="text-xs text-[#1B1F27]/60">
                Track clicks and earnings across different social platforms
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-lg bg-[#0FA98A]/10 px-2.5 py-1 text-xs font-bold text-[#0FA98A]">
              <TrendingUp className="h-3.5 w-3.5" /> Total Clicks: {data.clicks}
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#E7E1D6]">
            <table className="w-full text-left text-xs text-[#1B1F27]">
              <thead className="bg-[#FFF9F2] text-[#12203D] border-b border-[#E7E1D6]">
                <tr>
                  <th className="p-3 font-bold">Channel / Platform</th>
                  <th className="p-3 font-bold">Total Clicks</th>
                  <th className="p-3 font-bold">Total Sales</th>
                  <th className="p-3 font-bold">Commission Earned</th>
                  <th className="p-3 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D6] bg-white">
                {analyticsData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FFF9F2]/50 transition-colors">
                    <td className="p-3 font-semibold text-[#12203D]">
                      {row.channel}
                    </td>
                    <td className="p-3">{row.clicks} clicks</td>
                    <td className="p-3">{row.sales} sales</td>
                    <td className="p-3 font-bold text-[#FF5A1F]">
                      {row.earnings}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-block rounded-full bg-[#12203D]/5 px-2.5 py-0.5 text-[10px] font-bold text-[#12203D]">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}