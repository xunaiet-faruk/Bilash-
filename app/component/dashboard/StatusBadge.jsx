const tones = { delivered: "bg-emerald-50 text-emerald-700", paid: "bg-emerald-50 text-emerald-700", active: "bg-emerald-50 text-emerald-700", pending: "bg-amber-50 text-amber-700", processing: "bg-blue-50 text-blue-700", cancelled: "bg-red-50 text-red-700", draft: "bg-slate-100 text-slate-600" };
export default function StatusBadge({ status }) { const value = String(status || "pending").toLowerCase(); return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tones[value] || tones.pending}`}>{value}</span>; }
const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-brand-teal/15 text-brand-teal',
    completed: 'bg-brand-teal/15 text-brand-teal',
    cancelled: 'bg-red-100 text-red-600',
    active: 'bg-brand-teal/15 text-brand-teal',
    inactive: 'bg-ink/10 text-ink/50',
};

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || 'bg-ink/10 text-ink/50';
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${style}`}>
            {status}
        </span>
    );
};

export default StatusBadge;