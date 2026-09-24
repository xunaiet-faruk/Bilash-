const DataTable = ({ columns, rows, renderRow }) => (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-line bg-brand-cream/40">
                        {columns.map((col) => (
                            <th key={col} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-ink/40">
                                No data yet
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, i) => renderRow(row, i))
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default DataTable;