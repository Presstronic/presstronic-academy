(() => {
const { Button, Badge, Card, Input } = window.__DS;
const UI = (window.AcademyUI = window.AcademyUI || {});
const Icon = (p) => UI.Icon(p);

// ---------------- Catalog data ----------------
const TYPE_META = {
  story:     { label: 'Story path', icon: 'git-branch', color: 'var(--accent-fg-volt)', tint: 'var(--tint-volt)', border: 'color-mix(in oklab, var(--volt-500) 40%, transparent)' },
  track:     { label: 'Track',      icon: 'layers',     color: 'var(--accent-fg-cyan)', tint: 'var(--tint-cyan)', border: 'var(--border-accent)' },
  challenge: { label: 'Challenge',  icon: 'terminal',   color: 'var(--accent-fg-mag)',  tint: 'var(--tint-mag)',  border: 'color-mix(in oklab, var(--mag-500) 40%, transparent)' },
};

const CATALOG = [
  { id: 'broken-pipeline', type: 'story', title: 'The Broken Pipeline', track: 'Backend engineering', blurb: 'A silent job is eating messages and the client demo is in six hours. Patch it fast, or do it right.', tags: ['NestJS','PostgreSQL','Redis'], clearance: 2, dur: '6h', xp: 1200, status: 'progress' },
  { id: 'ghost-interface', type: 'story', title: 'Ghost in the Interface', track: 'Frontend engineering', blurb: 'A component re-renders itself into oblivion. Trace the ghost through the render tree before the launch.', tags: ['React','TypeScript'], clearance: 2, dur: '5h', xp: 900, status: 'progress' },
  { id: 'zero-day', type: 'story', title: 'Zero Day', track: 'Security', blurb: 'A live exploit is walking through your services. Contain the breach and read the attacker\u2019s intent.', tags: ['Docker','Linux'], clearance: 4, dur: '8h', xp: 1600, status: 'locked' },
  { id: 'silent-migration', type: 'story', title: 'Silent Migration', track: 'Backend engineering', blurb: 'A schema change ships clean, then production quietly diverges. Reconcile two truths without downtime.', tags: ['PostgreSQL','TypeScript'], clearance: 3, dur: '7h', xp: 1400, status: 'new' },
  { id: 'cache-heist', type: 'story', title: 'The Cache Heist', track: 'Backend engineering', blurb: 'Stale reads are leaking one customer\u2019s data to another. Find the poisoned key before legal does.', tags: ['Redis','Go'], clearance: 3, dur: '4h', xp: 1100, status: 'new' },
  { id: 'backend-track', type: 'track', title: 'Backend Engineering Path', track: 'Backend engineering', blurb: 'The full curated program: queues, data modeling, resilience, and shipping under fire. Nine story arcs.', tags: ['NestJS','PostgreSQL','Redis'], clearance: 1, dur: '40h', xp: 6000, status: 'progress' },
  { id: 'frontend-track', type: 'track', title: 'Frontend Engineering Path', track: 'Frontend engineering', blurb: 'State, rendering, and interface craft from first principles to production-grade component systems.', tags: ['React','TypeScript','GraphQL'], clearance: 1, dur: '36h', xp: 5400, status: 'new' },
  { id: 'security-track', type: 'track', title: 'Security Operations Track', track: 'Security', blurb: 'Threat modeling, incident response, and hardening real systems against real attackers. Clearance 03+.', tags: ['Docker','Linux','PostgreSQL'], clearance: 3, dur: '44h', xp: 6800, status: 'new' },
  { id: 'dlq', type: 'challenge', title: 'Dead-letter Queues', track: 'Backend engineering', blurb: 'Refactor a worker so poison messages park after three retries instead of blocking the whole queue.', tags: ['NestJS','Redis'], clearance: 2, dur: '45m', xp: 320, status: 'completed' },
  { id: 'race-renderer', type: 'challenge', title: 'Race the Renderer', track: 'Frontend engineering', blurb: 'Two async updates land out of order and the UI lies. Serialize the truth without blocking paint.', tags: ['React','TypeScript'], clearance: 2, dur: '35m', xp: 260, status: 'new' },
  { id: 'injection-autopsy', type: 'challenge', title: 'Injection Autopsy', track: 'Security', blurb: 'Given a breached endpoint, reconstruct the injection, patch it, and write the postmortem in mono.', tags: ['PostgreSQL','Docker'], clearance: 3, dur: '55m', xp: 400, status: 'new' },
  { id: 'shard-monolith', type: 'challenge', title: 'Shard the Monolith', track: 'Backend engineering', blurb: 'Split a hot table across shards while live traffic reads it. No lost writes, no locked rows.', tags: ['PostgreSQL','Go'], clearance: 4, dur: '60m', xp: 480, status: 'locked' },
];

const TRACKS = ['Backend engineering', 'Frontend engineering', 'Security'];

UI.Catalog = function Catalog({ go }) {
  const [q, setQ] = React.useState('');
  const [type, setType] = React.useState('all');
  const [tracks, setTracks] = React.useState([]);
  const [enrolled, setEnrolled] = React.useState(CATALOG.filter(o => o.status === 'progress' || o.status === 'completed').map(o => o.id));
  const [toast, setToast] = React.useState(null);
  const toastT = React.useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 2400);
  };

  const toggleTrack = (t) => setTracks(x => x.includes(t) ? x.filter(v => v !== t) : x.concat([t]));
  const toggleEnroll = (o) => {
    const has = enrolled.includes(o.id);
    setEnrolled(x => has ? x.filter(id => id !== o.id) : x.concat([o.id]));
    showToast(has ? ('Removed \u2014 ' + o.title) : ('Added to your file \u2014 ' + o.title));
  };

  const ql = q.trim().toLowerCase();
  const results = CATALOG.filter(o => {
    if (type !== 'all' && o.type !== type) return false;
    if (tracks.length && !tracks.includes(o.track)) return false;
    if (ql) {
      const hay = (o.title + ' ' + o.blurb + ' ' + o.track + ' ' + o.tags.join(' ')).toLowerCase();
      if (hay.indexOf(ql) < 0) return false;
    }
    return true;
  });

  const tabs = [['all', 'All'], ['story', 'Story paths'], ['track', 'Tracks'], ['challenge', 'Challenges']];

  return (
    <div style={{ padding: 'clamp(28px, 3vw, 48px)', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1440, width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="eyebrow dim">// MISSION CATALOG</div>
          <h1 className="display" style={{ fontSize: 32 }}>Choose your next assignment.</h1>
        </div>
        <Button variant="ghost" onClick={() => go('dashboard')}>Open dashboard</Button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <Input placeholder="Search paths, tracks, challenges, tech…" value={q} onChange={(e) => setQ(e.target ? e.target.value : e)} />
        </div>
        {TRACKS.map(t => (
          <button key={t} onClick={() => toggleTrack(t)} className="mono" style={{
            fontSize: 11, letterSpacing: '.05em', padding: '8px 12px', cursor: 'pointer',
            background: tracks.includes(t) ? 'var(--tint-cyan)' : 'transparent',
            border: '1px solid ' + (tracks.includes(t) ? 'var(--border-accent)' : 'var(--border-hairline)'),
            color: tracks.includes(t) ? 'var(--accent-fg-cyan)' : 'var(--text-muted)',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid var(--border-hairline)' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {tabs.map(([v, label]) => (
            <button key={v} onClick={() => setType(v)} className="mono" style={{
              background: 'transparent', border: 'none', borderBottom: '2px solid ' + (type === v ? 'var(--cyan-500)' : 'transparent'),
              fontSize: 12, letterSpacing: '.06em', padding: '8px 14px', cursor: 'pointer', marginBottom: -1,
              color: type === v ? 'var(--text-strong)' : 'var(--text-muted)',
            }}>{label}</button>
          ))}
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{results.length} results</span>
      </div>

      {results.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {results.map(o => {
            const tm = TYPE_META[o.type];
            const isEnrolled = enrolled.includes(o.id);
            const locked = o.status === 'locked';
            return (
              <div key={o.id} className="card-hover" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-hairline)', padding: 18, display: 'flex', flexDirection: 'column', gap: 11, opacity: locked ? 0.62 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 38, height: 38, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tm.tint, border: '1px solid ' + tm.border, color: tm.color }}>
                    <Icon name={tm.icon} size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span className="mono" style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: tm.color }}>{tm.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--text-strong)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{o.title}</span>
                  </div>
                  {o.status === 'progress' && <Badge tone="cyan">In progress</Badge>}
                  {o.status === 'completed' && <Badge tone="green">Completed</Badge>}
                  {locked && <Badge>Locked</Badge>}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{o.blurb}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {o.tags.map(t => <span key={t} className="mono" style={{ fontSize: 10, letterSpacing: '.04em', color: 'var(--text-muted)', border: '1px solid var(--border-hairline)', padding: '2px 7px' }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="shield" size={11} />Clr 0{o.clearance}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={11} />{o.dur}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--accent-fg-mag)' }}><Icon name="zap" size={11} />{o.xp.toLocaleString()} XP</span>
                </div>
                <div style={{ flex: 1 }}></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderTop: '1px solid var(--border-hairline)', paddingTop: 14 }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.track}</span>
                  {locked
                    ? <Button size="sm" variant="ghost" disabled>Clearance 0{o.clearance}</Button>
                    : o.status === 'progress'
                      ? <Button size="sm" onClick={() => go('story')}>Resume</Button>
                      : o.status === 'completed'
                        ? <Button size="sm" variant="ghost" onClick={() => go('lesson')}>Review</Button>
                        : isEnrolled
                          ? <Button size="sm" onClick={() => go('story')}>Start now</Button>
                          : <Button size="sm" onClick={() => toggleEnroll(o)}>Enroll</Button>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '56px 20px', border: '1px dashed var(--border-strong)', textAlign: 'center' }}>
          <Icon name="search-x" size={30} style={{ color: 'var(--text-muted)' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)' }}>No offerings match those filters.</div>
          <Button variant="ghost" size="sm" onClick={() => { setQ(''); setType('all'); setTracks([]); }}>Reset filters</Button>
        </div>
      )}

      {toast && (
        <div className="mono" role="status" style={{ position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)', zIndex: 500, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-overlay)', border: '1px solid var(--border-accent)', borderLeft: '2px solid var(--cyan-500)', color: 'var(--text-strong)', fontSize: 12, letterSpacing: '.03em', padding: '12px 18px', boxShadow: 'var(--shadow-3)' }}>
          <Icon name="circle-check" size={14} style={{ color: 'var(--accent-fg-cyan)' }} />{toast}
        </div>
      )}
    </div>
  );
};

// ---------------- Mission log ----------------
const LOG_KINDS = {
  mission:  { label: 'MISSION',  icon: 'git-branch', color: 'var(--accent-fg-volt)', tint: 'var(--tint-volt)', border: 'color-mix(in oklab, var(--volt-500) 40%, transparent)' },
  cohort:   { label: 'COHORT',   icon: 'calendar',   color: 'var(--accent-fg-cyan)', tint: 'var(--tint-cyan)', border: 'var(--border-accent)' },
  progress: { label: 'PROGRESS', icon: 'award',      color: 'var(--accent-fg-mag)',  tint: 'var(--tint-mag)',  border: 'color-mix(in oklab, var(--mag-500) 40%, transparent)' },
  system:   { label: 'SYSTEM',   icon: 'flag',       color: 'var(--text-muted)',     tint: 'var(--muted)',     border: 'var(--border-hairline)' },
};

const LOG_DATA = [
  { day: 'TODAY', items: [
    { id: 1, kind: 'mission', title: 'Checkpoint reached \u2014 The Broken Pipeline', body: 'Act II checkpoint saved. Your branch choice [B] is now graded: the proper fix held under replay.', time: '09:41', unread: true, action: ['Resume', 'story'] },
    { id: 2, kind: 'cohort', title: 'Your cohort\u2019s term starts Monday', body: 'Security Operations Track \u00b7 next term. 14 operatives enrolled. First transmission drops 09:00 UTC.', time: '08:15', unread: true, action: ['View catalog', 'catalog'] },
    { id: 3, kind: 'progress', title: 'Streak at risk', body: 'You\u2019re 11 days in. One story beat today keeps it alive \u2014 shortest open beat is 12 minutes.', time: '07:00', unread: true, action: ['Open dashboard', 'dashboard'] },
  ]},
  { day: 'YESTERDAY', items: [
    { id: 4, kind: 'progress', title: '+320 XP \u2014 Dead-letter Queues cleared', body: 'Challenge graded: 3/3 objectives. Idempotent Consumers is now recommended as your next challenge.', time: '18:22', unread: false, action: ['Next challenge', 'lesson'] },
    { id: 5, kind: 'mission', title: 'New decision point unlocked', body: 'Ghost in the Interface \u2014 Act I ends in a branch. Two paths, one render tree.', time: '12:03', unread: false, action: ['Choose', 'story'] },
  ]},
  { day: 'THIS WEEK', items: [
    { id: 6, kind: 'cohort', title: 'Discussion reply \u2014 The Broken Pipeline', body: 'k.osei replied to your retro post: \u201cThe fast patch was defensible \u2014 but your rollback plan sold it.\u201d', time: 'Mon', unread: false, action: ['Open thread', 'story'] },
    { id: 7, kind: 'system', title: 'Clearance review scheduled', body: 'You\u2019re 480 XP from Clearance 04. Zero Day and Shard the Monolith unlock at that level.', time: 'Mon', unread: false, action: ['See progression', 'progression'] },
  ]},
];

UI.MissionLog = function MissionLog({ go }) {
  const [tab, setTab] = React.useState('all');
  const [read, setRead] = React.useState([]);
  const allItems = LOG_DATA.reduce((a, g) => a.concat(g.items), []);
  const isUnread = (n) => n.unread && !read.includes(n.id);

  const tabs = [['all', 'All'], ['unread', 'Unread'], ['mission', 'Missions'], ['cohort', 'Cohort'], ['progress', 'Progress']];
  const countFor = (v) => v === 'all' ? allItems.length : v === 'unread' ? allItems.filter(isUnread).length : allItems.filter(i => i.kind === v).length;

  const groups = LOG_DATA.map(g => ({
    day: g.day,
    items: g.items.filter(n => tab === 'all' || (tab === 'unread' ? isUnread(n) : n.kind === tab)),
  })).filter(g => g.items.length > 0);

  return (
    <div style={{ padding: 'clamp(28px, 3vw, 48px)', display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 860, width: '100%', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="eyebrow dim">// TRANSMISSIONS</div>
          <h1 className="display" style={{ fontSize: 30 }}>Mission log.</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setRead(allItems.map(i => i.id))}>Mark all read</Button>
      </div>

      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border-hairline)' }}>
        {tabs.map(([v, label]) => (
          <button key={v} onClick={() => setTab(v)} className="mono" style={{
            background: 'transparent', border: 'none', borderBottom: '2px solid ' + (tab === v ? 'var(--cyan-500)' : 'transparent'),
            fontSize: 12, letterSpacing: '.06em', padding: '8px 14px', cursor: 'pointer', marginBottom: -1,
            color: tab === v ? 'var(--text-strong)' : 'var(--text-muted)',
          }}>{label} <span style={{ opacity: .6 }}>{countFor(v)}</span></button>
        ))}
      </div>

      {groups.map(g => (
        <div key={g.day} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '.14em', color: 'var(--text-muted)' }}>{g.day}</span>
          {g.items.map(n => {
            const km = LOG_KINDS[n.kind];
            const unread = isUnread(n);
            return (
              <div key={n.id} onClick={() => setRead(r => r.includes(n.id) ? r : r.concat([n.id]))} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer', padding: '14px 16px',
                background: unread ? 'var(--surface-overlay)' : 'var(--surface-card)',
                border: '1px solid var(--border-hairline)',
                borderLeft: '2px solid ' + (unread ? 'var(--cyan-500)' : 'transparent'),
              }}>
                <span style={{ width: 36, height: 36, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: km.tint, border: '1px solid ' + km.border, color: km.color }}>
                  <Icon name={km.icon} size={15} />
                </span>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mono" style={{ fontSize: 9, letterSpacing: '.14em', color: km.color }}>{km.label}</span>
                    {unread && <span style={{ width: 6, height: 6, background: 'var(--cyan-400)', flex: 'none' }} aria-label="unread"></span>}
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--text-strong)', fontWeight: 500 }}>{n.title}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.body}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flex: 'none' }}>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</span>
                  <a className="mono" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer' }}
                    onClick={(e) => { e.stopPropagation(); go(n.action[1]); }}>{n.action[0]} →</a>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {groups.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '56px 20px', border: '1px dashed var(--border-strong)', textAlign: 'center' }}>
          <Icon name="inbox" size={30} style={{ color: 'var(--text-muted)' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text-strong)' }}>Channel clear.</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>No transmissions in this category.</div>
        </div>
      )}
    </div>
  );
};

// ---------------- Certificate ----------------
UI.Certificate = function Certificate({ go }) {
  const D = window.AcademyData;
  const [toast, setToast] = React.useState(null);
  const toastT = React.useRef(null);
  const recordId = 'PA-2026-07-0412';

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 2400);
  };

  const stats = [
    ['1,200', 'XP EARNED'], ['3 / 3', 'CHALLENGES'], ['4 / 4', 'DECISIONS'], ['02', 'CLEARANCE'],
  ];

  return (
    <div style={{ padding: 'clamp(28px, 3vw, 48px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, maxWidth: 1000, width: '100%', margin: '0 auto' }}>
      <div style={{ position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 860, background: 'var(--surface-card)', border: '1px solid var(--border-accent)', boxShadow: 'var(--shadow-3)' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: -1, left: -1, width: 18, height: 18, borderTop: '2px solid var(--cyan-500)', borderLeft: '2px solid var(--cyan-500)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: -1, right: -1, width: 18, height: 18, borderTop: '2px solid var(--mag-500)', borderRight: '2px solid var(--mag-500)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: -1, left: -1, width: 18, height: 18, borderBottom: '2px solid var(--mag-500)', borderLeft: '2px solid var(--mag-500)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: -1, right: -1, width: 18, height: 18, borderBottom: '2px solid var(--cyan-500)', borderRight: '2px solid var(--cyan-500)', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, padding: 'clamp(32px, 5vw, 56px) clamp(24px, 5vw, 60px)', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-strong)', fontSize: 14 }}>PRESSTRONIC <span style={{ color: 'var(--cyan-400)' }}>ACADEMY</span></span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: 'var(--cyan-500)' }}></span>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>// COMPLETION RECORD</span>
              <span style={{ display: 'inline-block', width: 24, height: 2, background: 'var(--mag-500)' }}></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>This certifies that operative</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 38px)', letterSpacing: '-0.025em', color: 'var(--text-strong)', lineHeight: 1.1 }}>{D.user.name}</span>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '.1em', color: 'var(--text-muted)' }}>CALLSIGN {D.user.callsign.toUpperCase()}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>completed the story path</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(20px, 2.6vw, 25px)', letterSpacing: '-0.02em', color: 'var(--accent-fg-cyan)' }}>The Broken Pipeline</span>
            <span style={{ fontSize: 14, color: 'var(--text-body)', maxWidth: 520 }}>Diagnosed a silent queue failure, implemented dead-letter handling under deadline pressure, and defended the fix in retro. All three challenges graded. All four decision points survived.</span>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(16px, 3vw, 36px)', flexWrap: 'wrap', justifyContent: 'center', borderTop: '1px solid var(--border-hairline)', borderBottom: '1px solid var(--border-hairline)', padding: '16px 8px', width: '100%' }}>
            {stats.map(([v, l]) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 18, color: 'var(--text-strong)' }}>{v}</span>
                <span className="mono" style={{ fontSize: 9, letterSpacing: '.14em', color: 'var(--text-muted)' }}>{l}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--text-muted)' }}>ISSUED 2026-07-12</span>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--text-muted)' }}>RECORD {recordId}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'right', alignItems: 'flex-end' }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--accent-fg-green)' }}>● VERIFIABLE</span>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--text-muted)' }}>verify.presstronic.com/{recordId}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button notch glow onClick={() => {
          const url = 'https://verify.presstronic.com/' + recordId;
          try { navigator.clipboard.writeText(url); } catch (e) {}
          showToast('Share link copied \u2014 ' + url);
        }}>Copy share link</Button>
        <Button variant="ghost" onClick={() => showToast('Preparing PDF \u2014 completion record ' + recordId)}>Download PDF</Button>
        <Button variant="ghost" onClick={() => showToast('Opening LinkedIn certification form\u2026')}>Add to LinkedIn</Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', padding: '14px 20px', maxWidth: 860, width: '100%' }}>
        <Icon name="git-branch" size={17} style={{ color: 'var(--accent-fg-volt)' }} />
        <span style={{ fontSize: 14, color: 'var(--text-body)', flex: 1, minWidth: 200 }}>Your clearance review is 480 XP away. <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>Silent Migration</span> picks up where this story left off.</span>
        <a className="mono" style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => go('catalog')}>Next mission →</a>
      </div>

      {toast && (
        <div className="mono" role="status" style={{ position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)', zIndex: 500, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-overlay)', border: '1px solid var(--border-accent)', borderLeft: '2px solid var(--cyan-500)', color: 'var(--text-strong)', fontSize: 12, letterSpacing: '.03em', padding: '12px 18px', boxShadow: 'var(--shadow-3)' }}>
          <Icon name="circle-check" size={14} style={{ color: 'var(--accent-fg-cyan)' }} />{toast}
        </div>
      )}
    </div>
  );
};
})();
