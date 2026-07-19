(() => {
const { Badge, Switch } = window.__DS;
const UI = (window.AcademyUI = window.AcademyUI || {});
const Icon = (p) => UI.Icon(p);

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'story', label: 'Story', icon: 'git-branch' },
  { id: 'lesson', label: 'Challenges', icon: 'terminal' },
  { id: 'progression', label: 'Progression', icon: 'trophy' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

UI.Shell = function Shell({ screen, go, theme, setTheme, children }) {
  const D = window.AcademyData;
  return (
    <div className="app">
      <div className="side">
        <div style={{ padding: '4px 20px 18px', borderBottom: '1px solid var(--border-hairline)', marginBottom: 12 }}>
          <UI.Lockup size={13} onClick={() => go('landing')} />
        </div>
        {NAV.map((n) => (
          <div key={n.id} className={'side-item' + (screen === n.id ? ' active' : '')} onClick={() => go(n.id)}>
            <Icon name={n.icon} size={15} />
            <span>{n.label}</span>
          </div>
        ))}
        <div style={{ flex: 1 }}></div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Switch label="Dark mode" checked={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, flex: 'none', background: 'var(--tint-cyan)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: 'var(--accent-fg-cyan)' }}>RV</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{D.user.name}</div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--text-muted)' }}>CLEARANCE 0{D.user.clearance}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="topbar">
          <span className="mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            // {screen.toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 9, letterSpacing: '.16em', color: 'var(--accent-fg-green)' }}>● ONLINE</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--accent-fg-volt)' }}>{D.user.streak}d STREAK</span>
            <Badge tone="cyan">{D.user.xp.toLocaleString()} XP</Badge>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

UI.App = function App() {
  const [screen, setScreen] = React.useState('landing');
  const [theme, setTheme] = React.useState('dark');
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
  });
  const go = setScreen;
  const inApp = !['landing', 'auth'].includes(screen);

  let page = null;
  if (screen === 'landing') page = <UI.Landing go={go} />;
  else if (screen === 'auth') page = <UI.Auth go={go} />;
  else if (screen === 'dashboard') page = <UI.Dashboard go={go} />;
  else if (screen === 'story') page = <UI.Story go={go} />;
  else if (screen === 'lesson') page = <UI.Lesson go={go} />;
  else if (screen === 'progression') page = <UI.Progression />;
  else if (screen === 'profile') page = <UI.Profile />;

  return inApp
    ? <UI.Shell screen={screen} go={go} theme={theme} setTheme={setTheme}>{page}</UI.Shell>
    : page;
};
})();
