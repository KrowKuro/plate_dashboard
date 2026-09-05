import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/AppStore.jsx';
import Icon from '../ui/Icon.jsx';
import { cx } from '../ui/Primitives.jsx';
import { formatNumber } from '../../lib/format.js';

/**
 * Global search with keyboard navigation and a Ctrl/Cmd+K shortcut.
 * Swap `results` in the store for whatever your project searches.
 */
export default function SearchBar() {
  const { query, setQuery, results, selectItem } = useStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const choose = (item) => {
    if (!item) return;
    selectItem(item.id);
    setOpen(false);
    inputRef.current?.blur();
    navigate('/items');
  };

  const onKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (c + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[cursor]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <Icon
        name="search"
        size={15}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        placeholder="Search items…"
        aria-label="Search"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={cx(
          'h-9 w-full rounded-lg border border-line bg-surface-2 pr-16 pl-9 text-[13px] text-ink',
          'placeholder:text-ink-3 transition-colors focus:border-accent focus:outline-none',
        )}
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-ink-3">
        Ctrl K
      </kbd>

      {open && query.trim() && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-40 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-panel animate-fade-in">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-center text-[13px] text-ink-3">
              Nothing matches “{query}”.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.slice(0, 8).map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => choose(item)}
                    className={cx(
                      'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
                      i === cursor ? 'bg-surface-2' : 'hover:bg-surface-2',
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{item.name}</span>
                      <span className="block truncate text-[11px] text-ink-3">
                        {item.category} · {item.status}
                      </span>
                    </span>
                    <span className="tabular shrink-0 text-[11px] text-ink-3">
                      {formatNumber(item.value)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
