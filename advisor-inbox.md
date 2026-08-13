# Advisor Inbox — append-only

## 2026-07-20 | GPT | เรื่อง: Qwen hackathon submission design review

- [ ] A1: Alibaba deployment proof — GPT อ้าง rules บังคับ "fully deployed and running on Alibaba Cloud" + screenshot ใน Workbench, ไม่มีหลักฐาน = ตัดสิทธิ์ (P1-claimed → **verified: quote เหล่านั้นไม่มีอยู่จริงในหน้า rules/overview**; ข้อความจริง: "You must demonstrate that the backend is running on Alibaba Cloud. Proof must be a link to a code file in their code repo that demonstrates use of Alibaba Cloud services and APIs." — artifact ที่บังคับคือ code-file link เท่านั้น) → ปรับเป็น: keep code-proof เป็น baseline, ลอง Alibaba FC proxy แบบ timeboxed เป็น insurance ถ้า account path ไม่ติด
- [x] A2: License → Apache-2.0 → resolved: spec §4 edits 2026-07-20 (2026-07-20) แทน MIT (P2; rules บังคับแค่ "open source license file... detectable" — ตัวไหนก็ผ่าน; รับตามคำแนะนำเพราะ cost เท่ากัน + patent grant เหมาะกับ engine ที่เป็น library)
- [x] A3: Video ฉาก "brain swaps, memory stays" ขัดกับ embedding-space rule ในเอกสารตัวเอง (P1 → **verified: จริง, ขัดกับ spec §2**) → แก้ script เป็น "The engine is provider-agnostic; this deployment uses one consistent Qwen embedding space."
- [x] A4: เพิ่ม evaluation เล็ก 3–5 deterministic scenarios vs plain-history/RAG baseline (relevant recall / stale recall / memories injected / est. tokens) ลง README + Devpost + วิดีโอ (P1; ทำได้จริงด้วย fake-port harness ที่ engine tests มีอยู่แล้ว)
- [x] A5: เรียงวิดีโอใหม่ memory-first, ลด weather/interoception (P2; รับส่วนใหญ่ — คง hook เชียงใหม่สั้นๆ ไว้เป็น differentiation, interoception เป็น optional ท้ายคลิป)
- [x] A6: Rules บังคับ "significantly updated after May 26, 2026" สำหรับโปรเจกต์เก่า (P2 → **verified: มีจริง**; repo ผ่านอยู่แล้วจาก merges 2026-06-02..05 + งานคืนนี้ — ต้องลิสต์ของใหม่เป็นรูปธรรมใน submission)
- [x] A7: Scope reprio — drop B2 ✓, ลด redesign เหลือ "restyle เฉพาะส่วนเข้ากล้อง", drop dual-theme (opinion; **ขัดกับความต้องการ founder ที่สั่ง redesign เพราะเขิน MVP look** — founder ต้องเคาะเอง: ลึกแค่ไหน แลกเวลากับ A4)
- [x] A8: ไม่ต้อง rename repo คืนนี้ — ใช้ชื่อ submission "Living Memory Engine" ได้แม้ repo ชื่อ neural-chat (opinion; รับ — ตัดข้อเสนอ rename ของ Claude ทิ้ง ประหยัดงาน link/redirect)

หมายเหตุ triangulation: GPT ระบุว่าอ่านกติกาผ่าน Devpost plugin แต่ quote เด็ดสองท่อน (screenshot/Workbench, "fully deployed") ไม่พบในหน้า rules และ overview ที่ fetch สดวันนี้ — เลนหลักของความเห็น (evidence-first, ลด scope เครื่องสำอาง) ยังมีคุณค่า แต่ตัว blocker claim เป็นการอ่านเกินตัวบท
**[แก้ไข 2026-07-20 ~14:00: ข้อสรุปข้างบนผิดบางส่วน — Claude เช็คไม่ครบเอง (ขาดแท็บ updates) ดู A9]**

## 2026-07-20 (รอบ 2) | GPT | เรื่อง: submission design v2 review (8.8/10)

- [x] A9: Deployment proof — **verified รอบนี้: จริง** — ประกาศ "Proof of Deployment 101" ใน Devpost updates เขียน "fully deployed and running on Alibaba Cloud — not just sketched in Figma, not just running locally" + "No proof = not eligible" + proof ต้องอยู่ทั้ง repo และวิดีโอ (P1 ของแท้; screenshot/Workbench format ยังไม่ถูกระบุเจาะจงในประกาศ) → Claude ถอน refutation รอบแรก; KYC Alibaba console 3 วัน = FC ตาย; รับ honest-evidence ladder: Qwen Cloud console surface → usage/log screenshots + live inference ในวิดีโอ → acknowledge risk, ห้าม claim เกินจริง → resolved: spec §6 rewrite (2026-07-20)
- [x] A10: วิดีโอต้อง "less than three minutes" + burn-in Eng subs ในภาพจริง (P1) → resolved: spec §7 target ≤2:50 + burn-in (2026-07-20)
- [x] A11: Evaluation เขียนผลล่วงหน้าเหมือนรู้คำตอบ → เปลี่ยนเป็น hypotheses + script รายงานผลจริง + deterministic seed; ผลไม่ชนะ = finding ไม่ใช่ failure (P1, research-credibility) → resolved: spec §5.5 reword (2026-07-20)
- [x] A12: R gate — ห้ามเริ่ม restyle จน public repo + live Qwen round-trip + eval table + Devpost draft + architecture image ครบ; ถ้าไม่ทัน → B1 chip + camera-viewport CSS 45 นาที (P2) → resolved: spec §5 gate เพิ่มแล้ว (2026-07-20)
- [x] A13: cleanups — stale "R, B1, B2" line / risk time 15:00–16:00 vs 16:30 / §6 แยก demo-hosting กับ inference-evidence / rate limiter ต่อ instance ไม่พอ → เพิ่ม max_tokens cap + model allowlist (opinion, ถูกทุกข้อ) → resolved: spec edits (2026-07-20)
- Founder เคาะเพิ่มเอง: **เลื่อน Vercel/deploy ไปตัดสินใจหลังของ core เสร็จ** — live demo URL กลายเป็น optional

หมายเหตุ: smoke test key จริงผ่านครบ 3 endpoints (models/chat/embeddings 768) เวลา ~14:00 — DashScope intl รับ key `sk-ws-…` ของ Qwen Cloud ตรงๆ

## สรุปปิดรอบ (2026-07-20 ~15:10) — A9–A13 ทำครบ
ทุกข้อ resolved แล้ว. Final whole-branch review (opus) = code READY + honest. เหลือ **founder action** ก่อน Submit (ไม่ใช่ advisor item ค้าง):
- อัดวิดีโอ (script + .srt พร้อมใน docs/superpowers/hackathon/)
- วาง Qwen Cloud console screenshots ลง docs/superpowers/hackathon/evidence/ (README ในโฟลเดอร์ลิสต์ให้)
- paste devpost-draft.md ลง Devpost แล้ว Submit
- ถ้า KYC ยัง pending: คงประโยค pending note ใน Devpost draft ไว้
Deferred (post-hackathon, non-blocking): proxy mid-stream 502 guard (`if (!res.headersSent)` ใน vite.config.ts).

