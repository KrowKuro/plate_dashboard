import { useId, useState } from 'react';
import { cx } from '../ui/Primitives.jsx';
import { formatCompact, formatPercent } from '../../lib/format.js';

const TAU = Math.PI * 2;
const polar = (cx0, cy, r, a) => [cx0 + r * Math.cos(a), cy + r * Math.sin(a)];

function arcPath(cx0, cy, rOuter, rInner, start, end) {
  const large = end - start > Math.PI ? 1 : 0;
  const [x1, y1] = polar(cx0, cy, rOuter, start);
  const [x2, y2] = polar(cx0, cy, rOuter, end);
  const [x3, y3] = polar(cx0, cy, rInner, end);
  const [x4, y4] = polar(cx0, cy, rInner, start);
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

export default function DonutChart({ data, centerLabel = 'Total', centerValue }) {
  const clip = useId();
  const [hover, setHover] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total <= 0) {
    return <p className="py-8 text-center text-[13px] text-ink-3">No population data</p>;
  }

  const size = 168;
  const cx0 = size / 2;
  const cy = size / 2;
  const rOuter = 78;
  const rInner = 50;
  const gap = (2 / rOuter) * 0.5;

  const slices = data.reduce((acc, d) => {
    const prevEnd = acc.length ? acc[acc.length - 1]._raw : -Math.PI / 2;
    const sweep = (d.value / total) * TAU;
    acc.push({ ...d, start: prevEnd + gap, end: prevEnd + sweep - gap, _raw: prevEnd + sweep });
    return acc;
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-6">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${centerLabel}: ${centerValue}`}
        className="shrink-0"
      >
        <clipPath id={clip}>
          <circle cx={cx0} cy={cy} r={rOuter + 1} />
        </clipPath>
        {slices.map((s, i) => (
          <path
            key={s.key ?? s.label}
            d={arcPath(cx0, cy, rOuter, rInner, s.start, Math.max(s.start, s.end))}
            fill={s.color}
            opacity={hover === null || hover === i ? 1 : 0.4}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="cursor-default transition-opacity duration-200"
          />
        ))}
        <text
          x={cx0}
          y={cy - 6}
          textAnchor="middle"
          className="fill-[var(--color-ink)] text-[19px] font-semibold"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {centerValue}
        </text>
        <text
          x={cx0}
          y={cy + 12}
          textAnchor="middle"
          className="fill-[var(--color-ink-3)] text-[10px] uppercase"
          style={{ letterSpacing: '0.06em' }}
        >
          {centerLabel}
        </text>
      </svg>

      <ul className="w-full space-y-1">
        {slices.map((s, i) => (
          <li
            key={s.key ?? s.label}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={cx(
              'flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors',
              hover === i && 'bg-surface-2',
            )}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[3px] ring-1 ring-white/15"
              style={{ background: s.color }}
            />
            <span className="min-w-0 flex-1 truncate text-[12px] text-ink-2">{s.label}</span>
            <span className="tabular text-[12px] font-medium text-ink">
              {formatCompact(s.value)}
            </span>
            <span className="tabular w-5 text-right text-[11px] text-ink-3">
              {formatPercent((s.value / total) * 100, 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
