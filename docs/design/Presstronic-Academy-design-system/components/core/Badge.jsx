import React from 'react';

const TONES = {
  neutral: { fg: 'var(--secondary-foreground)', tint: 'var(--muted)', solid: 'var(--gray-600)', solidFg: 'var(--gray-50)', border: 'var(--border-strong)' },
  cyan: { fg: 'var(--accent-fg-cyan)', tint: 'var(--tint-cyan)', solid: 'var(--cyan-500)', solidFg: 'var(--text-on-accent)', border: 'var(--border-accent)' },
  volt: { fg: 'var(--accent-fg-volt)', tint: 'var(--tint-volt)', solid: 'var(--volt-500)', solidFg: '#1a1503', border: 'color-mix(in oklab, var(--volt-500) 50%, transparent)' },
  green: { fg: 'var(--green-400)', tint: 'var(--tint-green)', solid: 'var(--green-500)', solidFg: '#04170c', border: 'color-mix(in oklab, var(--green-500) 50%, transparent)' },
  red: { fg: 'var(--red-400)', tint: 'var(--tint-red)', solid: 'var(--red-500)', solidFg: '#fff5f5', border: 'color-mix(in oklab, var(--red-500) 50%, transparent)' },
};

export function Badge({ tone = 'neutral', variant = 'soft', style, children }) {
  const t = TONES[tone] || TONES.neutral;
  const solid = variant === 'solid';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '4px 8px', borderRadius: 0,
      background: solid ? t.solid : t.tint,
      color: solid ? t.solidFg : t.fg,
      border: solid ? '1px solid transparent' : '1px solid ' + t.border,
      ...style,
    }}>{children}</span>
  );
}
