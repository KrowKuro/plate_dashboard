import { useEffect, useRef, useState } from 'react';
import { cx } from './Primitives.jsx';

/**
 * Click-to-open panel anchored under its trigger. Closes on outside click and
 * on Escape, and returns focus to the trigger so keyboard users don't get lost.
 */
export default function Popover({ trigger, children, align = 'right', width = 260 }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <span ref={triggerRef}>
        {trigger({ open, toggle: () => setOpen((v) => !v) })}
      </span>

      {open && (
        <div
          style={{ width }}
          className={cx(
            'absolute top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-line',
            'bg-surface shadow-panel animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  );
}
