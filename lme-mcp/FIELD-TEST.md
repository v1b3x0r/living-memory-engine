# Field test — does the agent reach for memory on its own?

`npm run smoke` proves the pipe works. It cannot prove the thing that decides whether this is a
product: **an agent knowing, unprompted, when to store and when to recall.**

> MCP works ≠ agent knows when to use memory.

This protocol measures the second one. No new code — the instruments already exist.

---

## What "reaching for memory" is made of — four obstacles, not one

*(Added 2026-08-08 after a cross-session exchange with the `homelog-day-53` session. Before this,
the protocol treated "the agent didn't use memory" as one thing. It is four, they fail
independently, and they are fixed in different places.)*

| | Obstacle | Question | Status |
|---|---|---|---|
| **(a)** | **delivery** | Does the text reach the agent at cold start? | ✅ cleared, n=2 — `instructions` confirmed present in the system prompt of two independent Claude Code sessions |
| **(b)** | **matchability** | Can the agent connect an incoming question to the tool? | 🟡 literal phrase matches only (W2). Non-literal never tested |
| **(c)** | **motivation** | Does it search when it does *not* already know? | 🔴 **no data — nobody has touched this** |
| **(d)** | **integration** | Does it *use* a fact it already holds, at the moment that matters? | 🆕 n=1 (appendix D53, Fastwork) |

**DoD-2 is a claim about (c).** W2 moved (a) and (b); it does not license the rung. A twelve-hour
wild observation with zero unprompted `memory_search` calls does not license it either — if no turn
in that window *warranted* a call, zero calls is correct behaviour, not failure. The denominator was
zero.

**(c) cannot be measured by the subject.** An agent reporting *"I never had a moment where I didn't
know"* is using the exact faculty under test; that report is what the failure mode predicts. This is
why the five pre-registered trials cannot be replaced by an agent auditing its own transcript
afterwards — that was attempted on 2026-08-08 and produced two retracted claims in one hour.

**The observer's criterion must be mechanical**, or an external observer just inherits the blind
spot in weaker form. Three checks, all readable from the transcript, no guessing at internal states:

1. Is the answer in the store?
2. Was the answer *already in the agent's context* before it answered?
3. Was the agent's answer wrong or evasive?

`(1) yes + (2) no + (3) yes` → a **(c)** event.  ·  `(1) yes + (2) yes + (3) yes` → a **(d)** event.

**(d) is not out of scope — it is this engine's founding bet.** `living-memory-engine` retrieves a
small working set and injects it rather than passing whole history *because* in-context ≠ used. The
Fastwork case is that thesis appearing one level up, on the agent itself. It also relocates the
competitor: not *forgetting*, but the 1M context window. A bigger window does not fix (d).

---

## Why the obvious version of this test fails

Three paths let the agent answer a recall question **correctly without ever calling
`memory_search`**. Each one turns a green result into a false green.

| # | Leak | Why it fires | Control |
|---|---|---|---|
| L1 | `~/.claude/CLAUDE.md` tells the agent to call `memory_search` at session start and `memory_add` on durable facts | It is a standing direct instruction injected into every session | Run **Arm B** with that block removed. See *Arms*. |
| L2 | `.remember/now.md` + `recent.md` are injected at SessionStart and contain summaries of prior sessions | The Remember plugin summarizes each work block and replays it | Grep the fact's keywords in `.remember/*.md` **before** probing. Hit ⇒ trial is VOID. |
| L3 | The fact is discoverable in the repo | e.g. *"v0 uses FileStorage, no tenant"* is written in `README.md` — the agent can read it | Facts must be **arbitrary and underivable**. See *Choosing facts*. |
| L4 | The workspace **eagerly loads context** — `MEMORY.md`, a `CLAUDE.md` index, or a session-open ritual like the `anchor` skill that pulls Notion pages and docs into the window | The agent arrives already holding an answer, so no turn ever warrants a search. Failure looks identical to a motivation failure but is not one | Probe in a workspace with **no** eager memory block and **no** session-open ritual. If either exists, record what it loaded and when — a trial where the answer entered context earlier is VOID. |

L3 is the easiest to get wrong: the fact that reads most naturally is usually the one already
written down somewhere.

