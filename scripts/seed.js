/**
 * Regenerates public/data/items.json with a small demo dataset.
 *
 * Replace SOURCE with your own records — or delete this script entirely once
 * the project has real data.
 *
 *   node scripts/seed.js
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deriveItem } from '../src/lib/item.js';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, '../public/data/items.json');

const SOURCE = [
  { id: 'item-1', name: 'Northwind', category: 'alpha', status: 'active', value: 4200, notes: 'Primary account.' },
  { id: 'item-2', name: 'Contoso', category: 'alpha', status: 'active', value: 3100 },
  { id: 'item-3', name: 'Fabrikam', category: 'beta', status: 'paused', value: 2450, notes: 'Renewal pending.' },
  { id: 'item-4', name: 'Adventure Works', category: 'beta', status: 'active', value: 1890 },
  { id: 'item-5', name: 'Tailspin Toys', category: 'gamma', status: 'active', value: 1520 },
  { id: 'item-6', name: 'Wingtip Toys', category: 'gamma', status: 'archived', value: 940 },
  { id: 'item-7', name: 'Litware', category: 'beta', status: 'active', value: 760 },
  { id: 'item-8', name: 'Proseware', category: 'alpha', status: 'paused', value: 610 },
];

const seededAt = '2026-01-01T00:00:00.000Z';

const items = SOURCE.map((item, i) =>
  deriveItem({
    ...item,
    id: item.id || `item-${i + 1}`,
    createdAt: seededAt,
    updatedAt: seededAt,
  }),
);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(items, null, 2)}\n`, 'utf8');

console.log(`Wrote ${items.length} items -> ${OUT}`);
