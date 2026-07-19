import React from 'react';

export function Progress({ value = 0, max = 100, tone = 'cyan', label, showValue = false, height = 8, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = tone === 'volt' ? 'var(--volt-500)' : tone === 'green' ? 'var(--green-500)' : 'var(--cyan-500)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          <span>{label}</span>
          {showValue && <span style={{ color: 'var(--text-body)' }}>{value} / {max}</span>}
        </div>
      )}
      <div style={{ height, background: 'var(--surface-inset)', border: '1px solid var(--border-hairline)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: pct + '%', background: fill, transition: 'width var(--dur-slow) var(--ease-out)' }}></div>
      </div>
    </div>
  );
}
