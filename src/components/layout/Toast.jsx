import { useEffect } from 'react';
import { useStore } from '../../store/AppStore.jsx';
import Icon from '../ui/Icon.jsx';
import { cx } from '../ui/Primitives.jsx';

const TONES = {
  good: { ring: 'border-good/45', text: 'text-good', icon: 'check' },
  warning: { ring: 'border-warning/45', text: 'text-warning', icon: 'alert' },
  critical: { ring: 'border-critical/45', text: 'text-critical', icon: 'alert' },
  info: { ring: 'border-accent/45', text: 'text-accent-hi', icon: 'info' },
};

/** Status colour never carries the message alone — icon + text always ship together. */
export default function Toast() {
  const { notice, setNotice } = useStore();

  useEffect(() => {
    if (!notice) return undefined;
    // Warnings persist: an offline backend is a state, not an event.
    if (notice.tone === 'warning') return undefined;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice, setNotice]);

  if (!notice) return null;
  const tone = TONES[notice.tone] ?? TONES.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div
        className={cx(
          'pointer-events-auto flex max-w-lg items-start gap-3 rounded-xl border bg-surface-2 px-4 py-3',
          'shadow-panel animate-fade-in',
          tone.ring,
        )}
      >
        <span className={cx('mt-0.5 shrink-0', tone.text)}>
          <Icon name={tone.icon} size={16} />
        </span>
        <p className="text-[13px] leading-relaxed text-ink-2">{notice.message}</p>
        <button
          type="button"
          onClick={() => setNotice(null)}
          aria-label="Dismiss"
          className="-mr-1 shrink-0 rounded p-1 text-ink-3 transition-colors hover:text-ink"
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}
