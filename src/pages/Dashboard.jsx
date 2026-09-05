import { useStore } from '../store/AppStore.jsx';
import { formatNumber, formatCompact } from '../lib/insuranceFormatters.js';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  UserX,
  ShieldAlert,
  Building2,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const { stats, setActiveTab } = useStore();
  const navigate = useNavigate();

  const handleStatClick = (tab) => {
    setActiveTab(tab);
    navigate('/items');
  };

  const topCompanies = stats.companyBreakdown.slice(0, 6);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="border-b border-line-soft pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-ink">
          Vehicle Insurance Dashboard
        </h1>
        <p className="text-xs text-ink-3 mt-0.5">
          Real-time policy ledger monitoring, expiry tracking
        </p>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Policies Card */}
        <button
          onClick={() => handleStatClick('all')}
          className="flex flex-col text-left p-4 rounded-xl border border-line bg-surface hover:border-accent/40 hover:bg-surface-2 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-ink-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Ledger</span>
            <Layers className="w-4 h-4 text-accent" />
          </div>
          <div className="font-mono text-2xl font-bold text-ink group-hover:text-accent-hi transition-colors">
            {formatNumber(stats.total)}
          </div>
          <span className="text-[11px] text-ink-3 mt-1">All policy records in database</span>
        </button>

        {/* Active Policies Card */}
        <button
          onClick={() => handleStatClick('active')}
          className="flex flex-col text-left p-4 rounded-xl border border-line bg-surface hover:border-emerald-500/40 hover:bg-surface-2 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-ink-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Policies</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-400">
            {formatNumber(stats.active)}
          </div>
          <span className="text-[11px] text-ink-3 mt-1">Currently valid coverage</span>
        </button>

        {/* Expiring Policies Card */}
        <button
          onClick={() => handleStatClick('expiring')}
          className="flex flex-col text-left p-4 rounded-xl border border-line bg-surface hover:border-amber-500/40 hover:bg-surface-2 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-ink-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expiring Soon Policies</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-amber-400">
            {formatNumber(stats.expiring)}
          </div>
          <span className="text-[11px] text-ink-3 mt-1">Soon to requiring renewal</span>
        </button>

        {/* Expired Policies Card */}
        <button
          onClick={() => handleStatClick('expired')}
          className="flex flex-col text-left p-4 rounded-xl border border-line bg-surface hover:border-red-500/40 hover:bg-surface-2 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-ink-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expired Policies</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono text-2xl font-bold text-red-400">
            {formatNumber(stats.expired)}
          </div>
          <span className="text-[11px] text-ink-3 mt-1">Expired and requiring renewal</span>
        </button>

      </div>

      {/* Grid Section: Insurance Company Market Share & Expiry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Insurance Companies Breakdown */}
        <div className="lg:col-span-7 rounded-xl border border-line bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-sm text-ink">Insurance Company Distribution</h3>
            </div>
            <span className="text-xs text-ink-3">{stats.companyBreakdown.length} companies</span>
          </div>

          <div className="space-y-3">
            {topCompanies.map((comp) => {
              const pct = stats.total > 0 ? ((comp.count / stats.total) * 100).toFixed(1) : '0';
              return (
                <div key={comp.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink truncate max-w-[200px]">{comp.name}</span>
                    <div className="font-mono text-ink-3 text-[11px]">
                      <b className="text-ink font-semibold">{formatNumber(comp.count)}</b> ({pct}%)
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expiry Quick Status & Actions */}
        {/* <div className="lg:col-span-5 rounded-xl border border-line bg-surface p-5 flex flex-col justify-between space-y-4"> */}
        {/*   <div> */}
        {/*     <h3 className="font-semibold text-sm text-ink mb-1">Ledger Expiry Ratio</h3> */}
        {/*     <p className="text-xs text-ink-3">Live comparison of active vs expired policies</p> */}
        {/*   </div> */}
        {/**/}
        {/*   <div className="grid grid-cols-2 gap-3 py-2"> */}
        {/*     <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-center"> */}
        {/*       <span className="text-[11px] text-emerald-400 uppercase font-semibold block">Active Ratio</span> */}
        {/*       <span className="font-mono text-2xl font-bold text-emerald-400 mt-1 block"> */}
        {/*         {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% */}
        {/*       </span> */}
        {/*     </div> */}
        {/**/}
        {/*     <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-800/40 text-center"> */}
        {/*       <span className="text-[11px] text-red-400 uppercase font-semibold block">Expired Ratio</span> */}
        {/*       <span className="font-mono text-2xl font-bold text-red-400 mt-1 block"> */}
        {/*         {stats.total > 0 ? Math.round((stats.expired / stats.total) * 100) : 0}% */}
        {/*       </span> */}
        {/*     </div> */}
        {/*   </div> */}
      <div className="lg:col-span-5 rounded-xl border border-line bg-surface p-5 flex flex-col justify-between space-y-4">
  <div>
    <h3 className="font-semibold text-sm text-ink mb-1">Ledger Expiry Ratio</h3>
    <p className="text-xs text-ink-3">Live breakdown of active, expiring soon, and expired policies</p>
  </div>

  {(() => {
    const expiringCount = stats.expiring || 0;
    const trueActiveCount = Math.max(0, (stats.active || 0) - expiringCount);

    const data = [
      { name: 'Active', value: trueActiveCount, color: '#34d399' },
      { name: 'Expiring Soon', value: expiringCount, color: '#fbbf24' },
      { name: 'Expired', value: stats.expired || 0, color: '#f87171' }
    ];

    return (
      <div className="flex items-center gap-5">
        <PieChart width={160} height={160}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={45}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [formatNumber(value), name]}
            contentStyle={{ fontSize: 12 }}
          />
        </PieChart>

        <div className="flex-1 space-y-2.5">
        {data.map((entry) => {
            const pct = stats.total > 0 ? Math.round((entry.value / stats.total) * 100) : 0;
            return (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-ink-3">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}
                </span>
                <span className="font-mono font-semibold text-ink">
                {formatNumber(entry.value)} <span className="text-ink-3">({pct}%)</span>
                </span>
                </div>
            );
        })}
        </div>
        </div>
    );
  })()}

          <button
            onClick={() => navigate('/items')}
            className="w-full py-2.5 px-4 rounded-lg bg-accent text-white hover:bg-accent-hi text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Complete Policy Registry Ledger</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
