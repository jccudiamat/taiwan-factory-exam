# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
The user explicitly chose Next.js and Supabase only if a database or storage is necessary. Use Next.js App Router and TypeScript. The initial implementation uses static content and versioned browser-local progress; no Supabase dependency or credentials are needed.

## Users
The user confirmed the business will operate in the Philippines and primarily serve Filipino applicants for factory jobs in Taiwan. They want mock exams, preparation, and practice tests.

## Product Purpose
Help applicants practise foundational skills, understand mistakes, and build a repeatable study routine. This is independent educational preparation, not recruitment, placement, or an official examination.

## Capabilities and Constraints
Practice and mock answer keys, correctness, and explanations are revealed only after submitting or time expiry. Selecting, skipping, or timing out an item must not disclose correctness. Saved-question and historical answer review stays locked while a session is active.

The private progress page includes an interactive readiness chart for the latest ten completed current-format 100-item mocks; summary metrics use the latest five. It separates full-paper score (correct/100), answered-only accuracy, and individual-answer weighted speed. The conservative practice index takes the lowest of average score, answered accuracy, and speed attainment (12/average seconds ×100, capped at100). It is not a validated probability of passing. Consistency requires score and accuracy of at least90%, complete timing for recorded answers, and speed at most12 seconds in each of the last three mocks. Missing timing stays unknown, old formats are excluded without deleting history, and an empty chart never seeds fake data.

The owner requires rapid-fire practice and recruitment-pressure simulations. Practice sessions allocate 10 seconds per item as one total budget (15 items = 150 seconds / 02:30). Like mocks, questions can be answered in any order and selections remain editable until submission or total expiry. Individual items never expire, and earlier saved checked IDs do not lock resumed practice. Answer timing accumulates exposure across revisits and records the final selection. Missed or slow items must be repeated to meet the drill's accuracy-and-speed target. The 100-item mock uses five contiguous 20-item sections: math, English, logic, abstract reasoning, and attention to detail, with a fixed 1,200-second / 20:00 deadline (12 seconds per item) and a 90% website passing mark, with question and section navigation. There is no pause. Absolute deadlines survive navigation and refresh; expiry submits once, including on return after the browser was closed. Browser exit cannot be blocked, so the app explains that leaving does not pause time and uses a best-effort leave warning. This independent training format is not represented as an official employer test or verified recruitment standard.

Lesson assessments now allocate 10 seconds per item (00:50 for section checks and 01:40 for finals); instructional practice remains untimed. Per-item answer exposure includes revisits and time away while an item is current. Results and progress display individual-answer weighted averages, with untimed history and unanswered items excluded from timing averages. Existing historical scores and earlier passing evidence remain valid. Lesson speed summaries use the latest completed attempt per assessment, since a full lesson attempt history is not retained.

Learning is organized into eleven lessons and 51 individually addressable sections. The approved flow is detailed teaching and worked solutions, guided practice, independent practice, then a five-question section assessment requiring four correct answers. Passing enables guided continuation; section links remain directly accessible for review or targeted study. A ten-question mixed final assessment requires eight correct answers and becomes available after every section is passed. A lesson progress bar counts passed sections plus the final; reading alone earns no completion. Resume position, assessment drafts, and validated passing evidence use separate versioned browser storage. Retries prefer questions outside the preceding attempt, with finite pools rather than an unlimited-question claim. Existing practice and mock history stay separate.

Homepage samples are interactive daily questions for all five core topics, using Asia/Manila dates and separate versioned local storage. Each topic advances only after it was answered on an earlier date. Unanswered samples remain assigned, and daily seen IDs prevent repeats. With the present finite bank, exhausted topics await new content instead of cycling old questions. Daily responses do not count as completed mock/practice sessions.
Requested: a real Next.js website, installed design skills, and an AGENTS.md that prevents generic AI-looking output. The user named Impeccable and Make Interfaces Feel Better.

