# Smart Home Marketplace frontend specification and architecture baseline

Version: 1.3 | Updated: 2026-11-23
Status: RESEARCH_READY / ARCHITECTURE_PROPOSED / IMAGE_DESIGN_NOT_STARTED / IMPLEMENTATION_NOT_STARTED / BRAND_PROVISIONAL.

The existing filename `02_FRONTEND_PENDING.md` is retained for compatibility with the six-file pack. It now contains the researched frontend baseline. It is not a claim that a frontend has been built or that every proposed visual decision is approved.

## 1. Authority, scope and confirmed technology

The user has confirmed **English-only / LTR first, completed and reviewed end to end; Arabic / RTL is added afterward as a separate stage**. The stack is **React + JavaScript + Tailwind CSS**, starting with **simple CSS animation**, and a simple architecture that developers can read and change easily. Use `.js` and `.jsx`, not TypeScript. Do not substitute a different framework or add an animation framework without a concrete need and an explicit scope decision.

The current user request is the complete frontend architecture. The user plans to review it, then see UI images before application implementation. Do not install dependencies, scaffold an application, implement screens or publish a site solely because this document exists. When the user requests implementation, use this baseline, inspect the real repository, preserve existing work, and record any visual choices being used provisionally. Ordinary reversible implementation steps within that requested scope do not require repeated permission.

Read `01_ANALYSIS.md` for business behavior and `04_SECURITY.md` for security. `05_EXECUTION_CHECKLIST.md` controls bounded work and checkpoints. Detailed Arabic rationale, reference inventory and source URLs are in `references/Frontend_Design_Research_AR.md`. Load that report only for the specific design question, not on every coding turn.

## 2. Research conclusion and evidence limits

Recommended direction: a light, orderly technology marketplace with strong product imagery and clear purchasing information. Combine catalog clarity from the Gizmos/INPOWER references with the product hierarchy of BR.F and restrained editorial imagery from Echoform/Voltix. Do not combine every reference's colors, visual effects or page density.

The user supplied 11 JPEG references: some are large screenshots, others are perspective mockups or narrow page montages. They support observations about hierarchy, composition and style. They do not reveal original CSS dimensions, font files, responsive rules or interaction states. All implementation dimensions below are **our proposed baseline**, not measured Amazon/noon specifications.

Official sources reviewed include eBay Evo, a noon smart-switch product page and warranty page, Apple smart-home accessories, IKEA Egypt, Aqara, React, Tailwind, W3C, MDN and web.dev; Baymard provides original product-list usability research. Amazon.eg's homepage was not retrievable during research; Amazon's official seller fulfillment page supports operational distinctions only. No live Amazon pixel audit, checkout audit or user study was performed.

Reference extraction:

| Reference | Reuse | Adaptation |
| --- | --- | --- |
| Gizmos R01 | Clear store header, catalog grid, product cards | One consistent light system initially |
| Ontas R02–03 | Search hierarchy, product-led categories, spacious hero | Correct category/image mapping; readable contrast; reduce repeated sections |
| INPOWER R04–06 | Search, filters, price hierarchy, independent cart summary | Comfortable targets; responsive filter sheet; no excessive timers/badges |
| Small montage R07 | Listing/detail continuity | Too small to infer original typography or brand confidently |
| Voltix R08 | Editorial hierarchy, campaign spacing | Keep catalog information visible |
| BR.F R09 | Large gallery, distinct selections, price and reviews | Replace shoe sizing with relevant smart-home variants |
| Echoform R10 | Product story and feature comparisons | Use selectively for solutions/brand campaigns |
| Electronic R11 | Repeated product organization | Avoid an advertising sidebar that crowds useful filters |

## 3. Provisional visual tokens

Language sequencing is confirmed: English now; Arabic after English completion. Brand name, final palette, final font and final imagery remain open. P1 below is the recommended working palette. Do not describe it as user-approved branding. Update one token source when the identity changes.

