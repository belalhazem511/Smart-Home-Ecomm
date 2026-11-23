# Start the approved homepage implementation

Updated: 2026-11-23
Current authorization: IMPLEMENT HOME ONLY — W01 / first F00 slice.
Communication and UI: English only, LTR. Arabic/RTL is a later phase.

## Current user decision

The user has reviewed the visual direction and explicitly authorized starting implementation now. Further UI concept images and the remaining pages are postponed. This instruction updates the earlier project stage that waited for more images; it does not mark the full architecture, all screens, backend or integrations implemented.

Images continue to be created in the original design conversation, not by this Codex session. Begin useful code work within the homepage scope below. Do not wait for the remaining image concepts or repeat the previous analysis.

## Read and preserve

1. Follow applicable repository instructions and inspect the actual current directory.
2. Read the existing `project_state.md`; preserve verified progress and user decisions.
3. Read this file, the relevant conventions from `02_FRONTEND_PENDING.md`, and the bounded loop from `05_EXECUTION_CHECKLIST.md`.
4. Consult only the W01/layout sections of the architecture when necessary. Do not ingest all 88 page families, the complete page-map JSON or the 148-table archive.

If an app exists, continue it without replacement. If this is a documents-only folder, create the frontend in `frontend/`, keeping project documents and the existing checkpoint in place. Do not recreate, overwrite or move the user's `project_state.md` or repository instructions.

## Visual references in this starter

- `design-references/home-desktop.png`: approved desktop visual direction.
- `design-references/home-mobile.png`: approved mobile visual direction, showing the top of the page through the first product row.

The PNG dimensions are screenshot dimensions, not CSS specifications. Reconstruct the interface as real semantic HTML and React components. Do not display a full-page mockup image as the application, use screenshot text as raster UI, or overlay invisible controls on it.

These files are visual references, not individual production product/hero assets. Reuse authorized local assets if available. If individual photo assets are missing, continue building the layout with clean image-area placeholders and record `ASSET_PENDING` precisely. Do not invent asset sources, generate replacement images in this session or claim final visual fidelity while placeholders remain. Image assets can be supplied in the design conversation later.

## Implementation scope

Build one running responsive homepage, containing:

- Store header with the temporary SMART HOME wordmark, search field, account/cart entry and category navigation.
- Desktop split hero and stacked mobile hero, matching the reviewed composition.
- Six category tiles: Switches, Lighting, Sensors, Security, Curtains, Hubs.
- Four featured-device cards, using explicit development data in one small file.
- Compatibility-help section.
- Footer with the reviewed grouping and responsive arrangement.

Use React + JavaScript/JSX + Tailwind and small CSS transitions. Use Vite if starting a new application. Inspect actual package versions and use compatible current setup; consult official documentation only for an actual version/setup unknown. Reuse existing dependencies. Add a router or another library only when the current slice genuinely needs it.

Create only the page, layout and components this slice needs, following the planned architecture. Examples are HomePage, StoreLayout/Header/Footer, CategoryCard, ProductCard, a small fixture file, formatting helper and styles. Do not create empty folders or placeholder pages for the entire product.

## Simplicity is a requirement

- Use descriptive names, straightforward functions and explicit data flow.
- Keep state local unless sharing is actually needed. Do not create auth/cart infrastructure just to show header icons.
- Reuse repeated cards/sections with a small understandable props surface.
- Split components when responsibilities diverge or a file becomes hard to understand. Avoid both giant components and excessive fragmentation.
- Do not add Redux, custom repositories, dependency injection, a universal form/page engine or an animation framework for this slice.
- Keep visual tokens in one source. Use complete statically discoverable Tailwind class strings.
- Readability takes priority over artificially reducing line count. Explain only non-obvious decisions in comments.

## Dimensions and whitespace

| Element | Baseline |
| --- | --- |
| Main content | Centered, max 1320 CSS px, excluding external page padding |
| External padding | 16px mobile, 24px tablet, 32px wide desktop |
| Section spacing | Around 48–64px desktop, 32–40px mobile |
| Card gap | Around 20–24px desktop, 12–16px mobile |
| Card/group padding | Around 16–24px; compact mobile cards may use less if still readable |
| Body and input text | 16px baseline; readable card titles and secondary text |
| Buttons/touch controls | At least 44px intended target, usually 48px for primary actions |
| Radii | Around 8px controls, 12px cards, 16px hero |

P1 tokens remain the working visual direction: brand `#1D4ED8`, brand hover `#1E40AF`, text `#0F172A`, muted `#475569`, canvas `#F8FAFC`, surface white, border `#CBD5E1`, necessary control border `#64748B`. Inter is the English font candidate; use an appropriate system fallback if licensed local font files are absent, and record that limitation.

Use fluid layout, not a fixed screenshot-sized canvas. Adjust column count instead of shrinking text or cramping content. The mobile reference covers only the upper page; complete the remaining homepage sections responsively using the same components and spacing rules. Keep keyboard focus visible and respect reduced motion. Essential actions must work without hover.

## Behavior and boundaries

Implement the real homepage interactions that belong to this slice: keyboard-accessible mobile navigation, safe section navigation and ordinary control states where applicable. Keep unfinished destinations for later screens explicit in the checkpoint; do not create 88 fake working routes or present checkout/payment/auth as implemented.

Keep illustrative content in one clearly named development fixture file. All prices are demo EGP values, not live offers. Do not invent ratings, certification badges, delivery guarantees or backend success responses.

Do not implement backend endpoints, authentication, live cart/checkout, seller/admin portals, payment processing or Arabic in this slice. Preserve the business/security boundaries for later integration. Do not deploy or publish.

## Verification and finish

1. Run the required existing checks and production build once the slice is stable. Add targeted tests only for meaningful new behavior when justified; avoid tests that just mirror static markup.
2. Inspect the page at 390 and 1440 first, then check 360, 768, 1280 and 1920 plus 320 CSS-pixel reflow where browser access is available. Check keyboard navigation and text enlargement. Report any unavailable browser check as NOT_VERIFIED.
3. Confirm no unintended horizontal page overflow, clipped controls or tiny essential text. Identify photo/font gaps honestly.
4. Follow the existing limit of two cause-directed repairs per unchanged failure. Do not repeatedly reinstall, re-plan or replace the architecture.
5. Carefully update the same `project_state.md`: current scope, real paths, completed work, actual commands/results, remaining asset gaps and next exact step. Keep the active checkpoint concise.
6. Respond in English with a short summary, changed paths, verification and the observed local preview command/URL if a server is actually running. Distinguish a working homepage slice from final visual acceptance and full-platform completion.

Complete this homepage slice, then stop for visual review. Remaining pages and images are postponed, not removed from the project.
