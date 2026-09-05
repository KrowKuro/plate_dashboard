import { useStore } from '../../store/AppStore.jsx';
import Icon from '../ui/Icon.jsx';
import { Search } from 'lucide-react';

export default function Topbar({ onToggleSidebar, userEmail }) {
  const { query, setQuery } = useStore();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface px-4 gap-3">
      {/* Left section: Sidebar Toggle & Search */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onToggleSidebar}
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink transition-colors cursor-pointer"
          title="Toggle Navigation Sidebar"
        >
          <Icon name="sidebar" size={18} />
        </button>

        {/* Global Search */}
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plate, company, contract #..."
            className="w-full rounded-lg border border-line-soft bg-surface-2 pl-9 pr-3 py-1.5 text-xs text-ink placeholder-ink-3 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Right section: User info */}
      <div className="flex items-center gap-2 text-xs text-ink-3">
        <div className="flex items-center gap-2 pl-2 text-xs text-ink-3">
          <div className="h-7 w-7 rounded-full bg-accent/20 text-accent-hi flex items-center justify-center font-bold text-xs">
            VI
          </div>
          <span className="truncate max-w-[120px] hidden sm:inline">{userEmail}</span>
        </div>
      </div>
    </header>
  );
}
