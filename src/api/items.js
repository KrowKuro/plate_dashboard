import { api } from './client.js';
import { deriveItem } from '../lib/item.js';

/** Where the static copy lives when the API is unavailable. */
const STATIC_FALLBACK = '/data/items.json';

/**
 * Reads every item. Falls back to the static JSON file so the UI is still
 * usable (read-only) when the backend isn't running — a common state during
 * frontend-only development.
 *
 * @returns {Promise<{items: Array, readOnly: boolean, warning?: string}>}
 */
export async function fetchItems() {
  try {
    const { data } = await api.get('/items');
    return { items: data.map(deriveItem), readOnly: false };
  } catch {
    const res = await fetch(STATIC_FALLBACK);
    if (!res.ok) throw new Error('No API server and no local data file.');
    const data = await res.json();
    return {
      items: data.map(deriveItem),
      readOnly: true,
      warning:
        'API server offline — showing the saved dataset. Edits will not be persisted. Run `npm run server`.',
    };
  }
}

export async function createItem(input) {
  const { data } = await api.post('/items', input);
  return deriveItem(data);
}

export async function updateItem(id, patch) {
  const { data } = await api.patch(`/items/${id}`, patch);
  return deriveItem(data);
}

export async function deleteItem(id) {
  await api.delete(`/items/${id}`);
  return id;
}
