# living-memory-engine — NEXT SESSION (warp point)

> Read THIS first to resume. Side project (not HomeLog). Last big session: **2026-08-09 (LME MCP 0.1.0 → 0.1.1 PUBLISHED to npm; article live; see the dated block below — it has a deadline in it)**. Prior: 2026-08-08/09 (DoD-2 corrected into four obstacles). Prior: 2026-07-20 (Qwen Cloud hackathon — shipped a live submission). Prior: 2026-06-05 (prospective-resolution + Spec 1A attributed multi-person memory), 2026-06-03 (self-state grounding), 2026-06-02 (web pivot + ambient oracle).
> One-line: a **living-memory engine** — talk forever; a TS engine decays/consolidates/crystallizes instead of stuffing context. Star is **เชียงใหม่**, a Chiang-Mai entity that senses the real world (Open-Meteo) and remembers across sessions. **Default profile = Qwen Cloud; deployed live on Alibaba Cloud.** Local Ollama still an option.

## ⚡ 2026-08-11 — Remote LME MCP EXISTS (read this before the dated block)

The strategy moved: HN/adoption push was demoted mid-day (advisor ledger A57–A65). **lme-remote** — a hosted
streamable-HTTP MCP serving the real `~/.living-memory/brain.json` behind a RevenueCat entitlement gate — was
built, adversarially reviewed, and **passed its live DoD the same day** (phone retrieved the Mac's memory
world; 403→promotional-grant→200 through a public tunnel). It lives in its **own repo**
`side-projects/lme-remote/` (spec/plan/runbook inside; 20/20 tests; HEAD `a4e38f3`), permanent hostname
**https://lme.viibe.to** (Cloudflare named tunnel `lme`). Commercial boundary settled: local stdio = free/OSS
forever · hosted continuity = paid. ONS (anonymous mortal-memory trial) is spec'd as a seam, NOT built —
founder+GPT scoping round required first. Server+tunnel processes are still session-bound on the Mac
(hostname survives restarts). Durable hosting ships **together with the paywall** — founder ruling, not a
standalone task. The freeze-lift list below still stands, and DoD-3.9 gains urgency: hosted mode makes the
concurrency issue real (a per-brain serializer exists in lme-remote; cross-process locking belongs upstream).

## ✅ EXECUTED 2026-08-12 evening — the freeze-lift block below is DONE

All four items landed the day the freeze lifted: lme-mcp@0.1.1 source is in this repo (tagged
`lme-mcp-v0.1.1`; v0.1.0 has no surviving snapshot so it was not tagged), CLAUDE/AGENTS doc fixes
pushed, DoD-3.9 filed as [issue #3](https://github.com/v1b3x0r/living-memory-engine/issues/3).
`LME_MCP_Plan.md` §3 no longer contains the OpenRouter erratum (already fixed in place; the file
stays local-only via `.git/info/exclude`, along with the other private/superseded strata).
**New the same day:** Claude Code plugin repo `v1b3x0r/living-memory-plugin` (`living-memory`,
validate --strict ✔, npm smoke ✔) — marketplace submission via platform.claude.com/plugins/submit
pending founder login. `~/_dev/lme-release-0.1` kept, per the rule below.

## ⏰ DATED — DO THIS WHEN THE FREEZE LIFTS: **2026-08-12 04:00 GMT+7**

*Written 2026-08-09 22:00 because the next LME session will probably open on the 11th or 12th, in the
middle of HomeLog/XPRIZE work, and will not think to ask. This block is the eager channel; living-memory
is the lazy one and will not surface a dated commitment on its own (that is A32, decided by us).*

**`@nature-labs/lme-mcp@0.1.1` is published and live on npm, and its source has no home in git.**
That is the debt. When the freeze lifts:

1. Bring `~/_dev/lme-release-0.1/lme-mcp/` back into this repo (it is a detached worktree at `2be3605`)
2. Commit · merge · tag **`lme-mcp-v0.1.0`** and **`lme-mcp-v0.1.1`**
3. Push the working-tree doc fixes already made here: `CLAUDE.md` + `AGENTS.md` (the OpenRouter rule was
   wrong and is corrected), `LME_MCP_Plan.md` §3 still says OpenRouter has no embedding models — it has 31
4. File the **DoD-3.9 concurrency** issue publicly (first thing, per the original plan)

**Do not delete `~/_dev/lme-release-0.1`.** It is the only copy of the published source.

## ▶ ADOPTION IS NOT BLOCKED BY THE FREEZE — do not wait for the 12th

Shipped 2026-08-09 and already public: **npm 0.1.1** · the article
**https://www.v1b3.io/writing/i-gave-an-agent-a-package-name/** (live). Verified: 3 clients (Claude Code,
Hermes 0.20.0, Codex) · 5 embedding providers (Qwen Cloud, llama.cpp, Ollama, OpenRouter, mock).