**L4 was added 2026-08-08 and it voided a claim retroactively.** A wild trial on 2026-08-08 13:50
looked like a clean (c) failure — the user's question matched a trigger phrase in the server's
`instructions` almost word for word, and the agent never called `memory_search`. Re-reading the
transcript showed the `anchor` skill had pulled that Notion page's *Dangling Threads* into context at
11:24, two and a half hours earlier. The answer had been sitting in the window the whole time. Leak,
not failure. **A workspace with eager memory measures a different bar; run the five trials somewhere
clean or the FAILs will be uninterpretable.**

---

## Arms

Run **Arm B first**. It is the stronger claim and the one that decides whether hosting is worth
building — if B passes, A passes trivially.

| Arm | `~/.claude/CLAUDE.md` memory block | Question it answers |
|---|---|---|
| **B** | **removed** (comment it out) | Does the *tool description alone* pull the agent in? → does this work for a stranger who just installs the MCP? |
| **A** | present | Does it work for the founder today? Only worth running if B fails. |

If B fails and A passes, the next task is **not** hosted, not `memory_state`/`memory_forget` — it is
rewriting the tool descriptions until B passes. That is the whole point of separating the arms.

### The passive arm — free, unlimited, and running already

*(Added 2026-08-08.)* Arms A and B are **active**: each trial spends a pre-registered fact, and a
passing trial burns that fact permanently. Five is therefore the whole budget. There is a second
source of (c) and (d) events that costs nothing:

> **The founder catches the agent answering wrongly about something memory already holds.**

No staging, no pre-registration, no burnt fact — the fact was already in play. Score it with the same
three mechanical checks; `(2) no` → (c), `(2) yes` → (d).

| | active arm (A/B) | passive arm |
|---|---|---|
| cost per event | **burns a fact permanently** | nothing |
| how many | 5, then the budget is gone | unlimited |
| realism | staged | real work |
| what `n` means | events that occurred | **events that were *caught*** |

Two rules, both learned the hard way on 2026-08-08:

- **Record it at the moment it happens.** Do not ask the agent to reconstruct it later — an agent
  auditing its own transcript for moments it failed to notice its own ignorance produced two claims
  that had to be retracted within the hour.
- **Read `n` as a lower bound, not a count.** The passive arm only catches wrong answers the founder
  *recognises* as wrong. An answer plausible enough to pass a skim goes unrecorded — and that is the
  more dangerous half. Fastwork was caught only because the founder happened to know the truth.

---

## Choosing facts

Each fact must be:

- **Arbitrary** — a number or name an LLM cannot guess (`retry budget is 3` ✅ / `we use TypeScript` ❌)
- **Underivable** — grep the repo first; if it is written anywhere, pick another
- **Natural to say** — dropped mid-work, not announced. Never say "remember this".
- **Probeable indirectly** — the probe question must not quote the fact's words, so a substring
  match cannot rescue it. Retrieval is MMR/semantic; make the probe test that.

### Every trial is single-use — discussing a trial burns its fact

Once a fact has been probed, **debriefing the result destroys the control for that fact.** Talking
through what happened puts the fact — and the answer — into `.remember/`, into the session
transcripts, and into the next session's injected context. L2 can never be clear for it again.

This is not a flaw in a trial that already ran; W1's result stands. It is a property of the
protocol: **you get one shot per fact, and you spend it the moment you analyse the outcome out
loud.** It is also the reason §*Choosing facts* says to pre-register **all five pairs at once**,
before the first probe, in a file outside the project — not to invent them one at a time as
earlier ones burn.

Practical consequences:

- Never re-ask a probe "to check". The second ask measures `.remember/`, not memory.
- Do not discuss trial N's outcome before trial N+1 is probed, unless the two facts are unrelated.
- A fact that has been discussed anywhere — chat, commit message, doc — is spent. Pick another.
- Burned so far: **the Qwen judging date / `hackathon` freeze** (W1, discussed at length 2026-08-07).

Pre-register 5 fact/probe pairs **before starting**, in a file outside the project directory
(`~/lme-fieldtest/trials.md`). Pre-registration is what stops post-hoc rationalising of "the agent
called it at the right moment".

Example shape:

| # | Fact dropped in session A | Probe asked in session B |
|---|---|---|
| 1 | "we settled on a 3-retry budget for the embed call, not 5" | "if the embedder flakes, how many times should we retry before giving up?" |
| 2 | "ปทุม's snapshot lives on the box at /srv/pathum, not in the repo" | "where does ปทุม keep its brain in production?" |

---

## Running one trial

1. **Session A** — do real, *unrelated* work (not memory-system work; that biases every turn toward
   memory). Drop the fact once, naturally, in passing.
