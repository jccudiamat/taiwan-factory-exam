# Taiwan Factory Exam

A Next.js study app for Filipino applicants preparing for Taiwan factory-job assessments. Original educational exercises, not official employer exam papers.

## Run locally

Requires Node.js 20.9+ (built and verified with Node 24).

```sh
npm install
npm run dev
```

Open http://localhost:3000. If that port is in use, Next.js prints the alternative port.

```sh
npm test
npm run typecheck
npm run build
```

The production build is a static export in `out/`. Serve that folder using a static host with directory-index support. For local production preview: `npx serve out`. `next start` does not serve static exports.

## Included

- Daily homepage samples: one question per core topic. Unanswered questions and selections carry over; submitted answers lock until the next Philippine calendar day. Question IDs never repeat within retained daily history. The current pool has 25 samples per topic; exhausted topics wait for newly added questions rather than recycling. Daily answers are separate from completed practice-session statistics. Clearing local data also resets daily history.

- Eleven structured lessons with 51 sections, 102 worked examples, and 838 learning questions at `/learn/`. Each section has teaching, guided practice, independent practice, and a five-question assessment (four correct required). A ten-question final assessment (eight correct required) follows all section passes. Every section is directly accessible; only guided continuation and the final assessment require passing evidence. Lesson progress bars, resume, saved assessment drafts, and new-question retries use separate local progress. These thresholds are educational, not employer passing scores.
- Ohm’s law at `/learn/ohms-law/` has eight detailed sections: quantities, prefixes, current, voltage, resistance, proportions, series/parallel circuits, and power/model limits. Includes 16 worked examples, 160 original questions, direct section access, and the existing assessment/progress flow.
- The desktop navigation rail is always visible; mobile navigation remains expandable. The full independent-resource disclaimer has an X dismissal, remembered for the current tab via versioned sessionStorage with graceful failure. Dismissing it removes the banner row.
- Practice/mock instructions require blank paper and a pen and prohibit calculators, searches, AI, notes, cheat sheets, and outside help. This is a self-directed rule, not a claim of automated proctoring.
- `/preparation/` covers role differences, reported formats, 5S, dexterity, practical tips, alphabet and comparison drills.
- `/preparation/interview/` includes an English introduction framework, honest situation–action–result examples, ten interview practice questions, clarification phrases, and a checklist. Examples are illustrative, not employer scripts.
- `/color-vision/` explains clinical testing and offers 28 photographed Ishihara number/path plates for familiarization. Reference readings appear after all 28 items. No diagnosis, hiring recommendation, or pass/fail classification; responses are not persisted. This custom selection is not an official 28-plate edition. Source attribution, file hashes, embedded source-origin metadata, and the archive README are in `public/images/ishihara/`. The source states no redistribution license: confirm permission before publishing the plate files.

- 125 original questions: 25 per topic (math, English, logic, abstract reasoning, attention to detail).
- Rapid-fire 5/10/15-item practice: 10 seconds per item and an absolute total deadline (15 items = 02:30). First selection locks; correctness and explanations remain hidden until submission or expiry. Missed, skipped, expired, or slow items form a repeat drill until correctly answered under 10 seconds. The total timer continues through navigation; revisiting never resets an item's first-display boundary.
- A 100-item mock in five contiguous sections of 20 items: math, English, logic, abstract reasoning, attention to detail. Absolute 1,200-second (20:00) deadline, 12 seconds per item, and 90/100 practice passing mark, no pause. Section/question navigation is available; answers and solutions appear only after submission or expiry. Browsers retain control of closing and navigation; a leave warning is best-effort and never a browser lock.
- Lesson assessments are timed at 10 seconds per item: five items in 00:50, ten-item finals in 01:40. Lesson teaching, guided practice, and independent learning checks remain untimed.
- Time-to-answer records exposure to each question up to its latest answer, including revisits and time away while that item is current. Results show per-item timing and mocks show section averages. Progress averages individual timed answers rather than session averages. Unanswered items count as incorrect and are excluded from answer-time averages; historical untimed records retain accuracy without invented timing.
- Interactive readiness chart: latest ten completed current-format 100-item mocks, separate score/answered-accuracy/speed axes, toggleable series, exact-value selectors, accessible data table, and transparent practice index. Summary uses five recent mocks; consistency checks the latest three against 90% and 12-second targets. Earlier formats remain in history but are excluded from this comparison. Empty charts and missing timing remain honest empty/unknown states.
- Progress starts with four overview metrics and a recommended next step, followed by readiness trends, topic performance, lesson completion with Start/Resume/Review links, and recent sessions. Empty mock trends remain compact. Lesson speed details and metric definitions use disclosures. Reading alone never earns completion; the dashboard only reads existing validated learning data.
- Completed-session history, topic accuracy, latest-mistake review, saved-question practice, and local-data reset.
- Four original study guides, about page, privacy explanation, terms, responsive navigation, keyboard controls, reduced-motion support, and static page metadata.

