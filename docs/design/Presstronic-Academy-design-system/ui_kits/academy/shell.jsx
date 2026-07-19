(() => {
const { Badge, Switch } = window.__DS;
const UI = (window.AcademyUI = window.AcademyUI || {});
const Icon = (p) => UI.Icon(p);

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'catalog', label: 'Catalog', icon: 'compass' },
  { id: 'log', label: 'Mission log', icon: 'bell' },
  { id: 'story', label: 'Story', icon: 'git-branch' },
  { id: 'lesson', label: 'Challenges', icon: 'terminal' },
  { id: 'progression', label: 'Progression', icon: 'trophy' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

UI.Shell = function Shell({ screen, go, theme, setTheme, collapsed, setCollapsed, children }) {
  const D = window.AcademyData;
  return (
    <div className="app" style={{ gridTemplateColumns: (collapsed ? '72px' : 'var(--sidebar-w)') + ' 1fr' }}>
      <div className={'side' + (collapsed ? ' collapsed' : '')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '4px 12px 18px' : '4px 20px 18px', borderBottom: '1px solid var(--border-hairline)', marginBottom: 12, gap: 8 }}>
          <UI.Lockup size={13} mark={collapsed} onClick={() => go('dashboard')} />
          {!collapsed && <button className="side-toggle" title="Collapse navigation" onClick={() => setCollapsed(true)}><Icon name="chevron-left" size={14} /></button>}
        </div>
        {collapsed && <div style={{ padding: '0 12px 12px', display: 'flex', justifyContent: 'center' }}>
          <button className="side-toggle" title="Expand navigation" onClick={() => setCollapsed(false)}><Icon name="chevron-right" size={14} /></button>
        </div>}
        {NAV.map((n) => (
          <div key={n.id} className={'side-item' + (screen === n.id ? ' active' : '')} title={collapsed ? n.label : undefined}
            style={collapsed ? { justifyContent: 'center', padding: '10px 0' } : null} onClick={() => n.href ? (window.location.href = n.href) : go(n.id)}>
            <Icon name={n.icon} size={15} />
            {!collapsed && <span>{n.label}</span>}
          </div>
        ))}
        <div style={{ flex: 1 }}></div>
        <div style={{ padding: collapsed ? '14px 12px' : '14px 20px', borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 12, alignItems: collapsed ? 'center' : 'stretch' }}>
          <Switch label={collapsed ? null : 'Dark mode'} checked={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, flex: 'none', background: 'var(--tint-cyan)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: 'var(--accent-fg-cyan)' }}>RV</div>
            {!collapsed && <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{D.user.name}</div>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--text-muted)' }}>CLEARANCE 0{D.user.clearance}</div>
            </div>}
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
  const [screen, setScreen] = React.useState(() => {
    try { const h = (window.location.hash || '').replace('#', ''); if (h) return h; } catch (e) {}
    return 'landing';
  });
  const [theme, setTheme] = React.useState('dark');
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem('academy-nav-collapsed') === '1'; } catch (e) { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem('academy-nav-collapsed', collapsed ? '1' : '0'); } catch (e) {}
  }, [collapsed]);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo(0, 0);
  });
  React.useEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || '').replace('#', '');
      if (h) setScreen(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = setScreen;
  const inApp = !['landing', 'auth'].includes(screen);

  let page = null;
  if (screen === 'landing') page = <UI.Landing go={go} />;
  else if (screen === 'auth') page = <UI.Auth go={go} />;
  else if (screen === 'dashboard') page = <UI.Dashboard go={go} />;
  else if (screen === 'story') page = <UI.Story go={go} />;
  else if (screen === 'lesson') page = <UI.Lesson go={go} />;
  else if (screen === 'progression') page = <UI.Progression go={go} />;
  else if (screen === 'profile') page = <UI.Profile />;
  else if (screen === 'catalog') page = <UI.Catalog go={go} />;
  else if (screen === 'log') page = <UI.MissionLog go={go} />;
  else if (screen === 'certificate') page = <UI.Certificate go={go} />;

  return inApp
    ? <UI.Shell screen={screen} go={go} theme={theme} setTheme={setTheme} collapsed={collapsed} setCollapsed={setCollapsed}>{page}</UI.Shell>
    : page;
};
})();
