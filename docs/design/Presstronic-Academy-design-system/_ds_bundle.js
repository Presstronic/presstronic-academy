/* Presstronic Academy design-system bundle.
   Plain-JS compilation of the components folder — exposes window.PresstronicAcademyDS.
   Source of truth for styling/behavior: the .jsx files next to each .d.ts. */
(() => {
const NS = (window.PresstronicAcademyDS = window.PresstronicAcademyDS || {});
const h = (...a) => React.createElement(...a);

/* ---------------- Button ---------------- */
const BTN_SIZES = {
  sm: { padding: '8px 14px', fontSize: 11 },
  md: { padding: '11px 20px', fontSize: 12 },
  lg: { padding: '14px 26px', fontSize: 13 },
};
const BTN_VARIANTS = {
  primary: {
    base: { background: 'var(--primary)', color: 'var(--primary-foreground)', border: '1px solid transparent' },
    hover: { background: 'var(--cyan-600)' },
  },
  secondary: {
    base: { background: 'var(--secondary)', color: 'var(--secondary-foreground)', border: '1px solid var(--border-hairline)' },
    hover: { background: 'var(--gray-700)', border: '1px solid var(--border-strong)' },
  },
  ghost: {
    base: { background: 'transparent', color: 'var(--text-body)', border: '1px solid var(--border-strong)' },
    hover: { color: 'var(--cyan-400)', border: '1px solid var(--border-accent)' },
  },
  destructive: {
    base: { background: 'var(--destructive)', color: 'var(--destructive-foreground)', border: '1px solid transparent' },
    hover: { background: 'var(--red-400)' },
  },
};
NS.Button = function Button({ variant = 'primary', size = 'md', notch = false, glow = false, disabled = false, style, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const s = BTN_SIZES[size] || BTN_SIZES.md;
  return h('button', {
    disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: Object.assign({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
      fontSize: s.fontSize, padding: s.padding, borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1, transform: press ? 'scale(0.99)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
      clipPath: notch ? 'var(--notch)' : 'none',
      boxShadow: glow && variant === 'primary' ? 'var(--glow-cyan)' : 'none',
    }, v.base, hover && !disabled ? v.hover : null, style),
    ...rest,
  }, children);
};

/* ---------------- Badge ---------------- */
const BADGE_TONES = {
  neutral: { fg: 'var(--secondary-foreground)', tint: 'var(--muted)', solid: 'var(--gray-600)', solidFg: 'var(--gray-50)', border: 'var(--border-strong)' },
  cyan: { fg: 'var(--accent-fg-cyan)', tint: 'var(--tint-cyan)', solid: 'var(--cyan-500)', solidFg: 'var(--text-on-accent)', border: 'var(--border-accent)' },
  volt: { fg: 'var(--accent-fg-volt)', tint: 'var(--tint-volt)', solid: 'var(--volt-500)', solidFg: '#1a1503', border: 'color-mix(in oklab, var(--volt-500) 50%, transparent)' },
  green: { fg: 'var(--green-400)', tint: 'var(--tint-green)', solid: 'var(--green-500)', solidFg: '#04170c', border: 'color-mix(in oklab, var(--green-500) 50%, transparent)' },
  red: { fg: 'var(--red-400)', tint: 'var(--tint-red)', solid: 'var(--red-500)', solidFg: '#fff5f5', border: 'color-mix(in oklab, var(--red-500) 50%, transparent)' },
};
NS.Badge = function Badge({ tone = 'neutral', variant = 'soft', style, children }) {
  const t = BADGE_TONES[tone] || BADGE_TONES.neutral;
  const solid = variant === 'solid';
  return h('span', {
    style: Object.assign({
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '4px 8px', borderRadius: 0,
      background: solid ? t.solid : t.tint,
      color: solid ? t.solidFg : t.fg,
      border: solid ? '1px solid transparent' : '1px solid ' + t.border,
    }, style),
  }, children);
};

/* ---------------- Card ---------------- */
NS.Card = function Card({ notch = false, selected = false, selectedTone = 'cyan', interactive = false, padding = 20, style, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const edge = selectedTone === 'volt' ? 'var(--volt-500)' : 'var(--cyan-500)';
  const tint = selectedTone === 'volt' ? 'var(--tint-volt)' : 'var(--tint-cyan)';
  return h('div', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: Object.assign({
      background: selected ? tint : hover && interactive ? 'var(--surface-overlay)' : 'var(--surface-card)',
      border: '1px solid ' + (hover && interactive ? 'var(--border-strong)' : 'var(--border-hairline)'),
      borderLeft: selected ? '2px solid ' + edge : undefined,
      borderRadius: 0, padding,
      clipPath: notch ? 'var(--notch)' : 'none',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
    }, style),
    ...rest,
  }, children);
};

/* ---------------- Tabs ---------------- */
NS.Tabs = function Tabs({ items = [], value, onChange, style }) {
  const [internal, setInternal] = React.useState(value !== undefined ? value : (items[0] && (items[0].value !== undefined ? items[0].value : items[0])));
  const active = value !== undefined ? value : internal;
  const set = (v) => { setInternal(v); if (onChange) onChange(v); };
  return h('div', { style: Object.assign({ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-hairline)' }, style) },
    items.map((it) => {
      const v = it.value !== undefined ? it.value : it;
      const label = it.label !== undefined ? it.label : it;
      const on = v === active;
      return h('button', {
        key: v, onClick: () => set(v),
        style: {
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
          background: 'transparent', border: 'none', borderBottom: on ? '2px solid var(--cyan-500)' : '2px solid transparent',
          color: on ? 'var(--cyan-400)' : 'var(--text-muted)', padding: '10px 14px', marginBottom: -1,
          cursor: 'pointer', transition: 'color var(--dur-fast) var(--ease-out)',
        },
      }, label);
    })
  );
};

/* ---------------- Progress ---------------- */
NS.Progress = function Progress({ value = 0, max = 100, tone = 'cyan', label, showValue = false, height = 8, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = tone === 'volt' ? 'var(--volt-500)' : tone === 'green' ? 'var(--green-500)' : 'var(--cyan-500)';
  return h('div', { style: Object.assign({ display: 'flex', flexDirection: 'column', gap: 6 }, style) },
    (label || showValue) && h('div', {
      style: { display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' },
    },
      h('span', null, label),
      showValue && h('span', { style: { color: 'var(--text-body)' } }, value + ' / ' + max)
    ),
    h('div', { style: { height, background: 'var(--surface-inset)', border: '1px solid var(--border-hairline)', position: 'relative' } },
      h('div', { style: { position: 'absolute', inset: 0, width: pct + '%', background: fill, transition: 'width var(--dur-slow) var(--ease-out)' } })
    )
  );
};

/* ---------------- Input ---------------- */
NS.Input = function Input({ label, hint, error, type = 'text', style, inputStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return h('label', { style: Object.assign({ display: 'flex', flexDirection: 'column', gap: 6 }, style) },
    label && h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: error ? 'var(--red-400)' : 'var(--text-muted)' } }, label),
    h('input', {
      type,
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      style: Object.assign({
        fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)',
        background: 'var(--surface-inset)', borderRadius: 0, padding: '11px 12px', outline: 'none',
        border: '1px solid ' + (error ? 'var(--red-500)' : focus ? 'var(--cyan-500)' : 'var(--input)'),
        boxShadow: focus && !error ? '0 0 0 1px var(--cyan-500), 0 0 16px color-mix(in oklab, var(--cyan-500) 14%, transparent)' : 'none',
        transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      }, inputStyle),
      ...rest,
    }),
    (error || hint) && h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: error ? 'var(--red-400)' : 'var(--text-muted)' } }, error || hint)
  );
};

/* ---------------- Select ---------------- */
NS.Select = function Select({ label, options = [], style, selectStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return h('label', { style: Object.assign({ display: 'flex', flexDirection: 'column', gap: 6 }, style) },
    label && h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' } }, label),
    h('div', { style: { position: 'relative' } },
      h('select', {
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        style: Object.assign({
          width: '100%', appearance: 'none', WebkitAppearance: 'none',
          fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)',
          background: 'var(--surface-inset)', borderRadius: 0, padding: '11px 36px 11px 12px', outline: 'none',
          border: '1px solid ' + (focus ? 'var(--cyan-500)' : 'var(--input)'), cursor: 'pointer',
          transition: 'border-color var(--dur-fast) var(--ease-out)',
        }, selectStyle),
        ...rest,
      }, options.map((o) => h('option', { key: o.value !== undefined ? o.value : o, value: o.value !== undefined ? o.value : o }, o.label !== undefined ? o.label : o))),
      h('span', { style: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 } }, '\u25be')
    )
  );
};