| Role | Value | Use |
| --- | --- | --- |
| brand | `#1D4ED8` | Primary actions and selected emphasis |
| brand-hover | `#1E40AF` | Hover primary |
| brand-soft | `#EFF6FF` | Selected/help surfaces |
| canvas / surface | `#F8FAFC` / `#FFFFFF` | Page / cards and fields |
| text / muted | `#0F172A` / `#475569` | Primary / secondary readable text |
| border | `#CBD5E1` | Decorative separators and card borders |
| control-border | `#64748B` | Necessary control boundaries |
| success / danger | `#166534` / `#B91C1C` | Status with wording/icon |
| warning text / surface | `#92400E` / `#FFFBEB` | Warning |
| deal surface / text | `#FEF3C7` / `#78350F` | Truthful commercial offer |

Do not rely on the light decorative border alone to identify a control. Verify actual color pairs, including hover, selection, error and focus. Target WCAG 2.2 AA: normal text 4.5:1, qualifying large text 3:1, required non-text UI information 3:1. Status never relies on color alone. These are acceptance targets, not a claim of compliance before testing.

Provisional English typeface: Inter with a system fallback; validate English headings, prices and model names before final approval. Self-host licensed WOFF2 assets when implementing; use only necessary weights with `font-display: swap`. Noto Sans Arabic is a later candidate for L01; do not load Arabic UI dictionaries or that font in the initial English-only version. The Arabic research report uses system fonts and is not a final product-font sample.

| Role | Mobile | Desktop | Leading / weight |
| --- | --- | --- | --- |
| Hero | 30–36px | 44–56px | English 1.2 / 700; later Arabic 1.3 |
| Page H1 | 28px | 36px | 1.35 / 700 |
| Section heading | 24px | 28–32px | 1.4 / 600–700 |
| PDP title | 24px | 28–32px | 1.45 / 600 |
| Card title | 14px | 15–16px | 1.55 / 500 |
| Body and input | 16px | 16px | English 1.5 / 400; later Arabic 1.65 |
| Helper text | 13–14px | 14px | 1.5 / 400 |
| Card price | 20px | 22px | 1.3 / 700 |
| PDP price | 28px | 32px | 1.3 / 700 |
| Short badge | 12px | 12–13px | 1.4 / 600 |

Use rem for suitable sizing and respect text zoom. Do not use tiny type for essential cost, warranty or compatibility information. Arabic uses normal letter spacing. Card titles may use two lines at ordinary size, with access to full product details; allow content to grow under text enlargement rather than clip critical information.

Spacing scale in CSS px: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64**. Controls radius 8; cards 12; heroes/dialogs 16. Pills are for suitable chips, not every surface. Border 1px; an inset ring can mark selection without layout shift. Light shadows for overlays; avoid permanent heavy card shadows.

## 4. Layout, sizing and adaptive behavior

Use a capped content area of **1320px**. External page padding is 16px below 768, 24px from 768 to 1279, and 32px from 1280. Actual content width is `min(viewport - 2 * padding, 1320)`. The cap excludes the external padding. Do not accidentally put the padding inside a 1320 border-box cap and still claim these calculations.

Tailwind default breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536, with a 16px root assumption. Add a compact 360 breakpoint only if needed for the proposed one-to-two-column transition. Prefer mobile-first CSS; do not branch the UI using user-agent/device guesses.

| Viewport | Content | Filters | PLP columns / gap | Calculated card width |
| --- | --- | --- | --- | --- |
| 320 | 288 | Sheet | 1 | 288 |
| 360 | 328 | Sheet | 2 / 12 | 158 |
| 390 | 358 | Sheet | 2 / 12 | 173 |
| 430 | 398 | Sheet | 2 / 12 | 193 |
| 640 | 608 | Sheet | 3 / 16 | 192 |
| 768 | 720 | Sheet | 3 / 16 | 229.3 |
| 820 | 772 | Sheet | 3 / 16 | 246.7 |
| 1024 | 976 | Sidebar 224 + gap 24 | 3 / 20 | 229.3 |
| 1280 | 1216 | Sidebar 248 + gap 24 | 4 / 20 | 221 |
| 1440 | 1320 | Sidebar 248 + gap 24 | 4 / 20 | 247 |
| 1920 | 1320 | Sidebar 248 + gap 24 | 4 / 20 | 247 |

