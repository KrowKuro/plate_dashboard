import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import { cx } from '../ui/Primitives.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { formatCompact, formatNumber } from '../../lib/insuranceFormatters.js';
import { ShieldCheck, ShieldAlert, AlertTriangle, Car } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/items', label: 'Policy Registry', icon: 'table' },
  { to: '/reports', label: 'Reports & Analytics', icon: 'reports' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar({ collapsed, onNavigate }) {
  const { stats } = useStore();

  return (
    <nav
      aria-label="Main"
      className={cx(
        'flex h-full flex-col border-r border-line bg-surface transition-[width] duration-200',
        collapsed ? 'w-[68px]' : 'w-[248px]',
      )}
    >
      {/* App Branding */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-line-soft">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/20 text-accent-hi">
          <Car className="w-4 h-4" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[13px] leading-tight font-semibold text-ink">
              Insurance Registry
            </p>
            <p className="truncate text-[11px] text-ink-3">Vite · React · Tailwind</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cx(
                  'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]',
                  'transition-colors duration-150',
                  collapsed && 'justify-center',
                  isActive
                    ? 'bg-accent/14 font-medium text-ink'
                    : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent" />
                  )}
                  <Icon
                    name={item.icon}
                    size={17}
                    className={isActive ? 'text-accent-hi' : 'text-ink-3'}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer Stats Summary */}
      {!collapsed && (
        <div className="space-y-2 border-t border-line-soft p-3">
          <div className="rounded-lg bg-surface-2 px-3 py-2.5">
            <p className="text-[10px] font-medium tracking-wider text-ink-3 uppercase">
              Total Policies
            </p>
            <p className="mt-0.5 text-lg leading-tight font-semibold text-ink font-mono">
              {formatNumber(stats.total)}
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {formatCompact(stats.active)}
              </span>
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> {formatCompact(stats.expiring)}
              </span>
              <span className="text-red-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {formatCompact(stats.expired)}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
