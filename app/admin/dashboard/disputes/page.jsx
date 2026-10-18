"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { 
  ShieldAlert, Search, Send, CheckCircle2, 
  RotateCcw, XCircle, MessageSquare, Paperclip
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   MOCK DATA (API অনুযায়ী সাজানো)
   ═══════════════════════════════════════════════════════════ */
const initialDisputes = [
  {
    id: "DSP-102",
    orderId: "A-2291",
    customer: "Mahin Chowdhury",
    seller: "Bilash Traders",
    amount: 2450,
    status: "open", // open | resolved | refunded | rejected
    priority: "high",
    reason: "Item not as described",
    date: "2026-10-14 09:30 AM",
    messages: [
      { id: 1, sender: "customer", name: "Mahin Chowdhury", text: "The earbuds are not working properly. Only the left side works.", time: "09:30 AM" },
      { id: 2, sender: "seller", name: "Bilash Traders", text: "It was working when we shipped. Maybe it got damaged in transit.", time: "10:15 AM" },
    ],
  },
  {
    id: "DSP-101",
    orderId: "A-2288",
    customer: "Farzana Akter",
    seller: "Zaman Retail",
    amount: 780,
    status: "open",
    priority: "medium",
    reason: "Wrong item delivered",
    date: "2026-10-13 02:00 PM",
    messages: [
      { id: 1, sender: "customer", name: "Farzana Akter", text: "I ordered a coffee mug but received a yoga mat.", time: "02:00 PM" },
    ],
  },
  {
    id: "DSP-099",
    orderId: "A-2275",
    customer: "Kamal Hossain",
    seller: "Nur Enterprise",
    amount: 1250,
    status: "refunded",
    priority: "low",
    reason: "Item arrived damaged",
    date: "2026-10-10 11:20 AM",
    messages: [
      { id: 1, sender: "customer", name: "Kamal Hossain", text: "Box was broken.", time: "11:20 AM" },
      { id: 2, sender: "admin", name: "You", text: "Refunded via bKash. Sorry for the issue.", time: "12:00 PM" },
    ],
  },
];

const statusMap = {
  open: { label: "Open", bg: "bg-orange-100 text-orange-700 ring-orange-200" },
  resolved: { label: "Resolved", bg: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
  refunded: { label: "Refunded", bg: "bg-blue-100 text-blue-700 ring-blue-200" },
  rejected: { label: "Rejected", bg: "bg-rose-100 text-rose-700 ring-rose-200" },
};

const priorityMap = {
  high: "text-rose-600 bg-rose-50 ring-rose-200",
  medium: "text-amber-600 bg-amber-50 ring-amber-200",
  low: "text-slate-600 bg-slate-50 ring-slate-200",
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function DisputesPage() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [selectedId, setSelectedId] = useState(initialDisputes[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // ফিল্টার করা লিস্ট
  const filtered = disputes.filter(d => {
    if (filter !== "all" && d.status !== filter) return false;
    if (query && !`${d.id} ${d.orderId} ${d.customer}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const activeDispute = disputes.find(d => d.id === selectedId);

  // অ্যাডমিন রিপ্লাই পাঠানো
  const handleReply = () => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    
    setTimeout(() => {
      setDisputes(prev => prev.map(d => {
        if (d.id === selectedId) {
          return {
            ...d,
            messages: [...d.messages, {
              id: Date.now(),
              sender: "admin",
              name: "You",
              text: replyText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]
          };
        }
        return d;
      }));
      setReplyText("");
      setIsReplying(false);
      toast.success("Reply sent to both parties");
    }, 600);
  };

  // অ্যাকশন নেওয়া (Refund / Reject / Resolve)
  const handleAction = (action) => {
    if (!confirm(`Are you sure you want to mark this as ${action}?`)) return;

    setDisputes(prev => prev.map(d => 
      d.id === selectedId ? { ...d, status: action } : d
    ));
    toast.success(`Dispute marked as ${action}`);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full gap-4 p-4 sm:p-6 bg-slate-50/50">
      <Toaster position="bottom-center" />

      {/* ═══════ LEFT: LIST ═══════ */}
      <div className="flex w-[320px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            <h1 className="text-lg font-bold text-slate-900">Disputes</h1>
            <span className="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
              {disputes.filter(d => d.status === "open").length} open
            </span>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ID or customer..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2 pt-2">
          {["all", "open", "resolved"].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 rounded-t-lg py-2 text-xs font-semibold capitalize transition-colors ${
                filter === t ? "bg-orange-50 text-orange-700 border-b-2 border-orange-500" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`w-full rounded-xl p-3 text-left transition-all mb-1 ${
                selectedId === d.id ? "bg-orange-50 ring-1 ring-orange-200" : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-slate-900">{d.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${statusMap[d.status].bg}`}>
                  {statusMap[d.status].label}
                </span>
              </div>
              <p className="truncate text-sm font-semibold text-slate-800">{d.reason}</p>
              <p className="truncate text-xs text-slate-500 mt-0.5">Order: {d.orderId} · {d.customer}</p>
            </button>
          ))}
          {filtered.length === 0 && <p className="text-center text-sm text-slate-500 py-10">No disputes found</p>}
        </div>
      </div>

      {/* ═══════ RIGHT: DETAIL & CHAT ═══════ */}
      {activeDispute ? (
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900">{activeDispute.reason}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${priorityMap[activeDispute.priority]}`}>
                  {activeDispute.priority} priority
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Order <span className="font-semibold text-slate-800">#{activeDispute.orderId}</span> · 
                Amount <span className="font-semibold text-slate-800">৳{activeDispute.amount}</span> · 
                Opened {activeDispute.date}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAction("resolved")} className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="h-4 w-4" /> Resolve
              </button>
              <button onClick={() => handleAction("rejected")} className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors">
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button onClick={() => handleAction("refunded")} className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors">
                <RotateCcw className="h-4 w-4" /> Refund
              </button>
            </div>
          </div>

          {/* Info Bar */}
          <div className="flex gap-6 border-b border-slate-100 bg-slate-50/50 px-5 py-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Customer:</span>
              <span className="font-semibold text-slate-800">{activeDispute.customer}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Seller:</span>
              <span className="font-semibold text-slate-800">{activeDispute.seller}</span>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {activeDispute.messages.map((msg, i) => {
              const isAdmin = msg.sender === "admin";
              const isCustomer = msg.sender === "customer";
              
              return (
                <div key={i} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-600">
                      {isAdmin ? "You (Admin)" : msg.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isCustomer ? "bg-blue-100 text-blue-600" : isAdmin ? "bg-slate-200 text-slate-600" : "bg-violet-100 text-violet-600"}`}>
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    isAdmin ? "bg-slate-900 text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Box */}
          {activeDispute.status === "open" ? (
            <div className="border-t border-slate-100 p-4 bg-white">
              <div className="flex items-end gap-2">
                <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message to both parties..."
                  className="max-h-32 min-h-[40px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-slate-900 focus:bg-white transition-all"
                  rows={1}
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || isReplying}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500 text-white shadow-md hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> Both customer and seller will see this message.
              </p>
            </div>
          ) : (
            <div className="border-t border-slate-100 p-4 bg-slate-50 text-center">
              <p className="text-sm font-semibold text-slate-600">
                This dispute is closed. Marked as {activeDispute.status}.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white">
          <div className="text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-500">Select a dispute to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}