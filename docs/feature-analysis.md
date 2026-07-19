# Feature Analysis: Presstronic Academy vs. Competitors

> Living document. Captures competitive analysis, feature decisions, and MVP scoping from design discussions.

## Competitive Landscape

| Dimension | boot.dev | CodeSignal | Presstronic Academy |
|---|---|---|---|
| **Learning model** | Linear, topic-by-topic | Assessment-focused | Branching narrative paths (CYOA) |
| **Code execution** | ✅ Real-time | ✅ Real-time | ✅ Planned (containers + WS) |
| **Content authoring** | Internal only | Internal only | ✅ Full CMS with publishing workflow |
| **Multi-tenancy** | ❌ | ❌ | ✅ Planned |
| **Public profiles** | Limited | ✅ (VC profile) | ✅ Planned (mastery-focused) |
| **Story/narrative** | ❌ | ❌ | ✅ Core differentiator |
| **Test-out flow** | ❌ | Partial | ✅ Planned (delayed feedback) |
| **Project export** | ❌ | ❌ | ✅ Planned (ZIP artifacts) |
| **Monetization** | Subscription | Freemium | ✅ Planned (Stripe + invite) |

---

## 1. Lesson-Focused Comments

**Decision:** Inline annotations anchored to lesson content — not a forum. Discord handles broader community discussion.

### Model

```
Comment
  └── lessonId (or lessonId + blockId/paragraphId)
  └── parentId          (for threaded replies)
  └── authorId
  └── body
  └── type: question | hint-request | clarification | general
  └── resolved          (boolean, set by instructor)
  └── upvotes           (helpful signal)
  └── visibility: public | private
```

### Design Principles

- **Anchor to blocks, not just lessons.** Each Markdown paragraph, code block, or exercise gets an identifiable ID. A comment says *"I'm confused about this specific code block"* not *"this lesson is confusing."*
- **Two visibility modes.** Default public so students benefit from each other's questions. Private option for sensitive or personal questions.
- **Instructor resolution.** Marked threads collapse but remain searchable. Keeps lessons clean while preserving knowledge.
- **"Stuck" flag.** Student marks a comment as *"I'm stuck on this exercise"* — surfaces to instructors with priority. Distinct from a general question.
- **No top-level forum.** Broader discussion belongs in Discord. Comments are strictly lesson-anchored.

### CYOA Integration

Comments are scoped to the specific path node, not the whole module. If a student takes the challenge path vs. the structured path through a module, their comments are anchored to the content they're actually seeing. Prevents spoilers and keeps context tight.

### MVP Scope

Lesson-level comments only (no block anchoring). Add block-level anchoring once the CMS renders lessons with identifiable blocks.

---

## 2. Instructor Dashboard

Even without live sessions, instructors need visibility into content health and student signals.

### Content Management (already planned via CMS issues)

- Draft / review / publish workflow for lessons, exercises, modules
- Preview rendering before publishing
- Content version history

### Student Signals (new)

- **Stuck heatmap** — which lessons/exercises have the most unresolved "stuck" flags or questions. Signals where content breaks down.
- **Path distribution** — in CYOA modules, what percentage of students chose each path? If 90% always pick path A, path B may be too hard or unappealing.
- **Failure rate by exercise** — highest fail rate on first attempt vs. on retry.
- **Time-to-complete** — duration per lesson/exercise. Outliers signal confusion or disengagement.

### Moderation

- Comment queue — unresolved questions, flagged content
- Student reports — bugs in lessons, inappropriate content

### Analytics

- Enrollment funnel — started vs. completed, drop-off points
- Mastery distribution — bell curve of mastery scores per course
- Cohort comparison — cross-tenant performance (multi-tenancy)

### MVP Scope

Content management + stuck heatmap + failure rates. Everything else is phase 2.

---

## 3. Gamification Inside the CYOA Structure

**Principle:** Don't bolt on generic gamification. Make it part of the narrative and terminal aesthetic.

### Achievements → "Clearances"

Frame achievements as security clearances or system declassifications:

- **Clearance levels:** `LEVEL 0` → `LEVEL 5` → `OPERATOR` → `ARCHITECT`
- Earned by mastering courses, not just completing them
- Displayed on public profiles as a clearance tier
- Each clearance unlocks subtle visual flair (glow effects, terminal animations) — thematic, not cartoonish

