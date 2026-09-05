const nf = new Intl.NumberFormat('en-US');

export const formatNumber = (n) => nf.format(Math.round(Number(n) || 0));

/** Compact form for stat tiles: 1.2M, 348K, 940. */
export function formatCompact(n) {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (Math.abs(v) >= 1e4) return `${Math.round(v / 1e3)}K`;
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return nf.format(Math.round(v));
}

export function formatArea(km2) {
  const v = Number(km2) || 0;
  if (v > 0 && v < 0.1) return `${(v * 1e6).toFixed(0)} m²`;
  return `${v.toFixed(v < 10 ? 2 : 1)} km²`;
}

export const formatPercent = (v, digits = 1) => `${(Number(v) || 0).toFixed(digits)}%`;

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: '2-digit' });
}

export const formatCoord = (n) => (Number(n) || 0).toFixed(5);
