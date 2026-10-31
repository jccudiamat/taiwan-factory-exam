---
name: Taiwan Factory Exam
description: A community-library study desk for independent practice.
colors:
  paper: "#f8f9f5"
  white: "#ffffff"
  ink: "#24382d"
  muted: "#627066"
  forest: "#244d3c"
  forest-hover: "#173b2b"
  rail: "#eef1e8"
  sage: "#e5ecdc"
  sage-strong: "#ceddc0"
  sand: "#f1e9d8"
  lavender: "#eeebf4"
  blue: "#e5edf0"
  line: "#dce2d7"
  success: "#2f6245"
  success-bg: "#edf5e9"
  error: "#9b4034"
  error-bg: "#fcf0ea"
typography:
  display:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "44px"
    fontWeight: 550
    lineHeight: 1.16
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "38px"
    fontWeight: 560
    lineHeight: 1.18
    letterSpacing: "-.035em"
  title:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 570
    lineHeight: 1.35
    letterSpacing: "-.025em"
  body:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: "Public Sans, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 560
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  small: "6px"
  panel: "12px"
  answer: "7px"
spacing:
  compact: "12px"
  regular: "20px"
  section: "28px"
  spacious: "32px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.white}"
    rounded: "{rounded.small}"
    padding: "11px 18px 11px 20px"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
    textColor: "{colors.white}"
    rounded: "{rounded.small}"
    padding: "11px 18px 11px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    rounded: "{rounded.small}"
    padding: "11px 18px 11px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.forest}"
    rounded: "{rounded.small}"
    padding: "11px 18px 11px 20px"
  button-light:
    backgroundColor: "#ecf1d8"
    textColor: "{colors.forest-hover}"
    rounded: "{rounded.small}"
    padding: "11px 18px 11px 20px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.small}"
    padding: "11px 18px 11px 20px"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.white}"
    rounded: "{rounded.small}"
    padding: "11px 18px 11px 20px"
---
# Design System: Taiwan Factory Exam

## Overview

**Creative North Star: "Community-library study desk"**

Community-library study materials become a calm, useful place to practise. Warm paper, forest-green actions, sage navigation, and aligned subject rows give the interface an approachable, orderly character.

The system supports independent learning without borrowed employer authority or fictional activity. It uses restrained surfaces and explicit answer feedback at the appropriate stage: after submission or expiry for practice and mocks, and after checking for untimed instructional practice. Decorative staging never delays the next answer.

**Key Characteristics:**
- Useful subject rows and persistent desktop study navigation.
- One self-hosted type family with clear hierarchy.
- Tonal surfaces, fine dividers, and explicit answer states.

## Colors

Forest green and warm paper anchor the interface; quiet subject tints help orientation without becoming competing action colors. The frontmatter records the shared CSS palette.

### Primary
- **Forest:** primary actions, navigation emphasis, focus, and the mock-exam panel. Forest-hover deepens interactive states.
- **Sage and strong sage:** selected options, resume summaries, and completed-question indicators.

### Secondary
- **Sand, lavender, and blue:** restrained subject markers and supporting content. Lavender is a small matte subject tint, never a glow or dominant brand color.
- **Success and error:** checked answers and time warnings, each with a light companion background and explicit meaning beyond color.

### Neutral
- **Paper and white:** page canvas and question surfaces.
- **Rail:** persistent navigation background.
- **Ink and muted:** primary reading and supporting information.
- **Line:** fine structural boundaries and option borders.

## Typography

Public Sans is a local variable font with Arial and sans-serif fallbacks. The frontmatter records the base display, headline, title, body, and control-label roles; source CSS contains contextual adjustments rather than a rigid mathematical scale. Small headings use 15px, weight 600, and 1.45 line height. Reading articles increase body copy to 15px on mobile; page introductions use up to 65ch.

**The One Voice Rule.** Use Public Sans across headings, reading copy, controls, and numbers; use tabular numerals for timers and scores.

## Layout

The persistent desktop rail is 232px wide and the main canvas has a 1240px maximum width with 42px side padding. At 1190px the rail contracts to 210px and gutters to 28px. At 960px the study desk, session setup, and quiz columns stack. At 700px the rail becomes a compact independently expandable header; main gutters are 22px, reducing to 18px below 380px. At 1500px the study aside gains width.

Use a flexible main column with a narrower supporting column where useful. Subject lists, saved work, and review rows share thin horizontal dividers. Action groups wrap. Quiz position controls reflow from sidebar to rows, then five columns on mobile. Keep page overflow absent at 360px; wide history data scrolls inside its own wrapper.

## Elevation & Depth

The shipped interface is flat: tonal panels, borders, and spacing establish depth. The stylesheet declares a shadow variable but does not apply it; it is not an active elevation token.

**The Flat Study Surface Rule.** Separate content through space, fine dividers, and paper or sage fills. Do not add elevation to ordinary rows or answer controls.

## Shapes

Controls use gently curved corners, panels use broader corners, and answer options have their own modest radius, as recorded above. Use 1px borders for surfaces and options. Subject icon tiles use 10px corners. Lucide strokes are generally 1.7 for navigation and topic icons, with lighter large contextual symbols; the brand mark is the owner-approved deep-green crossed Taiwan and Philippine flags PNG, with plain poles and a transparent background. Render at 56px square on desktop and 44px square on mobile; preserve its aspect ratio. The wordmark uses consistent semibold weight with “Taiwan Factory” above “Exam”. The browser icon uses enlarged flag artwork on a paper-colored rounded tile for contrast on dark and light browser tabs.

