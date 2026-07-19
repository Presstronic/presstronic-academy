// Presstronic Academy UI kit — shared demo data (globals)
window.AcademyData = {
  user: { name: 'R. Vasquez', callsign: 'rvasquez', clearance: 3, xp: 2140, xpNext: 3000, streak: 11 },

  paths: [
    { id: 'p1', title: 'The Broken Pipeline', track: 'Backend engineering', act: 'Act 2', progress: 58, status: 'active', icon: 'git-branch' },
    { id: 'p2', title: 'Ghost in the Interface', track: 'Frontend engineering', act: 'Act 1', progress: 22, status: 'active', icon: 'layout-dashboard' },
    { id: 'p3', title: 'Zero Day', track: 'Security', act: 'Locked', progress: 0, status: 'locked', icon: 'shield' },
  ],

  log: [
    { t: '09:42', msg: 'Checkpoint reached — CH.3 “The Handoff”', tone: 'cyan' },
    { t: '09:17', msg: 'Challenge passed: refactor the queue worker (+120 XP)', tone: 'green' },
    { t: 'YDA', msg: 'Branch taken: “Trust the fixer”', tone: 'volt' },
    { t: 'YDA', msg: 'Lesson complete: idempotent consumers', tone: 'neutral' },
  ],

  story: {
    path: 'The Broken Pipeline',
    act: 'ACT 2',
    chapter: 'CH. 3 — THE HANDOFF',
    beats: [
      { kind: 'narration', text: 'The deploy logs scroll past like rain. Somewhere in this pipeline, a job is silently eating messages — and the client demo is in six hours.' },
      { kind: 'video', title: 'Poison messages in 90 seconds', duration: '01:32', at: '00:31', progress: 34 },
      { kind: 'narration', text: 'Mara slides her chair over. “The queue worker retries forever on a poison message. You can patch it fast, or do it right. Your call, operative.”' },
      { kind: 'objective', text: 'Stop the poison message from blocking the queue.' },
    ],
    choices: [
      { key: 'A', label: 'Patch it fast — drop the message and move on.', hint: 'Quick. Risky. Mara will remember this.', consequence: { kind: 'narration', text: 'You drop the message. The queue drains, the demo is saved — but a customer record is now quietly missing. Somewhere, a future incident ticket is being written.' } },
      { key: 'B', label: 'Do it right — add a dead-letter queue with retry limits.', hint: 'Slower. Opens a coding challenge.', consequence: { kind: 'narration', text: 'You wire up a dead-letter queue. It takes an hour you barely have, but poison messages now park themselves for inspection. Mara nods: “Clean.”' } },
      { key: 'C', label: 'Ask Mara to pair on it.', hint: 'Costs time. Builds trust.', consequence: { kind: 'narration', text: 'Mara pulls up a chair. Twenty minutes of questions later, you understand the retry semantics better than the docs do. Trust +1.' } },
    ],
    objectives: [
      { text: 'Reproduce the stuck queue locally', done: true },
      { text: 'Identify the poison message', done: true },
      { text: 'Stop it from blocking the queue', done: false },
      { text: 'Ship before the demo', done: false },
    ],
    mapActs: [
      { name: 'ACT 1', nodes: ['done','done','done','done'] },
      { name: 'ACT 2', nodes: ['done','done','now','open'] },
      { name: 'ACT 3', nodes: ['locked','locked','locked'] },
    ],
  },

  lesson: {
    title: 'Dead-letter queues',
    challenge: 'Refactor the worker so poison messages park after 3 retries.',
    code: [
      [['tok-c','// worker.ts — retries forever on failure']],
      [['tok-k','async function'],[null,' '],['tok-f','handle'],[null,'(msg: Message) {']],
      [[null,'  '],['tok-k','try'],[null,' {']],
      [[null,'    '],['tok-k','await'],[null,' process(msg);']],
      [[null,'  } '],['tok-k','catch'],[null,' (err) {']],
      [[null,'    '],['tok-c','// TODO: this requeues forever']],
      [[null,'    '],['tok-k','await'],[null,' queue.requeue(msg);']],
      [[null,'  }']],
      [[null,'}']],
    ],
    tests: [
      { name: 'parks message after 3 retries', pass: true },
      { name: 'preserves message payload in DLQ', pass: true },
      { name: 'does not block subsequent messages', pass: false },
    ],
  },

  achievements: [
    { icon: 'git-branch', name: 'First fork', desc: 'Take your first branching decision', earned: true },
    { icon: 'terminal', name: 'Clean hands', desc: 'Pass a challenge on the first run', earned: true },
    { icon: 'flame', name: 'On a wire', desc: '10-day streak', earned: true },
    { icon: 'shield', name: 'Clearance 03', desc: 'Reach clearance level 3', earned: true },
    { icon: 'map', name: 'Cartographer', desc: 'Reveal every branch of one path', earned: false },
    { icon: 'trophy', name: 'The long way', desc: 'Finish a path taking only “do it right” choices', earned: false },
  ],

  clearances: [
    { lvl: '01', name: 'Recruit', xp: '0', hash: 'a1f92c0', done: true,
      desc: 'Day-one clearance. Granted on enrollment — read access to the training branches and the first story path, no commits required yet.' },
    { lvl: '02', name: 'Operator', xp: '600', hash: '9d3e7b4', done: true,
      desc: 'Earned by shipping three skill challenges clean and surviving a full story arc without reverting a decision.' },
    { lvl: '03', name: 'Specialist', xp: '1,800', hash: 'c48a11f', done: true, now: true,
      desc: 'Earned by clearing the Broken Pipeline arc and holding a first-try pass rate above 80% across ten challenges.' },
    { lvl: '04', name: 'Fixer', xp: '3,000', hash: '1e0f6b3', done: false,
      desc: 'Unlocks at 3,000 XP — requires closing two multi-file refactors and surviving a production-incident simulation live.' },
    { lvl: '05', name: 'Legend', xp: '5,200', hash: '7dd2c88', done: false,
      desc: 'Top clearance. Reserved for operatives who finish every path\u2019s hard-mode branch and mentor a cohort through one.' },
  ],
};
