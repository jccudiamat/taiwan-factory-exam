# Taiwan Factory Exam — project instructions

## Product and architecture
- Prioritize the learner journey: lessons and worked solutions, topic practice, then a timed mock exam. Lead homepage navigation and the main action with learning; keep practice directly accessible without prerequisites.
- Read PRODUCT.md and DESIGN.md before changing the experience. The primary audience is Filipino applicants for factory work in Taiwan.
- Use Next.js App Router, TypeScript, and plain CSS with shared tokens. Server-render informational pages; isolate interactive components. Do not add a second styling system.
- The site is an independent educational resource. Never invent employer affiliation, pass rates, reviews, user counts, accreditation, job offers, or guarantees.
- Use original practice/mock questions in src/lib/questions.ts and learning questions in src/lib/curriculum-math.ts and src/lib/curriculum-concepts.ts and src/lib/curriculum-abstract.ts. Every question must have one unambiguous correct answer and a useful explanation. Do not copy actual employer tests or paid reviewers.
- Static export is intentional. No Supabase, authentication, database, tracking, payments, or uploads in this version. Progress is versioned localStorage, with validation and graceful failure. Do not store personal data or secrets.
- Introduce Supabase only for an approved feature that needs shared persistence (accounts, cross-device progress, paid entitlements, admin content). Enable RLS on every exposed table; never ship a service-role key to the browser. Object storage is for uploaded files, not quiz answers.

## Required design skills
- .agents/skills/taste-skill/SKILL.md — frontend taste; preserve the established design system.
Use the project-installed skills as applicable:
- .agents/skills/impeccable/SKILL.md — design direction, hierarchy, responsive behavior, final review.
- .agents/skills/make-interfaces-feel-better/SKILL.md — typography, hit targets, alignment, states, restrained motion.
- .agents/skills/react-best-practices/SKILL.md — React and Next.js performance.
- .agents/skills/web-design-guidelines/SKILL.md — accessibility and interface review.
User instructions and existing authorization take precedence over skill approval rituals. Routine implementation decisions are delegated; do not turn small changes into a redesign workshop.

## Visual rules
- Use descriptive, task-specific headings about Taiwan factory exam preparation or the actual lesson, question, result, or privacy topic. No motivational slogans in headers, subheaders, navigation, or metadata. Keep wording natural; do not repeat the same search phrase in every heading.
- Treat this as a working study tool, not a SaaS marketing landing page. Put real practice within one click.
- Preserve the forest-green, paper, sage, and ink palette. One self-hosted Public Sans family, a deliberate type scale, and generous readable spacing.
- Use a persistent navigation rail on desktop and compact navigation on mobile. Group subjects in useful rows, not a wall of interchangeable feature cards.
- No gradient text, purple glow, glassmorphism, floating decorative blobs, fake charts, emoji icons, all-caps eyebrow labels, generic stock-photo heroes, or invented social proof.
- Icons come from Lucide with consistent strokes. Keep controls and focus outlines visible. Avoid decorative animation in the question flow.
- At least 44px touch targets, clear hover/focus/disabled states, text plus color for correctness, reduced-motion support, no horizontal page overflow at 360px.
- Use native links, buttons, radio inputs, details, and progress elements. Make quiz instructions, time limits, and submission consequences clear. Never let animation delay answers.
- Empty progress is an honest empty state, not seeded fake results. Counts must derive from the question bank and recorded answers.

## Quiz integrity
- Readiness charts use only completed current-format 100-item/20-minute mocks. Define denominators: full score includes blanks; answered accuracy excludes blanks; speed pools recorded individual answers. Preserve missing values and old formats without inventing chart data. Disclose the practice-index formula and require three consistent mocks for a targets-met status; never frame it as a hiring recommendation or validated pass probability.
- New practice sessions budget 10 seconds per actual item (15 = 02:30), lock the first selection, and use a non-resetting first-display item deadline. Repeat missed/slow items until correct under 10 seconds. New mocks contain 100 distinct original items in contiguous sections (20 each: math, English, logic, abstract, detail) with an absolute 20:00 deadline (12 seconds/item) and a 90% website passing mark. No pause or timer reset. Never claim a website can block browser exit or that this is an official recruitment format.
- Lesson section assessments have 00:50 and finals 01:40; instructional practice stays untimed. Track validated per-item exposure and final answer time across revisits and refresh. Results and progress aggregate individual timed answers; exclude legacy untimed records and unanswered items from timing means without removing them from score totals. Preserve earlier history and passing evidence.
- Learning sections contain substantial teaching, worked solutions, guided and independent practice, and a five-question assessment requiring four correct. Guided continuation requires a section pass, while every section remains directly accessible. The ten-question mixed final requires all section passes and eight correct. These are learning thresholds, never official employer criteria. Progress counts passed sections plus the final, not reading or visits.
- Preserve separate learning storage and existing practice/mock history. Validate question IDs, answers, submission state and passing evidence; retain unfinished assessment drafts and last section/stage. Submission locks the attempt; retries prefer questions outside the previous attempt and preserve earlier passing evidence. Keep content-version changes deliberate. Numeric grading must never evaluate learner expressions.
- Homepage daily samples use Philippine calendar dates. Keep unanswered questions unchanged across days and refreshes; lock submitted answers for that day, then offer an unseen question per topic the next day. Never recycle exhausted daily question pools. Preserve daily history in validated browser storage and include it in local-data reset.
- Practice and mock exams reveal correctness, answer keys, and explanations only after submission or expiry. Keep active answer options neutral, including skipped/expired items. Saved/history answer reviews stay locked while a session is active. Untimed instructional lesson checks may explain answers after checking.
- Timers use an absolute deadline, not a decrement-only interval. Refreshing cannot reset exam time.
- Persist answers and current position. Validate saved question IDs and option indices. Complete each attempt once, including after refresh or timer expiry.
- Scores count unanswered questions as incorrect. Describe scores as practice feedback, never official passing criteria.
- Save only capped attempt history and question IDs; expose clearing local data. Handle corrupt or unavailable storage without crashing or claiming data was saved.

## Verification and delivery
- Run npm test, npm run typecheck, and npm run build after changes to scoring, persistence, routes, or the quiz engine.
- Exercise a full practice session, mock submission, refresh/resume, results, saved items, reset, and keyboard navigation. Inspect desktop and mobile renders.
- Keep explanatory content crawlable. Metadata must describe real content. Configure NEXT_PUBLIC_SITE_URL only with the actual deployment origin; never invent a canonical domain.
- Keep work/ and generated build output out of Git. Never commit credentials.
- Do not publish publicly or introduce payments until the owner supplies operator/contact details and confirms the hosting and business setup. A local build is the default for this repository.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