/* ---------------- Checkbox ---------------- */
NS.Checkbox = function Checkbox({ label, checked, defaultChecked = false, onChange, style }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  const toggle = () => { const v = !on; setInternal(v); if (onChange) onChange(v); };
  return h('label', {
    onClick: (e) => { e.preventDefault(); toggle(); },
    style: Object.assign({ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }, style),
  },
    h('span', {
      style: {
        width: 16, height: 16, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'var(--cyan-500)' : 'var(--surface-inset)',
        border: '1px solid ' + (on ? 'var(--cyan-500)' : 'var(--input)'),
        transition: 'background var(--dur-fast) var(--ease-out)',
      },
    }, on && h('svg', { width: 10, height: 10, viewBox: '0 0 10 10', fill: 'none' },
      h('path', { d: 'M1.5 5.5L4 8L8.5 2.5', stroke: 'var(--text-on-accent)', strokeWidth: 1.8 }))),
    label && h('span', { style: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-body)' } }, label)
  );
};

/* ---------------- Switch ---------------- */
NS.Switch = function Switch({ label, checked, defaultChecked = false, onChange, style }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  const toggle = () => { const v = !on; setInternal(v); if (onChange) onChange(v); };
  return h('label', {
    onClick: (e) => { e.preventDefault(); toggle(); },
    style: Object.assign({ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }, style),
  },
    h('span', {
      style: {
        width: 36, height: 20, flex: 'none', position: 'relative',
        background: on ? 'var(--cyan-500)' : 'var(--surface-inset)',
        border: '1px solid ' + (on ? 'var(--cyan-500)' : 'var(--input)'),
        transition: 'background var(--dur-base) var(--ease-out)',
      },
    }, h('span', {
      style: {
        position: 'absolute', top: 2, left: on ? 18 : 2, width: 14, height: 14,
        background: on ? 'var(--text-on-accent)' : 'var(--gray-400)',
        transition: 'left var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
      },
    })),
    label && h('span', { style: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-body)' } }, label)
  );
};

/* ---------------- Dialog ---------------- */
NS.Dialog = function Dialog({ open = false, onClose, eyebrow, title, footer, width = 480, children }) {
  if (!open) return null;
  return h('div', {
    onClick: onClose,
    style: { position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)', background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  },
    h('div', {
      onClick: (e) => e.stopPropagation(),
      style: {
        width, maxWidth: '100%', background: 'var(--surface-overlay)',
        border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-3)', borderRadius: 0,
        clipPath: 'var(--notch)', display: 'flex', flexDirection: 'column',
      },
    },
      h('div', { style: { padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 } },
        eyebrow && h('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-400)' } }, eyebrow),
        title && h('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--text-strong)' } }, title)
      ),
      h('div', { style: { padding: '14px 24px 20px', fontSize: 14, lineHeight: 1.6, color: 'var(--text-body)' } }, children),
      footer && h('div', { style: { padding: '14px 24px', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'flex-end', gap: 10 } }, footer)
    )
  );
};

/* ---------------- Tooltip ---------------- */
NS.Tooltip = function Tooltip({ content, side = 'top', style, children }) {
  const [show, setShow] = React.useState(false);
  const pos = side === 'bottom'
    ? { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
    : { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
  return h('span', {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    style: Object.assign({ position: 'relative', display: 'inline-flex' }, style),
  },
    children,
    show && h('span', {
      style: Object.assign({
        position: 'absolute', zIndex: 'var(--z-toast)', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em',
        background: 'var(--gray-800)', color: 'var(--gray-100)', border: '1px solid var(--border-strong)',
        padding: '6px 10px', boxShadow: 'var(--shadow-2)',
      }, pos),
    }, content)
  );
};
})();
