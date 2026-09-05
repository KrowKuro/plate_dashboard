/**
 * The example domain record.
 *
 * This is deliberately generic — swap `Item` for whatever your project stores
 * and the rest of the app (store, API, table, charts) keeps working. It is
 * dependency-free so the browser and the Express backend can both import it
 * and always agree on derived values.
 */

export const CATEGORIES = [
  { key: 'alpha', label: 'Alpha' },
  { key: 'beta', label: 'Beta' },
  { key: 'gamma', label: 'Gamma' },
];

export const STATUSES = [
  { key: 'active', label: 'Active', tone: 'good' },
  { key: 'paused', label: 'Paused', tone: 'warning' },
  { key: 'archived', label: 'Archived', tone: 'neutral' },
];

/** Fill in defaults and normalise types. Derived fields are always recomputed. */
export function deriveItem(input = {}) {
  const category = CATEGORIES.some((c) => c.key === input.category)
    ? input.category
    : 'alpha';
  const status = STATUSES.some((s) => s.key === input.status) ? input.status : 'active';

  return {
    id: input.id,
    name: (input.name || 'Untitled').trim(),
    category,
    status,
    value: Math.max(0, Number(input.value) || 0),
    notes: input.notes ?? '',
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: input.updatedAt || input.createdAt || new Date().toISOString(),
  };
}

/** Aggregates for the dashboard tiles and charts. */
export function computeStats(items = []) {
  const totalValue = items.reduce((s, i) => s + i.value, 0);
  const byValue = [...items].sort((a, b) => b.value - a.value);

  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    count: items.filter((i) => i.category === c.key).length,
    value: items.filter((i) => i.category === c.key).reduce((s, i) => s + i.value, 0),
  }));

  const byStatus = STATUSES.map((s) => ({
    ...s,
    count: items.filter((i) => i.status === s.key).length,
  }));

  return {
    count: items.length,
    totalValue,
    averageValue: items.length ? Math.round(totalValue / items.length) : 0,
    activeCount: items.filter((i) => i.status === 'active').length,
    highest: byValue[0] ?? null,
    lowest: byValue[byValue.length - 1] ?? null,
    byCategory,
    byStatus,
  };
}

/** Case-insensitive ranked search over name, category and notes. */
export function searchItems(items, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  return items
    .map((item) => {
      const name = item.name.toLowerCase();
      let score = -1;
      if (name === q) score = 0;
      else if (name.startsWith(q)) score = 1;
      else if (name.includes(q)) score = 2;
      else if (item.category.includes(q)) score = 3;
      else if ((item.notes || '').toLowerCase().includes(q)) score = 4;
      return { item, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => a.score - b.score || b.item.value - a.item.value)
    .map((r) => r.item);
}
