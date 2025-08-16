

Below is a concise, end‑to‑end plan to evolve this site into a polished, high‑impact experience that communicates the Second Zeitgeist clearly and credibly.

# North Star
- __Clarity__: Narrative-first, evidence-linked, and easily navigable.
- __Credibility__: Transparent sources, annotated claims, consistent taxonomy.
- __Accessibility__: Fully keyboard-operable, screen‑reader friendly, respects motion/contrast.
- __Performance__: Fast by default; 95+ Lighthouse on mobile/desktop.
- __Maintainability__: Data-driven content; minimal friction to author and review.

# Architecture & Data Model
- __Unify timeline data__:
  - Normalize dates in [_data/epistemology.yml](cci:7://file:///home/netu/second-zeitgeist/_data/epistemology.yml:0:0-0:0); add `sort_key` (yyyymmdd int). Reintroduce safe sort in [/_includes/timeline-native.html](cci:7://file:///home/netu/second-zeitgeist/_includes/timeline-native.html:0:0-0:0).
  - Add `_data/facets.yml` to define canonical facet names, colors, and descriptions.
- __Content schema__:
  - Document required/optional fields in [README.md](cci:7://file:///home/netu/second-zeitgeist/README.md:0:0-0:0) (date, end_date, title, claim, facets, evidence, sources).
  - Add examples for high-quality entries and anti-patterns.
- __Data QA__:
  - YAML lint + CI checks to catch missing fields, unknown facets, broken links.

# UX & Interactivity
- __Timeline default & controls__:
  - Already default to interactive (unless reduced motion). Add subtle hint above toggle: “Switch to Text Timeline for filtering/search.”
  - Keep native timeline filter UI; add visual chips with counts and inline clear (in [/_includes/timeline-native.html](cci:7://file:///home/netu/second-zeitgeist/_includes/timeline-native.html:0:0-0:0) + [assets/css/style.scss](cci:7://file:///home/netu/second-zeitgeist/assets/css/style.scss:0:0-0:0)).
- __Deep linking__:
  - Expand URL param schema (already passing q, start, end, facets): ensure it round-trips on first paint and supports bookmarking/sharing.
- __Refactor JS__:
  - Move inline timeline logic into `assets/js/timeline.js`, imported via [/_layouts/default.html](cci:7://file:///home/netu/second-zeitgeist/_layouts/default.html:0:0-0:0) for cleanliness and caching.

# Accessibility
- __A11y audits__:
  - Run axe + Lighthouse. Fix headings order, roles, labels, color contrast (focus rings).
- __Keyboard UX__:
  - Ensure focus order and “skip to content” link (in [/_layouts/default.html](cci:7://file:///home/netu/second-zeitgeist/_layouts/default.html:0:0-0:0)).
  - Carousel and timeline fully operable with Tab/Enter/Space/Arrow keys.
- __Reduced motion/contrast__:
  - Already respecting reduced motion; add contrast toggle if needed.

# Performance
- __Critical CSS__:
  - Inline critical above‑the‑fold CSS in [/_layouts/default.html](cci:7://file:///home/netu/second-zeitgeist/_layouts/default.html:0:0-0:0), keep remainder in [assets/css/style.scss](cci:7://file:///home/netu/second-zeitgeist/assets/css/style.scss:0:0-0:0).
- __JS loading__:
  - `defer` non-critical JS; tree-shake/trim utilities; keep lightweight vanilla JS.
- __Media__:
  - Preconnect KnightLab CDN. Lazy-load all images/iframes (already done for timeline).
- __Targets__: LCP < 2.5s, TTI < 3s, 95+ Lighthouse scores.

# SEO & Social
- __Meta tags__:
  - Expand OpenGraph/Twitter tags per page in [/_layouts/default.html](cci:7://file:///home/netu/second-zeitgeist/_layouts/default.html:0:0-0:0) (title, description, [assets/social-card.svg](cci:7://file:///home/netu/second-zeitgeist/assets/social-card.svg:0:0-0:0)).
- __Sitemap & robots__:
  - Ensure `sitemap.xml` (Github Pages plugin or static). Add `robots.txt`.
- __Schema.org__:
  - Add JSON‑LD `CreativeWork` and `ItemList` for the timeline page.

# Print / PDF
- __Print view__:
  - Add `print.md` route with simplified layout. Strong print styles in [assets/css/style.scss](cci:7://file:///home/netu/second-zeitgeist/assets/css/style.scss:0:0-0:0) (page breaks by facet/year).
  - “Export PDF” button triggers `window.print()`. No server dependency.

# Search
- __Site-wide search__:
  - Build `search.json` page (layout: null) to expose: timeline events, quotes, and pages.
  - Integrate Lunr.js with keyboard navigation, result highlighting, and section filters.

# Authoring & Contribution
- __Docs__:
  - CONTRIBUTING.md with data guidelines, style guide, and review checklist.
  - PR/Issue templates (What changed? Evidence? Facets? Links verified?).
- __Editing UX__:
  - Instructions for GitHub UI editing of YAML. Optionally explore Netlify CMS later.

# CI/CD & Quality
- __GitHub Actions__:
  - Steps: `bundle exec jekyll build` → YAML lint → `htmlproofer` (links, images, HTML) → Lighthouse CI (PR comment with score deltas).
  - Cache bundler gems for faster builds.
- __Gate rules__:
  - Fail PR if broken links or schema violations; warn on Lighthouse regressions.

# Deployment
- __Hosting__:
  - GitHub Pages for simplicity, or Netlify for PR deploy previews + better caching.
- __Env__:
  - No secrets needed; keep zero-trust posture.

# Analytics (privacy-first)
- __Optional, opt-in__:
  - Plausible/GoatCounter for aggregate page views and route changes.
  - No PII, no cookies; document in README and footer link.

# Visual Design
- __Design system__:
  - CSS custom properties for color, spacing, typography scale.
  - Harmonize headings, spacing rhythm, and card modules (timeline items, quotes).
  - Improve focus states & hover states for clarity and accessibility.

# Milestones & Deliverables
- __Phase 1: Foundations (2–3 days)__
  - Normalize dates + `sort_key`; re-enable safe chronological sort.
  - A11y + Performance audit fixes (quick wins).
  - Add SEO meta, sitemap, robots.
  - Result: Stable, fast, accessible baseline.
- __Phase 2: Discovery (3–5 days)__
  - Search (`search.json` + Lunr UI).
  - Deep-linkable filters polish (chips, counts).
  - Print/PDF route and CSS.
  - Result: Exploration, sharing, and export are excellent.
- __Phase 3: Quality & Scale (3–5 days)__
  - JS refactor (externalize timeline code), code cleanup.
  - CI pipeline (HTMLProofer, YAML lint, Lighthouse CI).
  - Contribution guides and templates.
  - Result: Contributor-friendly, continuously verified.

# Success Metrics
- __Performance__: 95+ Lighthouse (mobile/desktop), <3s TTI on median.
- __A11y__: 0 critical axe violations; full keyboard coverage.
- __Quality__: 0 broken links in CI; YAML lint clean.
- __Engagement__: Search usage measurable; interactive default persists by choice.

# Risks & Mitigations
- __Data inconsistency__: Normalize schema; CI lint guards.
- __External dependencies (KnightLab)__: Lazy-load; provide native fallback (already in place).
- __Scope creep__: Phase gating; clear acceptance criteria per milestone.

# Concrete Next Steps (recommend)
1) __Reintroduce chronological sort safely__  
   - Add `sort_key` to [_data/epistemology.yml](cci:7://file:///home/netu/second-zeitgeist/_data/epistemology.yml:0:0-0:0) and re-add `| sort: 'sort_key'` in [/_includes/timeline-native.html](cci:7://file:///home/netu/second-zeitgeist/_includes/timeline-native.html:0:0-0:0).  
   - Acceptance: Native timeline strictly chronological; no build errors.

2) __Search MVP__  
   - Create `search.json` (layout null) pulling events, quotes, and pages.  
   - Add minimal search UI in header, results drawer with keyboard navigation.

3) __Print page__  
   - Add `print.md` route + print CSS (page breaks by year/facet, hide chrome).  
   - Acceptance: Clean PDF via browser print, no layout overflows.

If you approve, I’ll implement Step 1 immediately, then proceed to Search and Print in Phase 2.

# References to Files
- Data: [_data/epistemology.yml](cci:7://file:///home/netu/second-zeitgeist/_data/epistemology.yml:0:0-0:0), `_data/quotes.yml`, `_data/facets.yml` (new)
- Includes: [/_includes/timeline-native.html](cci:7://file:///home/netu/second-zeitgeist/_includes/timeline-native.html:0:0-0:0), [/_includes/timeline-wrapper.html](cci:7://file:///home/netu/second-zeitgeist/_includes/timeline-wrapper.html:0:0-0:0), [/_includes/quote-carousel.html](cci:7://file:///home/netu/second-zeitgeist/_includes/quote-carousel.html:0:0-0:0)
- Layout: [/_layouts/default.html](cci:7://file:///home/netu/second-zeitgeist/_layouts/default.html:0:0-0:0)
- Assets: [/assets/css/style.scss](cci:7://file:///home/netu/second-zeitgeist/assets/css/style.scss:0:0-0:0), [/assets/js/carousel.js](cci:7://file:///home/netu/second-zeitgeist/assets/js/carousel.js:0:0-0:0), `/assets/js/timeline.js` (new)
- Pages: [/index.md](cci:7://file:///home/netu/second-zeitgeist/index.md:0:0-0:0), `/print.md` (new), `/search.json` (new)

# Status
- Plan delivered with phased roadmap and clear acceptance criteria.  
- Dev server running; interactive timeline default restored.  
- Awaiting your prioritization of the next 1–2 tasks (proposed: sort_key+sort, then search and print).