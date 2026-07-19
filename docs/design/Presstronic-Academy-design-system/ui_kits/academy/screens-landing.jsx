(() => {
const { Button, Badge, Card } = window.__DS;
const UI = (window.AcademyUI = window.AcademyUI || {});

function Icon({ name, size = 16, style }) {
  return (
    <span
      style={{ display: 'inline-flex', width: size, height: size, fontSize: size, flex: 'none', ...style }}
      dangerouslySetInnerHTML={{ __html: '<i data-lucide="' + name + '" style="width:' + size + 'px;height:' + size + 'px;display:inline-block"></i>' }}
    ></span>
  );
}
UI.Icon = Icon;

UI.Lockup = function Lockup({ size = 15, sub = false, onClick, mark = false }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ width: size * 1.9, height: size * 1.9, flex: 'none', background: 'var(--cyan-500)', clipPath: 'polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: Math.round(size * 1.05), color: 'var(--text-on-accent)', lineHeight: 1 }}>A</span>
      </div>
      {!mark && <div style={{ display: 'flex', flexDirection: 'column', gap: 3, lineHeight: 1 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: Math.max(8, Math.round(size * 0.56)), letterSpacing: '0.34em', color: 'var(--text-muted)' }}>PRESSTRONIC</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size, letterSpacing: '0.02em', color: 'var(--text-strong)' }}>ACADEMY<span className="blink" style={{ color: 'var(--accent-fg-mag)' }}>_</span></span>
      </div>}
      {sub && !mark && <span className="sig-dash mag" style={{ alignSelf: 'flex-end', marginBottom: 3 }}></span>}
    </div>
  );
};

