import { useState } from 'react';
import { useStore } from '../../store/AppStore.jsx';
import Icon from '../ui/Icon.jsx';
import {
  Button,
  IconButton,
  Field,
  Input,
  Textarea,
  Select,
} from '../ui/Primitives.jsx';
import { CATEGORIES, STATUSES } from '../../lib/item.js';

/**
 * Create / edit form for one record. A plain controlled form — no form library
 * — so it stays easy to adapt to whatever fields a project needs.
 */
export default function ItemEditor({ item, onClose }) {
  const { addItem, saveItem } = useStore();
  const isNew = !item?.id;

  const [form, setForm] = useState(() => ({
    name: item?.name ?? '',
    category: item?.category ?? 'alpha',
    status: item?.status ?? 'active',
    value: item?.value ?? 0,
    notes: item?.notes ?? '',
  }));
  const [saving, setSaving] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    const payload = { ...form, name: form.name.trim(), value: Number(form.value) || 0 };
    const result = isNew ? await addItem(payload) : await saveItem(item.id, payload);
    setSaving(false);
    if (result) onClose?.();
  };

  return (
    <form onSubmit={submit} className="flex h-full flex-col animate-slide-in">
      <header className="flex items-center justify-between border-b border-line-soft px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/18 text-accent-hi">
            <Icon name={isNew ? 'plus' : 'pencil'} size={16} />
          </span>
          <h2 className="text-[14px] font-semibold text-ink">
            {isNew ? 'New item' : 'Edit item'}
          </h2>
        </div>
        <IconButton icon="close" label="Cancel" onClick={onClose} />
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <Field label="Name" htmlFor="ie-name">
          <Input
            id="ie-name"
            value={form.name}
            autoFocus
            required
            placeholder="Item name"
            onChange={(e) => set('name', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Category" htmlFor="ie-category">
            <Select
              id="ie-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status" htmlFor="ie-status">
            <Select
              id="ie-status"
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Value" htmlFor="ie-value">
          <Input
            id="ie-value"
            type="number"
            min="0"
            value={form.value}
            onChange={(e) => set('value', e.target.value)}
          />
        </Field>

        <Field label="Notes" htmlFor="ie-notes">
          <Textarea
            id="ie-notes"
            rows={3}
            value={form.notes}
            placeholder="Optional context…"
            onChange={(e) => set('notes', e.target.value)}
          />
        </Field>
      </div>

      <footer className="flex items-center gap-2 border-t border-line-soft px-4 py-3">
        <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon="check"
          className="flex-1"
          disabled={saving || !form.name.trim()}
        >
          {saving ? 'Saving…' : isNew ? 'Create' : 'Save'}
        </Button>
      </footer>
    </form>
  );
}
