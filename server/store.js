/**
 * JSON-file storage.
 *
 * It lives in `public/` on purpose — Vite serves it directly, so the frontend
 * still works with the backend switched off. Writes go through a promise chain
 * and a temp-file rename so two concurrent requests can't interleave and leave
 * a half-written file on disk.
 *
 * Swap this module for a real database later by keeping these function
 * signatures and changing nothing above them.
 */

import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { deriveItem } from '../src/lib/item.js';

const here = dirname(fileURLToPath(import.meta.url));
export const DATA_FILE = resolve(here, '../public/data/items.json');

let writeChain = Promise.resolve();

async function readAll() {
  if (!existsSync(DATA_FILE)) return [];
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(deriveItem) : [];
  } catch (err) {
    // A corrupt file should surface loudly rather than silently emptying the UI.
    throw new Error(`Cannot read ${DATA_FILE}: ${err.message}`, { cause: err });
  }
}

async function writeAll(items) {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
  await rename(tmp, DATA_FILE);
  return items;
}

/** Serialises a read-modify-write against the file. */
function mutate(fn) {
  const next = writeChain.then(async () => {
    const current = await readAll();
    const { items, result } = await fn(current);
    await writeAll(items);
    return result;
  });
  // Keep the chain alive even if this mutation rejects.
  writeChain = next.catch(() => {});
  return next;
}

export const list = () => readAll();

export async function get(id) {
  const all = await readAll();
  return all.find((i) => i.id === id) ?? null;
}

export function create(input) {
  return mutate((all) => {
    const now = new Date().toISOString();
    const item = deriveItem({
      ...input,
      id: input.id && !all.some((i) => i.id === input.id) ? input.id : randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
    return { items: [...all, item], result: item };
  });
}

export function update(id, patch) {
  return mutate((all) => {
    const index = all.findIndex((i) => i.id === id);
    if (index === -1) return { items: all, result: null };

    const merged = deriveItem({
      ...all[index],
      ...patch,
      id,
      createdAt: all[index].createdAt,
      updatedAt: new Date().toISOString(),
    });

    const items = [...all];
    items[index] = merged;
    return { items, result: merged };
  });
}

export function remove(id) {
  return mutate((all) => {
    const exists = all.some((i) => i.id === id);
    return { items: all.filter((i) => i.id !== id), result: exists };
  });
}

/** Bulk replace — used by JSON import. */
export function replaceAll(inputs) {
  return mutate(() => {
    const now = new Date().toISOString();
    const items = inputs.map((input) =>
      deriveItem({ ...input, id: input.id || randomUUID(), createdAt: now, updatedAt: now }),
    );
    return { items, result: items };
  });
}
