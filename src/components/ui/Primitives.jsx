import Icon from './Icon.jsx';

export const cx = (...parts) => parts.filter(Boolean).join(' ');

export function Panel({ className = '', children, ...rest }) {
  return (
    <section
      className={cx(
        'rounded-panel border border-line bg-surface',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

export function PanelHeader({ title, subtitle, icon, actions }) {
  return (
    <header className="flex items-start justify-between gap-3 border-b border-line-soft px-4 py-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && (
          <span className="mt-0.5 text-ink-3">
            <Icon name={icon} size={17} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-[13px] font-semibold tracking-wide text-ink uppercase">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 truncate text-xs text-ink-3">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </header>
  );
}


const BUTTON_VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hi disabled:hover:bg-accent',
  secondary:
    'bg-surface-2 text-ink-2 hover:bg-surface-3 hover:text-ink border border-line',
  ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
  danger: 'bg-critical/15 text-critical border border-critical/40 hover:bg-critical/25',
};

const BUTTON_SIZES = {
  sm: 'h-8 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-[13px] gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors duration-150',
        'disabled:cursor-not-allowed disabled:opacity-45',
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

export function IconButton({ icon, label, active = false, className = '', ...rest }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={rest.role === 'switch' ? undefined : active || undefined}
      className={cx(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150',
        active
          ? 'bg-accent/18 text-accent-hi'
          : 'text-ink-3 hover:bg-surface-2 hover:text-ink',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}


export function Toggle({ checked, onChange, label, description, disabled }) {
  return (
    <label
      className={cx(
        'flex items-center justify-between gap-3 rounded-lg px-2 py-1.5',
        disabled ? 'opacity-45' : 'cursor-pointer hover:bg-surface-2',
      )}
    >
      <span className="min-w-0">
        <span className="block truncate text-[13px] text-ink-2">{label}</span>
        {description && (
          <span className="block truncate text-[11px] text-ink-3">{description}</span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          'inline-flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200',
          checked ? 'bg-accent' : 'bg-surface-3',
        )}
      >
        <span
          className={cx(
            'h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      </button>
    </label>
  );
}


export function Field({ label, hint, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-medium tracking-wide text-ink-3 uppercase"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-ink-3">{hint}</p>}
    </div>
  );
}

const CONTROL =
  'w-full rounded-lg border border-line bg-surface-2 px-3 text-[13px] text-ink ' +
  'placeholder:text-ink-3 transition-colors focus:border-accent focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

export function Input({ className = '', ...rest }) {
  return <input className={cx(CONTROL, 'h-9', className)} {...rest} />;
}

export function Textarea({ className = '', ...rest }) {
  return <textarea className={cx(CONTROL, 'py-2 leading-relaxed', className)} {...rest} />;
}

export function Select({ className = '', children, ...rest }) {
  return (
    <div className="relative">
      <select
        className={cx(CONTROL, 'h-9 appearance-none pr-9', className)}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="chevronDown"
        size={15}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-3"
      />
    </div>
  );
}

export function Slider({ value, min, max, step = 1, onChange, format, label }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">
          {label}
        </span>
        <span className="tabular text-[12px] text-ink-2">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-3 accent-accent"
      />
    </div>
  );
}


const BADGE_TONES = {
  neutral: 'bg-surface-3 text-ink-2',
  accent: 'bg-accent/15 text-accent-hi',
  good: 'bg-good/15 text-good',
  warning: 'bg-warning/15 text-warning',
  critical: 'bg-critical/15 text-critical',
};

export function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium',
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Swatch({ color, size = 10, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={cx('inline-block shrink-0 rounded-[3px] ring-1 ring-white/20', className)}
      style={{ background: color, width: size, height: size }}
    />
  );
}


export function Spinner({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cx('animate-spin', className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.2" fill="none" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function EmptyState({ icon = 'info', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <span className="text-ink-3">
        <Icon name={icon} size={26} />
      </span>
      <p className="text-sm font-medium text-ink-2">{title}</p>
      {description && <p className="max-w-xs text-xs text-ink-3">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export function DataRow({ label, value, accent = false, mono = true }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="shrink-0 text-[12px] text-ink-3">{label}</dt>
      <dd
        className={cx(
          'truncate text-right text-[13px] font-medium',
          mono && 'tabular',
          accent ? 'text-accent-hi' : 'text-ink',
        )}
      >
        {value}
      </dd>
    </div>
  );
}
