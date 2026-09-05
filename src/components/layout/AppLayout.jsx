import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import Toast from './Toast.jsx';
import { useStore } from '../../store/AppStore.jsx';
import { Spinner } from '../ui/Primitives.jsx';
import Icon from '../ui/Icon.jsx';

const USER_EMAIL = 'user@gmail.com';

export default function AppLayout() {
  const { status } = useStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const apply = () => setCollapsed(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  if (status.error) {
    return (
      <div className="grid h-full place-items-center p-6">
        <div className="max-w-md rounded-panel border border-critical/40 bg-surface p-6 text-center">
          <span className="text-critical">
            <Icon name="alert" size={28} className="mx-auto" />
          </span>
          <h1 className="mt-3 text-base font-semibold text-ink">Could not load data</h1>
          <p className="mt-1.5 text-[13px] text-ink-3">{status.error}</p>
          <p className="mt-3 text-[12px] text-ink-3">
            Start the API with <code className="rounded bg-surface-2 px-1.5 py-0.5">npm run server</code>{' '}
            or reseed with <code className="rounded bg-surface-2 px-1.5 py-0.5">npm run seed</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-plane">
      <div className="hidden shrink-0 md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 animate-slide-in">
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onToggleSidebar={() => {
            if (window.matchMedia('(max-width: 767px)').matches) setMobileOpen((v) => !v);
            else setCollapsed((v) => !v);
          }}
          userEmail={USER_EMAIL}
        />

        <main className="relative min-h-0 flex-1 overflow-hidden">
          {status.loading ? (
            <div className="grid h-full place-items-center">
              <div className="flex flex-col items-center gap-3 text-ink-3">
                <Spinner size={26} className="text-accent" />
                <p className="text-[13px]">Loading…</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>

      <Toast />
    </div>
  );
}