Two columns at 360 are conditional on real content remaining usable. Use 10px card padding, one short badge, a readable wrapping price and a full-width 44px action. Switch to one column when long text or text enlargement fails acceptance; do not shrink type to preserve column count. The homepage has no filter sidebar, so its card widths differ; start with four desktop columns rather than blindly reusing PLP calculations.

Desktop header: main row min-height 72–80, category row 40–44. Mobile header: 56–64 main row plus a separate 48px search row. Allow content to wrap; these are starting sizes, not clipping heights. Desktop search height 48–52. Sticky content must not obscure focus or consume most of a small landscape viewport.

Homepage hero: desktop two-column composition with approximately 360–440px minimum height; mobile separate text/image blocks and an approximately 4:3 image. Height grows with content. Product gallery uses contain, not hero-style cropping. Section spacing 32–40 mobile and 48–64 desktop. Desktop PDP roughly 56/44 columns with gap 32; stack when content no longer fits. Cart summary 320–360px only when available space allows; otherwise inline. Footer four desktop groups, simpler groups/accordions on mobile.

## 5. Component anatomy and behavior

| Component | Starting dimensions | Required behavior |
| --- | --- | --- |
| Icon | 16 inline, 20 button, 24 navigation; stroke 2 | One SVG family; currentColor; accessible action name |
| Icon button | 44×44 target; 48 for frequent actions | Visible focus, label, pressed/disabled as applicable |
| Button | Min-height 44; main purchase 48; inline padding 16–20; text 14–16 | Default, hover, focus, pressed, loading, disabled; stable size |
| Field/select | Min-height 48; padding 12–16; text 16 | Persistent label, helper/error association, autocomplete/inputMode |
| Checkbox/radio | 20 glyph within min 44 label row | Label clickable; checked/focus/disabled/error |
| Quantity | Each stepper target 44×44 | Server quantity constraints, pending state, failure recovery |
| Filter chip | 36–40 visual with comfortable surrounding hit area | Selected text/style; named remove action |
| Badge | Min-height 24, padding 4×8, text 12 | Usually noninteractive; 1–2 maximum per card |
| Product card | Square media, padding 10–16, gaps 8–12, radius 12 | Image/title/spec/rating count/price/offer context/action |
| PDP gallery | Square main media; thumbnails 64–72 | Stable aspect ratio, selected thumbnail, meaningful alt, fallback |
| Tabs | Target height 44–48 | Correct semantics/keyboard; use accordions where simpler |
| Dialog | Max-width 480–560; min outer margin 16 | Focus management, accessible name, inert background, close/return focus |
| Filter sheet | Up to 400 wide or fullscreen when needed | Draft/apply/reset, internal scroll, safe area |
| Toast | Max-width 360, padding 16 | Nonintrusive announcement; important finance errors remain inline |
| Pagination | 44px targets | Current page announced; URL persistence |
| Portal table | Rows min 52–56; heading 44–48; text 14 | Clear sort/status/actions; compact cards or labelled scroll area on small screens |

44–48px is our usability target. WCAG AA target-size criterion is 24×24 CSS px with exceptions; do not conflate it with the proposed comfort target. Build shared components only when needed, not a speculative library first.

ProductCard must not be a link wrapping nested buttons. Image and title link to the product; cart/favorite controls are separate. Essential actions are always available on touch. If a required variant is unselected, show a details/selection action rather than adding a silent default SKU.

