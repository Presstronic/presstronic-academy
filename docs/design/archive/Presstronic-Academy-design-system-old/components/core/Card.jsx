import React from 'react';

export function Card({ notch = false, selected = false, selectedTone = 'cyan', interactive = false, padding = 20, style, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const edge = selectedTone === 'volt' ? 'var(--volt-500)' : 'var(--cyan-500)';
  const tint = selectedTone === 'volt' ? 'var(--tint-volt)' : 'var(--tint-cyan)';
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: selected ? tint : hover && interactive ? 'var(--surface-overlay)' : 'var(--surface-card)',
        border: '1px solid ' + (hover && interactive ? 'var(--border-strong)' : 'var(--border-hairline)'),
        borderLeft: selected ? '2px solid ' + edge : undefined,
        borderRadius: 0, padding,
        clipPath: notch ? 'var(--notch)' : 'none',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >{children}</div>
  );
}