Implementation choices delegated by the build request: free initial practice; math, English, reasoning, and attention-to-detail topics; a mixed timed mock; explanations; bookmarks; mistake review; local progress. These choices can be revised. Accounts, paid access, cloud sync, employer-specific exams, and an admin editor are not confirmed requirements.

## Brand Commitments
The owner requires descriptive Taiwan factory exam/preparation headings and search-friendly page metadata. Avoid inspirational one-liners. Each heading must identify the actual exam topic, learning task, or page purpose. Search visibility is an objective, not a promised ranking or passing outcome.
Working name: Taiwan Factory Exam, consistent with the current workspace and prior domain discussion. The domain has not been registered or trademark-cleared. The user explicitly rejects generic AI visual styling. The owner supplied a crossed-flags photograph as reference and approved the generated deep-green Taiwan/Philippine flags icon as the website logo.

## Evidence on Hand
No official or licensed question bank, testimonials, outcome statistics, employer endorsements, or business contact details were supplied. Author original educational questions; label them independent practice and never claim official equivalence or a hiring guarantee. No invented trust signals or user activity.

## Product Principles
- Lead with lessons and worked solutions, followed by topic practice and then the timed mock. Keep each area directly accessible for returning learners.
- Start a useful practice session without an account.
- Explain answers rather than rewarding guessing.
- Keep all progress statistics honest and derived from real local attempts.
- Make the scope and limits of independent preparation clear.
- Minimize collected data and recurring infrastructure.

## Open Decisions
The owner supplied Notes.txt and requested coverage of all its preparation areas, deeper lessons with complete solutions, and color-vision practice. The learning curriculum covers arithmetic, six-section PEMDAS, fractions and decimals, percentages and units, reasoning and spatial patterns, visual abstract reasoning, factory English, visual checking, 5S, and dexterity preparation. Preparation also covers role/format differences, alphabet and serial-comparison drills, and a custom 28-item set of photographed Ishihara number/path plates for non-diagnostic familiarization. Applicant-reported timing and employer claims are explicitly variable rather than official standards. Color responses are ephemeral and excluded from persistent exam history. Dexterity learning assessments check knowledge, not physical fitness or job eligibility.

Leonxlnx Taste Skill is installed project-locally; incumbent palette, type, layout, and plain CSS remain authoritative.

Public hosting/domain, legal operator/contact details, future monetization, and any eventual Supabase-backed features remain undecided.

The owner also requested interview tips and abstract reasoning across lessons, assessments, practice, and mocks. The abstract lesson has four sections with original shape diagrams and accessible descriptions. The dedicated interview guide covers a truthful introduction, situation–action–result examples, ten original practice questions, English clarification phrases, and preparation checklists. Neither is presented as a verified employer script.

The desktop navigation rail remains visible and has no hide/show toggle, as requested by the owner. Mobile navigation uses its compact expandable menu. The full independent-resource disclaimer has an X dismissal, remembered for the current tab using versioned sessionStorage; dismissal removes the complete banner row and moves focus to main content. Former desktop navigation preferences are ignored. Main content retains its existing maximum reading width.

Practice and mock instructions explicitly require blank paper and pen and discourage calculators, searches, AI tools, notes, cheat sheets, or outside help. The rule supports honest self-assessment and is not advertised as proctoring.

Ohm’s law is an eight-section electrical fundamentals lesson covering quantities, unit prefixes, all three V = IR rearrangements, proportional reasoning, series/parallel circuits, and power/model limitations. Its 16 worked examples and 160 original questions use the existing guided/independent practice, assessment, final gate, and local lesson progress flow. Concept references link to OpenStax. No claim is made that this subject appears in every employer exam.