State styling baseline: primary default `#1D4ED8`, hover `#1E40AF`, pressed `#1E3A8A`, all with white text. Keyboard focus uses a visible 3px brand outline with 2px offset and sufficient separation from the control. Loading keeps width stable with a 20px indicator and announces status; prevent duplicate submission without implying success. Disabled may use `#E2E8F0` surface/`#64748B` text with a visible reason when needed; do not rely on a tooltip on a disabled control. Field focus uses brand and error uses danger with associated wording. Selected variants use an inset 2px ring plus a label/check, without shifting layout.

Introduce layering only as needed: content 0, local raised element 10, sticky header 20, custom backdrop 40, custom dialog 50, toast 60. Native dialog uses the top layer; place dialog-specific notices inside it rather than assuming a high z-index can escape that layer. Avoid arbitrary thousands and obscuring active fields/focus.

Product content hierarchy: image → title → one decisive category-specific attribute → real rating average/count or honest no-review state → current price/currency → offer/seller context where needed → action. Do not invent reviews, scarcity, discount reference prices, fulfillment promises, certification badges or payment logos.

## 6. Screen inventory and key smart-home requirements

| Area | Required content/flow |
| --- | --- |
| Store home | Search-led header, one hero, use cases, categories, selected products, compatibility help, brands, support/footer |
| PLP/search | Result count, sorting, applied filters, category-specific filters, grid, pagination/back preservation |
| PDP | Gallery, title, rating, variant, compatibility/requirements, seller offer, price, delivery, warranty/returns, purchase |
| Compare | 2–4 products, meaningful specifications, differences and unknown values; mobile two at a time |
| Cart | Groups by seller, item quantities, availability/price changes, shipping and transparent total |
| Checkout | Registered checkout initially, address/shipping/payment/review, pending/unknown and final outcome |
| Account | Profile, addresses, orders, multiple shipments, cancellation/return/warranty/support |
| Seller | Application/documents/review state, offers/stock, fulfillment, returns, statements |
| Admin | Authorized seller/catalog reviews, operations/support, finance boundaries and audit context |

These are a delivery inventory, not authorization to implement all screens in one pass. Guest checkout, installation, advanced compatibility automation and promotions remain governed by `01_ANALYSIS.md`; do not silently activate them.

Smart-home information: protocol (Wi-Fi/Zigbee/Thread/etc.), whether a hub is required and which one, supported ecosystem with evidence and conditions, neutral requirement, gang count, electrical/load/box constraints where relevant, regional model, local/cloud behavior and required/optional subscription. Put purchase-critical requirements near the CTA. Unknown is distinct from unsupported; a common protocol alone does not prove interoperability. Do not ask shoppers for home Wi-Fi passwords or manufacturer account credentials.

Separate Product, Variant and Seller Offer in state and UI. Changing a seller can change shipping/warranty/price; changing a variant can change technical requirements and imagery. Show the selected combination explicitly. “From” must refer to an actually eligible offer, not an invented cheapest price or a guaranteed delivered total. Platform/store/fulfiller/warranty provider are separate labels when different.

## 7. Dynamic data, state and integration

| State | Owner | Rule |
| --- | --- | --- |
| Drawer open, image, draft variant | Local React state | Keep close to the component |
| Query, filters, sort, page | URL search parameters | Shareable/back-friendly; reset page after applied filter changes |
| Mobile filter draft | Local state until Apply | Cancel leaves committed URL unchanged |
| Cart items | Small CartContext if shared | Keys include offer/variant; totals revalidated by server |
| Auth session summary | AuthContext if needed | Server authorization remains authoritative |
| Products/offers/orders | Server responses | Do not duplicate complete collections across contexts |

Use one source of truth. Derive cheap totals/filtered views from current data rather than storing contradictory copies. Add a server-state cache library only when repeated caching/invalidation needs justify it. Do not build a custom generalized cache/repository framework to avoid a small library.