## Components

- **Buttons:** forest primary, bordered transparent secondary, pale light variant on dark surfaces, quiet text-like actions, and red destructive confirmation. Standard minimum height is 46px; small controls are 44px and large controls 50px. Hover changes fill or text; active buttons scale to .96. Disabled controls lower opacity to .48 and use a not-allowed cursor.
- **Navigation:** aligned icon and label rows, 46px minimum height, subtly filled active state, and aria-current. The desktop rail stays visible without a hide/show control. Mobile navigation expands with its own menu button, exposing aria-expanded and aria-controls.
- **Independent-resource disclaimer:** supporting text and a visible 44px X control sit in the topbar. Dismissal persists for the current tab and removes the entire topbar row. Removing the disclaimer moves focus to main content so keyboard focus remains useful. The dismissal remains usable when storage is unavailable.
- **Question panels:** white, bordered containers with 26px 30px 28px desktop padding; compact mobile padding preserves room for the answer text.
- **Answer inputs:** native radio inputs cover the full 58px-minimum option row. Selection changes fill and border; checked correct and incorrect states use both semantic color and accessible status. Keyboard focus surrounds the whole row.
- **Subject rows:** aligned icon tile, title, concise description, optional count, and directional icon; dividers establish the list rhythm.
- **Feedback and review:** practice and mock correctness, answer keys, and explanations appear only after submission or expiry. Active options remain neutral, including skipped or expired items; saved and historical answer reviews remain locked while a session is active. Untimed instructional lesson checks may explain answers immediately after checking. Native details disclose review explanations. Empty progress and saved-item screens offer a direct next step without fabricated data.
- **Progress overview and next step:** a divided four-metric row summarizes recorded work, followed by a sage next-action panel. Metrics reflow to two columns on mobile. Native details keep calculation notes available without competing with the next action. The overview and next step precede the trend, topic and lesson detail, session history, and local-data controls; this hierarchy belongs to the progress surface.
- **Page sharing:** a compact toolbar sits beside the page title, aligned to its top-right within the same header block. Public pages never reserve a separate sharing row above their heading. It pairs a quiet Share label with Facebook and copy-link icons on pale, gently rounded 44px square controls. Back links stay above the header. At 700px and below, sharing follows the title and introductory copy, aligned right with a 16px gap. On the study desk, sharing sits beside View my progress in the existing top row; on mobile those two actions share a row beneath the page context. Each icon has an accessible name, native tooltip, visible focus, and hover feedback. Copy success uses a check icon and live status; failure reveals a labeled selectable URL. Local previews expose the unavailable Facebook action through an accessible hint and tooltip. Keep sharing off private results and active assessments.
- **Optional lesson videos:** flat, divided rows follow the written teaching and precede practice continuation. A Lucide play icon, linked title, creator credit, and section-specific study prompt establish purpose before the action. Players are open by default, lazy-loaded, and never autoplay. Reuse the small secondary button above the player for “Close video player” and “Show video player” when closed, plus a text link for the external fallback; action groups wrap and long titles break within the reading column. The player fills the column at 16:9 with a 200px minimum height and a fine border; closing it or leaving the Learn stage unloads it. YouTube’s privacy practices apply when its preview loads. Watching earns no completion credit.
- **Lesson completion rows:** flat divided rows align the lesson title and explicit completion state with a native progress bar, percentage, and Start, Resume, or Review action. Passed sections and the final assessment determine completion; reading alone receives no credit. Rows stack on mobile while keeping the action visible. Lesson answer-time detail sits in a native disclosure beneath the rows.
- **Readiness chart:** a flat bordered study surface uses native SVG with an accessible title and description. Summary metrics and status precede the plot. Solid, dashed, and dotted lines distinguish score, answered accuracy, and answer speed beyond color; labeled percentage and seconds-per-item axes keep the units explicit. Native toggle and mock-selection buttons expose pressed states, a status line reports the selected result, and a details disclosure provides exact values and the calculation. Plot only eligible recorded mocks, leave missing values unknown, and use a compact empty row with a direct mock action rather than invented points. Supporting metrics reflow from four columns to two on mobile.

Focus uses a 2px forest outline with a 4px offset, or a 3px offset around radio groups. Control transitions last 120–140ms with ease-out. Reduced-motion preference reduces transition and animation duration to .01ms; no question entrance choreography is used. Interactive targets should remain at least 44px.

## Do's and Don'ts

### Do:
- Do use native links, buttons, radio inputs, details, and progress elements.
- Do keep practice actions close to their instructions and preserve visible keyboard focus.
- Do pair answer-state color with meaningful text or accessible icons.
- Do retain honest empty states and numbers derived from recorded work.
- Do distinguish chart series beyond color, label their units, and provide accessible exact values.

### Don't:
- Don't add gradient text, purple glow, glassmorphism, decorative blobs, emoji icons, or generic stock-photo heroes.
- Don't introduce all-caps eyebrows, fictional social proof, or employer affiliation.
- Don't replace subject rows with a wall of interchangeable cards.
- Don't animate question entrances or delay feedback once it is available.
