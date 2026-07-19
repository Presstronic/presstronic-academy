import React from 'react';

const SIZES = {
  sm: { padding: '8px 14px', fontSize: 11 },
  md: { padding: '11px 20px', fontSize: 12 },
  lg: { padding: '14px 26px', fontSize: 13 },
};

const VARIANTS = {
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

export function Button({ variant = 'primary', size = 'md', notch = false, glow = false, disabled = false, style, children, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'var(--font-mono)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        fontSize: s.fontSize, padding: s.padding, borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1, transform: press ? 'scale(0.99)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        clipPath: notch ? 'var(--notch)' : 'none',
        boxShadow: glow && variant === 'primary' ? 'var(--glow-cyan)' : 'none',
        ...v.base, ...(hover && !disabled ? v.hover : null), ...style,
      }}
      {...rest}
    >{children}</button>
  );
}