### Streaks → "Uptime"

- Consecutive days framed as *"system uptime"* — e.g., "47 days uptime"
- Visual: a green pulse that stays active. Break the streak = "system offline"
- No shame spiral — coming back after a break resets the counter, no penalty messaging

### Leaderboards → "Network Rankings"

- **Opt-in only.** Not everyone wants to be ranked.
- **Ranked by mastery depth, not speed.** Reward thoroughness, not rushing. Aligns with "first principles" philosophy.
- **Scoped to courses, not global.** "Top 10 in Algorithms" not "top 10 overall." Less intimidating, more meaningful.
- **Thematic framing:** "Highest clearance operators" or "Most connected nodes in the network"

### Narrative Integration

- **Story unlocks.** Certain achievements unlock narrative content — lore, backstory, character moments. Ties gamification directly to the CYOA structure.
- **Path-specific achievements.** "Took the challenge path through Auth & AuthZ and passed on first attempt" is different from "Completed Auth & AuthZ via structured path."
- **Branch divergence stats.** On public profiles: "Took 12 unique paths across 8 modules" — celebrates exploration, not just completion.

### What to Avoid

- No XP bars or level numbers that feel like a mobile game
- No sound effects or confetti — keep the terminal aesthetic serious
- No forced social competition — everything is opt-in

---

## 4. Mobile / PWA

The code runner is the hard part on mobile. Everything else is straightforward.

### PWA Requirements

- Service worker for offline lesson reading (Markdown content caches well)
- Install prompt — "Add to home screen" flow
- Splash screen + icons matching the terminal aesthetic
- Audit all MUI components for mobile breakpoints

### Code Editor on Mobile

Three options:

1. **Monaco Editor** — has mobile support but is clunky. Touch typing code is inherently painful.
2. **Custom mobile editor** — touch-optimized with larger targets, virtual keyboard optimization, swipe navigation.
3. **Hybrid (recommended for MVP)** — simplified textarea with syntax highlighting overlay on mobile. Full Monaco on desktop.

**Recommendation:** Option 3 for MVP. Functional mobile editor that handles exercises without trying to be VS Code. Students can do exercises on mobile; power users will want desktop for serious coding. That's fine — be honest about it.

### Exercise UI on Mobile

- **Structured mode** (locked signature) is easier on mobile — less to type
- **Challenge mode** needs larger viewport — split view stacks vertically on mobile (instructions above, editor below)
- **Real-time output streaming** via WebSocket — must work on mobile, test early

### Navigation

- Bottom nav bar on mobile (standard pattern)
- Hamburger menu for secondary navigation
- Touch-friendly path selection UI at module boundaries (large tap targets for CYOA choices)

---

## 5. Third-Party API Integrations

Even without a public API, these integrations are worth considering.

### LMS Standards (Enterprise / Multi-Tenant)

- **LTI 1.3** — Learning Tools Interoperability. If a university or company wants to embed Presstronic Academy inside their existing LMS (Canvas, Moodle, Blackboard), LTI is the standard protocol. High value for the multi-tenancy B2B angle.
- **xAPI (Tin Can)** — Learning Records Database. Sends structured learning events ("completed lesson X", "passed exercise Y") to an external system. Enterprises want this for compliance and reporting.
- **SCORM** — older standard, some legacy LMSes still require it. Lower priority.

### Identity Providers