Every data screen supports loading/empty/error/success. Purchase flows also need unavailable, pending, unknown, changed-price, insufficient-stock and expired-session states where applicable. Skeletons reserve media/card dimensions. Mark retained stale results as updating. Abort or ignore older search responses so they cannot overwrite newer results.

Search suggestions may start with a 250–350ms debounce and bounded results; verify behavior with the real API. Prefer a working submit search over an inaccessible partial combobox. Desktop simple filters may apply immediately; mobile multi-filter sheets apply explicitly. Within a multi-select group use OR and between different groups AND, as agreed by the API; do not invent frontend semantics that contradict the server.

One `api.js` wrapper handles fetch, error mapping, credentials/CSRF policy and AbortSignal. Never automatically replay an unknown payment/order POST; use backend idempotency/status lookup rules. A payment return query string never proves success. No provider secret or privileged credential in frontend source or public Vite environment variables. No raw untrusted seller HTML; security implementation follows `04_SECURITY.md`.

Development fixtures must model two sellers, multiple variants, no reviews, long English names/model codes, missing images and unavailable products. Keep mock mode explicit; never silently replace failed production APIs with fake success. The frontend does not reserve stock by adding to cart and does not calculate authoritative tax/commission/refunds itself.

## 8. Motion and interaction

| Interaction | Proposed duration/effect |
| --- | --- |
| Button color response | 120–160ms |
| Card hover | 160–180ms, translateY no more than 2px |
| Popover | 160–200ms, opacity + 4–8px movement |
| Dialog/sheet | 200–240ms, focus state handled separately |
| Cart feedback | Badge/inline message, no flying-product animation |

CSS transitions/keyframes only initially. Prefer transform/opacity and explicit transition properties. Apply hover movement only under `(hover: hover)` and no-preference motion conditions. Respect `prefers-reduced-motion`; keep the final visible state and essential feedback. Avoid `transition: all`, continuous shimmer across many cards, autoplay video, auto-rotating heroes, scroll hijacking, parallax and blanket `will-change`. Do not hide actions until hover. A future carousel requires deliberate controls and accessibility review, not only an animation.

## 9. Language, accessibility and responsive acceptance

Confirmed sequence: **finish the English-only product first, then add Arabic**. Initially use `<html lang="en" dir="ltr">` throughout customer, seller and admin screens. All navigation, forms, validation, empty/error/pending states and purchase/after-sales journeys are English. Proposed formatting locale is `en-EG`, currency `EGP`. Do not show an unfinished language toggle or auto-switch to Arabic from browser settings. The research report being Arabic does not change the product language.

Keep preparation small: group fixed English UI strings in a plain object by screen/task, use one Intl formatting helper and logical CSS (`padding-inline`, `margin-inline`, start/end). Keep API product descriptions separate from UI dictionaries. No speculative translation platform, empty Arabic dictionary or initial Arabic-font download is needed.

After the English implementation and final review pass for the requested complete scope, activate L01: Arabic UI and content, appropriate language/direction, Arabic font, plural/number/date formatting and full RTL journey review. Use bidi isolation where needed; mirror directional navigation arrows, not logos/search/cart/check/play automatically. Never use global row-reverse as an RTL fix. Arabic must not be required to pass the initial English-only review, and its absence must be reported as scheduled scope rather than a completed feature.

Require keyboard access, visible unobscured focus, skip link, semantic forms/links/buttons, labels and associated error text, meaningful alt, no color-only states. Modal sheets/dialogs manage focus and prevent background interaction; Escape/close and focus restoration follow the interaction's valid state. Use native controls where practical rather than reimplementing complex widgets.

Test 200% text enlargement and 320 CSS-pixel reflow. Do not disable pinch zoom. Test narrow landscape, touch and keyboard, mobile keyboard visibility, safe-area padding for bottom bars and last-content visibility. Horizontal scroll is permitted only inside intentionally labelled comparison/table regions when necessary, not across the page.