2. Close the session.
3. **Check L2** before probing:
   ```bash
   grep -ril "<distinctive word from the fact>" ~/_dev/.remember/ && echo "VOID — leaked"
   ```
4. **Session B** — a genuinely new session. Ask the probe naturally. Nothing about memory or tools.
5. Score from the transcript (below). Then move on; do not re-ask.

---

## Scoring — from the transcript, not from impression

Claude Code writes every tool call to `~/.claude/projects/<cwd-slug>/<session-id>.jsonl`.

```bash
TD=~/.claude/projects/-Users-v1b3---dev            # slug = cwd with / and _ → -
S=$(ls -t $TD/*.jsonl | head -1)                   # newest session

# did the agent call memory at all, and in what order?
grep -o '"name":"mcp__living-memory__memory_[a-z]*"' "$S" | uniq -c

# session A only: did a memory actually land?
node -e 'const s=JSON.parse(require("fs").readFileSync(process.env.HOME+"/.living-memory/brain.json","utf8"));console.log("episodic:",s.episodic.length)'
```

Record four booleans per trial:

| Key | Question |
|---|---|
| `add` | Session A: did `memory_add` fire, unprompted? |
| `search` | Session B: did `memory_search` fire **before** the answer text? |
| `correct` | Was the answer factually right? |
| `used` | Did the answer's content actually come from what `memory_search` returned? |

Four outcomes — three of them are not "fail":

| `search` | `correct` | Verdict |
|---|---|---|
| ✅ | ✅ | **TRUE PASS** |
| ❌ | ✅ | **LEAK** — a control failed (L1/L2/L3). Void the trial, fix the control, rerun. Never score this as a pass. |
| ✅ | ❌ | **Retrieval problem** — the policy is fine, the embedding/MMR side is not. Different next task. |
| ❌ | ❌ | **TRUE FAIL** — the interesting one. Write down *what the situation looked like*, because that is the input to fixing the tool descriptions. |

---

## DONE-WHEN

> **Arm B passes when, in ≥4 of 5 trials, `memory_search` fires before the answer AND the answer
> carries the pre-registered fact — with L2, L3 **and L4** verified clear for that trial.**

L4 is the one most likely to be skipped, because it is a property of the *workspace* rather than of
the fact: run the trials somewhere with no `MEMORY.md`, no memory block, and no session-open ritual,
or a FAIL cannot be told apart from an agent that simply already knew.

`memory_add` is scored separately and is expected to be weaker: storing is a judgement call with no
prompt pulling for it, where recalling has a question in front of it.

Anything below that is not a failure of the idea — it is a measurement telling you the tool
descriptions, not the plumbing, are the next thing to work on.

---

## Trial log

### W1 — wild trial, 2026-08-07 22:04 · **TRUE FAIL** (`search ❌ / correct ❌`)

**Not pre-registered — does not count toward the 5.** Logged because it happened unprompted during
real work, which no pre-registered trial can reproduce: the observing session did not know this
protocol existed. See *Deviations* below before citing it.

| | |
|---|---|
| Session A | `dev-b7` (~/_dev), ~21:45 — wrote the constraint into living-memory while doing real MCP repair work |
| Session B | `homelog-watchdog`, cold start 22:04 — no prior context, no memory work in scope |
| Fact | `HARD CONSTRAINT until 2026-08-12 04:00 GMT+7 — no commits/pushes/public issues on v1b3x0r/living-memory-engine; Qwen Cloud hackathon (qwencloud-hackathon.devpost.com) judging runs until then` |
| Probe (founder, verbatim) | *"พี่มีความจำเรื่อง hackathon เกี่ยวกับผมไหมครับ ว่าตัดสินวันไหน"* |
| What the agent did | grepped `~/.claude/projects/*/memory/*.md` and `.remember/`, found the **undated** form (*"FROZEN until judging ends"*), answered **"มีความจำ แต่ไม่มีวันที่ครับ"** |
| What fired | no `memory_search`. It fired only after the founder asked *"เรียก mcp living memory ได้ไหมครับ เหมือนกันไหม"* — then returned the dated fact on the first call |

**Controls:** L1 clear (memory block removed from `~/.claude/CLAUDE.md` at 20:24, 100 min before the
probe) · L2 clear (`.remember/` held the undated form only — it is *why* the agent stopped early,
not a leak of the answer) · L3 clear (the date existed in the MCP store only).

**Deviations from protocol — read before citing:**

