import OrdersChart from "../../component/dashboard/orders-chart";
const stats = [
  {
    label: "Total revenue",
    value: "$48,320",
    change: "+12.4%",
    positive: true,
    accent: "orange",
    trend: [12, 18, 15, 22, 28, 24, 32],
  },
  {
    label: "Active users",
    value: "2,845",
    change: "+4.1%",
    positive: true,
    accent: "cyan",
    trend: [8, 12, 10, 15, 14, 18, 22],
  },
  {
    label: "New orders",
    value: "312",
    change: "-2.3%",
    positive: false,
    accent: "rose",
    trend: [20, 18, 22, 19, 15, 17, 14],
  },
  {
    label: "Avg. order value",
    value: "$154.80",
    change: "+1.8%",
    positive: true,
    accent: "emerald",
    trend: [10, 12, 11, 14, 15, 14, 17],
  },
];

const activity = [
  { name: "Mahin Chowdhury", action: "placed an order · #A-2291", time: "2m ago", color: "cyan" },
  { name: "Nusrat Jahan", action: "requested a refund · #A-2287", time: "18m ago", color: "orange" },
  { name: "Tanvir Ahmed", action: "upgraded to Pro plan", time: "1h ago", color: "emerald" },
  { name: "Farzana Akter", action: "left a product review", time: "3h ago", color: "violet" },
  { name: "Sadman Rahman", action: "placed an order · #A-2280", time: "5h ago", color: "cyan" },
];

const topProducts = [
  { name: "Wireless Earbuds Pro", sales: 128, revenue: "$11,392", growth: "+18%" },
  { name: "Smart Watch S9", sales: 96, revenue: "$19,104", growth: "+12%" },
  { name: "USB-C Hub 7-in-1", sales: 74, revenue: "$3,367", growth: "+9%" },
  { name: "4K Webcam", sales: 58, revenue: "$8,642", growth: "+6%" },
];

const accentMap = {
  orange: { text: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-500/20", dot: "bg-orange-400" },
  cyan: { text: "text-cyan-500", bg: "bg-cyan-500/10", ring: "ring-cyan-500/20", dot: "bg-cyan-400" },
  rose: { text: "text-rose-500", bg: "bg-rose-500/10", ring: "ring-rose-500/20", dot: "bg-rose-400" },
  emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20", dot: "bg-emerald-400" },
  violet: { text: "text-violet-500", bg: "bg-violet-500/10", ring: "ring-violet-500/20", dot: "bg-violet-400" },
};

function Sparkline({ data, id }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 30;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full sm:h-8" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={areaPoints} fill={`url(#spark-${id})`} stroke="none" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Page = () => {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 sm:text-[11px]">
              Live overview
            </span>
          </div>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Good morning, Rafiul 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:mt-1.5 sm:text-sm">
            Here&apos;s what&apos;s happening with{" "}
            <span className="font-semibold text-slate-700">Bilash</span> today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className="flex-1 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:flex-none sm:px-4 sm:text-sm">
            Download report
          </button>
          <button className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98] sm:flex-none sm:px-4 sm:text-sm">
            + New order
          </button>
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => {
          const a = accentMap[s.accent];
          return (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
            >
              <div className={`pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full ${a.bg} blur-2xl`} />
              <div className="relative">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                    {s.label}
                  </p>
                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${a.bg} ring-1 ring-inset ${a.ring} ${a.text} sm:h-7 sm:w-7`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 sm:h-3.5 sm:w-3.5">
                      {s.positive ? (
                        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                  </span>
                </div>

                <p className="mt-2.5 text-xl font-bold tabular-nums tracking-tight text-slate-900 sm:mt-3 sm:text-2xl">
                  {s.value}
                </p>

                <div className={`mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold sm:mt-2 sm:text-xs ${s.positive ? "text-emerald-600" : "text-rose-600"}`}>
                  <span>{s.change}</span>
                  <span className="text-slate-400">vs last week</span>
                </div>

                <div className={`mt-2 sm:mt-3 ${a.text}`}>
                  <Sparkline data={s.trend} id={`s-${i}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrdersChart />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
              Recent activity
            </h2>
            <button className="cursor-pointer whitespace-nowrap text-[11px] font-medium text-orange-600 hover:text-orange-700 sm:text-xs">
              View all
            </button>
          </div>
          <ul className="mt-3 flex flex-col sm:mt-4">
            {activity.map((a) => {
              const ac = accentMap[a.color];
              return (
                <li key={a.name + a.time} className="flex items-start gap-2.5 border-b border-slate-100 py-2.5 last:border-0 sm:gap-3 sm:py-3">
                  <span className={"mt-1.5 h-2 w-2 shrink-0 rounded-full " + ac.dot} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-800 sm:text-sm">
                      {a.name}
                    </p>
                    <p className="truncate text-[11px] text-slate-500 sm:text-xs">
                      {a.action}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400 sm:text-[11px]">
                    {a.time}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
              Top products
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Best performers this week
            </p>
          </div>
          <button className="cursor-pointer whitespace-nowrap text-[11px] font-medium text-orange-600 hover:text-orange-700 sm:text-xs">
            View all
          </button>
        </div>

        <div className="mt-4 -mx-4 overflow-x-auto sm:mx-0 sm:mt-5">
          <table className="w-full min-w-[520px] text-xs sm:min-w-0 sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                <th className="px-4 pb-3 font-medium sm:px-0 sm:pr-4">#</th>
                <th className="pr-4 pb-3 font-medium">Product</th>
                <th className="pr-4 pb-3 font-medium">Sales</th>
                <th className="pr-4 pb-3 font-medium">Revenue</th>
                <th className="px-4 pb-3 text-right font-medium sm:px-0">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((p, i) => (
                <tr key={p.name} className="group transition-colors hover:bg-slate-50/60">
                  <td className="px-4 py-3 pr-4 sm:px-0 sm:py-3.5">
                    <span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 sm:h-7 sm:w-7 sm:text-xs">
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-slate-800 sm:py-3.5">
                    <span className="block max-w-[140px] truncate sm:max-w-none">
                      {p.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-slate-600 sm:py-3.5">
                    {p.sales}
                  </td>
                  <td className="py-3 pr-4 tabular-nums font-semibold text-slate-800 sm:py-3.5">
                    {p.revenue}
                  </td>
                  <td className="px-4 py-3 text-right sm:px-0 sm:py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 sm:text-[11px]">
                      ↑ {p.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;