## 10. Simple architecture and code conventions

Proposed build tool: Vite, with compatible stable versions recorded at implementation time. Use the current Tailwind Vite integration and a single token definition source; do not mix old v3 configuration recipes into a v4 setup. Reuse an existing suitable repository setup instead of scaffolding a duplicate project.

| Path | Responsibility |
| --- | --- |
| `src/app` | Entry, routes, necessary providers |
| `src/pages` | Screen composition; customer/seller/admin subfolders when needed |
| `src/components/ui` | Small genuinely shared Button/Field/Dialog primitives |
| `src/components/layout` | Header/Footer/StoreLayout/PortalLayout |
| `src/features/catalog` | ProductCard/Filters/Gallery/Compatibility |
| `src/features/cart` | Shared cart state and actions |
| `src/features/auth` | Session UI and auth flow |
| `src/lib` | `api.js`, formatting helpers only as needed |
| `src/styles` | `index.css`, tokens and small motion rules |
| `src/mocks` | Explicit development fixtures |

Do not create empty folders or abstractions in advance. One page composes a few meaningful parts; do not split every span or compress an entire store into one component. Names should explain purpose. Split when responsibilities diverge, repeated logic deserves reuse or a file becomes hard to read; line count is not an acceptance metric. Comments explain non-obvious reasons.

Start with React local state and small contexts. No default Redux, generic repository, dependency injection system, microfrontend, huge UI framework, custom page-builder DSL or form-engine abstraction. One router is reasonable when routes are implemented. Lucide is a proposed icon option: import only the icons used. Complex accessibility behavior must still be implemented correctly; simplicity never means removing focus management or security.

Keep Tailwind class strings complete and statically discoverable. Use a small variant map such as `{ primary: 'bg-brand text-white', secondary: 'bg-white text-brand' }`; do not assemble `bg-${color}-600`. Define semantic theme tokens once, using Tailwind v4 theme variables where appropriate. Validated dynamic values can use CSS custom properties. Avoid class names delivered by untrusted API content and huge configurable component prop surfaces.

## 11. Images, performance and discoverability

Use contain for product media; cover only for suitable lifestyle imagery with deliberate crops. Reserve dimensions/aspect ratio, provide responsive image sizes, defer below-fold media and avoid lazy-loading the LCP image. Do not distort or cut off products to fit a decorative card. Image licensing/brand permissions remain to be resolved before production.

Field targets: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile of real visits, split by mobile/desktop. These have not been measured on this unbuilt project. Lab checks are diagnostics and cannot certify field Core Web Vitals. Route-split heavy seller/admin areas when justified; do not memoize everything preemptively.

Public product routes must support direct opening and useful titles/metadata. Plan canonical URLs, sitemap and accurate product structured data; avoid indexing account/cart/admin. Vite/SPA is a development simplicity choice, not a completed production SEO decision. Before launch verify rendered indexable content and link previews; decide whether public-route prerendering is needed without silently replacing React/JavaScript/Tailwind. Rich-result appearance is not guaranteed by structured data.

## 12. Finite delivery plan once implementation is requested

| Stage | Outcome | Important acceptance |
| --- | --- | --- |
| F00 | Inspect repo, record stack/commands, tokens and one representative card/header | 390/1440, long English/model text, real hit targets |
| F01 | Catalog/search/filter states | URL/back, narrow layouts, loading/empty/error, stale-response handling |
| F02 | Product/variant/offer and comparison | Accurate requirements, unknown compatibility, unavailable variant |
| F03 | Cart/registered checkout and order outcome | Two sellers, quote change, stock failure, pending/unknown payment |
| F04 | Account and after-sales | Ownership, shipment split, cancellation/return/warranty states |
| F05 | Seller/admin tasks in requested scope | Permission-aware actions, real API denial handling, readable small-screen tasks |
| F06 | Complete English scope and final review | English end-to-end journeys, accessibility, responsive evidence, build/performance and integration limits |
| L01 — later | Add Arabic only after English completion/review | Translations/content, RTL, font, formatting and all customer/seller/admin journeys reviewed again |

