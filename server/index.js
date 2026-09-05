/**
 * Boilerplate REST API.
 *
 * A thin Express layer over the JSON store. Domain logic lives in src/lib so
 * the browser and the server always agree on derived values and aggregates.
 */

import express from 'express';
import cors from 'cors';
import * as store from './store.js';
import { computeStats, searchItems, CATEGORIES, STATUSES } from '../src/lib/item.js';

const PORT = Number(process.env.PORT) || 5174;

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

/** Wraps an async handler so a rejection becomes a 500 instead of a hang. */
const route = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

function validateItem(body) {
  const errors = [];
  if (!body || typeof body !== 'object') return ['Request body must be a JSON object'];
  if (!String(body.name || '').trim()) errors.push('`name` is required');
  if (body.value != null && Number(body.value) < 0) {
    errors.push('`value` cannot be negative');
  }
  if (body.category && !CATEGORIES.some((c) => c.key === body.category)) {
    errors.push(`\`category\` must be one of: ${CATEGORIES.map((c) => c.key).join(', ')}`);
  }
  if (body.status && !STATUSES.some((s) => s.key === body.status)) {
    errors.push(`\`status\` must be one of: ${STATUSES.map((s) => s.key).join(', ')}`);
  }
  return errors;
}

app.get(
  '/api/items',
  route(async (req, res) => {
    let items = await store.list();
    const { category, status, q } = req.query;

    if (category) items = items.filter((i) => i.category === String(category));
    if (status) items = items.filter((i) => i.status === String(status));
    if (q) items = searchItems(items, String(q));

    res.json(items);
  }),
);

app.get(
  '/api/items/:id',
  route(async (req, res) => {
    const item = await store.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  }),
);

app.post(
  '/api/items',
  route(async (req, res) => {
    const errors = validateItem(req.body);
    if (errors.length) return res.status(400).json({ error: 'Invalid item', errors });
    res.status(201).json(await store.create(req.body));
  }),
);

app.patch(
  '/api/items/:id',
  route(async (req, res) => {
    const updated = await store.update(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  }),
);

app.put(
  '/api/items/:id',
  route(async (req, res) => {
    const errors = validateItem(req.body);
    if (errors.length) return res.status(400).json({ error: 'Invalid item', errors });
    const updated = await store.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  }),
);

app.delete(
  '/api/items/:id',
  route(async (req, res) => {
    const removed = await store.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Item not found' });
    res.status(204).end();
  }),
);

app.get(
  '/api/stats',
  route(async (_req, res) => res.json(computeStats(await store.list()))),
);

app.get(
  '/api/search',
  route(async (req, res) => {
    const results = searchItems(await store.list(), String(req.query.q || ''));
    res.json(results.slice(0, 25));
  }),
);

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, storage: 'json', file: store.DATA_FILE }),
);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Unknown endpoint' }));

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity
app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`Storage: ${store.DATA_FILE}`);
});