Color vision now uses 28 distinct 400×400 source PNG photographs with unchanged image payloads: the 24 plates corresponding to the owner’s supplied sheet plus four other plates from the same 38-plate archive. No generated substitute plates remain. Numeral and path observations are collected before showing reference readings, with no clinical score, diagnosis, or hiring result. Source origins are embedded as PNG text metadata; attribution, the original archive README and source/packaged/image-payload SHA-256 hashes are recorded. Public redistribution permission is not stated by that source and must be confirmed before public launch; local preview remains the default.

Progress page hierarchy is overview → next preparation step → mock readiness trend → topic and lesson detail → session history → local data controls. The overview shows the latest eligible 100-item mock, overall practice accuracy, individually weighted answer time, and fully completed lessons with passed-section counts. Recommendations resume an active timed session or saved lesson assessment before suggesting unfinished lessons or mistake review. Lesson rows reuse validated passing evidence, show percent/section/final completion, and provide Start/Resume/Review links; reading does not earn progress. The read-only learning snapshot uses existing versioned localStorage, follows clearing and cross-tab changes, and reports unknown lesson data when storage cannot be read. Empty mock trends are compact and never dominate lesson/practice progress; chart summary metrics precede the graph.

Recent session history separates raw score, percentage accuracy, and Passed/Failed result. Mock outcomes use the existing exact 90% practice mark, including earlier mock sizes; drill outcomes require every item correct in under 10 seconds. An all-correct drill with missing individual timing is Not assessed rather than being assigned an invented speed outcome. Status text accompanies semantic colors, and wide tables scroll within an accessible keyboard-focusable region. These are training targets, not official employment criteria.


Resource navigation is Study guides → Preparation & tips → Interview tips → Color-vision practice → About. Interview tips has its own direct navigation link and unique MessageSquare icon; its parent preparation page does not also show as current. Lessons, practice, mock, saved questions, and progress remain in the main study group.

All 51 teaching sections include optional topic-matched YouTube resources (25 distinct public videos, metadata checked 2026-10-31). Each includes creator attribution, an original section-specific study prompt, an external link, and a privacy-enhanced inline player shown by default, with a Close video player control above it. Native lazy loading defers offscreen previews; playback requires pressing Play. Closing unloads the player and exposes Show video player to reopen it. YouTube may receive preview requests before playback; no video is downloaded or rehosted. Closing the player or changing learning stages unloads it. Videos do not award completion or alter assessments, and written teaching remains the primary crawlable content. Availability, ads, captions, and embedding are controlled by YouTube and the creator; direct watch links remain as a fallback. The privacy page discloses the optional third-party connection.


The seven Ishihara path items use plate-specific native radio choices based on the supplied reference sheet, including single/two-line observations, color combinations, broken lines, no continuous line, uncertainty, and an Other description. Red/purple wording accommodates the supplied sheet and source manual color terms. Numeral items remain free entry. Choosing an option does not advance or reveal a reference; the learner submits it with Record and continue. Choices and optional descriptions clear for the next plate and restart. Reference readings remain after all 28 observations, with no score or diagnosis.


Public study pages integrate a compact Share toolbar beside the title, aligned top-right, with only Facebook and copy-link icon controls. There is no standalone share row above the title. Below 700px the controls follow the title and introduction, aligned right. The study desk instead groups sharing beside View my progress in its existing context row; mobile keeps those two actions together below the context text. It covers the home/catalog pages, lesson overviews, each teaching section, guides, preparation/interview tips, color-vision instructions, about, and legal pages. Practice topics and the mock show it only on their public instruction screen; saved/mistake practice, personal progress, results, active quizzes, and lesson assessment steps do not offer it. Share URLs use the configured real site origin or current origin, remove all query/hash state, and share no answers or scores. The icon controls have accessible names, native tooltips, 44px targets, and a live copy status. Clipboard failure exposes a labeled selectable link and never claims success. Local/private-network preview links can be copied but Facebook is disabled with an accessible explanation and tooltip until there is a public address. No Facebook SDK, click analytics, server/database, or automatic post is introduced.