Create components as needed in each slice. Fix and verify one representative repeated component before copying it across screens. Follow the two cause-directed repair limit from `05_EXECUTION_CHECKLIST.md`; do not endlessly regenerate the UI or replace a working architecture for local styling errors.

## 13. Final frontend checklist

- [ ] English/LTR first and later Arabic sequencing recorded as confirmed; brand/font choices remain provisional.
- [ ] Verified 360/390/768/1024/1280/1440 layouts plus 320 reflow, 200% text enlargement and narrow landscape.
- [ ] Tested keyboard/focus/labels/dialog behavior, reduced motion and touch without hover.
- [ ] Confirmed actual contrast pairs and stable images/skeletons.
- [ ] Exercised long English names/model codes, large prices, no reviews, unknown compatibility, missing images and unavailable offers.
- [ ] Checked search/back/filter draft behavior and stale response handling.
- [ ] Verified two-seller cart, quote changes, rejected/unknown payment, session expiry and server denial behavior.
- [ ] No secrets, fake production fallbacks, false badges, nested interactive links or frontend-only authorization.
- [ ] Build and targeted tests passed with commands recorded; screenshots assessed against the actual scope.
- [ ] Distinguish research, mock preview, sandbox integration and live readiness in the final report.

## 14. Source routing

Human-facing study and full sources: `references/Frontend_Design_Research_AR.md`.

Direct technical references: [React composition](https://react.dev/learn/thinking-in-react), [React state](https://react.dev/learn/choosing-the-state-structure), [Tailwind responsive](https://tailwindcss.com/docs/responsive-design), [Tailwind theme](https://tailwindcss.com/docs/theme), [Tailwind class detection](https://tailwindcss.com/docs/detecting-classes-in-source-files), [Tailwind Vite](https://tailwindcss.com/docs/installation/using-vite), [W3C targets](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [W3C contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [Web Vitals](https://web.dev/articles/vitals).

English font source: [Inter official site](https://rsms.me/inter/). Arabic font candidate for later L01: [Noto Sans Arabic](https://fonts.google.com/noto/specimen/Noto+Sans+Arabic).

No frontend code, live browser UI test, usability test, performance result or final branding approval is supplied by this research baseline.

## 15. Architecture and complete page map

Current architecture: **one React application, five reusable layouts, 88 page families covering 118 route patterns**. Store 11, Auth 7, Checkout 3, Account 15, Seller 19, Admin 30, System 3. A family can reuse explicit list/create/detail components or several route aliases; do not generate 118 independent designs or 88 placeholder screens.

The five layouts are StoreLayout, AuthLayout, CheckoutLayout, AccountLayout nested inside StoreLayout, and PortalLayout shared by seller/admin with distinct fixed navigation and server-backed permissions. Use one declarative router. One AuthProvider serves all areas; customer cart state spans store/account/checkout; merchant scope comes from the URL plus verified membership. Suspended-store obligations/read-only access follow API permissions, not a blanket frontend assumption.

Detailed source of truth for proposed page IDs, routes, content, actions, data capabilities and states: `references/Frontend_Architecture.md`. Structured review inventory: `references/Frontend_Page_Map.json`. Load the relevant area/page IDs only. The JSON is not an application-generation DSL. Actual API endpoints come from OpenAPI; capability names in the inventory are requirements.

Current D00: architecture proposed for review. D01: activate the first Home desktop image after the user accepts this direction, then mobile/catalog/product/cart/portal representatives as needed. Application implementation follows the reviewed visual direction and requested F00–F06 scope. Arabic is later L01 after complete English review. Images do not prove CSS dimensions, accessibility, authorization or working payment behavior.