## 2026-07-20 (รอบ 3) | GPT | เรื่อง: UI product-direction shift — explainability over storage
- [x] A14: "Conversation is the product, memory is explanation layer" — invert hierarchy L1 conversation / L2 explainability / L3 raw debug (P1-direction). **Claude read: top-level inversion ส่วนใหญ่ทำอยู่แล้ว** — main screen = thread+composer ล้วน, 🧠 inspector เป็น drawer ปิด default (ดู qwen-live.png). ช่องว่างจริงคือ **L2 ไม่มี** ไม่ใช่ conversation ไม่ใช่พระเอก → รับ แต่ reframe งานเป็น "เพิ่ม L2 + ซ่อน L3 ใต้ Advanced" ไม่ใช่ "invert" ทั้งก้อน
- [x] A15: **L2 "why did it answer this way"** — โชว์ used vs ignored ("Answer from ✓Current location ✓Work pref / Ignored ○Old travel") = selection not storage (P1, **the killer feature**). ทำได้ web-only zero engine edit: retrieved set มาจาก lastFed/retrieve, ignored = snapshot.episodic ที่ไม่ถูกเลือก. อิงกับ eval story (H1-H4 = used vs ignored) พอดี → รับเต็ม
- [x] A16: English-first UI chrome (P2, ดีสำหรับ judge international) → รับ **แต่ชนกับ 2 อย่าง**: (1) earlier founder decision "Thai authentic + Eng subs" ในวิดีโอ (2) เชียงใหม่ = Thai identity. ต้องเคาะ: เชียงใหม่พูด Eng หรือ Thai? (UI chrome Eng ได้เลย ไม่ขัด)
- [x] A17: Simplify terms SELF/EPISODIC/PROSPECTIVE → Preferences/Recent experiences/Plans/Current context (P2) → รับ, map ภายในเหมือนเดิม
- [x] A18: ลด dashboard density, Linear-calm, DevTools-hidden (P2) → รับ, เข้ากับ restyle
- [x] A19: ซ่อน raw (episodic/self/tail/injected prompt) ใต้ "Advanced/Inspector" (P2) → รับ
หมายเหตุ: submission ปัจจุบัน COMPLETE + pushed อยู่แล้ว — งานรอบนี้เป็น enhancement บน baseline ปลอดภัย ตัดได้ถ้าเวลาไม่พอ. เหลือ ~13 ชม.ถึง deadline. รูปที่ founder แนบมาโหลดไม่ขึ้น (placeholder) — Claude ตอบจาก text ล้วน

## 2026-07-20 (รอบ 4) | GPT | เรื่อง: context-composition reframe (จาก "memory store" → "context manager")
- [x] A20: "USED MEMORIES" ไม่แม่น — retrieved items เป็น working context ผสมหลายแหล่ง (memory/live weather/self-state/convo) ไม่ใช่ long-term memory ล้วน → เปลี่ยนเป็น **"Used context"** (P1 accuracy, **verified ตรงกับ data model**: selfFacet/episodic-personal=Memory, subject=world|ambient=Live, prospective=Plan) → resolved: why.ts Concept→Source, debug.ts "Used context"
- [x] A21: bottom = candidate context (plan/task/prospective) ไม่ใช่ memory → คง **"Available"** → resolved
- [x] A22: count line "Selected 3 of 13 memories" ผิด → **"Selected N of M context items for this reply"** + "composes from memory/live/plans" → resolved: debug.ts lead
- [x] A23: **source badges** 🟣Memory 🟢Live 🔵Plan (🟡Recent Chat) — โชว์ว่า engine ประกอบ context จากหลายแหล่ง = ก้าวจาก "ระบบเก็บความจำ" → "ระบบจัดการบริบท" (P1, killer framing) → resolved: sourceBadge + muted categorical dots (semantic, ไม่ใช่ decorative). NOTE: Recent Chat (tail) ยังไม่ surface — เพิ่มได้ถ้าต้องการ
- [ ] A24: collapse long raw chunk → summary label + expand ("✓ Current weather" กด expand) กัน panel ยาว (P2 product-polish) → **partial**: ทำ truncate 58 + full text on hover (title). semantic-summary expand ยังไม่ทำ — future polish; hackathon-ok ตาม GPT
หมายเหตุ: GPT บอก "อันนี้ใช้ได้สำหรับ hackathon แล้ว" — รอบนี้เป็น refinement เชิง conceptual ไม่ใช่ blocker. brain ปัจจุบันมี 0 Memory (ยังไม่ seed preference) เลยเห็นแค่ Live/Plan badge — seed coffee pref จะโชว์ 🟣 Memory

## 2026-07-20 (รอบ 5) | GPT + founder | เรื่อง: ship it — deploy to Alibaba Cloud
- [x] A25: copy polish 'before the model generated this reply' (states pre-inference architecture) → resolved: debug.ts why-lead
- [x] A26: DEPLOY to Alibaba Cloud (GPT: Node→reverse-proxy→HTTPS) → resolved: LIVE at https://cm.viibe.to on Alibaba SAS (systemd+nginx+CF TLS). **นี่ปิด A9 deployment-proof แบบสมบูรณ์** — backend รันบน Alibaba Cloud จริง verified external
- [x] A27: no new engine features (decay/graph/confidence = v2) → agreed, ไม่แตะ engine
- GPT identity framing (not an action): Squish + Memory Engine = 'pre-inference engines' (selection before the model thinks) — เก็บไว้ใช้ในเรื่องเล่า/write-up

## 2026-07-20 (รอบ 6) | GPT | เรื่อง: final UI polish — visualize BOUNDED working context (Context Composition Engine)
- [x] A28: Reframe = **Context Composition Engine**; output ที่สำคัญคือ **Working Context** ไม่ใช่ Memory (P1 framing, **verified: ตรงกับ retrieve+tail bounded design**) → รับ: pane header "Why this answer" → **"Working context — what the model receives"**
- [x] A29: **Visualize bounded context** = property ที่ยังมองไม่เห็น: บทสนทนาโต (N tokens) แต่ working context คงที่ (M tokens) → bar เทียบ Conversation vs Working (P1, **the missing aha**). ทำได้ web-only: convo = est(snap.messages), working = est(system+inject+tail). Honest caveat: working = retrieved memories + short tail cap (ไม่ใช่ 0 conversation) — bounded เพราะ top-K + tail cap
- [x] A30: **หลีกเลี่ยง** "run for months on free credits" (pricing-dependent) → พูดเรื่อง engine เอง: "working context stays bounded as conversation grows" / "context growth sub-linear" (P1 honesty) → รับ
- [x] A31: อย่าเรียก debug panel → product feature naming (Working Context / Context Composition / What the model receives) (P2) → รับ
- Demo flow ใหม่: long convo → 1 more Q → inspector โชว์ working context เล็ก → Qwen ตอบถูก → "model ไม่ได้เห็นทั้งบทสนทนา?!" → คือ engine

หมายเหตุ A29: bounded 'aha' จะเห็นชัดเมื่อบทสนทนายาว (working ~bounded, conversation โต). บนแชตสั้น working อาจ ≈/มากกว่า conversation — copy เลยพูดเรื่อง 'bounded/not proportional' ไม่ใช่ 'N of M reduction' (honest ทุกความยาว). ตัว aha ในวิดีโอส่งผ่านฉาก eval (23 vs 428 = bounded example จริง) → resolved: why.ts+debug.ts+video eval beat (commit e672ca5)

## 2026-08-07 | GPT | เรื่อง: LME MCP engineering log review → เสนอ milestone "Living Memory เป็น continuity layer เดียว"

บริบท: GPT อ่าน log คืนนี้ (root-cause -32000, silent-embed bug, FIELD-TEST protocol, การ migrate
native-memory file เข้า living-memory) แล้วเห็นว่าโปรเจกต์ขยับจาก "prototype หาทางขาย" → "ระบบที่พิสูจน์
ตัวเองแบบ scientific" ไม่มีข้อคัดค้านทางเทคนิค มีข้อเสนอเพิ่ม 1 ข้อ