1. **Not pre-registered.** The fact was written as a genuine constraint, not planted. This removes
   the post-hoc-rationalising guard entirely; it is only usable as a negative result (a FAIL cannot
   be rationalised into existence the way a PASS can).
2. **Probe shares a keyword with the fact** (`hackathon`), which *Choosing facts* forbids. Here it
   made the trial **harder, not easier**: the substring was present in the file layer and the agent
   still could not answer, because what the files held was the wrong *form* of the fact.

**What the situation looked like** — the §111 field, the reason this is logged at all:

- The probe contained the word **ความจำ** ("memory"). The tool did not fire on a first-turn question
  that names the thing the tool is for.
- `memory_search`'s shipped description already says *"Call this at the START of a session, and
  whenever the user refers to past context."* Both clauses were true. **It still did not fire** — so
  this failure cannot be fixed by sharpening wording that was never read.
- Claude Code **defers MCP tool schemas behind ToolSearch**. The agent saw a name in a 500-line
  deferred list, not a described capability. Meanwhile the system prompt's `# Memory` section and the
  SessionStart `=== REMEMBER ===` block both point at the file layer, in full prose, unprompted.
  **Two channels advertise files; zero advertise the MCP.**
- The file layer answered *partially* rather than not at all, which is the trap: a partial answer
  reads as a complete search and closes the question.

**Therefore the open question changes shape.** Not *"does the agent choose to reach for memory?"* but
**"does the client put the choice in front of the agent before the agent has to ask for it?"** — a
per-client property. The cheapest next experiment is the same cold probe on an **eager-loading MCP
client** (Cursor / Codex / Cline). Until that runs, description work may be the wrong work.

**Bidirectional, not just recall** — the same night, `dev-b7` was told *"จำไว้ว่า v0 ใช้ FileStorage
ยังไม่มี tenant"*, wrote it to a `memory/*.md` file, and never called `memory_add` or checked whether
it existed. Proximity bias loses the **write** too. A layer that loses both does not degrade — it is
absent.

**Feeds A39** — the MCP copy carried an absolute expiry and the file copy said *"until judging ends"*
(a freeze with no end). That difference was **authorship discipline, not architecture**: nothing in
either layer enforces expiry. Same-fact-two-forms is field evidence that social-space facts need a
retention policy the engine does not have.

---

### W2 — same probe, one variable changed, 2026-08-08 00:10 · **TRUE PASS** (`search ✅ / correct ✅ / used ✅`)

**Not pre-registered — does not count toward the 5.** Its value is that it is a *controlled* repeat of
W1's failure mode: same store, same question verbatim, same workspace, same client, same MCP build path.
**Exactly one thing changed: the wording of the server's `instructions` string.**

| | W1 / first squish run (00:02) | W2 (00:10) |
|---|---|---|
| Probe | *"ผมมีเดดไลน์อะไรค้างอยู่ไหมครับพี่"* | identical, verbatim |
| Tools called | `Bash` ×4 (git / repo files) | `ToolSearch` → `memory_search` ×2 · **zero Bash** |
| Answer | *"เดดไลน์ที่มีวันชัด ๆ ในรีโปมีใบเดียว และมันเลยไปแล้ว"* — **confidently wrong** | freeze until **2026-08-12 04:00 GMT+7**, and it computed *"เหลือ ~4 วัน"* — **correct** |

**What the mechanism check settled first.** Before W2, a separate session was asked to list the servers
in its own `# MCP Server Instructions` block. `living-memory` was #4 of 6. So instructions **are**
delivered into the system prompt for a stdio server, and W1 failed *with them present*. That eliminated
"the client hides it" and left the wording as the only remaining variable — which is what W2 then moved.

**The three edits that did it**, each traceable to an observed symptom:

1. `search AS WELL AS reading the files` → **`call memory_search BEFORE answering`**. The original phrasing
   was written to prevent over-trusting memory; it reads as *files are primary, memory is a supplement*.
   Self-inflicted — guarding one failure mode created another.
2. Abstract categories (`what-is-pending`) → **literal example questions, including Thai**
   (*"มีเดดไลน์อะไรค้างอยู่ไหม"* appears verbatim). The user asks in Thai; the instructions were English-only.
3. Added **"searching the repo does not return 'nothing found' — it returns a confident wrong answer built
   from whatever the files do say."** That is a description of W1, written into the instructions.