**What is missing is one thing only: a stranger who is not us.** Nothing about that is frozen.

- Founder's read, 2026-08-09: **Hacker News / Product Hunt**, not LinkedIn — LinkedIn measured 569
  impressions and 40 followers over four weeks, and `Followers gained from this post = 0` on every post.
  The most technical post did worst (25 impressions). It is a diary with ~50 readers, not a channel.
- Squish precedent (Notion Turn 6, 2026-07-06) armed **six** surfaces in one day: free tier · ungated
  skill · pre-wired fork · Telegram · npm · upstream PR. LME has armed exactly one (npm).
- Squish's own lesson, worth stealing: *a gated skill vanishes exactly when the MCP is absent* — so if a
  skill gets built for LME, ship it ungated.
- Upstream PR to Hermes is precedented (`NousResearch/hermes-agent#59460`) **but it has sat reviewed and
  unmerged since 2026-07-16** — month-scale latency. Do not stack LME onto that PR; it would reset its review.

**Do not let HomeLog/XPRIZE crowd this out silently.** If a session opens and only sees HomeLog, that is
the failure mode this block exists to prevent.

## The open question that decides whether hosted/Remote MCP is worth building

Not "does the spec want it" — stdio is a current standard transport in MCP revision 2026-07-28 and is not
deprecated. Claude's *consumer* surfaces (web/Desktop/mobile) take remote connectors only; Claude Code,
Hermes and Codex all take stdio, which is what shipped.

The real question is **"how would we ever know if someone used it?"** Squish could answer that — 157 MCP
requests, 45 real tool executions — because it was hosted. LME is local by design and reports nothing;
`Telemetry: none` is in the README as a feature. Decide that question before building transport.

---

## Previous session context — 2026-08-09 (LME MCP shipping day)

**Where LME actually stands** (corrected late 2026-08-08 in a cross-session exchange with the `homelog-day-53` session — full write-up: `lme-mcp/FIELD-TEST.md`, ledger `advisor-inbox.md` A51–A56, Notion Agent Log 2026-08-09):

"Agent reaches for memory" is **four obstacles**, not one — **(a) delivery** ✅ n=2 · **(b) matchability** 🟡 literal matches only · **(c) motivation** 🔴 **no data, nobody has touched this** · **(d) integration** 🆕 n=1. **DoD-2 is a claim about (c); W2 moved (a)+(b).** So do **not** open the day by rewording tool descriptions or `instructions` — if the blocker is (c)/(d), that is the wrong layer.

**Today's three blocks** (all in `side-projects/lme-chat/` — a *separate repo, NOT under the freeze*, so it commits freely; `memory-engine` stays working-tree-only until **2026-08-12 04:00**):

1. **Block 1 — harvest, no new features.** `src/lib/ledger.ts` already writes a full `TurnRecord` every turn (`fedSystem`/`fedInject`/`fedTailCount`, `usedIds`+`availableCount`, `proposed`/`created`/`dropped`, model+prompt stamps). Export the ~339 turns already sitting in the founder's browser and plot four curves:
   - `fedInject` **over time** ← the one that matters: flat across 339 turns while the conversation grows to ~203k tokens = *bounded*, measured
   - `availableCount` **growth curve** ← if it grows linearly, this is an append log with extra steps. **Be willing to see that.**
   - `usedIds / availableCount` (retrieval sharpness) · `created / proposed` (dedup rate, ~30–50% in the wild)
   - **Every one of these is computable from metadata alone — no message content needs reading.** The founder's thread is personal; keep it that way, and the charts stay shareable.