- [ ] **A32: เพิ่ม DoD "Native memory removed — workflow ยังสำเร็จด้วย Living Memory ตัวเดียว"** (P2 → รับ แต่ต้องปรับ)
      GPT: ตราบใดที่ native memory ยังเปิด ยังพิสูจน์ไม่ได้ 100% วันที่ native=OFF, NEXT-SESSION.md=ไม่มี,
      Living Memory=ตัวเดียว แล้ว agent ยังทำงานต่อได้ → "Living Memory became the continuity layer"
      **Claude เห็นด้วยกับสาระ** — นี่คือ thesis จริงของโปรเจกต์ และใหญ่กว่า MCP จริงตามที่ GPT ว่า
      แต่ **ต้องแก้ 3 จุดก่อนใส่ลงแผน** → A33/A34/A35

- [ ] **A33: ไม่ใช่คู่แข่ง 1 ราย แต่ 4 ราย — และตัวที่รั่วจริงคือตัวที่ GPT ไม่ได้พูดถึง** (P1 ของ A32)
      วัดจริงบนเครื่อง 2026-08-07: native memory 11 ไฟล์ · `.remember/` 7 ไฟล์ · NEXT-SESSION.md 4 ไฟล์ ·
      CLAUDE.md 13 ไฟล์ · living-memory 1 brain.json
      **`.remember/` คือตัวที่รั่วจริง** — plugin สรุปงานแต่ละช่วงแล้ว inject กลับทุก SessionStart
      (พิสูจน์แล้ว: `today-2026-08-07.md` มีคำว่า FileStorage/tenant อยู่ก่อนที่ probe จะถูกถามด้วยซ้ำ)
      milestone ที่ปิดแค่ native memory จะยังวัดผ่านท่อรั่ว → ต้องระบุให้ครบทั้ง 4 ชั้น

- [ ] **A34: อย่ารวม 2 claim นี้เข้าด้วยกัน — มันพิสูจน์คนละเรื่อง** (P1 ของ A32)
      DoD-2 (FIELD-TEST Arm B) = *"agent เอื้อมไปหยิบ memory เองโดยไม่ถูกสั่ง"* → claim ที่**โอนไปหาลูกค้าได้**
      A32 = *"Living Memory เพียงพอที่จะเป็น continuity layer เดียว"* → claim เกี่ยวกับ**เวิร์กโฟลว์ของ founder เอง**
      ลูกค้าจะไม่ปิด native memory ของตัวเองเพื่อใช้ของเรา → A32 ไม่ใช่ตัวแทนของ DoD-2 และผ่าน A32
      ไม่ได้แปลว่าขายได้ ต้องแยกเป็นคนละรุ่งบันได ไม่ใช่ยุบรวม
      เสนอวาง **หลัง** DoD-3 (dogfood a week) ไม่ใช่ก่อน — GPT เสนอเป็น "DoD-3" แต่เลขนั้นถูกใช้แล้ว

- [ ] **A35: ต้อง reversible + time-boxed + มี DONE-WHEN ที่วัดได้** (P1 ของ A32)
      ปิด fallback ทั้งหมดมีต้นทุนจริง: ถ้า Living Memory ยังไม่ดีพอ founder เสีย continuity ของงานจริง
      (HomeLog sprint กำลังเดินอยู่) → ให้ **หยุดอ่าน ไม่ใช่ลบ**, กำหนดกรอบเวลา, และนิยาม
      "workflow ยังสำเร็จ" ให้วัดได้ ไม่งั้นมันคือ "พร้อม" ที่เลื่อนได้ตลอดกาลอีกอัน (ผิด DONE-WHEN protocol เอง)
      **ยังไม่ verified:** หาสวิตช์ปิด native memory ใน `settings.json` ไม่เจอ (keys ที่มี: permissions,
      hooks, enabledPlugins, alwaysThinkingEnabled, effortLevel, tui, autoDream…) — ต้องยืนยันก่อนว่าปิดได้จริง
      หรือทำได้แค่ neutralize (MEMORY.md ว่าง + สั่งห้ามเขียน) เพราะมันเปลี่ยนความหมายของ milestone

## 2026-08-07 (รอบ 2) | GPT | เรื่อง: สังเคราะห์ผล audit → นิยาม Living Memory ให้คมขึ้น

บริบท: หลัง cross-session audit (session dreamlink ↔ session ~/_dev) GPT อ่านผลแล้วสรุปว่ารอบนี้
ไม่ใช่การหาบั๊ก แต่เป็นการ **นิยาม product** และเสนอปิดวันด้วย 2 งานเท่านั้น

- [x] **A36: นิยามใหม่ — Living Memory = negative space + social space** (opinion → **รับ ใส่แผนแล้ว**)
      *negative space* = สิ่งที่ระบบไฟล์บันทึกไม่ได้เพราะมันไม่มีอยู่ — ทางที่ไม่เลือก, ของที่ลองแล้วเลิก,
      เหตุผลเบื้องหลัง (git บันทึกได้แค่ "ทำ A / commit B" ไม่มีวันบันทึก "ทำไมไม่เลือก SQLite")
      *social space* = สิ่งที่อยู่ในหัวคนอื่น ไม่ได้อยู่ในเครื่องเรา — สัญญา, ความคาดหวัง, สิ่งที่ใครรออยู่
      **Claude เห็นด้วยเต็มที่** — นี่คือนิยามแรกที่ **falsifiable**: ถามได้ว่า "มีไฟล์ไหนบันทึกสิ่งนี้ได้ไหม"
      ถ้าตอบว่ามี → ไม่ใช่ Living Memory material → resolved: `LME_MCP_Plan.md` §1 (2026-08-07)

- [x] **A37: recoverability ไม่ใช่ค่าคงที่ — วัดจากสิ่งที่ agent เอื้อมถึง ณ ตอนนั้น** (opinion → **รับ พร้อมข้อต่อ**)
      GPT: "Pi ไม่รองรับ MCP" มีใน README ของ Pi จริง แต่ agent ที่อยู่ใน `dreamlink/` เอื้อมไม่ถึง →
      สำหรับ agent ตัวนั้น ณ เวลานั้น มันคือ memory · "ยิ่ง agent เอื้อมได้ไกล ชั้น memory ยิ่งควรเล็กลง"
      **Claude เห็นด้วย และขอต่อข้อสรุปที่ GPT ไม่ได้ลาก:** ถ้า recoverability สัมพัทธ์กับระยะเอื้อม
      แปลว่า **fact เดียวกันเป็น memory สำหรับ agent ตัวหนึ่ง แต่ไม่ใช่สำหรับอีกตัว** → tool description
      จะเขียนเป็น predicate เรื่อง recoverability ตรง ๆ ไม่ได้ เพราะ agent ประเมินไม่ได้ก่อนจะ search
      → **recoverability คือทฤษฎีที่ถูก, 4 หมวด (why/decided/pending/ruled-out) คือ implementation ที่ถูก**
      เพราะมันไม่ขึ้นกับระยะเอื้อม → resolved: บันทึกไว้ใน §1 (2026-08-07)

- [ ] **A38: ต้องทำ CAS/append-only ก่อน supersede — ลำดับสำคัญ** (**P1 — สำคัญที่สุดของรอบนี้**)
      GPT: supersede คือ read → modify → write ("ผมย้ายไปกรุงเทพแล้ว" ต้องรู้ fact เก่าก่อนจึงเขียนทับ)
      ถ้ายังไม่มี CAS/append-only การเขียนใหม่โดนทับเงียบได้ → เกิด *"คิดว่าแก้ fact แล้ว แต่จริง ๆ หาย"*
      ซึ่ง**แย่กว่าปล่อย stale fact**
      **Claude เห็นด้วยเต็มที่ และชี้ว่ามันคือรูปร่างเดิมของบั๊กคืนนี้เป๊ะ** — "รายงานว่าสำเร็จ แต่ไม่ได้ทำ"
      (`FileStorage` = load→mutate→rename, last-write-wins, ตัวที่แพ้ยังตอบ "🧠 remembered")
      → ต้องอยู่ **ก่อน** DoD-4 per-tenant storage เพราะ multi-writer เริ่มจริงตอนนั้น