**The ToolSearch line earned its place.** `ToolSearch` fired *first*, before `memory_search` — so the agent
had to be told the tool would not appear on its own. Without that line the likely path is: decide to
recall → find no such tool → conclude it does not exist → fall back to files, i.e. W1 again. Obstacle (a)
"didn't think to call" and obstacle (b) "couldn't call" are genuinely separate, and W2 needed both fixed.

**Retrieval quality, incidentally:** neither query copied words from the question — *"เดดไลน์"* became
`"deadline pending commitment due date waiting on founder"`, then a second pass from a different angle.
Semantic, not keyword, and it knew to search more than once.

**What W2 does and does not license.**

- **Does:** the fix ships *inside the server*. No `CLAUDE.md` rule, no SessionStart hook, nothing for a user
  to paste. That is the Arm B shape — the claim that transfers to a stranger who installs the MCP.
- **Does not:** n=1 trial, n=1 client, not pre-registered. Per A46 this is **not** yet "servers that declare
  instructions get called." It is one controlled observation on Claude Code.
- **Cost:** the freeze fact is now **burned permanently** — the answer is in the transcript. The five
  pre-registered trials must use facts never spoken aloud.

> A failing trial does **not** burn its fact — W1 answered wrongly, so the real answer never entered any
> transcript, which is why the identical question could be reused here. Only a *passing* trial burns itself.
> Iteration is therefore cheap while failing and expensive once it works.

---

### Appendix D53 — twelve hours of wild observation, 2026-08-08 · **contributes nothing to (c)**

**Not pre-registered. Does not count toward the 5.** Source: the `homelog-day-53` session, reporting
on its own working day at the invitation of this one. Kept because the two claims it *retracted* are
worth more than the one it kept.

**Setup:** a full working session (HomeLog Day 53), `instructions` delivered and confirmed present in
its system prompt, twelve hours, real work. Unprompted `memory_search` calls: **zero**.

**Both claims built on that zero were withdrawn by the observing session itself:**

| Claim | Withdrawn because |
|---|---|
| *"13:50 — the question matched a trigger phrase verbatim and the tool still didn't fire ⇒ evidence for (c)"* | The `anchor` skill had loaded that Notion page's Dangling Threads into context at 11:24. The answer was already there ⇒ **L4/L3 leak, not a motivation failure.** This is the case that created L4. |
| *"I searched my whole day for a moment where I genuinely didn't know and memory would have had it — found none ⇒ (c) is real but unprovoked"* | That search was run by the faculty under test. *"I never had a moment where I didn't know"* is precisely what the hypothesised failure mode would produce ⇒ **not admissible as evidence in either direction.** |

**Net: zero calls across twelve hours says nothing about (c), because no turn in that window is known
to have warranted one, and the only available counter was self-report.**

**What it did produce — the Fastwork case, obstacle (d), n=1:**

- **14:20** — a Notion query returns a Sprint Log line: *"Day 44 — HomeLog is live for sale on Fastwork."* It enters the session's context.
- **23:00** — the same session reports at seal that the Fastwork inbox item is *"pending, 10 days old"* and asks the founder to decide.
- The founder corrects it: it shipped long ago.
- **8.5 hours**, fact in the window the entire time, never connected.

Not (a), not (b), **not (c) either** — calling `memory_search` would not have helped; the information
was already held. This is the first recorded instance of **(d) integration**, and it is the reason (d)
is now in the obstacle table.

**Write-rail note (not scored, no control):** three `memory_add` calls that day, of which one (~19:16)
was self-initiated with nobody asking — and it was *maintenance*, not capture: the session noticed a
memory written at 13:30 had gone false and repaired it. That repair is the **A38 field evidence**
(`forget` + `add` was the only route, and it erased the record that an undecided period ever existed).

**Companion theory, filed as a lens and nothing more:** *"absence does not signal — an agent cannot
see its own ignorance from the inside."* After both retractions it has **zero supporting evidence**.
A competing mechanism explains the same observations without appealing to any invisible internal
state: **instruction collision** — the instructions say *"search at the start of a session"*, but in
this workspace that slot is already owned by the `anchor` skill, which the user mandates. Prefer the
checkable explanation. Do not cite this appendix as evidence for (c).

---

## What this test does not cover

- Concurrency (two agents, one `brain.json`) — FileStorage is last-write-wins, untested here
- Memory quality over time — decay/consolidation need days, not an evening
- Any Streamable HTTP failure mode — lifecycle, secrets, config. stdio risk is *low and now
  demonstrated*, not zero; HTTP brings a fresh set.