UI.Landing = function Landing({ go }) {
  const feats = [
    { icon: 'git-branch', title: 'Branching curriculum', desc: 'Every decision forks the story. Take the fast patch or the right fix — the path remembers.' },
    { icon: 'terminal', title: 'Skill challenges', desc: 'Real code, real tests. Pass the run to unlock the next chapter.' },
    { icon: 'book-open', title: 'Modular lessons', desc: 'Self-contained knowledge units you can replay from any checkpoint.' },
    { icon: 'trophy', title: 'Progression that means something', desc: 'XP, clearance levels, and achievements tied to what you shipped — not time watched.' },
  ];
  return (
    <div>
      {/* Nav */}
      <div className="ld-nav">
        <div className="ld-nav-in">
          <UI.Lockup size={15} sub />
          <div style={{ display: 'flex', gap: 24, flex: 1 }}>
            <span className="ld-link">Paths</span>
            <span className="ld-link">Challenges</span>
            <span className="ld-link">Pricing</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" size="sm" onClick={() => go('auth')}>Sign in</Button>
            <Button size="sm" onClick={() => go('auth')}>Enroll</Button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg"></div>
        <div className="hero-glow"></div>
        <div className="section" style={{ position: 'relative', padding: '112px 24px 96px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}>
          <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span className="sig-dash"></span>// A CHOOSE-YOUR-OWN-ADVENTURE JOURNEY INTO SOFTWARE MASTERY<span className="sig-dash mag"></span></div>
          <h1 className="display" style={{ fontSize: 'clamp(56px, 5.2vw, 88px)', fontWeight: 800, maxWidth: 980, textShadow: '0 0 48px color-mix(in oklab, var(--cyan-500) 28%, transparent)' }}>
            Master software.<br /><span className="ink-signal">One decision</span> at a time.
          </h1>
          <p style={{ maxWidth: 640, fontSize: 18, margin: 0 }}>
            Presstronic Academy replaces endless tutorials with a branching, story-driven
            adventure. You take the assignments. Your choices write the path.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button size="lg" notch glow onClick={() => go('auth')}>Begin your first mission</Button>
            <Button size="lg" variant="ghost">Watch a branch play out</Button>
          </div>
          <div style={{ display: 'flex', gap: 40, marginTop: 40, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            <span><span style={{ color: 'var(--text-accent)' }}>27</span> STORY PATHS</span>
            <span><span style={{ color: 'var(--accent-fg-mag)' }}>412</span> CHALLENGES</span>
            <span><span style={{ color: 'var(--accent-fg-volt)' }}>8,900+</span> OPERATIVES</span>
          </div>
        </div>
      </div>

      {/* Features bento */}
      <div className="section" style={{ padding: '96px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="eyebrow dim">// HOW IT WORKS</div>
          <h2 className="display" style={{ fontSize: 36 }}>Not a course. An assignment.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {feats.map((f, i) => (
            <Card key={f.title} notch={i === 0} padding={28} interactive>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Icon name={f.icon} size={22} style={{ color: 'var(--text-accent)' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-body)' }}>{f.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Story preview */}
      <div style={{ background: 'var(--surface-raised)', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="section" style={{ padding: '96px 24px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 56, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="eyebrow volt">// LIVE FROM A PATH</div>
            <h2 className="display" style={{ fontSize: 32 }}>Every chapter ends in a fork.</h2>
            <p style={{ fontSize: 15, margin: 0 }}>
              Patch it fast, do it right, or ask for help — each branch teaches a different
              lesson, and the story holds you to it. Replay any checkpoint to walk the road
              not taken.
            </p>
            <div><Button variant="ghost" onClick={() => go('auth')}>Try this fork</Button></div>
          </div>
          <div className="dark hud neon-top" style={{ background: 'var(--surface-inset)', border: '1px solid var(--border-strong)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14, color: 'var(--text-body)' }}>
            <div className="eyebrow dim" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>THE BROKEN PIPELINE — CH. 3</span><span>06:00:00 TO DEMO</span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7 }}>
              “The queue worker retries forever on a poison message. You can patch it fast,
              or do it right. Your call, operative.”
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="choice"><span className="key">A</span><span>Patch it fast — drop the message and move on.</span></div>
              <div className="choice"><span className="key">B</span><span>Do it right — add a dead-letter queue.</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="section" style={{ padding: '96px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center', alignItems: 'center' }}>
          <div className="eyebrow dim">// PRICING</div>
          <h2 className="display" style={{ fontSize: 36 }}>One subscription. Every path.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 760, margin: '0 auto', width: '100%' }}>
          <Card padding={28}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Badge>Recruit</Badge>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="mono" style={{ fontSize: 34, color: 'var(--text-strong)' }}>$0</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>/ FOREVER</span>
              </div>
              <div style={{ fontSize: 14 }}>Act 1 of every path. Feel the fork before you commit.</div>
              <Button variant="ghost" onClick={() => go('auth')}>Start free</Button>
            </div>
          </Card>
          <Card padding={28} notch style={{ borderColor: 'var(--border-accent)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Badge tone="cyan" variant="solid">Operative</Badge>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="mono" style={{ fontSize: 34, color: 'var(--text-strong)' }}>$19</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>/ MONTH</span>
              </div>
              <div style={{ fontSize: 14 }}>Every act, every branch, all challenges, full progression.</div>
              <Button notch onClick={() => go('auth')}>Enroll now</Button>
            </div>
          </Card>
        </div>
      </div>

      <UI.Footer />
    </div>
  );
};

/* ================= Footer — full site footer with GDPR/CCPA data-rights controls ================= */
const FOOT_COLS = [
  { head: 'PRODUCT', links: ['Story paths', 'Skill challenges', 'Progression', 'Pricing', 'Changelog', 'System status'] },
  { head: 'LEARN', links: ['Documentation', 'Field notes (blog)', 'Community Discord', 'Support'] },
  { head: 'COMPANY', links: ['About Presstronic', 'Careers', 'Contact', 'Press kit'] },
  { head: 'LEGAL', links: ['Terms of service', 'Privacy policy', 'Cookie policy', 'Acceptable use', 'Data processing agreement', 'Sub-processors', 'Open-source licenses', 'Security'] },
];

UI.Footer = function Footer() {
  const { Button, Badge, Dialog, Switch } = window.__DS;
  const Icon = UI.Icon;
  const [exportState, setExportState] = React.useState('idle');   // idle | done
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteState, setDeleteState] = React.useState('idle');   // idle | done
  const [cookiesOpen, setCookiesOpen] = React.useState(false);
  const [cookiesSaved, setCookiesSaved] = React.useState(false);

  const linkStyle = { fontSize: 13, color: 'var(--text-body)', cursor: 'pointer' };

  return (
    <div style={{ borderTop: '1px solid var(--border-hairline)', background: 'var(--surface-raised)' }}>
      {/* Data rights strip */}
      <div style={{ borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="section" style={{ padding: '48px 24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(320px, 1fr)', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="eyebrow">// YOUR DATA, YOUR CALL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: 'var(--text-strong)' }}>We hold your data like it's radioactive.</div>
            <div style={{ fontSize: 14, maxWidth: 520 }}>
              GDPR and CCPA compliant by design. Export everything we know about you, or erase it — no
              tickets, no retention tricks, no dark patterns. Questions go to <a href="mailto:privacy@presstronic.com">privacy@presstronic.com</a> (our data protection officer).
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="ghost" onClick={() => setExportState('done')}><Icon name="download" size={13} /> Request my data</Button>
              <Button variant="destructive" onClick={() => { setDeleteState('idle'); setDeleteOpen(true); }}><Icon name="trash-2" size={13} /> Delete me</Button>
              <Button variant="ghost" onClick={() => setCookiesOpen(true)}><Icon name="cookie" size={13} /> Cookie preferences</Button>
            </div>
            {exportState === 'done' && (
              <div className="mono fade-in" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--accent-fg-green)' }}>REQUEST LOGGED — FULL EXPORT (JSON + CSV) ARRIVES BY EMAIL WITHIN 72 HOURS.</div>
            )}
            {deleteState === 'done' && (
              <div className="mono fade-in" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--red-400)' }}>DELETION SCHEDULED — 14-DAY GRACE PERIOD, THEN EVERYTHING IS GONE. CONFIRMATION EMAIL SENT.</div>
            )}
            {cookiesSaved && (
              <div className="mono fade-in" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--accent-fg-cyan)' }}>COOKIE PREFERENCES SAVED FOR THIS TERMINAL.</div>
            )}
            <div className="mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--text-muted)' }}>EXPORTS COVER: PROFILE · PROGRESS · DECISIONS · SUBMISSIONS · BILLING · SUPPORT THREADS</div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="section" style={{ padding: '56px 24px 40px', display: 'grid', gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(4, minmax(140px, 1fr))', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <UI.Lockup size={13} sub />
          <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 240 }}>A choose-your-own-adventure journey into software mastery. Built by Presstronic LLC.</div>
          <div style={{ display: 'flex', gap: 14, color: 'var(--text-muted)' }}>
            <Icon name="github" size={16} />
            <Icon name="youtube" size={16} />
            <Icon name="twitch" size={16} />
            <Icon name="rss" size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, background: 'var(--green-500)', display: 'inline-block' }}></span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--text-muted)' }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
        {FOOT_COLS.map((col) => (
          <div key={col.head} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="mono" style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.12em', color: 'var(--text-muted)' }}>{col.head}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {col.links.map((l) => <a key={l} href="#" style={linkStyle}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border-hairline)' }}>
        <div className="section" style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--text-muted)' }}>© 2026 PRESSTRONIC LLC · GPL-3.0-OR-LATER · KANSAS CITY, USA</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge>GDPR</Badge>
            <Badge>CCPA</Badge>
            <Badge>WCAG 2.2 AA</Badge>
            <span className="sig-dash mag"></span>
          </div>
        </div>
      </div>

      {/* Delete-me dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} eyebrow="// RIGHT TO ERASURE — GDPR ART. 17" title="Erase everything?"
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setDeleteOpen(false)}>Keep my account</Button>
          <Button variant="destructive" size="sm" onClick={() => { setDeleteState('done'); setDeleteOpen(false); }}>Yes — delete me</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span>This schedules permanent deletion of your account and every record tied to it: profile, story decisions, challenge submissions, XP, achievements, billing history, and support threads.</span>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '.08em', color: 'var(--text-muted)' }}>14-DAY GRACE PERIOD TO CANCEL · BACKUPS PURGED WITHIN 30 DAYS · INVOICES RETAINED ONLY WHERE TAX LAW REQUIRES</span>
        </div>
      </Dialog>

      {/* Cookie preferences dialog */}
      <Dialog open={cookiesOpen} onClose={() => setCookiesOpen(false)} eyebrow="// COOKIE PREFERENCES" title="Only what you allow."
        footer={<>
          <Button variant="ghost" size="sm" onClick={() => setCookiesOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => { setCookiesSaved(true); setCookiesOpen(false); }}>Save preferences</Button>
        </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div><div style={{ fontSize: 13, color: 'var(--text-strong)' }}>Strictly necessary</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sessions, security, saving your place in the story.</div></div>
            <Badge tone="cyan">Always on</Badge>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div><div style={{ fontSize: 13, color: 'var(--text-strong)' }}>Analytics</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Anonymous usage stats. No third-party ad tech, ever.</div></div>
            <Switch />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div><div style={{ fontSize: 13, color: 'var(--text-strong)' }}>Marketing</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mission updates and new-path announcements.</div></div>
            <Switch />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
})();