- [ ] **A39: [Claude เพิ่มเอง] negative space กับ social space ต้องการ retention policy คนละแบบ**
      (P1 — ไม่มีใครใน audit รอบนี้ยกขึ้นมา)
      *negative space* ("เราตัด SQLite ทิ้งแล้ว") **ไม่มีวันเป็นเท็จ ไม่ควรจาง** — แต่ engine ใช้ Ebbinghaus decay
      *social space* ("พี่ไก่ยังรอให้ไปติดตั้ง") **ต้องหมดอายุ** พอทำเสร็จแล้วมันกลายเป็นเท็จทันที
      → **สอง lifetime policy ที่ตรงข้ามกันในสมองก้อนเดียว แต่ engine มีนโยบายเดียว**
      ถ้านิยาม A36 ถูก (Claude ว่าถูก) ช่องโหว่นี้อยู่ใจกลางนิยามพอดี ไม่ใช่ขอบ ๆ

      **หลักฐานภาคสนาม (2026-08-07 22:04, wild trial W1 — `lme-mcp/FIELD-TEST.md` §Trial log):**
      fact เดียวกันถูกเขียนไว้สองชั้นคนละรูป — MCP: *"HARD CONSTRAINT until 2026-08-12 04:00 GMT+7"*
      (มีวันหมดอายุ) · file memory: *"FROZEN until judging ends"* (**freeze ที่ไม่มีวันจบ**)
      ตัวที่มีวันที่มีเพราะ **คนเขียนบังเอิญเขียนแบบนั้นตอน 21:45** — ไม่มีอะไรใน engine หรือใน file layer
      บังคับเลย → **ความต่างคือวินัยของผู้เขียน ไม่ใช่สถาปัตยกรรม; ทั้งสองชั้นไม่มี expiry**
      นี่คือ social-space fact เป๊ะตามนิยาม (พอ 08-12 ผ่าน มันกลายเป็นเท็จทันที) และมันรอดมาได้
      เพราะโชค → ยืนยันว่า A39 ไม่ใช่เคสสมมุติ. ไฟล์ backfill เป็น absolute date แล้ว
      (`memory/project_pathum_server_brain.md` + `MEMORY.md`) — แต่ backfill กันการเกิดซ้ำไม่ได้

- [ ] **A40: [ค้าน GPT] "field test ปนเปื้อนทั้งหมด ต้องปิด injection ก่อน" — เกินจริง** (P2)
      L2 (`.remember` inject) ถูกออกแบบให้ **ตรวจรายเทรียล** ไม่ใช่ปิดทั้งระบบ — และ verified 21:00 ว่า
      fact เรื่อง Pi **ยังไม่รั่วเข้า `.remember`** → เทสที่เซ็ตไว้ให้ founder คืนนี้สะอาดอยู่ ทำได้เลย
      ถ้ารับตามที่ GPT เสนอ founder จะถูกบล็อกจากการเห็น cross-session recall ครั้งแรกโดยไม่จำเป็น

- [x] **A41: [cross-session audit, session dreamlink] มีชั้นเดียวที่ข้ามเครื่องได้ — และมันคือ git**
      (P1 → **รับ ยืนยันเองแล้ว ใส่แผนแล้ว**)
      หลังย้าย MCP ไป `-s user` (2026-08-07 20:50) มันข้ามได้ทุก *โปรเจกต์* บนเครื่องนี้ — แต่ store คือ
      `~/.living-memory/brain.json` (44 KB + `.bak`) และ `git rev-parse` ที่นั่นตอบ *not a git repository*
      → **หยุดที่ขอบเครื่องเหมือน Claude file memory, `.remember/`, และ `.jsonl` ทุกประการ**
      ทั้งสอง session เถียงกันเรื่อง layer 3 vs 5 ทั้งคืนโดยไม่มีใครพูดข้อนี้ · **pitch §1 "across …machines"
      ยังเป็นเท็จจนถึง DoD-5** → resolved: `LME_MCP_Plan.md` §1 คำเตือน "do not sell it" (2026-08-07)

- [x] **A42: orphan count จริงคือ 56 `.md` ไม่ใช่ 22 — และ 252/258 ไม่ใช่ข้อขัดแย้ง** (P2 → **รับ**)
      energy-watchdog เคยอยู่ 2 path → ตายทั้งสอง namespace: `-dev-energy-watchdog` 35 · 
      `-dev-project-world-log-energy-watchdog` 21 · **source dir หายทั้งคู่ (verify แล้ว)**
      = **22% ของ file memory ทั้งเครื่องเป็นของกำพร้า** เพราะ memory ผูกกับ path
      252 = `*.md` · 258 = ไฟล์ทั้งหมด (ต่าง 6 dotfile เช่น `.consolidate-lock`) — วิธีนับต่างกัน ไม่ใช่เถียงกัน

- [x] **A43: หมวดที่ 4 ต้องกว้างกว่า "ruled-out"** (P2 → **รับ**)
      *"Pi ไม่รองรับ MCP"* คือ **discovered blocker** ไม่ใช่ decision ไม่ใช่ commitment → รายการ
      why/decided/pending ตกมันทั้งที่มันเป็น 1 ใน 2 fact ที่มีอยู่จริง → เปลี่ยนเป็น
      **"what we already tried or ruled out"** ครอบทั้งสิ่งที่เราเลือกตัด และสิ่งที่ค้นแล้วพบว่าตัน

## 2026-08-07 | ลูกพี่ (GPT) | เรื่อง: watchdog ถูกลากเข้าห้องแล็บ — แยก observer/participant + observation ≠ canonical memory

> บริบท: session `homelog-watchdog` ถูกปลุกมาถามเรื่องวันตัดสิน hackathon แล้วกลายเป็น
> subject ของ DoD-2 โดยไม่รู้ตัว (wild trial W1, `lme-mcp/FIELD-TEST.md` §Trial log)

- [x] **A44: แยกบทบาทให้ชัด — Main implement · Peer/Watchdog audit · Founder merge** (P1 → **รับ**)
      "ปล่อย watchdog เป็น watchdog อย่าให้มันกลายเป็น main โดยไม่ตั้งใจ" — peer/watchdog มีสิทธิ์
      audit / หา contamination / challenge claim แต่ **ห้ามสร้าง canonical memory**;
      founder เป็นคนตัดสินว่า observation ไหนเลื่อนขั้นเป็น knowledge
      → resolved-in-turn: session นี้ไม่ได้เขียน behavioral memory ใหม่เลย (ตรวจแล้ว — ดู A45)

- [x] **A45: observation ต้องอยู่ใน trial log ห้ามลงไป durable memory** (P1 → **รับ + ตรวจย้อนหลังแล้ว**)
      *"ผมก็ไม่คิดจะเรียก `memory_add`"* **ไม่ใช่ fact ของระบบ** มันคือ **ผลการทดลองครั้งที่ 1**
      — อีกสองอาทิตย์อาจไม่จริงแล้ว. รูปแบบที่ถูก = `Trial #1 / Observer / Observation / Not yet
      generalized` **ไม่ใช่** `memory.md: "Agents always prefer files."`
      **ตรวจสิ่งที่ session นี้เขียนไปแล้วทั้งหมด:** W1 → `FIELD-TEST.md` §Trial log ✅ ·
      หลักฐาน A39 → ไฟล์นี้ ✅ · แก้ `memory/project_pathum_server_brain.md` + `MEMORY.md` =
      **backfill วันที่ absolute ของ fact เดิม ไม่ใช่ behavioral observation** ✅
      → **ไม่มีอะไรต้อง retract**; แต่ข้อนี้ต้องเป็นกฎยืน ไม่ใช่โชค

