(() => {
const { Button, Badge, Card, Progress } = window.__DS;
const UI = (window.AcademyUI = window.AcademyUI || {});
const Icon = (p) => UI.Icon(p);

function VideoBeat({ b }) {
  return (
    <div className="dark hud fade-in" style={{ border: '1px solid var(--border-strong)', background: 'var(--gray-950)', color: 'var(--gray-300)' }}>
      <div className="scanlines" style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 60% 70% at 50% 42%, color-mix(in oklab, var(--cyan-500) 12%, transparent), transparent 72%)' }}>
        <div className="grid-bg"></div>
        <div style={{ position: 'absolute', top: 14, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--accent-fg-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>// LESSON FEED — {b.title}</span>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '.2em', color: 'var(--accent-fg-mag)' }}>REC ●</span>
        </div>
        <button style={{ position: 'relative', width: 64, height: 64, background: 'var(--tint-cyan)', border: '1px solid var(--border-accent)', color: 'var(--accent-fg-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--glow-cyan)' }}>
          <Icon name="play" size={22} />
        </button>
        <span className="mono" style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 10, color: 'var(--text-muted)' }}>{b.at} / {b.duration}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', borderTop: '1px solid var(--border-hairline)' }}>
        <Icon name="play" size={14} style={{ color: 'var(--accent-fg-cyan)' }} />
        <div style={{ flex: 1, position: 'relative', height: 4, background: 'var(--gray-800)' }}>
          <div style={{ position: 'absolute', inset: 0, width: b.progress + '%', background: 'var(--cyan-500)' }}></div>
          <div style={{ position: 'absolute', top: -2, left: '42%', width: 3, height: 8, background: 'var(--volt-500)' }}></div>
          <div style={{ position: 'absolute', top: -2, left: '81%', width: 3, height: 8, background: 'var(--volt-500)' }}></div>
        </div>
        <Icon name="captions" size={14} style={{ color: 'var(--text-muted)' }} />
        <Icon name="volume-2" size={14} style={{ color: 'var(--text-muted)' }} />
        <Icon name="maximize" size={14} style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  );
}

UI.Story = function Story({ go }) {
  const S = window.AcademyData.story;
  const [beats, setBeats] = React.useState(S.beats);
  const [taken, setTaken] = React.useState(null);

  const choose = (c) => {
    setTaken(c.key);
    setBeats((b) => [
      ...b,
      { kind: 'decision', text: c.label, key: c.key },
      c.consequence,
      { kind: 'narration', text: 'CHECKPOINT SAVED. The next chapter is compiling…' },
    ]);
  };

  return (
    <div className="story-grid" style={{ padding: 'clamp(28px, 3vw, 48px)', maxWidth: 1520, width: '100%', margin: '0 auto' }}>
      {/* Narrative pane */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="eyebrow dim">// {S.act} · {S.chapter}</div>
            <h1 className="display" style={{ fontSize: 30 }}>{S.path}</h1>
          </div>
          <Badge tone="volt">Decision point</Badge>
        </div>

        <div className="scanlines" style={{ background: 'var(--surface-inset)', border: '1px solid var(--border-hairline)', padding: '30px 34px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {beats.map((b, i) => (
            b.kind === 'video' ? (
              <VideoBeat key={i} b={b} />
            ) : b.kind === 'objective' ? (
              <div key={i} className="fade-in" style={{ display: 'flex', gap: 10, alignItems: 'center', background: 'var(--tint-cyan)', border: '1px solid var(--border-accent)', padding: '10px 14px' }}>
                <Icon name="crosshair" size={14} style={{ color: 'var(--text-accent)' }} />
                <span className="mono" style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent-fg-cyan)' }}>OBJECTIVE — {b.text}</span>
              </div>
            ) : b.kind === 'decision' ? (
              <div key={i} className="beat decision fade-in">
                <div className="mono" style={{ fontSize: 11, letterSpacing: '.08em', color: 'var(--accent-fg-volt)', marginBottom: 4 }}>YOU CHOSE [{b.key}]</div>
                <div style={{ fontSize: 14, color: 'var(--text-strong)' }}>{b.text}</div>
              </div>
            ) : (
              <div key={i} className="beat fade-in" style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 720 }}>{b.text}</div>
            )
          ))}
        </div>

        {!taken ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="hazard"></div>
            <div className="eyebrow volt">// CHOOSE YOUR BRANCH</div>
            {S.choices.map((c) => (
              <button key={c.key} className="choice" onClick={() => choose(c)}>
                <span className="key">{c.key}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ color: 'var(--text-strong)', fontSize: 14 }}>{c.label}</span>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{c.hint}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            {taken === 'B' && <Button notch glow onClick={() => go('lesson')}>Open the coding challenge</Button>}
            {taken !== 'B' && <Button notch onClick={() => go('dashboard')}>Continue to next chapter</Button>}
            <Button variant="ghost" onClick={() => { setBeats(S.beats); setTaken(null); }}>Rewind to checkpoint</Button>
          </div>
        )}
      </div>

      {/* Right rail */}
      <div className="story-rail" style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 84 }}>
        <Card padding={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="eyebrow dim">// BRANCH MAP</div>
            {window.AcademyData.story.mapActs.map((act) => (
              <div key={act.name} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--text-muted)' }}>{act.name}</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {act.nodes.map((n, i) => (
                    <React.Fragment key={i}>
                      <div className={'node ' + (n === 'open' ? '' : n)}></div>
                      {i < act.nodes.length - 1 && <div style={{ width: 22, height: 1, background: n === 'done' ? 'var(--cyan-500)' : 'var(--border-strong)' }}></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.06em', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent-fg-volt)' }}>■</span> YOU ARE HERE · <span style={{ color: 'var(--text-accent)' }}>■</span> CLEARED
            </div>
          </div>
        </Card>

        <Card padding={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="eyebrow dim">// OBJECTIVES</div>
            {window.AcademyData.story.objectives.map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className={'node ' + (o.done ? 'done' : '')} style={{ width: 10, height: 10 }}></div>
                <span style={{ fontSize: 13, color: o.done ? 'var(--text-muted)' : 'var(--text-body)', textDecoration: o.done ? 'line-through' : 'none' }}>{o.text}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="eyebrow dim">// PATH TELEMETRY</div>
            <Progress label="Path progress" value={58} max={100} showValue height={6} />
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>NEXT CHECKPOINT</span><span style={{ color: 'var(--text-accent)' }}>+180 XP</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
})();
