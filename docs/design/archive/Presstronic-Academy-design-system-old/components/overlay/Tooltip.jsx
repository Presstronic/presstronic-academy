import React from 'react';

export function Tooltip({ content, side = 'top', style, children }) {
  const [show, setShow] = React.useState(false);
  const pos = side === 'bottom'
    ? { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
    : { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' };
  return (
    <span onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      {children}
      {show && (
        <span style={{
          position: 'absolute', ...pos, zIndex: 'var(--z-toast)', whiteSpace: 'nowrap',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em',
          background: 'var(--gray-800)', color: 'var(--gray-100)', border: '1px solid var(--border-strong)',
          padding: '6px 10px', boxShadow: 'var(--shadow-2)',
        }}>{content}</span>
      )}
    </span>
  );
}