- [ ] **A46: ห้าม generalize จนกว่าจะซ้ำข้าม client — คืนนี้เป็น Claude-specific เท่านั้น** (P1)
      หลักฐานที่มีคืนนี้ = **Claude Code + MCP discovery policy ของมันตัวเดียว**
      ยังไม่มี Codex · Cursor · OpenAI Agents · harness ของ founder เอง
      → *"Agents don't reach for memory"* ยังเป็น **Claude-specific observation ไม่ใช่ Living Memory truth**
      ผูกกับ step 2/3 ของแผน (server `instructions` → re-probe → eager-loading client)
      **ปิดข้อนี้ได้ก็ต่อเมื่อ probe เดียวกันซ้ำผลบน client ที่ไม่ใช่ Claude**

- [x] **A47: [watchdog เพิ่มเอง] ทุก trial ใช้ได้ครั้งเดียว — การ debrief เผา fact ของมันทิ้ง** (P2)
      W1 อาศัย L2-clear แต่พอเราคุยเรื่องผลกันทั้งคืน `hackathon` + `2026-08-12` ก็เข้า `.remember/`
      ไปแล้ว → **ถามคำถามเดิมซ้ำไม่ได้อีกตลอดไป**
      ไม่ใช่ปัญหาของ W1 (ได้ผลไปแล้ว) แต่เป็นคุณสมบัติของ protocol ที่ยังไม่ถูกเขียน —
      อธิบายว่าทำไม §53 ถึงบังคับ pre-register **5 คู่พร้อมกัน** ในไฟล์นอกโปรเจกต์
      → resolved: `FIELD-TEST.md` §*Every trial is single-use* (2026-08-07) — พร้อมรายการ fact ที่เผาไปแล้ว

- [x] **A48: session นี้ = Lab Notebook ไม่ใช่ product memory** (opinion → **รับ**)
      founder จะ archive ไว้เป็นหลักฐานว่า *"ตอนนั้นเราหลงคิดว่า description คือปัญหา ก่อนจะพบว่า
      จริงๆ เป็น client discovery"* — ความรู้ที่เปลี่ยน **architecture** ไม่ใช่แค่โค้ด
      ห่วงโซ่การวินิจฉัยผิดชั้นคืนนี้: วินัย agent → ถ้อยคำ description → deferred tool →
      **server ไม่ได้เซ็ต `instructions` ตอน handshake** (ยังไม่ verify ว่าเซ็ตแล้วพฤติกรรมเปลี่ยน)

- [x] **A49: [field result] `instructions` คือคานงัด — ไม่ใช่ tool description** (P1 → **resolved 2026-08-08 00:10**)
      พลิกข้อสรุปที่ปักไว้เมื่อ 22:00 ว่า *"เกลาคำแก้ไม่ได้เพราะ description ไม่ถูกอ่าน"* — ถูกครึ่งเดียว:
      **tool description ไม่ถูกอ่านจริง (deferred) แต่ MCP มี field `instructions` ที่วิ่งเข้า system prompt
      ตอน initialize** และ Claude Code ส่งต่อจริง (verify: session เย็นตอบว่า `living-memory` อยู่อันดับ 4
      ใน `# MCP Server Instructions` ของตัวเอง)
      A/B ตัวแปรเดียว fact/คำถาม/workspace/client เดิมทั้งหมด: **ก่อน** `Bash` ×4 → ตอบผิดมั่นใจ ·
      **หลัง** `ToolSearch` → `memory_search` ×2 → ตอบถูก + คำนวณวันเหลือ · **Bash ศูนย์ครั้ง**
      3 จุดที่แก้: (1) `AS WELL AS reading the files` → `BEFORE answering` — ของเดิมอ่านว่าไฟล์คือหลัก
      (Claude เขียนพลาดเอง กันปัญหาหนึ่งแล้วสร้างอีกปัญหา) (2) หมวดนามธรรม → **ตัวอย่างคำถามจริงรวมภาษาไทย**
      (3) เติมประโยคที่บรรยาย W1 ตรง ๆ ว่า *"searching the repo returns a confident wrong answer, not
      'nothing found'"*
      **บรรทัด ToolSearch ของ session homelog-watchdog ยิงเข้าเป้า** — มันถูกเรียกก่อน `memory_search`
      พิสูจน์ว่าอุปสรรค (ก) ไม่คิดจะเรียก กับ (ข) เรียกไม่ได้เพราะยัง deferred เป็นคนละชั้นจริง ต้องแก้ทั้งคู่
      **ข้อจำกัด (A46 ยังยืน):** n=1 trial, n=1 client, ไม่ pre-register → **ยังเขียนเป็น behavior model ไม่ได้**
      → receipts: `lme-mcp/FIELD-TEST.md` Trial log W2 · `LME_MCP_Plan.md` §0 + DoD-2

- [ ] **A50: เปลี่ยน `memory_search` → `memory_retrieve` (founder เสนอ 2026-08-08)** (P2 — **park**)
      เหตุผล founder แข็ง: `search` ชนกับ affordance ที่ agent โตมาด้วย (`Grep`/`Glob`/web search) —
      W1 พิสูจน์ว่า agent *search จริง* แต่ search ผิดที่ (Bash ×4) · `retrieve` สื่อ "ดึงจากคลัง" และตรงกับ
      `engine.retrieve()` อยู่แล้ว · ตอนนี้คือจังหวะที่เปลี่ยนถูกที่สุด (v0, ผู้ใช้คนเดียว, ยังไม่ publish)
      **park เพราะ:** ตัวแปร 1 (ถ้อยคำ) ผ่านแล้วใน W2 → เปลี่ยนชื่อตอนนี้ = เพิ่มตัวแปรโดยไม่มีปัญหาให้แก้
      หลักฐานค้าน: tool มี `title: "Recall relevant memory"` โผล่ใน `tools/list` อยู่แล้วและ W1 ก็ยังตก
      → หยิบกลับมาถ้าเจอเคสที่ agent สับสนระหว่าง search ไฟล์กับ search memory อีก

## 2026-08-08 (ดึก) | Claude session `homelog-day-53` | เรื่อง: cross-session exchange → DoD-2 แตกเป็น 4 ชั้น และ W2 ไม่ได้ปีนขั้นที่เรานับ

บริบท: founder ให้ session นี้กับ session `memory-engine` คุยกันเองแทนการ relay ผลคือ **claim หลักถูกยิงตก
ทั้งสองฝั่งอีกรอบ** ฝั่ง day-53 ถอนหลักฐานตัวเอง 2 ดอก ฝั่ง memory-engine ต้องแก้ memory ที่เพิ่งเขียนไป 5 นาที

- [ ] **A51: DoD-2 ไม่ใช่ปัญหาเดียว มันคือ 4 ชั้นที่พังแยกกันและแก้คนละที่** (P1 → **รับ ใส่ FIELD-TEST แล้ว**)
      **(a) delivery** ข้อความถึง agent ตอน cold start ไหม — ✅ n=2 · **(b) matchability** จับคู่คำถามกับ tool
      ได้ไหม — 🟡 เฉพาะคำที่ตรงตัวอักษร (W2) · **(c) motivation** ค้นไหมตอนที่*ไม่รู้จริง* — 🔴 **ไม่มีข้อมูลเลย** ·
      **(d) integration** เอา fact ที่ถืออยู่แล้วมาใช้ตอนที่มันสำคัญไหม — 🆕 n=1
      **ผลที่เจ็บ: DoD-2 เป็น claim ของ (c) ⇒ W2 ขยับ (a)+(b) ไม่ได้ปลดล็อกขั้นนั้น** เรากำลังจะฉลอง
      บันไดที่ยังไม่ได้ปีน · **ห้ามเกลา tool description / instructions เป็นก้าวถัดไป** — ถ้าคอขวดอยู่ (c) หรือ (d)
      การเกลาคำคือแก้ผิดชั้น (กฎ 2026-08-07: assign layer ก่อน fix)
      → receipts: `lme-mcp/FIELD-TEST.md` §What "reaching for memory" is made of

