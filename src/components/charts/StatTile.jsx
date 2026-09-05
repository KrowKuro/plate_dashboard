import Icon from '../ui/Icon.jsx';
import { cx } from '../ui/Primitives.jsx';

/**
 * A KPI stat tile — a single headline figure, per the data-viz "not a chart"
 * rule. The value uses proportional figures; the optional caption and delta
 * sit in text ink, never a series colour.
 */
export default function StatTile({
  label,
  value,
  unit,
  caption,
  icon,
  accent = 'var(--color-accent-hi)',
  delay = 0,
}) {
  return (
    <div
      className="rounded-panel border border-line bg-surface p-4 animate-rise"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">
          {label}
        </p>
        {icon && (
          <span
            className="grid h-7 w-7 place-items-center rounded-lg"
            style={{ background: `color-mix(in srgb, ${accent} 16%, transparent)`, color: accent }}
          >
            <Icon name={icon} size={15} />
          </span>
        )}
      </div>
      <p className="mt-2 flex items-baseline gap-1.5">
        <span className="text-[26px] leading-none font-semibold text-ink">{value}</span>
        {unit && <span className="text-[13px] text-ink-3">{unit}</span>}
      </p>
      {caption && (
        <p className={cx('mt-1.5 truncate text-[12px] text-ink-3')}>{caption}</p>
      )}
    </div>
  );
}
