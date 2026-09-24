const StatCard = ({ label, value, trend, trendUp = true, icon, accentColor = 'brand-orange' }) => (
    <div className="rounded-2xl border border-line bg-white p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium text-ink/50">{label}</p>
                <p className="mt-1.5 font-display text-2xl font-bold text-brand-navy">{value}</p>
            </div>
            {icon && (
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${accentColor}/10 text-${accentColor}`}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                </span>
            )}
        </div>
        {trend && (
            <p className={`mt-3 flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-brand-teal' : 'text-red-500'}`}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={trendUp ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                </svg>
                {trend}
            </p>
        )}
    </div>
);

export default StatCard;