import React from 'react';

export function Switch({ label, checked, defaultChecked = false, onChange, style }) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = checked !== undefined ? checked : internal;
  const toggle = () => { const v = !on; setInternal(v); if (onChange) onChange(v); };
  return (
    <label onClick={(e) => { e.preventDefault(); toggle(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none', ...style }}>
      <span style={{
        width: 36, height: 20, flex: 'none', position: 'relative',
        background: on ? 'var(--cyan-500)' : 'var(--surface-inset)',
        border: '1px solid ' + (on ? 'var(--cyan-500)' : 'var(--input)'),
        transition: 'background var(--dur-base) var(--ease-out)',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: on ? 18 : 2, width: 14, height: 14,
          background: on ? 'var(--text-on-accent)' : 'var(--gray-400)',
          transition: 'left var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)',
        }}></span>
      </span>
      {label && <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}
