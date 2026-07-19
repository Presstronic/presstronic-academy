(() => {
const { Button, Badge, Card, Tabs, Input } = window.__DS;
const UI = (window.AcademyUI = window.AcademyUI || {});
const Icon = (p) => UI.Icon(p);

UI.Lesson = function Lesson({ go }) {
  const L = window.AcademyData.lesson;
  const [ran, setRan] = React.useState(false);
  return (
    <div className="lesson-grid" style={{ padding: 'clamp(28px, 3vw, 48px)', maxWidth: 1760, width: '100%', margin: '0 auto' }}>
      {/* Briefing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="eyebrow dim">// SKILL CHALLENGE</div>
          <h1 className="display" style={{ fontSize: 28 }}>{L.title}</h1>
          <div><Badge tone="volt">Branch B — do it right</Badge></div>
        </div>
        <Card padding={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="eyebrow dim">// BRIEFING</div>
            <p style={{ margin: 0, fontSize: 14 }}>
              A poison message is a message that fails processing every time. If your worker
              retries it forever, it blocks everything behind it.
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>
              The fix: count attempts, and after a limit, park the message in a
              <span className="mono" style={{ color: 'var(--accent-fg-cyan)' }}> dead-letter queue</span> for
              a human to inspect.
            </p>
          </div>
        </Card>
        <Card padding={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="eyebrow dim">// ACCEPTANCE</div>
            {L.tests.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {ran
                  ? <Badge tone={t.pass ? 'green' : 'red'} variant="solid">{t.pass ? 'PASS' : 'FAIL'}</Badge>
                  : <Badge>WAIT</Badge>}
                <span style={{ fontSize: 13 }}>{t.name}</span>
              </div>
            ))}
          </div>
        </Card>
        <Button variant="ghost" size="sm" onClick={() => go('story')}><Icon name="play" size={12} /> Rewatch briefing — 01:32</Button>
        <Button variant="ghost" onClick={() => go('story')}>← Back to the story</Button>
      </div>

      {/* Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, background: 'var(--surface-raised)', border: '1px solid var(--border-hairline)', borderBottom: 'none', padding: '10px 16px' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>src/worker.ts</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setRan(false)}>Reset</Button>
            <Button size="sm" onClick={() => setRan(true)}>Run tests</Button>
          </div>
        </div>
        <div className="code-pane dark scanlines" style={{ padding: '14px 0', minHeight: 320 }}>
          {L.code.map((line, i) => (
            <div className="ln" key={i}>
              <span className="no">{i + 1}</span>
              <span>{line.map(([cls, txt], j) => <span key={j} className={cls || undefined}>{txt}</span>)}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--surface-raised)', border: '1px solid var(--border-hairline)', borderTop: 'none', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {ran ? (
            <span className="mono" style={{ fontSize: 11, color: 'var(--red-400)' }}>2 / 3 PASSING — messages still block. Check your requeue path.</span>
          ) : (
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>RUN TESTS TO EVALUATE</span>
          )}
          <span className="mono" style={{ fontSize: 11, color: 'var(--accent-fg-volt)' }}>REWARD +120 XP</span>
        </div>
      </div>

      {/* AI mentor — context-aware */}
      <div className="hud ai-panel" style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-hairline)', background: 'var(--surface-card)', minHeight: 520, alignSelf: 'stretch' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="eyebrow">// PROXY — AI MENTOR</span>
          <span className="mono blink" style={{ fontSize: 9, letterSpacing: '.2em', color: 'var(--accent-fg-mag)' }}>● LIVE</span>
        </div>
        <div style={{ padding: '10px 16px', display: 'flex', flexWrap: 'wrap', gap: 6, borderBottom: '1px solid var(--border-hairline)' }}>
          {['LESSON: DEAD-LETTER QUEUES', 'FILE: worker.ts', 'TESTS: ' + (ran ? '2 / 3 PASSING' : 'NOT RUN')].map((c) => (
            <span key={c} className="mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--text-muted)', border: '1px solid var(--border-hairline)', padding: '3px 6px' }}>{c}</span>
          ))}
        </div>
        <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div style={{ alignSelf: 'flex-end', maxWidth: '90%', background: 'var(--surface-overlay)', border: '1px solid var(--border-hairline)', padding: '10px 12px', fontSize: 13 }}>
            Why does the third test still fail?
          </div>
          <div style={{ alignSelf: 'flex-start', maxWidth: '95%', background: 'var(--tint-cyan)', border: '1px solid var(--border-accent)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, lineHeight: 1.6 }}>Your <span className="mono" style={{ color: 'var(--accent-fg-cyan)' }}>catch</span> block still requeues every failure. Track <span className="mono" style={{ color: 'var(--accent-fg-cyan)' }}>msg.attempts</span> — after the third attempt, publish to the dead-letter queue instead of calling <span className="mono" style={{ color: 'var(--accent-fg-cyan)' }}>requeue()</span>.</span>
            <span className="mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--text-muted)' }}>REFERENCING worker.ts L5–L8 · RUN #2</span>
          </div>
        </div>
        <div style={{ padding: 12, borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <Input placeholder="Ask about this lesson or your code…" style={{ flex: 1 }} />
            <Button size="sm">Send</Button>
          </div>
          <span className="mono" style={{ fontSize: 9, letterSpacing: '.08em', color: 'var(--text-muted)' }}>PROXY SEES: THE LESSON · YOUR EDITOR · TEST RESULTS</span>
        </div>
      </div>
    </div>
  );
};
})();
