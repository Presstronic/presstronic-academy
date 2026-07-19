import React from 'react';

export function Select({ label, options = [], style, selectStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>}
      <div style={{ position: 'relative' }}>
        <select
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            width: '100%', appearance: 'none', WebkitAppearance: 'none',
            fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)',
            background: 'var(--surface-inset)', borderRadius: 0, padding: '11px 36px 11px 12px', outline: 'none',
            border: '1px solid ' + (focus ? 'var(--cyan-500)' : 'var(--input)'), cursor: 'pointer',
            transition: 'border-color var(--dur-fast) var(--ease-out)',
            ...selectStyle,
          }}
          {...rest}
        >
          {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>▾</span>
      </div>
    </label>
  );
}
