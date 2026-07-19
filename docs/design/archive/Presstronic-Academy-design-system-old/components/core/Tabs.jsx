import React from 'react';

export function Tabs({ items = [], value, onChange, style }) {
  const [internal, setInternal] = React.useState(value ?? (items[0] && (items[0].value ?? items[0])));
  const active = value !== undefined ? value : internal;
  const set = (v) => { setInternal(v); if (onChange) onChange(v); };
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-hairline)', ...style }}>
      {items.map((it) => {
        const v = it.value ?? it;
        const label = it.label ?? it;
        const on = v === active;
        return (
          <button key={v} onClick={() => set(v)} style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', border: 'none', borderBottom: on ? '2px solid var(--cyan-500)' : '2px solid transparent',
            color: on ? 'var(--cyan-400)' : 'var(--text-muted)', padding: '10px 14px', marginBottom: -1,
            cursor: 'pointer', transition: 'color var(--dur-fast) var(--ease-out)',
          }}>{label}</button>
        );
      })}
    </div>
  );
}
