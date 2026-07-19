(() => {
const { Button, Input, Checkbox } = window.__DS;
const UI = (window.AcademyUI = window.AcademyUI || {});


UI.Auth = function Auth({ go }) {
  const [mode, setMode] = React.useState('login');
  const login = mode === 'login';
  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
      <div className="grid-bg"></div>
      <div className="hero-glow"></div>
      <div style={{ position: 'relative', width: 460, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><UI.Lockup size={17} sub onClick={() => go('landing')} /></div>
        <div className="hud neon-top" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', clipPath: 'var(--notch)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-hairline)' }}>
            {['login', 'register'].map((m) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px 0',
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
                color: mode === m ? 'var(--text-accent)' : 'var(--text-muted)',
                borderBottom: mode === m ? '2px solid var(--cyan-500)' : '2px solid transparent', marginBottom: -1,
              }}>{m === 'login' ? 'Sign in' : 'Enroll'}</button>
            ))}
          </div>
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="eyebrow dim">// SECURE CHANNEL</div>
            {!login && <Input label="Callsign" placeholder="Choose a username" />}
            <Input label="Email" placeholder="you@domain.dev" />
            <Input label="Access key" type="password" placeholder="••••••••••" hint={login ? undefined : 'Min 12 characters. Make it strange.'} />
            {login ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Checkbox label="Remember this terminal" defaultChecked />
                <a href="#" className="mono" style={{ fontSize: 11, letterSpacing: '.06em' }}>LOST KEY?</a>
              </div>
            ) : (
              <Checkbox label="Send me mission updates" />
            )}
            <Button size="lg" notch onClick={() => go('dashboard')} style={{ width: '100%' }}>
              {login ? 'Open channel' : 'Create operative file'}
            </Button>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--text-muted)', textAlign: 'center' }}>
          PROTECTED BY RATE LIMITING · JWT + REFRESH · TLS 1.3
        </div>
      </div>
    </div>
  );
};
})();