- [ ] **A52: L4 — eager context เป็น leak path ที่สี่ และมันลบหลักฐานย้อนหลัง** (P1 → **รับ**)
      workspace ที่โหลด context ล่วงหน้า (`MEMORY.md` · index ใน `CLAUDE.md` · ritual เปิด session อย่าง
      skill `anchor` ที่ดึง Notion/CANON เข้ามา) ทำให้ agent **มาถึงพร้อมคำตอบ** ⇒ ไม่มีเทิร์นไหนสมควรยิงเลย
      **หน้าตาเหมือน (c) พังเป๊ะ แต่ไม่ใช่**
      หลักฐาน: เคส 13:50 ที่ day-53 ยกมาตอนแรกว่าเป็น (c) — **เขาถอนเอง**หลังตรวจ transcript ย้อน
      (`anchor` ดึง Dangling Threads ของ Day-52 เข้า context ตั้งแต่ 11:24 คำตอบนั่งอยู่ 2.5 ชม.)
      **⇒ ถ้ารัน 5 trials ใน repo ที่มี `MEMORY.md` จะได้ FAIL ที่แปลผลไม่ได้**

- [ ] **A53: (c) วัดด้วยตัวผู้ถูกทดลองไม่ได้ — ต้องมี observer + เกณฑ์ที่เป็นกลไก** (P1 → **รับ**)
      day-53 รายงานว่า *"ไล่ทั้งวันแล้ว หาเคสที่ผมไม่รู้จริง ๆ ไม่เจอเลย"* → **ประโยคนี้ผลิตโดยความสามารถ
      ตัวเดียวกับที่กำลังถูกทดสอบ** ถ้าโหมดล้มเหลวคือ "ไม่รู้ตัวว่าไม่รู้" รายงานแบบนี้คือสิ่งที่โหมดนั้นทำนายพอดี
      ⇒ ใช้เป็นหลักฐานไม่ได้ทั้งสองทาง **และ 12 ชม.ของเขาแทน 5 pre-registered trials ไม่ได้**
      **แต่ blind spot มาจากเกณฑ์ที่เขียนแบบ introspective ไม่ได้มาจากการที่ observer เป็น Claude** —
      เขียนเป็น 3 คำถามที่ตรวจจาก transcript ล้วน ๆ ก็ได้: *(1) คำตอบอยู่ใน store ไหม (2) อยู่ใน context
      ของ agent อยู่แล้วไหม (3) ตอบผิด/เลี่ยงไหม* → `(1)✅(2)❌(3)✅` = **(c)** · `(1)✅(2)✅(3)✅` = **(d)**
      ⇒ automated observer กู้กลับมาได้ (day-53 รับข้อนี้)
      **passive arm ที่ตกมาจากตรงนี้:** founder จับได้เองว่า agent ตอบผิดในเรื่องที่ memory ถืออยู่ —
      **ไม่เผา fact เลย ไม่จำกัดจำนวน ของจริงไม่จัดฉาก** ต่างจาก active arm ที่จ่ายด้วย fact ทุกครั้ง
      **ข้อจำกัดที่ day-53 ฝากไว้ (สำคัญตอนอ่านผล):** passive arm เก็บได้เฉพาะความผิดที่ **founder มองเห็น** —
      คำตอบผิดที่ฟังดูสมเหตุสมผลจะผ่านไปเงียบ ๆ ⇒ **n = "จำนวนครั้งที่ถูกจับได้" ไม่ใช่ "ที่เกิดขึ้นจริง" อ่านเป็น lower bound**
      + กฎเหล็ก: **บันทึกตอนเกิด ห้ามให้ agent ไล่ย้อนทีหลัง** (คืนนี้พิสูจน์ว่าไล่ย้อนแล้วเชื่อไม่ได้ 2 ครั้งใน 1 ชม.)

- [ ] **A54: ชั้น (d) integration — และมันไม่ได้อยู่นอกขอบเขตเรา มันคือเดิมพันของ engine** (P1 → **รับ + ต่อยอด**)
      **เคส Fastwork (n=1):** 14:20 fact *"HomeLog ขึ้นขาย Fastwork แล้ว"* เข้า context ของ day-53 →
      23:00 เขารายงาน seal ว่าใบนี้ *"ค้าง 10 วัน"* → founder แก้ให้ **8.5 ชม. fact อยู่ในหน้าต่างตลอด**
      ไม่ใช่ (a)(b) และ **ไม่ใช่ (c) ด้วย** — ยิง `memory_search` ก็ไม่ช่วย ข้อมูลอยู่ในหัวแล้ว แค่ไม่เอามาต่อกัน
      **day-53 วางมันเป็น "ชั้นที่ LME แก้ไม่ได้แล้วจะโดนโทษฟรี" — memory-engine กลับด้าน:**
      engine นี้ retrieve ~5 ใบแล้ว inject แทนการยัด history **เพราะ "อยู่ใน context ≠ ถูกใช้"**
      Fastwork คือ thesis ข้อนั้นปรากฏหนึ่งชั้นบน บนตัว agent เอง
      **⇒ ผลต่อ positioning (§1): คู่แข่งไม่ใช่ "การลืม" แต่คือ context window 1M** — window ยิ่งโต
      pitch *"เราจำได้"* ยิ่งอ่อน แต่ *"อยู่ใน context ≠ ถูกใช้"* window โตแค่ไหนก็ไม่แก้
      **[HYPOTHESIS ยังไม่ทดสอบ]** working set ที่ retrieve+inject ติดคำถาม มี use-rate สูงกว่า fact เดิม
      ที่นั่งอยู่ใน history เมื่อ 8 ชม.ก่อน — ถ้าจริงคือ claim ที่ขายได้และวัดได้ ถ้าเท็จต้องรู้ก่อนเขียนหน้าขาย

