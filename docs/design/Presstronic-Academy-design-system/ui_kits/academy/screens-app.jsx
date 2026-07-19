(() => {
const { Button, Badge, Card, Progress, Input, Select, Switch, Tabs } = window.__DS;
const D = window.AcademyData;
const UI = (window.AcademyUI = window.AcademyUI || {});
const Icon = (p) => UI.Icon(p);

function PageHead({ eyebrow, title, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="eyebrow dim">{eyebrow}</div>
        <h1 className="display" style={{ fontSize: 32 }}>{title}</h1>
      </div>
      {right}
    </div>
  );
}
UI.PageHead = PageHead;

// ---------------- Dashboard ----------------
UI.Dashboard = function Dashboard({ go }) {
  return (
    <div style={{ padding: 'clamp(28px, 3vw, 48px)', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1440, width: '100%', margin: '0 auto' }}>
      <PageHead eyebrow={'// OPERATIVE ' + D.user.callsign.toUpperCase()} title={'Welcome back, ' + D.user.name + '.'}
        right={<Badge tone="cyan">Clearance 0{D.user.clearance}</Badge>} />

      {/* Continue mission */}
      <Card notch padding={0} className="hud" style={{ borderColor: 'var(--border-accent)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, padding: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="eyebrow volt">// RESUME MISSION</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>
              {D.story.path} — Ch.3 The Handoff
            </div>
            <div style={{ fontSize: 14, maxWidth: 560 }}>The queue is still blocked. Mara is waiting on your call — patch it fast, or do it right.</div>
            <Progress value={58} max={100} label="Path progress" showValue style={{ maxWidth: 420, marginTop: 6 }} />
          </div>
          <Button size="lg" notch glow onClick={() => go('story')}>Re-enter story</Button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Active paths */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="eyebrow dim">// YOUR PATHS</div>
          {D.paths.map((p) => (
            <Card key={p.id} interactive={p.status !== 'locked'} padding={18}
              onClick={p.status !== 'locked' ? () => go('story') : undefined}
              style={p.status === 'locked' ? { opacity: 0.55 } : null}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--tint-cyan)', border: '1px solid var(--border-accent)', color: 'var(--text-accent)' }}>
                  <Icon name={p.icon} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-strong)' }}>{p.title}</div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{p.track} · {p.act}</div>
                </div>
                {p.status === 'locked'
                  ? <Badge>Clearance 04</Badge>
                  : <div style={{ width: 120 }}><Progress value={p.progress} max={100} height={6} /></div>}
              </div>
            </Card>
          ))}
        </div>

        {/* Right rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={20}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="eyebrow dim">// TELEMETRY</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="stat"><span className="v">{D.user.xp.toLocaleString()}</span><span className="k">XP total</span></div>
                <div className="stat"><span className="v">{D.user.streak}<span style={{ color: 'var(--accent-fg-volt)' }}>d</span></span><span className="k">Streak</span></div>
              </div>
              <Progress label="To clearance 04" value={D.user.xp} max={D.user.xpNext} showValue />
            </div>
          </Card>
          <Card padding={20}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="eyebrow dim">// MISSION LOG</div>
              <div>
                {D.log.map((l, i) => (
                  <div className="log-row" key={i} style={{ borderBottom: i === D.log.length - 1 ? 'none' : undefined }}>
                    <span className="t">{l.t}</span>
                    <span style={{ color: l.tone === 'green' ? 'var(--accent-fg-green)' : l.tone === 'volt' ? 'var(--accent-fg-volt)' : l.tone === 'cyan' ? 'var(--accent-fg-cyan)' : 'var(--text-body)' }}>{l.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ---------------- Profile ----------------
UI.Profile = function Profile() {
  return (
    <div style={{ padding: 'clamp(28px, 3vw, 48px)', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
      <PageHead eyebrow="// OPERATIVE FILE" title="Profile" />
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16, alignItems: 'start' }}>
        <Card padding={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: 'var(--tint-cyan)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--accent-fg-cyan)' }}>RV</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-strong)' }}>{window.AcademyData.user.name}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{window.AcademyData.user.callsign}</div>
            </div>
            <Badge tone="cyan">Clearance 03 — Specialist</Badge>
            <Button variant="ghost" size="sm">Change avatar</Button>
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="eyebrow dim">// IDENTITY</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="First name" defaultValue="Rosa" />
                <Input label="Last name" defaultValue="Vasquez" />
                <Input label="Email" defaultValue="rosa@vasquez.dev" />
                <Select label="Primary track" options={['Backend engineering', 'Frontend engineering', 'Security']} />
              </div>
              <Input label="Bio" defaultValue="Queue whisperer. Takes the long way on purpose." />
              <div style={{ display: 'flex', gap: 10 }}>
                <Button>Save changes</Button>
                <Button variant="ghost">Discard</Button>
              </div>
            </div>
          </Card>
          <Card padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="eyebrow dim">// TERMINAL PREFERENCES</div>
              <Switch label="Dark mode" defaultChecked />
              <Switch label="Type-on narration" defaultChecked />
              <Switch label="Weekly mission digest" />
            </div>
          </Card>
          <Card padding={24} style={{ borderColor: 'color-mix(in oklab, var(--red-500) 40%, transparent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className="eyebrow" style={{ color: 'var(--red-400)' }}>// DANGER ZONE</div>
                <div style={{ fontSize: 13 }}>Burn this operative file. All paths, XP, and achievements are erased.</div>
              </div>
              <Button variant="destructive" size="sm">Delete account</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ---------------- Progression ----------------
UI.Progression = function Progression({ go }) {
  const D = window.AcademyData;
  return (
    <div style={{ padding: 'clamp(28px, 3vw, 48px)', display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1440, width: '100%', margin: '0 auto' }}>
      <PageHead eyebrow="// SERVICE RECORD" title="Progression" right={
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a className="mono" style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer' }} onClick={() => go && go('certificate')}>View completion record →</a>
          <Badge tone="volt">2,140 XP</Badge>
        </div>
      } />

      <Card padding={24}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="eyebrow dim">// CLEARANCE LADDER</div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>$ git log --graph --oneline clearance</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {D.clearances.map((c, i) => {
              const last = i === D.clearances.length - 1;
              const prev = D.clearances[i - 1];
              const state = c.now ? 'now' : c.done ? 'done' : 'locked';
              const aboveSolid = i > 0 && prev.done;
              const belowSolid = c.done;
              const accent = c.now ? 'var(--volt-500)' : c.done ? 'var(--cyan-500)' : 'var(--border-strong)';
              const labelColor = c.now ? 'var(--accent-fg-volt)' : c.done ? 'var(--text-accent)' : 'var(--text-muted)';
              return (
                <div key={c.lvl} className={'cgraph-row ' + state} style={{ display: 'flex', gap: 16, padding: '6px 12px', margin: '0 -12px', borderRadius: 6, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch', width: 20, flex: 'none' }}>
                    <div style={{ width: 0, flex: 1, borderLeft: i === 0 ? 'none' : ('2px ' + (aboveSolid ? 'solid' : 'dashed') + ' ' + (aboveSolid ? 'var(--cyan-500)' : 'var(--border-strong)')) }}></div>
                    <div className={'cgraph-node ' + state}></div>
                    <div style={{ width: 0, flex: 1, borderLeft: last ? 'none' : ('2px ' + (belowSolid ? 'solid' : 'dashed') + ' ' + (belowSolid ? 'var(--cyan-500)' : 'var(--border-strong)')) }}></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1, minWidth: 0, paddingBottom: last ? 0 : 22, paddingTop: i === 0 ? 0 : 2 }}>
                    <div style={{ flex: '0 0 220px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontSize: 12, color: c.now ? 'var(--accent-fg-volt)' : c.done ? 'var(--text-accent)' : 'var(--text-muted)' }}>{c.hash}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: c.done || c.now ? 'var(--text-strong)' : 'var(--text-muted)' }}>{c.name}</span>
                        {c.now && <span className="mono" style={{ fontSize: 10, letterSpacing: '.06em', fontWeight: 700, color: 'var(--text-on-accent)', background: 'var(--volt-500)', padding: '2px 7px' }}>HEAD</span>}
                        {!c.done && !c.now && <Icon name="lock" size={11} />}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>clearance/{c.lvl}-{c.name.toLowerCase()} · {c.xp} XP</div>
                    </div>
                    <div className="cgraph-detail" style={{ flex: 1, minWidth: 0, borderLeft: '2px ' + (c.done ? 'solid' : 'dashed') + ' ' + accent, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: labelColor }}>// FIELD NOTE</span>
                      <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-body)', margin: 0 }}>{c.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Progress label="To clearance 04 — Fixer" value={D.user.xp} max={D.user.xpNext} showValue tone="volt" />
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="eyebrow dim">// ACHIEVEMENTS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {D.achievements.map((a) => (
            <Card key={a.name} padding={18} style={a.earned ? null : { opacity: 0.5 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: a.earned ? 'var(--tint-volt)' : 'var(--muted)', border: '1px solid ' + (a.earned ? 'color-mix(in oklab, var(--volt-500) 45%, transparent)' : 'var(--border-hairline)'), color: a.earned ? 'var(--accent-fg-volt)' : 'var(--text-muted)' }}>
                  <Icon name={a.icon} size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text-strong)' }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
})();
