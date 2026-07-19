import React from 'react';

export function Checkbox({ label, checked, defaultChecked = false, onChange, style }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  const toggle = () => { const v = !on; setInternal(v); if (onChange) onChange(v); };
  return (
    <label onClick={(e) => { e.preventDefault(); toggle(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', ...style }}>
      <span style={{
        width: 16, height: 16, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'var(--cyan-500)' : 'var(--surface-inset)',
        border: '1px solid ' + (on ? 'var(--cyan-500)' : 'var(--input)'),
        transition: 'background var(--dur-fast) var(--ease-out)',
      }}>
        {on && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.5L4 8L8.5 2.5" stroke="var(--text-on-accent)" strokeWidth="1.8" /></svg>}
      </span>
      {label && <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}
