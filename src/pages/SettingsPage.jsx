import { useStore } from '../store/AppStore.jsx';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { settings, setSetting, resetSettings } = useStore();

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
      <div className="border-b border-line-soft pb-4">
        <h1 className="text-xl md:text-2xl font-bold text-ink flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-accent" />
          Settings & Preferences
        </h1>
        <p className="text-xs text-ink-3 mt-0.5">
          Configure interface density and layout preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Display Preferences */}
        <div className="rounded-xl border border-line bg-surface p-5 space-y-4">
          <h3 className="font-semibold text-sm text-ink">Interface & Density</h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">Table Layout Density</p>
                <p className="text-ink-3">Choose comfortable or compact spacing</p>
              </div>
              <select
                value={settings.density}
                onChange={(e) => setSetting('density', e.target.value)}
                className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs text-ink focus:outline-none"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-line-soft">
              <div>
                <p className="font-medium text-ink">Default Page Size</p>
                <p className="text-ink-3">Number of virtualized rows overscan</p>
              </div>
              <select
                value={settings.pageSize}
                onChange={(e) => setSetting('pageSize', Number(e.target.value))}
                className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-xs text-ink focus:outline-none"
              >
                <option value={25}>25 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={resetSettings}
            className="px-4 py-2 rounded-lg border border-line text-xs font-medium text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