- **GitHub OAuth** — already planned (#206)
- **Google OAuth** — likely expected by students
- **SAML / OIDC** — for enterprise tenants requiring SSO through Okta, Azure AD, etc. Multi-tenancy killer feature.

### Payment

- **Stripe** — already planned (#164)
- **Paddle** — alternative that handles VAT/sales tax globally. Solves a headache Stripe doesn't.

### Developer Ecosystem

- **Webhooks** — let tenants receive events (student completed course, new enrollment) at their own endpoints. Simple, powerful, no public API needed.
- **GitHub integration** — push completed exercise solutions to a student's GitHub repo. Builds their portfolio automatically.
- **VS Code extension** — companion extension showing progress inside VS Code. Not an API integration, but a force multiplier.

### MVP Scope

GitHub OAuth + Stripe. Everything else is phase 2+. LTI and SAML are high-value for B2B but complex.

---

## 6. MVP Prioritization

### Phase 1: Foundation (in progress)

- Spring Boot backend scaffold (#203)
- Auth: registration, login, sessions (#205)
- GitHub OAuth (#206)
- Frontend rewire to Spring Boot (#207)
- Profile management (#208)
- CI/CD (#204)

### Phase 2: Content Engine

- CMS: Track/Course CRUD (#168)
- CMS: Module/Section/Lesson CRUD (#169)
- CMS: Exercise config (#170)
- CMS: Preview rendering (#173)
- CMS: Publishing workflow (#174)
- Lesson media support (#201)
- **One full course authored and shippable**

### Phase 3: Code Runner + Assessment

- Runner: Job queue (#176)
- Runner: Container execution (#177)
- Runner: WebSocket streaming (#178)
- Runner: Persist results (#179)
- Exercise editor modes (#180)
- Visible vs hidden tests (#181)
- Assessment APIs (#157)

### Phase 4: Progression + CYOA

- Mastery tracking (#182)
- Progress dashboard (#183)
- Public profiles (#184)
- Project artifact export (#185)
- Choose-your-path selection (#198)
- Test-out flow (#199)
- Story engine APIs (#158)

### Phase 5: Polish + Monetization

- Stripe subscriptions (#164)
- Invite gating (#165)
- Lesson comments (new)
- Instructor dashboard (new)
- PWA + mobile optimization (new)
- Gamification / clearances (new)

### What to Cut from MVP

To ship something learnable in ~3–4 months:

- **Cut:** Story engine (#158), choose-your-path (#198), test-out flow (#199) — require full CMS and runner first
- **Cut:** Multi-tenancy enforcement — ship single-tenant, add later
- **Cut:** Public profiles — internal progress tracking is enough
- **Cut:** Gamification — add after content proves engaging
- **Keep:** Linear courses with exercises, code runner, mastery tracking, auth, CMS

> The CYOA is the differentiator, but it requires the most infrastructure to work well. Ship linear first, prove the learning model, then add branching.

---

## 7. AI Lesson Assistant

RAG (Retrieval-Augmented Generation) scoped to lesson content.

### Data Pipeline

```
Lesson Markdown → Chunk by paragraph/block → Embed (sentence-transformers) → Store in pgvector (PostgreSQL)
```

PostgreSQL is already in the stack — **pgvector** is the natural choice. No separate vector database needed.

### Guardrails (Critical)

The AI must help without solving:

1. **Never output the answer.** If a student asks *"what should I put in this function?"*, the AI explains the concept, gives a different example, or asks a guiding question.
2. **Scope to current lesson only.** The AI only knows the content of the lesson the student is on. No cross-lesson hints that could spoil future content.
3. **Socratic mode.** Default to asking questions back: *"What do you think `forEach` does here?"* not *"You need to use `forEach`."*
4. **Hint levels.** First request → conceptual hint. Second request → more specific hint. Third request → similar (not identical) example. Never the solution.
5. **Code explanation, not code generation.** If a student pastes their code and asks *"why is this wrong?"*, the AI explains the error pattern, not the fix.

### Architecture

```
Student message + lesson context →
  LLM with system prompt (guardrails) +
  retrieved lesson chunks (RAG) →
  response streamed to student
```

### Model Choice

Start with an API model (Claude, GPT-4) for MVP. Fine-tuning your own model is a separate project that only makes sense at scale. The differentiation is in the prompt engineering and RAG retrieval, not the base model.

### Cost Management

Cache common questions per lesson. If 50 students ask *"what is a closure?"* on the same lesson, serve the cached response after the first generation.

### MVP Scope

Chat widget on lesson pages, scoped to current lesson content, using an API model with strong system prompt guardrails. No fine-tuning needed initially.

---

## Open Questions

- Block-level comment anchoring: what granularity? (paragraph, code block, sentence?)
- AI assistant: which API model to start with? (cost vs. quality trade-off)
- Mobile editor: syntax highlighting library for the simplified textarea?
- Instructor dashboard: real-time vs. batched analytics?
- Clearance levels: how many tiers, and what mastery thresholds unlock each?
- PWA: offline scope — lessons only, or exercises too?
