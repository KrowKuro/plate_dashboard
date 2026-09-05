import { useStore } from '../store/AppStore.jsx';
import { formatNumber, formatCompact } from '../lib/insuranceFormatters.js';
import { Building2, Car, ShieldCheck, ShieldAlert, BarChart3, PieChart } from 'lucide-react';

export default function ReportsPage() {
  const { stats } = useStore();

  const activePct = stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : '0';
  const expiredPct = stats.total > 0 ? ((stats.expired / stats.total) * 100).toFixed(1) : '0';
  const ownerPct = stats.total > 0 ? ((stats.withOwner / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="border-b border-line-soft pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-ink flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-accent" />
          Analytics & Policy Ledger Reports
        </h1>
        <p className="text-xs text-[#9a9587] mt-0.5">
          Detailed metrics across insurance companies, vehicle brands, and contract types
        </p>
      </div>

      {/* Grid: 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-line bg-surface space-y-1">
          <span className="text-xs text-ink-3 font-medium uppercase tracking-wider">Active Policy Ratio</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400">{activePct}%</span>
            <span className="text-xs text-ink-3">({formatCompact(stats.active)} active)</span>
          </div>
          <p className="text-[11px] text-ink-3">Policies with valid insurance coverage</p>
        </div>

        <div className="p-4 rounded-xl border border-line bg-surface space-y-1">
          <span className="text-xs text-ink-3 font-medium uppercase tracking-wider">Expired Policy Ratio</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-red-400">{expiredPct}%</span>
            <span className="text-xs text-ink-3">({formatCompact(stats.expired)} expired)</span>
          </div>
          <p className="text-[11px] text-ink-3">Policies requiring immediate renewal</p>
        </div>

        <div className="p-4 rounded-xl border border-line bg-surface space-y-1">
          <span className="text-xs text-ink-3 font-medium uppercase tracking-wider">Owner Number in JSON</span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-accent-hi">{ownerPct}%</span>
            <span className="text-xs text-ink-3">({formatCompact(stats.withOwner)} specified)</span>
          </div>
          <p className="text-[11px] text-ink-3">Records with owner phone field in JSON dataset</p>
        </div>
      </div>

      {/* Grid: Companies Breakdown & Vehicle Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Breakdown */}
        <div className="rounded-xl border border-line bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-sm text-ink">Insurance Company Distribution</h3>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
            {stats.companyBreakdown.map((c) => {
              const pct = stats.total > 0 ? ((c.count / stats.total) * 100).toFixed(1) : '0';
              return (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink truncate max-w-[200px]">{c.name}</span>
                    <span className="font-mono text-ink-3 text-[11px]">
                      <b className="text-ink">{formatNumber(c.count)}</b> ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Brand Breakdown */}
        <div className="rounded-xl border border-line bg-surface p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-sm text-ink">Top Registered Vehicle Brands</h3>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-1">
            {stats.brandBreakdown.slice(0, 10).map((b) => {
              const pct = stats.total > 0 ? ((b.count / stats.total) * 100).toFixed(1) : '0';
              return (
                <div key={b.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink truncate max-w-[200px]">{b.name}</span>
                    <span className="font-mono text-ink-3 text-[11px]">
                      <b className="text-ink">{formatNumber(b.count)}</b> ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