Public pages have Share controls for copying clean page links, opening Facebook sharing after publication. The compact Facebook and link icons sit at the top right of shareable pages. Private history and active attempt views are excluded. Local preview links remain copyable; they are not reachable by Facebook.

## Does it need a database or storage?

No external database or object storage is needed for this version. Questions and guides live in TypeScript; Next.js pre-renders pages at build time. Versioned localStorage records separately retain practice/mock progress (`taiwan-factory-exam:v1`), daily samples (`taiwan-factory-exam:daily:v1`), and learning (`taiwan-factory-exam:learning:v1`). Learning stores the last section and stage, current assessment answers, and passing evidence; reading a section alone never counts as passing. Storage errors and corrupt data are handled. Clearing local data removes all three records. No cookies, accounts, tracking, or payment flows are installed.

Local progress belongs to one browser and origin. It is not shared across devices and can disappear when site data is cleared. Practice answers are in the client bundle, so this is a self-study tool, not a secure or proctored examination platform.

Add Supabase Auth + Postgres when accounts, cloud history, paid entitlements, or an admin question editor are actually needed. Supabase Storage is useful only for uploaded media/files (for example question images); text questions and scores belong in Postgres. Require RLS for user-owned rows and keep service-role credentials server-only. A secure paid or high-stakes exam needs server-side answer delivery, grading, authorization, and payment verification; it cannot rely on this static-only design.

## Editing content

- `src/lib/questions.ts`: IDs, options, correct answer index (zero-based), explanations. Keep stable IDs for stored progress.
- `src/lib/guides.ts`: original study guides.
- `src/lib/lessons.ts`: learning catalog; `curriculum-math.ts`, `curriculum-concepts.ts`, and `curriculum-abstract.ts`: section teaching, worked examples, and original learning questions. Keep IDs stable and update the learning content version when incompatible grading/content changes invalidate saved evidence.
- `src/lib/learning-progress.ts`: assessment selection, grading, validated progress, and prerequisites; `src/components/learning-provider.tsx`: separate learning persistence.
- `src/components/learning-ui.tsx` and `src/app/learn/learning.css`: section navigation, practice, assessment, and progress UI.
- `src/app/globals.css`: shared design tokens, components, and breakpoints.
- `src/lib/quiz.ts`: scoring, selection, validation, and timer functions.
- `src/components/progress-provider.tsx`: browser-local persistence.

## SEO and public launch

Public pages have descriptive headings, unique titles/descriptions, matching social-share metadata, and crawlable HTML links. Each page emits its own canonical URL once the actual production origin is configured. Personal history, saved-question, and mistake-review pages remain noindex.

After deploying: verify that the live site is accessible over HTTPS, set `NEXT_PUBLIC_SITE_URL` and rebuild, check `/robots.txt` and `/sitemap.xml` on that domain, then verify ownership in Google Search Console and submit the sitemap. Indexing and rankings are determined by search engines and cannot be guaranteed by headings or metadata.

Set `NEXT_PUBLIC_SITE_URL` to the actual production origin before building; this enables a real-origin sitemap. It is intentionally unset because the suggested domain has not been registered/verified. Personal progress and saved-content routes are noindex. Do not put personal data in query strings.

Before public launch, add the operator's identity/contact and complete the hosting-specific privacy disclosures in the legal pages. Confirm business/tax requirements, original-content rights, and name clearance. No fabricated operator address, contact email, endorsements, or legal certification is included. Public publication and domain purchase are outside this local build.

## Design and agent instructions

Read `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, and the installed skills in `.agents/skills/` before changing the UI. The skills are installed per project and discoverable on the next Codex turn. Their pinned upstream revisions are in `SKILLS.md`.

Fonts are self-hosted Public Sans, with its SIL Open Font License in `src/app/fonts/OFL.txt`. Icons use Lucide. No stock photography or generated raster assets are necessary for the study interface.
