import { formatNumber, formatCompact } from './format.js';

export { formatNumber, formatCompact };

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('mn-MN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isExpired(record) {
  if (!record || !record.endDate) return false;
  const end = new Date(record.endDate).getTime();
  return !isNaN(end) && end < Date.now();
}

export function getDaysUntilExpiry(endDate) {
  if (!endDate) return null;
  const end = new Date(endDate).getTime();
  if (isNaN(end)) return null;
  const diffTime = end - Date.now();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