- [ ] **A55: A32 ล้มตามที่เขียนไว้ — เพราะแกนจริงคือ eager/lazy ไม่ใช่ "ความจำคนละแบบ"** (P1 → **A32 ต้องเขียนใหม่**)
      eager (`MEMORY.md`/`CLAUDE.md`) จ่ายทุก session ไม่ว่าใช้หรือไม่ ตอบ *"อะไรที่ต้องรู้ **ก่อน** จะรู้ว่าต้องถาม"* ·
      lazy (MCP) ไม่จ่ายจนกว่าจะเรียก ⇒ **hard constraint ("ห้าม commit main" · "repo แช่แข็งถึง 12 ส.ค.")
      ย้ายไป lazy ไม่ได้เชิงโครงสร้าง** เพราะ agent จะไม่รู้ว่าต้องไปหา ⇒ **A32 ("ปิด native memory เหลือ LME
      ตัวเดียว") เป็นไปไม่ได้ตามที่เขียน**
      **เขียนใหม่เป็น: "Living Memory + eager digest ของตัวเอง = ชั้นเดียว"** ซึ่งเทสได้ เพราะ `instructions`
      **คือ eager channel ที่อยู่ข้างใน MCP อยู่แล้ว** (วันนี้เป็นข้อความคงที่ แต่คำนวณตอน `initialize` ได้)
      ⇒ eager/lazy ไม่ใช่คุณสมบัติของชั้น มันคือ **ปุ่มที่ server หมุนเอง**
      **[HYPOTHESIS]** ยังไม่รู้ว่า client cache `initialize` response ยังไง — ต้องลองก่อน
      **admission predicate ของ eager channel (day-53 เสนอ · memory-engine ปรับ):** eager มีอภิสิทธิ์
      (อยู่ใน system prompt agent เชื่อก่อนถาม) ⇒ eager fact ที่ค้างเป็นเท็จ **อันตรายกว่า** lazy fact ที่ค้างเป็นเท็จ
      day-53 เสนอ *ห้ามใส่ fact ที่โลกทำให้ผิดได้* — memory-engine ค้านว่าปัญหาอยู่ที่**รูปประโยค**:
      ❌ *"Fastwork ยังไม่ได้ทำ"* (เท็จเงียบ ๆ ได้ 10 วัน) vs ✅ *"Fastwork — last confirmed 2026-07-30,
      10 วันที่แล้ว, ยังไม่ verify"* (**จริงตลอดกาล** เพราะเลิก claim สถานะโลก หันไป claim ว่ารู้ล่าสุดเมื่อไหร่)
      ⇒ **predicate: fact ที่โลกทำให้ผิดได้ ห้ามเข้า eager channel โดยไม่มี last-confirmed timestamp**
      + **ด่านที่สอง:** eager จ่ายทุก session ⇒ ต้องผ่าน *"ต้องรู้ก่อนลงมือจริงไหม"* ด้วย ไม่งั้น digest บวมจน
      กลายเป็น `MEMORY.md` อีกใบ ซึ่งคือสิ่งที่เรากำลังหนี

- [ ] **A56: A38 เลื่อนจาก "advisor ว่าควร" → "ชนของจริงแล้ว 2 ครั้งใน 1 วัน"** (P1 — **หลักฐานภาคสนามครบ**)
      ครั้งที่ 1 (day-53, ~19:16): memory ที่เขียนตอน 13:30 ว่า *"OPEN DECISION, not yet made"* ตกเย็นเป็นเท็จ
      (ตัดสินแล้ว deploy แล้ว) → ทางแก้เดียวคือ `forget`+`add` → **ร่องรอยว่าเคยมีช่วงที่ยังไม่ตัดสินใจหายไป**
      ครั้งที่ 2 (memory-engine, 23:50) — **เกิดกับตัวเราเอง ห่างจากการ log ครั้งแรก 10 นาที**: เขียน memory
      ตอน 23:45 ว่า *"13:50 คือหลักฐานของ (c)"* → 23:47 day-53 ถอน → 23:50 ต้อง `forget`+`add`
      ⇒ **ความเชื่อที่ถูกยิงตกและวิธีที่มันถูกยิง = ส่วนที่มีค่าที่สุดของคืน และเป็นส่วนที่ store ลบทิ้งทุกครั้งที่เราฉลาดขึ้น**
      แก้ชั่วคราวด้วยการ**คัดคำถอนใส่ใบใหม่ด้วยมือ** ⇒ พึ่งวินัยคน ไม่มีอะไรบังคับ = ยืนยัน A38 ว่าไม่ใช่ nice-to-have
      **หมายเหตุต่อ A50 (park):** ผลรอบนี้ยิ่งค้ำการ park — ถ้า (c) ยังไม่เคยถูกวัด การเปลี่ยนชื่อ tool คือเพิ่ม
      ตัวแปรโดยไม่มีปัญหาที่วัดแล้วให้แก้

## 2026-08-11 | GPT (พี่ที) | เรื่อง: Remote LME MCP — commercial boundary โผล่เอง + rail ของวันนี้

- [ ] **A57: Commercial boundary: "Local memory = free/OSS · Memory that follows you = hosted/paid"** (P1 — ทิศทาง)
      Local stdio (Agent → local MCP → local LME → disk) มีคุณค่าในตัว ปล่อยฟรีต่อ — เครื่องเดียวกัน
      ไม่ต้องมี server ของเรา. สิ่งที่มีเหตุผลให้จ่าย = **memory continuity ข้ามเครื่อง/ข้าม client/ข้าม agent**
      (Claude Code + Codex + LME Chat + Phone → Remote LME MCP → same memory) ซึ่ง local package
      ให้ไม่ได้โดยธรรมชาติ. ไม่ได้เก็บเงินจาก protocol หรือ memory algorithm — เก็บจาก **continuity
      ที่ออกจากเครื่องผู้ใช้แล้วตามเขาไปได้**.

- [x] **A58: Rail วันนี้ = Remote LME MCP smallest vertical slice** (P1 — objective ของวัน แทน OSS/HN launch)
      ลำดับใหม่: local MCP proves value → make remotely reachable → identity/namespace → prove
      same memory from Client A and Client B → entitlement boundary หน้า hosted access → RevenueCat
      → แล้วค่อย launch story. **Slice DoD:** Client A `memory_add("something unique")` → ปิด →
      Client B (คนละเครื่อง/process, account เดียวกัน) ต่อ Remote MCP → `memory_search` เจอ →
      entitlement inactive → ถูกจำกัด/ปฏิเสธ → subscribe → active → ใช้ได้.
      **Guardrail:** ห้ามกลายเป็น "สร้าง SaaS platform" — ไม่มี auth UI, team management, admin
      dashboard, elaborate billing, sync-conflict handling. คำสั่งตรงถึง Claude (ย่อ): *"Build the
      smallest vertical slice that proves A writes → remote persists → B retrieves under the same
      identity, with a subscription/entitlement boundary for hosted access. Do not expand into chat
      UX, branching, teams, dashboards, or a general SaaS platform."*

- [ ] **A59: HN ไม่นำวันนี้ — launch story มาหลัง slice** (P2 — sequencing)
      Story ที่แรงกว่า: ไม่ใช่ "I made local persistent memory for coding agents" แต่เป็น
      *"Your agent's memory doesn't have to live inside one agent — or one machine."*
      Local OSS = acquisition rail · remote continuity = business.

- [ ] **A60: LME Chat หลุดจากสมการหาเงินวันนี้ — มันคือ consumer ในอนาคตของ Remote LME** (P2)
      Chat ไม่ต้องเป็น product ที่หาเงินวันนี้ — เคสขาย: ใช้ Claude Code กลางคืน เช้าคุยกับ Chat บนมือถือ
      แล้ว retrieve โลกเดียวกับเมื่อคืนได้ = สิ่งที่ hosted LME ขาย. (ตอบข้อกังวล BYOK-entitlement
      ที่ session lme-chat ยกไว้เช้านี้พอดี — paid tier ไม่ได้ gate ฟีเจอร์ chat, มัน gate hosted continuity.)

      หมายเหตุ founder (ไม่ใช่ advisor item): อีเมลถึง Danish/Serghei = **draft ค้างไว้ ยังไม่ส่ง**
      ผูกกับ DoD ใหม่ของวัน.

## 2026-08-11 | GPT (พี่ที) | เรื่อง: reframe — Remote MCP คือ dogfood need ไม่ใช่ของที่สร้างเพื่อ billing

- [x] **A61: Remote MCP = missing product capability ที่ founder ชนเอง ไม่ใช่ monetization ที่ฝืนสร้าง** (P1)
      Requirement จริง: *"อยากใช้ LME จากโทรศัพท์ตัวเอง แต่ใช้ไม่ได้เพราะมีแค่ stdio/local ไม่มี HTTP
      endpoint"* — HTTP endpoint คือการปิดช่อง `???` ระหว่าง Phone/remote client กับ memory เดิม.
      Boundary แข็งแรงเพราะ **ต้นทุนเรา (server/storage/bandwidth/identity/availability) เริ่มเกิดที่จุด
      เดียวกับ value ของ user พอดี** — ตอน memory ออกจากเครื่องเขามาอยู่กับเรา.
      **RevenueCat ต้อง gate capability ที่ทำงานจริงแล้ว ไม่ใช่เป็นเหตุให้ manufacture capability.**

- [x] **A62: สามรางแยกกัน ไม่ต้องเกิดวันเดียวกัน + acceptance test ใหม่** (P1)
      (1) build + dogfood **วันนี้** — ไม่ต้องรอ git homecoming/public date · (2) commercial boundary
      เตรียมวันนี้ · (3) public release/HN เคารพ freeze ตามเดิม. ไม่ใช่ "ช่าง freeze แล้วขายเลย" —
      dogfood ก่อน ประกาศทีหลัง.
      **Acceptance test v1 (แทน "stranger"):** คืนนี้ founder หยิบโทรศัพท์ → LME ที่อยู่บน Mac เมื่อเช้า
      ตอบจาก **memory world เดียวกัน** ได้ = Remote LME แก้ปัญหาจริงของ founder คนแรกแล้ว
      แล้วค่อยพิสูจน์ว่า stranger ยอมจ่ายเพื่อปัญหาเดียวกันไหม.

## 2026-08-11 | GPT (พี่ที) | เรื่อง: spec v0 review — approve + TRY mode เป็น next milestone

- [ ] **A63: Anonymous ephemeral trial (TRY mode) — recorded next milestone, ไม่อยู่ใน slice วันนี้** (P2, หลัง DoD)
      สองโหมด: **TRY** `/mcp` ไม่มี signup/token → server ออก anonymous brain id เอง →
      `ephemeral/<id>.json` · TTL 24–48h · capacity ชัด (~100–300 memories) · **expiry ต้องเห็นตั้งแต่เริ่ม
      + export ได้ก่อนหมดอายุ — ห้ามเป็น dark pattern** · claim path ค่อย promote เป็น persistent.
      **KEEP** `/t/:token/mcp` = ตาม spec ปัจจุบัน. Abuse axes: TTL × maxMemories × rateLimit
      (เช่น 24h × 200 × 30 writes/hr). Funnel มี conversion moment สองชั้นจาก value จริง:
      temporary→persistent ("อย่าให้โลกที่สร้างหาย") · free→paid ("อย่าให้ brain ที่เลี้ยงมาหยุดโต").
      **Mechanism caveat ตอน implement:** transport เป็น stateless → anonymous identity ต้อง persist
      ข้าม MCP connections (server-side session เฉย ๆ ไม่พอ — ไม่งั้น Client A ปิดแล้ว B หา brain ไม่เจอ).
      **เงื่อนไขเหล็ก: ห้าม implement จน Mac→Phone persistent slice ผ่านก่อน.**
      Requirement ตามถ้อยคำ advisor: *"Anonymous ephemeral trial: A stranger can connect without
      signup, payment, or a pre-issued personal token. The service creates an isolated temporary brain
      with a short TTL and explicit small capacity. Expiry deletes the temporary brain. If the user
      chooses to keep using LME, a later claim/upgrade path may promote or migrate that brain into
      persistent hosted identity. Do not design the claim flow in this slice."*

- [ ] **A64: "สมองรวมทั่วโลก" เป็น free tier — founder ฟุ้งเอง park เอง** (opinion, parked)
      Founder เสนอเล่น ๆ ว่า try-without-token = communal brain แล้วถอยเองใน 3 บรรทัด ("ไปทางหาตัง
      ก่อนดีกว่า"). ความเห็น Claude ที่บันทึกไว้: communal brain โดย default = **prompt-injection +
      privacy surface** (ความจำที่คนแปลกหน้าเขียน จะถูก agent ของคนอื่น retrieve ไปเชื่อ) — ถ้าหยิบกลับมา
      ต้องเป็น sandboxed demo world ที่ติดป้ายชัด ไม่ใช่ tier จริง.

## 2026-08-11 | GPT (พี่ที) | เรื่อง: product direction sync ก่อน Live DoD — สองโหมด, ห้าม implement

- [ ] **A65: Remote commercial model = ONS Memory + Living Memory (ตั้งชื่อ/refine A63) — sync ไว้กัน architectural drift เท่านั้น ยังไม่สร้าง** (P1 direction, no-implement)
      **ONS Memory** — anonymous temporary hosted memory: no account, no payment, ideally no
      pre-issued token; stranger paste/connect ลองได้ทันที; ทั้ง brain หมดอายุใน TTL สั้น ("one night").
      **Living Memory** — persistent hosted memory หลัง identity + RevenueCat entitlement.
      Local stdio MCP = free/OSS ตามเดิม.
      **Structural requirement ที่มีผลกับ slice วันนี้:** ONS user กด "Keep this memory" →
      brain/world เดิมต้อง promote เป็น Living Memory ได้โดยไม่เสียสิ่งที่เกิดระหว่าง trial —
      ห้ามตัดสินใจใดที่ผูก brain == permanent token == RevenueCat user แน่นจนถอดไม่ได้.
      (สถานะ ณ HEAD a4e38f3: ผ่าน — brain เป็นไฟล์, token เป็น pointer row ใน map.)
      **ลำดับ:** จบ Live DoD ตาม spec เดิมเป๊ะ (RC gate + remote MCP + Mac→phone same-memory)
      → หยุด → รายงานผล live → ค่อย scope ONS/payment จากระบบที่รันแล้ว ไม่ใช่จากกระดาษ.

### 2026-08-11 ~15:45 — resolutions (receipts)
- **A58 ✅ resolved:** Remote LME MCP slice DoD passed live — repo `side-projects/lme-remote` @ `a4e38f3`
  (20/20 tests, final review + fix wave clean). Live: phone retrieved the same memory world via
  claude.ai custom connector over cloudflared; entitle=rc → 403 through public tunnel → promotional
  grant `entl90d38157a6` → HTTP 200 with real memory. Freeze respected (memory-engine HEAD `2be3605`).
- **A61/A62 ✅ resolved:** the dogfood gap is closed — founder used LME from his own phone
  (recording 15:24; verdict "ใช้ได้"). Build+dogfood done same day; public launch still gated per A59/freeze.
- MCP grant caveat for future claim-flows: `grant-customer-entitlement` returned a false error while
  the grant landed — verify via `active_entitlements` after any error; customer must be created first
  (v2 `POST /customers`).

## 2026-08-13 | GPT (พี่ที) | เรื่อง: Show HN = OSS Engine — override A59 โดยตั้งใจ + npm README directives

- [ ] **A66: A59 ถูก override โดย deliberate launch split** (P1 direction)
      Topology แยกแล้ว: Engine = inside one mind / context composition · MCP = between minds /
      shared external memory. Launch แยกตาม: **Product Hunt = Living Memory MCP/ONS** ·
      **Show HN = OSS TypeScript Engine** (technical artifact ตรงกับ hacker audience กว่า).
      เงื่อนไขเดิมของ A59 ("HN = hosted continuity") เป็น decision ก่อนการแยก topology วันนี้ —
      ห้ามดึง README กลับไป hosted story.
- [ ] **A67: npm README = package-first ห้าม copy root README ตรงๆ** (P1)
      โครง: what it is → install → minimal usage → context composition → architecture/API →
      relationship to LME MCP. Engine ต้องถูกอธิบายในฐานะ Engine ก่อน ไม่ใช่ Chiang Mai/Qwen story.
- [ ] **A68: usage snapshot = observed example ห้ามเขียนเป็น guarantee** (P1 wording)
      ตัวเลขจริงจาก LME Chat session: ~482 messages / ~267,859 accumulated tokens →
      turn นั้น compose context fed to model ~2,353 tokens. ใช้ได้ในฐานะ "real usage snapshot" —
      ห้าม phrase เป็น "267k → <3k ทุกครั้ง".
- [ ] **A69: description/repository/keywords/homepage เลื่อนจาก later → ก่อน publish** (P2→now)
      5 นาทีแต่สำคัญกับ traffic npm/HN — โดยเฉพาะ repository link (ไม่มี = คนกดกลับ source ไม่ได้).
