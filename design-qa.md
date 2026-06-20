# Design QA — square flag overflow and atlas expansion

- source visual truth path: `/Users/mieszkomahboob/.codex/attachments/2ba1a839-3b03-41f8-98c6-a60f150ca9df/codex-clipboard-5c243641-af42-4642-97d4-4f4c11b7c40b.png`
- implementation screenshot path: unavailable — the in-app browser connection could not be established in this run
- source viewport: 1430 × 1360 physical pixels
- target state: Atlas, two-column grid, search result limited to Switzerland
- live implementation: `https://jakiesluchawki.github.io/KIM-FLAGI/?v=67406ff`

## Full-view comparison evidence

The source screenshot shows the square Swiss flag sized from the card width. Its rendered height exceeds the fixed image frame and covers the metadata, title and summary. The deployed stylesheet now gives the image frame a fixed 205 px block size, clips overflow and constrains the image independently with `width: auto`, `height: auto`, `max-width: 100%` and an explicit 153 px maximum height. Live asset inspection confirms that the deployed CSS contains these rules, but a rendered implementation screenshot could not be captured in the selected browser.

## Focused region comparison evidence

The relevant region is the first Atlas result card. The source flag occupies approximately 574 × 574 physical pixels while its background frame is approximately 410 physical pixels high. The patch makes the flag fit the inner content height rather than deriving both dimensions from card width. The same containment rule is applied to mission, dialog, quiz and comparison frames so Switzerland, Vatican City and Nepal cannot escape their presentation areas.

## Findings

- [P0 resolved in code] Square SVG overlaps card copy.
  - Location: Atlas country cards, `.flag-image` and `.country-card .flag-image img`.
  - Evidence: source screenshot shows the Swiss SVG extending into the text; deployed CSS constrains and clips the image frame.
  - Fix applied: intrinsic sizing with independent maximum dimensions, explicit card-frame maximum height and overflow clipping.
- [P2 verification blocker] No rendered after-screenshot from the selected browser.
  - Location: desktop Atlas at the two-column breakpoint and mobile card layout.
  - Impact: typography, spacing rhythm, palette, image containment and copy were checked in source and build output, but the final rendered pixels could not be compared side by side.
  - Fix: capture the live Switzerland result at the same viewport when the in-app browser connection is available.

## Required fidelity surfaces

- Fonts and typography: existing Newsreader and Manrope system preserved; no typography tokens changed.
- Spacing and layout rhythm: card height and existing editorial grid preserved; new screens reuse the same section, rule and card rhythm.
- Colors and visual tokens: existing cream, mineral grey, blue and terracotta tokens preserved.
- Image quality and asset fidelity: original national SVG assets retained; no substitute artwork added; containment fixed across all presentation frames.
- Copy and content: new copy follows the existing technical, source-conscious tone and avoids reducing the material to trivia.

## Patches made

- constrained square and unusual flag proportions in every fixed image frame;
- added six research trails with reading progress;
- added saved flags, a personal research notebook and saved-only filtering;
- added comparison presets, pair similarity and distinguishing features;
- added the clue-based “Detektyw flag” quiz mode;
- added automated regression coverage for square SVG containment and trail data.

## Implementation checklist

- [x] Automated tests pass.
- [x] Production build passes.
- [x] Dependency audit reports zero vulnerabilities.
- [x] GitHub Pages deployment succeeds.
- [x] Live JS and CSS assets contain the new features and containment fix.
- [ ] Capture and compare the rendered after-state in the selected browser.

final result: blocked