2. **Block 2 — quality, using the criterion agreed last night.** Three mechanical checks per suspect turn: *(1) is the answer in the store · (2) was it already in `fedInject` · (3) was the reply wrong.* `(1)✅(2)❌(3)✅` = **retrieval miss** · `(1)✅(2)✅(3)✅` = **(d) integration miss**. First time engine-fault and model-fault can be told apart.
3. **Block 3 — make the felt claim falsifiable.** "Multi-layer linked conversation got better" is **join**, not recall: ask something needing two facts stated ~200 turns apart and never together. Answers = something a context window can't do. Doesn't = the felt gain may be UX/flow, which is also worth knowing.

**Founder decision 2026-08-09 01:20:** the existing 339-turn thread is too personal to be the research corpus → a **new entity** (MDS-ecosystem-flavoured, or just easy to talk to) and research in **one pass at ~500 turns**. Block 1 still runs on the old thread for free (metadata only); Blocks 2–3 wait for the new entity.

**Headline number, and its trap:** `~203,431 tok conversation → ~2,710 tok fed` = **1.33%, 75×**. That proves **bounded**, *not* **good** — a system that simply truncates scores better. It only means something paired with a quality axis holding across the 339 turns.

**Still open (not today's blocks):** ~~`lme-mcp/` is untracked~~ → **resolved 2026-08-09**: shipped from a third detached worktree, published to npm; provenance debt now tracked in the dated block at the top · 5 pre-registered DoD-2 trials unrun, and they must run in a workspace with **no eager memory** (L4) · A38 CAS/append-only before supersede — hit twice for real on 2026-08-08, and a third time on 08-09 (4 of 19 stored memories carry tool-envelope markup that cannot be edited, only forgotten+re-added) · after 2026-08-12 04:00, file the DoD-3.9 issue first.

---

## ✅ 2026-07-20 — Qwen Cloud hackathon (MemoryAgent track) — SHIPPED a live submission
Repo **renamed `neural-chat` → `living-memory-engine`** (public, Apache-2.0; GitHub redirects old links). All hackathon assets in one bucket: **`docs/superpowers/hackathon/`** — start at `codex-brief.md`. What landed (all pushed to main, engine 92 + web 74 tests green, tsc 0, zero engine edits):
- **Qwen Cloud integration** — new default profile via key-safe proxy: pure rules `web/src/lib/qwenproxy.ts` (path/model allowlist, 768-dim, max_tokens cap) wired as Vite dev middleware + `web/server.mjs` (prod). Key in `web/.env.local` (`QWEN_API_KEY`), never in client.
- **Live deploy on Alibaba Cloud** — `server.mjs` (zero-dep Node) under systemd `memory-engine` behind nginx on an Alibaba Simple Application Server, Cloudflare TLS → **https://cm.viibe.to** (+ `http://47.79.255.217`). Runbook: `docs/superpowers/hackathon/DEPLOY.md`.
- **L2 "why this answer"** explainability (`web/src/lib/why.ts` + `ui/debug.ts`) — Used context vs Available, source badges (Memory/Live/Plan); raw tiers under Advanced. Pane inverted to product-first per advisor.
- **English UI chrome + reply-mirrors-language** — เชียงใหม่ replies Thai to Thai, English to English. `[Self-state]` block now English (`(adjust stance: …)`).
- **Restyle** — warm-editorial (clay accent, serif masthead, haze). **Dark = clean near-black, Light = beige.** White-canvas bug fixed at root (`html { background }` + `color-scheme`).
- **Evaluation** — deterministic `engine/eval/run.ts` (`npm run eval`), H1–H4 vs full-history baseline (H3: 1 of 31 @ ~23 vs ~428 tokens; H2 honest "both retrieved" finding).
- **Demo video 2:25** (`docs/superpowers/hackathon/media/demo.mp4`) — burned-in EN subs + OpenAI-TTS (sage) VO, built from live-app captures via chrome-devtools + ffmpeg.
- **Repo tidy** — loose root PNGs moved out (`.assets-scratch/`, gitignored); `.gitignore` hardened.
- **Advisor ledger** `advisor-inbox.md` — 5 GPT rounds triaged (A1–A27).

**Remaining founder actions before Submit (deadline 2026-07-20 14:00 PDT):** upload `media/demo.mp4` → YouTube → paste link into `devpost-draft.md` → paste into Devpost (MemoryAgent) → **Submit**. Codex does a final review pass (`codex-brief.md`).

**Known-deferred (post-hackathon, non-blocking):** proxy mid-stream 502 guard (`if(!res.headersSent)` — dev middleware only; `server.mjs` already has it); Spec 1B privacy-scoped retrieval + persons viz; contradiction-aware consolidation (the H2 gap).

## ✅ DONE + VERIFIED LIVE 2026-06-02 — web pivot, Phase 1 + Phase 2

Pivoted the frontend from Expo → **plain web** (Vite vanilla, no React) + **uicp** drawer + the existing engine (`file:../engine`). **Mobile/Expo is FROZEN** (not deleted; don't touch). Old root React prototype removed.

- **Phase 1 (foundation):** IndexedDB `StoragePort` · `ModelProfile` config (Ollama default; chat+embed switch together) · personas (เชียงใหม่ seed) · engine factory · chat UI (stream/persist/persona-reactive) · drawer (persona / profile / **model dropdown discovered from `/v1/models`**) · theme. **20 unit tests green, tsc 0.**
- **Memory debug pane** (🧠 top-right): live Snapshot view (self/episodic/prospective + strength/tags/emb) + **Injection Tap** (type a query → `engine.retrieve` → real `formatInjection` string the LLM gets).
- **Phase 2 (ambient soul):** `lib/data/chiangmai.ts` (8 อำเภอ + FIELD_LEGEND text + METRIC_KEYS) · `world.ts` (Open-Meteo air+weather, no key, CORS-ok, multi-district 1 array) · `ambient.ts` (diurnal-aware z-score salience → oracle interpret → `addEpisodic` → `maybeGreet`) · boot+interval tick in chat.ts.
- **Lab Mode (tuning instrument — เชียงใหม่ tuning is the project's PRIMARY focus):** in the 🧠 pane — toggles for what's fed to the LLM each turn (⏱ time + position top/end · 🧬 self · 📎 episodic · 🎯 prospective · 💬 tail) via `labRespond` (mirrors `engine.respond()`, engine untouched; default = identical) · **📤 "last fed"** shows the exact assembled prompt · 🧹 per-persona brain-wipe (re-run experiments from blank) · inline **custom-system-prompt new-friend form** (a system prompt anchors an entity against drift — founder's finding; spawn ground-level entities like a botanist from birth). **24 web tests green.** Time-position 'end' is the temporal-tuning knob for the [Current time] hallucination.
- **Verified on Ollama via Playwright:** chat streams in เชียงใหม่'s voice; persists across reload; persona+profile+model switch work; memory engine writes episodic (extract + 768-dim embeds) + retrieval works (Injection Tap surfaces relevant memory); **เชียงใหม่ proactively greets on open, grounded in the real observed air** ("...บางมุมต้องระวังฝุ่นนิดหน่อย เหมือนมีอะไรกำลังเปลี่ยนไป").

**State:** **MERGED to main** (PR #2 `fcdef4b`, 42 commits) and pushed — 2026-06-03. `labrespond.ts` in `src/lib/`. Adversarial code-review done (3 findings fixed: memory-dup-on-stream-error, persona-switch repaint race, shared `ui/dom.ts`); two engine fixes landed post-merge (prepare hook builds `dist/` on fresh install; `addEpisodic` embeds before loading snapshot to avoid clobbering concurrent writes).

## ✅ DONE + VERIFIED LIVE 2026-06-03 — self-state grounding (the core direction, now built)

The 2026-06-02 "concept only" core direction is **implemented and live**. 5-signal interoception (`online · llm local/remote · embeddings · world_feed fresh/stale · memory age`) injected as a `[Self-state]` block at the top of every turn via `labRespond`, gated by the 🪞 lab toggle (default ON). Facts always; a `(ปรับท่าที: …)` self-directive only when a signal is off-nominal. Code: `lib/selfstate.ts` (`gatherSelfState` + pure `formatSelfState`), **34 tests** (63 web tests total green, tsc 0). Spec/plan condensed (7 TDD tasks) under `docs/superpowers/`. Also added: **devlog file sink** (`lib/devlog.ts` → `web/.debug/dev.log`, dev-only) to read the real prompt fed to the LLM.

## ✅ SHIPPED 2026-06-05 — prospective-resolution + Spec 1A (both engine, merged to main)

**prospective-resolution:** cue-triggered lifecycle (dormant→trigger→reinforce→resolve→decay→abandon→archive-cap). See the earlier backlog entry; `consolidation.ts` helpers + debug-pane pending/archive split.

**Spec 1A — Attributed Multi-Person Memory** (the **Social Reality Model** foundation; `memory/social-reality-model-direction.md` + `docs/superpowers/specs/2026-06-05-attributed-multi-person-memory-design.md` + plan `…/plans/2026-06-05-attributed-memory-1a.md`). **Engine-only** (web untouched = the deliberate "engine-only proof"): every episodic memory carries `source` / `source_type`('user'|'ambient'|'self'|'system') / `subject`('world'|'self'|person-id); placement routes by subject into **entity / per-person / interaction** tiers; the **echo-chamber kill is structural** (subject='self' → interaction log → never an episodic → never a SelfFacet); person identity = stable synthetic `person-id`, names are appended `known_names[]` never keys. New `engine/src/attribution.ts` (placeMemory/resolvePerson/deriveVisibility) + interaction ledger + transitional unified-pool retrieve (the 1B privacy-filter seam). **engine 36→92 tests**, build clean, tsc 0. Live-verified on real chiangmai data (back-compat: 63 old memories load through new engine, 0 errors; interaction ledger user+model with correct source_type). Built via full superpowers flow (brainstorm→spec→plan→subagent-driven TDD 10 tasks→adversarial reviews). **MERGED to main** (ff `79390a9`), NOT pushed.

**Known limits (by design):** 1A does NOT surface in the web UI and does NOT retroactively clean OLD polluted memory (forward-looking) — chiangmai's pre-1A Self-tier/episodic still hold echo-chamber junk. 🧹 ล้างสมอง for a clean sample.

## ▶ NEXT: Spec 1B — Retrieval & Identity (founder-requested start = debug-pane viz)
The visible half: **privacy-scoped retrieval** (insert the viewer/visibility filter at the `retrieve()` pool-union seam — already pre-built), **relationship-derived display** ("คนที่ชอบเดินตลาด"), **emergent naming** (infer+confirm / ask-after-relationship / alias-merge of split person-ids). **Founder-requested starting point:** a `web/src/ui/debug.ts` viz surfacing the new 1A structures — 👥 Persons (id + known_names + facts), 🔗 Interactions ledger, source/subject attribution badges on episodic cards — so 1A becomes visible. Then **Spec 2** (semantic clustering / corroboration / confidence→phrasing + self-facet dedup).

## Resume in 30 seconds
```bash
# Ollama must be running with models pulled:
ollama pull gemma4:e4b-mlx && ollama pull embeddinggemma   # chat + embed (MLX is faster on Apple Silicon; e2b deleted)
cd web && npm install && npm run dev                   # http://localhost:5173
cd web && npm test                                     # 63 web tests green; engine: cd engine && npm test → 92
cd web && npx tsc --noEmit                              # 0 errors
```
- Default model profile = **Local (Ollama)** `localhost:11434/v1`. Switch profile/model in the ☰ drawer (LM Studio / OpenRouter+local-embed / OpenAI Direct). Other machine (4070ti) = LM Studio.
- **gemma4:e4b-mlx** (current on M3 Air 16GB; founder swapped from gguf e2b) is still slow (~20–40s chat + a SEPARATE ~30–120s tick/extract call). The extract is the slow tail — attribution lands seconds-to-minutes after the visible reply. Greeting/observe run in the background.

## Architecture (`web/`)
- `src/lib/` — `storage.ts` (IndexedDB StoragePort + kv) · `config.ts` (ModelProfile presets + AMBIENT knobs: ambientRefreshMs/salienceK/baselineWindow/worldlogCap) · `models.ts` (fetch /v1/models) · `personas.ts` (CHIANGMAI seed, ambient+prompts) · `engine.ts` (getEngine→{engine,storage,chatPort}, resetEngines) · `theme.ts` · `world.ts` · `ambient.ts` · `data/chiangmai.ts`.
- `src/ui/` — `chat.ts` (thread/composer/stream + ambient tick) · `drawer.ts` (left nav) · `debug.ts` (right memory pane) · `dom.ts` (shared `el()`).
- Engine consumed via `file:../engine` (exports map → prebuilt `dist/`). **After editing `engine/src`, run `cd engine && npm run build`.** Provider ports from the `…/provider` subpath; browser fetch streams natively (no expo/fetch).
- Spec: `docs/superpowers/specs/2026-06-02-neural-chat-web-ambient-oracle-design.md`. Foundation plan: `docs/superpowers/plans/2026-06-02-neural-chat-web-foundation.md`.

## Decision when you return
prospective-resolution **SHIPPED** 2026-06-04 (engine 58 tests, web verified live on legacy data). Next-ripe: **intent-completion UI surface** ("เพื่อนกำลังรออะไรอยู่") or **background continuity** (service worker).

## Backlog (next rounds)
- **prospective-resolution — DONE 2026-06-04** (engine Tasks 1-8 + adversarial-review fixes): cue-triggered lifecycle (dormant→trigger→reinforce→resolve→decay→abandon→**archive-cap**); `consolidation.ts` gains `decayProspective`/`abandonWeakProspective`/`capProspective`; `retrieve()` triggers on clue-embedding cosine match (cooldown + reinforce-on-trigger); `extract()` reports `resolved[]`; debug pane splits pending(live)/archive(count); **legacy rows auto-migrate on first tick** (verified live: chiangmai had 14). Plan: `docs/superpowers/plans/2026-06-02-prospective-resolution.md`. **Next depth:** intent-completion UI ("เพื่อนกำลังรออะไรอยู่"), priority-modulated trigger threshold.
- UI polish: **stream the proactive greeting** (currently appears whole via ingestModel) · timestamps/date-badges · message actions (copy/edit/rewind/retry) · favicon.
- Ambient depth: deeper/seasonal salience baselines beyond diurnal · **background continuity** (service worker/cron so the city "lives on while you're away" — turns it from "checks weather on open" into a real life).
- **Self-state grounding — DONE 2026-06-03** (see the verified-live section above). Next depth on it: act on the `(ปรับท่าที: …)` directive beyond text (e.g. behavioral calibration), and wire it toward the layer-4 MDS substance (confidence/temporal-certainty/sensory-integrity/identity-stability).
- **Layer 4 (MDS affect)**: swap `cityMood()` for real PAD/needs state (the seam is in place). Big, separate — converges with self-state grounding (now built).
- Multi-province; image/vision.

## Gotchas (hard-won this session)
- **cwd drift**: git commands `cd <root> && git…` move the shell cwd → later `npx vitest` from root globs the engine's tests with the wrong (node) env. Use `git -C <root> …` for git and `cd web && …` explicitly for vitest/tsc.
- **vitest env**: `web/vite.config.ts` MUST `import { defineConfig } from 'vitest/config'` (not `'vite'`) for `test.environment: 'happy-dom'` to apply — tests use `localStorage`; storage/engine tests also `import 'fake-indexeddb/auto'`.
- **Ollama**: CORS is open for `localhost:5173` by default (no OLLAMA_ORIGINS needed). OpenRouter has **zero embedding models** — never use it for embed; pair it with a local embedder.
- **Playwright refs** rotate every snapshot — capture and act in consecutive calls.
- Engine unchanged (still 36 tests green in `engine/`); all Phase-1/2 work is in `web/` with zero engine edits.
