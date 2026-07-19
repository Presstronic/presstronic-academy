import React from 'react';

export function Input({ label, hint, error, type = 'text', style, inputStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: error ? 'var(--red-400)' : 'var(--text-muted)' }}>{label}</span>}
      <input
        type={type}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-strong)',
          background: 'var(--surface-inset)', borderRadius: 0, padding: '11px 12px', outline: 'none',
          border: '1px solid ' + (error ? 'var(--red-500)' : focus ? 'var(--cyan-500)' : 'var(--input)'),
          boxShadow: focus && !error ? '0 0 0 1px var(--cyan-500), 0 0 16px color-mix(in oklab, var(--cyan-500) 14%, transparent)' : 'none',
          transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
          ...inputStyle,
        }}
        {...rest}
      />
      {(error || hint) && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: error ? 'var(--red-400)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </label>
  );
}
