import { useState } from 'react';
import { cx } from '../ui/Primitives.jsx';
import { formatNumber } from '../../lib/format.js';

/**
 * Horizontal bar chart for a single measure across named categories
 * (magnitude + identity → horizontal bars). One series, so no legend — the
 * title names it. Bars are thin with a 4px rounded data-end anchored to the
 * baseline; each value is direct-labelled; a hover wash gives the interaction
 * layer. Rows can carry their own colour (used where a row
 * colour is also spelled out by its label).
 */
export default function BarChart({
  data,
  color = 'var(--color-series-1)',
  valueFormat = formatNumber,
  onSelect,
  emptyLabel = 'No data',
}) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...data.map((d) => d.value));

  if (!data.length) {
    return <p className="py-8 text-center text-[13px] text-ink-3">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-2.5">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const active = hover === i;
        return (
          <div
            key={d.key ?? d.label}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onSelect?.(d)}
            onKeyDown={(e) => {
              if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelect(d);
              }
            }}
            className={cx(
              'group',
              onSelect && 'cursor-pointer rounded-md px-1 -mx-1 transition-colors',
              onSelect && active && 'bg-surface-2',
            )}
          >
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-[12px] text-ink-2">
                {d.color && (
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-[3px] ring-1 ring-white/15"
                    style={{ background: d.color }}
                  />
                )}
                <span className="truncate">{d.label}</span>
              </span>
              <span className="tabular shrink-0 text-[12px] font-medium text-ink">
                {valueFormat(d.value)}
                {d.suffix && <span className="ml-1 text-ink-3">{d.suffix}</span>}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-[4px] bg-surface-2">
              <div
                className="h-full rounded-[4px] transition-[width,opacity] duration-500"
                style={{
                  width: `${Math.max(2, pct)}%`,
                  background: d.color || color,
                  opacity: active ? 1 : 0.88,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
