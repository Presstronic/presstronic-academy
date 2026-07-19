import React from 'react';

export function Dialog({ open = false, onClose, eyebrow, title, footer, width = 480, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-overlay)', background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width, maxWidth: '100%', background: 'var(--surface-overlay)',
        border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-3)', borderRadius: 0,
        clipPath: 'var(--notch)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {eyebrow && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-400)' }}>{eyebrow}</div>}
          {title && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{title}</div>}
        </div>
        <div style={{ padding: '14px 24px 20px', fontSize: 14, lineHeight: 1.6, color: 'var(--text-body)' }}>{children}</div>
        {footer && <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}
