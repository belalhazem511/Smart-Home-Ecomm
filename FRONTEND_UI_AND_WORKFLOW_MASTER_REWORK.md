# Smart Home Marketplace — UI and Workflow Master Rework

**Language:** English first, LTR. Arabic/RTL comes after the English experience is complete and reviewed.

**Audience:** The Codex agent working in B:\Smart_Home_Vibe_Coding_Pack (2).

**Repository:** https://github.com/belalhazem511/Smart-Home-Ecomm.git

**Working branch:** integration/storefront-20261123

**Last user-reported baseline:** a9b99443ccac7e7bbb8294ad831b3e190df70729. Inspect the actual local HEAD; do not reset to this SHA.

**Purpose:** Replace the current prototype presentation and fill the missing marketplace journeys. A route containing a heading and a table is not a completed business experience.

## 00. Read this before implementing

This document replaces the earlier small visual-correction brief. It is the comprehensive frontend requirements and gap-audit brief. It does not authorize inventing completed payment processing, authentication, legal compliance, shipment execution, or money transfers.

The owner explicitly requested text-only work. Do not browse competitor websites, use browser automation, generate images, install design libraries, or upgrade dependencies. The supplied screenshots and project documents are the visual evidence. The comparisons below describe established marketplace patterns; they are not a fresh audit of Amazon or Noon, and they do not assert that every competitor uses every feature or policy.

Read project_state.md, the current routes, components, fixture models, existing tests, and the relevant sections of the existing architecture/page map. Do not repeatedly reload the entire document pack. Do not replace existing decisions silently.

First produce a project-local gap audit that maps each requirement ID below to its actual route/component and evidence. Use these statuses:

| Status | Meaning |
|---|---|
| OBSERVED | Visible in the supplied screenshots; does not establish interactivity. |
| LOGIC_TESTED | A specific behavior has an actual test; does not establish visual quality. |
| FRONTEND_COMPLETE | Screen, interactions, validation, and required states exist in the selected data mode. |
| NOT_VERIFIED | Implementation or behavior has not been checked. |
| MISSING | Source inspection establishes that the required implementation is absent. |
| BACKEND_REQUIRED | The UI can exist, but the operation requires server/provider integration. |
| DECISION_REQUIRED | Business rules or provider choices are unresolved. |
| ASSET_PENDING | A required individual visual asset is absent. |
| DEFERRED_P2 | An intentionally later enhancement, with a recorded reason. |

Do not label something missing merely because a screenshot does not show it. Conversely, a passed build, a demo notice, or an isolated helper test does not establish that a journey is complete.

### Execution discipline

1. Audit before editing; preserve current working logic and unrelated files.
2. Implement shared visual foundations and representative screens before broad propagation.
3. Work through the milestones in section 15, one bounded milestone at a time.
4. Keep frontend interactions useful: fields, filters, drawers, detail views, validation, and clearly identified in-memory demo changes.
5. Keep real operations behind explicit backend/provider boundaries.
6. Update project_state.md and the local gap tracker after each milestone.
7. Commit and push each verified milestone using a meaningful English title and body.
8. A missing provider does not prevent building its UI states and documenting its contract. It does prevent claiming the operation works.
9. Do not stop at a generic plan and call the requested work finished. Do not call unresolved gaps complete.

## 01. Evidence and comparison with marketplace expectations

The six screenshots show the following concrete problems. Screenshot dimensions are physical image pixels; they do not prove CSS dimensions or browser zoom. The sizes proposed later are CSS specifications.

- The storefront hero has a large empty image column labeled ASSET_PENDING.
- Header and hero occupy much of the initial viewport; useful product browsing appears far below.
- Product cards devote excessive space to generic icons, then repeat empty-review and unavailable-feature text.
- At least one featured card has a disabled details destination.
- The cart has no visible product thumbnail and spreads a small amount of information across a large area.
- Seller/admin navigation prominently lists many unavailable areas.
- Operational pages contain development explanations such as fixture, memory, fictional records, and deferred features in primary content.
- The seller primary action has dark text on a blue background.
- The dashboards have weak hierarchy, repeated metric blocks, and sparse operational context.
- Storefront screenshots use port 4173; portal screenshots use 5173. Verify the served directories/versions rather than assuming they are identical or stale.

### Capability comparison

The baseline column is a requirement for this product, inspired by familiar large-marketplace behavior. Current evidence refers only to the screenshots and user-forwarded execution reports.

| Area | Marketplace baseline for this product | Current evidence | Required correction |
|---|---|---|---|
| Header | Search, clear categories, account/orders access, cart count | Basic header exists | Improve proportions, navigation and discoverability. |
| Homepage | Product-led merchandising and useful category entry points | Empty hero and repeated cards | Establish deliberate composition and actual asset plan. |
| Product cards | Image, readable model, price, useful attributes, actionable choice | Huge icon areas and development copy | Rebuild shared card and support all displayed destinations. |
| Search | Suggestions, URL state, filters, sorting, useful no-results recovery | Catalog/search logic reportedly exists | Verify complete interactions and presentation. |
| Product details | Gallery, variants, offers, shipping, specifications, clear purchase decision | Selection logic reportedly tested | Audit the whole decision flow and missing states. |
| Compatibility | Product-specific ecosystem and installation requirements | Some fixture attributes exist | Add structured, cautious compatibility information. |
| Seller identity | Seller profile, offer ownership, warranty source | Merchant identity exists | Make offer differences understandable to shoppers. |
| Cart | Product rows, controls, seller splits, valid totals, recovery | Grouping/totals reportedly tested | Add images, selection clarity, and stale-offer recovery. |
| Checkout | Address, per-seller delivery, payment, review, submission states | Four-step demo reportedly exists | Add all exception/result UI; real submission remains gated. |
| Payment results | Success, failed, cancelled, pending and unknown/recovery | Real payment deferred | Create distinct screens/contracts; never infer Paid from a redirect. |
| Authentication | Verification, recovery, session and access states | Forms and local demo login exist | Specify real journey states and backend boundaries. |
| Customer account | Orders, addresses, profile, requests, notifications | Basic account pages exist | Complete aftersales and account-management surfaces. |
| Order tracking | Seller orders, multiple shipments, item quantities, event history | Order snapshots reportedly exist | Add shipment-level presentation and partial-state handling. |
| Cancellation | Eligible items, reason, review, outcome, refund tracking | Not evidenced | Inspect, then implement the missing frontend journey. |
| Returns | Item selection, eligibility, evidence, pickup, inspection, outcome | Not evidenced | Provide a complete request/status journey. |
| Warranty | Coverage source, serial, evidence, request and resolution | Warranty text on some offers | Add warranty case journey; do not invent coverage. |
| Customer protection | Clear costs/policies, evidence, support and escalation | Not evidenced end to end | Make help and dispute resolution discoverable. |
| Seller onboarding | Business profile, documents, review, revisions, approval states | Approved fixture merchants exist | Build application and review UI. |
| Seller membership | Explicit merchant memberships and scoped capabilities | Merchant isolation helpers reportedly tested | Extend scoping to every seller screen and action. |
| Catalog contribution | Match existing product or propose a new canonical product | Draft offers exist; catalog area largely deferred | Separate catalog proposal from seller offer creation. |
| Seller offers | SKU, variant, price, warranty, status and revision history | List and draft editor reportedly exist | Complete lifecycle UI without self-approving publication. |
| Inventory | Warehouse stock, reservations, adjustments and low-stock states | Deferred in screenshots | Add inventory screens and server contract. |
| Seller orders | Search, detail, item-level fulfillment and permitted actions | Overview table exists | Build operational order and shipment journeys. |
| Seller finance | Statements, fee breakdowns, holds, payouts and disputes | Deferred in screenshots | Build read-only finance UI before real financial actions. |
| Admin merchants | Document review, decisions, revision requests and history | Basic review preview reportedly exists | Add detail states and evidence trail. |
| Admin catalog | Proposals, duplicate checks, categories, variants, moderation | Basic preview reportedly exists | Complete review and version-aware screens. |
| Admin operations | Parent/seller orders, shipments, cancellations, refunds | Basic order inspection exists | Provide connected operational detail. |
| Admin support | Customer/seller cases, evidence, deadlines, decisions | Not evidenced | Build case queues and timelines. |
| Admin finance | Settlement reconciliation, holds, payout approval separation | Deferred | Build explicit financial states/contracts; no fake transfers. |
| Trust and accessibility | Clear semantics, keyboard use, contrast, error recovery | Browser checks unverified | Source checks plus a manual review checklist. |

## 02. Scope, priorities, and unresolved business decisions

### Priority meanings

- **P0:** Core purchase/sale journeys, usable navigation, coherent visual system, truthful states, and protections against misleading or invalid actions.
- **P1:** Complete operational UI, customer aftersales, merchant onboarding, administration, and connected preview scenarios.
- **P2:** Enhancements such as advanced promotions, advertising, warehouse scanning, recommendation engines, and installation scheduling. Record them; do not use them to delay the core experience.

P0/P1 frontend completeness is different from production readiness. Authentication, actual orders, stock reservations, provider payments, carrier booking, document verification, refunds, payouts, and legally binding decisions need backend integration.

### Decisions that must be recorded instead of invented

| Decision | UI consequence |
|---|---|
| Operating countries, currencies and legal entities | Address fields, currencies, taxes, seller eligibility and policies. |
| Merchant of record and invoice issuer | Who sells, who issues invoices, tax documents and refund responsibilities. |
| Payment provider and supported methods | Hosted checkout, callbacks, saved-payment tokens and refund capabilities. |
| COD availability and carrier remittance | Eligibility, cash collection, settlement and refund handling. |
| Shipping responsibility and carriers | Labels, pickup, tracking, failed delivery and return-to-origin. |
| Commission model and promotion funding | Seller statement calculations and customer discount presentation. |
| Payout provider/schedule and reserve policy | Pending, available, held, requested and paid balances. |
| Cancellation, return and warranty policies | Eligibility and deadlines; do not hardcode arbitrary days. |
| Category/document requirements | Seller documents, product evidence, restricted products and review queues. |
| Installation/service scope | Device-only purchase versus separately booked installation. |

Document names such as business registration, tax registration, representative identity, bank-account evidence, authorization letters, supplier invoices, or beneficial-owner information are possible inputs. The actual requirements depend on the country, business model and provider; this document is not a statement of current legal obligations.

## 03. Route and navigation inventory

Follow existing agreed paths where they differ from the examples below. Do not add duplicate aliases casually. A screen may be a route, nested panel, drawer, or tab when that makes the code simpler. Each journey still needs a reachable entry and exit.

| Area | Required screen families |
|---|---|
| Storefront | Home; category index; category catalog; brand index/catalog; search; product detail; seller storefront; compare; wishlist. |
| Customer authentication | Sign in; sign up; verification; recovery request; reset password; session-expired/access states; optional MFA when implemented. |
| Checkout | Cart; address/delivery/payment/review steps; provider return/resume; order result: success/pending/failed/unknown. |
| Customer account | Overview; profile; addresses; security/sessions; orders; order detail; shipment detail; cancellation; returns; warranty; requests/cases; reviews; notifications; privacy requests. |
| Public support | Help center; contact/support entry; shipping; returns; warranty explanation; terms; privacy; seller information; compatibility help. |
| Seller entry | Sell-with-us landing; application draft; documents; review status; revision/resubmission; merchant selection. |
| Seller workspace | Overview; catalog lookup; product proposals/list/detail/editor; offers/list/detail/editor; inventory/warehouses/adjustments; orders/detail; shipments/detail; aftersales/cases; statements/payouts; team/settings/support. |
| Admin workspace | Overview; merchant queue/detail; users; memberships/access; categories/brands/attributes; product/proposal/offer review; order/seller-order/shipment inspection; cancellation/return/warranty/disputes; finance/reconciliation; support; reviews; content/policies/settings; audit/operations. |
| System | Not found; access unavailable; service error; maintenance where applicable. |

Typical existing routes include /shop, /search, /products/:productSlug, /cart, /checkout, /account, /seller/:merchantId, and /admin. Use the local page map as the authoritative path inventory after reconciling it with source.

Navigation rules:

1. Every visible primary destination must open a meaningful implemented screen.
2. Remove long disabled roadmap lists from ordinary navigation; keep the roadmap in documentation.
3. If an action is unavailable, explain the relevant reason near that action. Do not scatter developer terminology over the interface.
4. Keep clearly labeled local preview entry points for Customer, Seller and Admin in development mode.
5. Do not add a production role picker that grants privileged access.
6. Preserve category/search/filter URL state and useful browser Back behavior.
7. Customer orders, seller orders, offers, variants, shipments and cases need distinct identifiers and detail destinations.

## 04. Visual system and layout specifications

These are proposed implementation targets, not measurements inferred from the screenshots. Inspect existing styles first. Replace conflicting rules instead of appending override blocks repeatedly.

| Foundation | Specification |
|---|---|
| Brand accent | Existing cobalt #1D4ED8; hover #1E40AF. Use it consistently for primary actions and active states. |
| Text and surfaces | Text #111827 or existing navy; muted #64748B; white panels; restrained #F5F6F8 canvas; #E2E8F0 borders. |
| Typography | One intentional sans-serif stack, using available local assets or system fonts. No external font dependency is required. |
| Type hierarchy | Body/form 16px; table/card detail 13–14px; product title 14–16px; section/page heading 24–30px; hero 32–40px. |
| Spacing | A small consistent scale: 4, 8, 12, 16, 24, 32, 48px. Avoid arbitrary large padding everywhere. |
| Store content | Existing 1320px maximum with 16/24/32px responsive gutters. |
| Header | Approximately 24px utility row, 64px main row, 40px category bar on desktop. Search is the main control. |
| Hero | Approximately 280–320px desktop. Without photography, use a compact promotion strip rather than a large empty image panel. |
| Category entry | Compact image-led tiles; no oversized empty squares and repeated generic taglines. |
| Product grid | Four or five columns when space supports it; three/two/one according to usable card width. Do not force unreadable mobile cards. |
| Product media | Approximately 170–190px desktop card media area; consistent object-fit contain and background treatment. |
| Buttons | Approximately 40–44px desktop controls and at least 44px mobile touch targets. Primary text must contrast with its background. |
| Icons | Existing shared SVG set, normally 18–20px in controls; consistent stroke and alignment. |
| Corners | Around 8px controls/cards and 12px larger panels. Avoid excessive nested rounded boxes. |
| Portal shell | Full application width, approximately 224–240px sidebar, 64px top bar, 24px workspace padding. Store max-width does not constrain the whole portal. |
| Portal density | 24px page heading; about 96px metric cards; table header about 40px; rows typically 48–56px, expanding for legitimate content. |
| Motion | Short opacity/transform transitions, around 120–200ms; reduced-motion support; no animated decoration on every card. |

### Storefront composition

- Give search, category discovery, account/orders and cart a clear order.
- Display cart unit count rather than the number of distinct lines.
- Keep the hero subordinate to shopping content; products should not be several unnecessary screens away.
- Use specific product/category copy. Repeated generic slogans do not make a marketplace feel established.
- Use one coherent page background and clear panel boundaries; do not enclose every label in a pill.
- Real product photography is a visual-completion requirement. A generic line icon remains a fallback, not a finished product image.

### Operational workspace composition

- Use a deliberate sidebar/top-bar structure and a clear active location.
- Put title, short context and primary action on one well-aligned page header.
- Place search, status/date filters and table actions in a practical toolbar.
- Make money columns easy to scan, quantities aligned, identifiers readable, and statuses text-labeled.
- Small-data and zero-data states are legitimate. Do not invent revenue, trends or charts to fill empty space.
- Provide one compact persistent Demo preview indicator with an information disclosure. Keep the fictional-data limitation discoverable without repeating development paragraphs in every panel.

### Asset plan

Record each missing asset with asset key, related product/category, expected local filename, purpose, aspect ratio, alt text, availability and source. Needed assets include a hero if retained, category imagery, individual product/gallery images, seller logos where supplied, and optional local font files.

Do not use a full reference screenshot as the implemented page. Do not use unrelated photography as a product image. When an asset is missing, implement a restrained fallback and keep ASSET_PENDING in the tracker. Do not call visual signoff complete while critical assets remain missing.

## 05. Shared interaction and state requirements

For each applicable screen, cover initial/loading, populated, empty, no-results, invalid input, request error, unavailable resource, insufficient access, and successful local interaction states. Render only states relevant to the operation.

- Loading must correspond to actual asynchronous work; do not add artificial delays for appearance.
- Preserve input after recoverable errors. Move focus to a useful error summary when appropriate.
- Use labels, helper text and field-specific errors. Do not rely only on placeholders or color.
- Distinguish saving, saved, failed, pending confirmation and unknown outcome.
- Prevent duplicate submission while an operation is in flight. Real idempotency belongs to the server contract.
- Warn about genuinely unsaved changes when leaving an editor; do not prompt on every harmless navigation.
- Dialogs/drawers need keyboard entry, focus handling, Escape where appropriate, and a clear close action.
- Show useful feedback after removal or saving; support undo where safe and simple.
- Keep table overflow inside its container. Avoid document-wide horizontal scrolling.
- Do not expose internal stack traces, provider secrets or raw technical error strings to ordinary users.
- Avoid stale search/filter responses replacing newer results when an API is later connected.

### 05.1 Component-level acceptance

| Component | Required details |
|---|---|
| Search | Named input, clear control when populated, keyboard submit, Escape to close suggestions, query retained on results. Suggestions have a useful selected state and destination. |
| Category navigation | Active category, recognizable hierarchy, predictable mobile expansion, meaningful item names, no empty dropdown panels. |
| Product image/gallery | Stable aspect ratio, correct contain/crop treatment, alt text, selected thumbnail, useful missing/error fallback, no layout jump while loading. |
| Product card | Two-line title boundary, deliberate attribute hierarchy, consistent money formatting, supported offer/action, no false review/discount/scarcity decoration. |
| Money display | Shared formatter; currency unambiguous; unit versus line totals distinct; zero and unavailable values never confused; no NaN or undefined output. |
| Quantity control | Integer input, increment/decrement if used, min/max state, accessible names, invalid input recovery, update feedback; quantity zero has an explicit removal behavior. |
| Form field | Visible label, required/optional distinction, format hints where needed, autocomplete, field error, disabled/read-only distinction and useful focus state. |
| Primary/secondary/destructive action | Consistent size/contrast, loading state, meaningful label, duplicate-submit protection, confirmation proportional to consequence. |
| Filter toolbar | Current values, clear/reset behavior, applied count where useful, status/date control, result count and no-results recovery. |
| Data table | Semantic headings, stable row identity, aligned amounts, visible row destination, status text, empty/loading/error states and contained overflow. |
| Pagination | Actual item/page counts, disabled boundary controls, retained filters, invalid-page recovery and a useful page-size choice only when implemented. |
| Dialog/drawer | Accessible title, sensible initial focus, close behavior, no lost draft by accident, keyboard containment and focus return when applicable. |
| Status badge | Text plus restrained color; distinguish payment/order/shipment states; no unexplained color-only meaning. |
| Timeline | Dated events, actor/source when useful, chronological ordering, current state and meaningful next step. |
| File upload | Purpose, accepted type/size, selected file preview/metadata, replace/remove, progress/cancel/retry and field-specific errors; real safety validation belongs to the backend. |
| Feedback | Inline confirmation or concise toast as appropriate; preserve context; distinguish local demo save from external execution. |

### 05.2 Field and action contracts for important forms

Use the existing business specification where it is more precise. Conditional fields depend on country, product type, policy or provider. Do not make every field mandatory by default.

| Form | Core fields/context | Main actions and validation/result requirements |
|---|---|---|
| Customer sign-up | Name, email, password, confirmation, applicable terms reference | Create account/preview as appropriate; field errors; verification next step; no seller/admin role grant. |
| Sign-in | Email, password, optional supported second factor, safe return destination | Sign in, show password, recover access; invalid/unverified/suspended/expired states; demo boundary explicit. |
| Verification/reset | Account-safe reference, code/link state, new password/confirmation for reset | Verify/reset, resend with configured cooldown, expiry/used-code errors; never log secrets. |
| Address | Recipient, phone, country, region/city, address lines, postal code when required, optional delivery notes/default | Save/cancel/select; country-aware validation; unsupported area; address edits do not rewrite order snapshots. |
| Checkout delivery | Seller/shipment group, covered items, service, cost, estimate, selected address | Choose/change; invalidate incompatible choices after address/cart changes. |
| Checkout payment/review | Eligible method, hosted provider reference when live, final cost breakdown and reviewed policies | Back/edit/review/submit; duplicate prevention; changed-price/stock and pending/unknown outcomes. |
| Cancellation | Eligible line IDs, quantities, reason, displayed consequence | Review/confirm; ineligible/too-late response; show request status separately from refund status. |
| Return | Line IDs/quantities, reason, issue description, evidence, preferred remedy when allowed, pickup/drop-off | Save draft/review/submit; eligibility, upload errors and request timeline. |
| Warranty | Order item, serial when applicable, coverage source, issue, evidence and contact | Review/submit; unknown/expired/ineligible coverage; assessment timeline and remedy. |
| Support case | Category, linked resource, subject/description, evidence, participant visibility | Submit/reply/escalate; preserve text after failure; public versus internal messages explicit. |
| Merchant application | Business/legal/public identity, country, representative/contact, applicable registrations, documents | Save draft/review/submit; completeness; duplicate/changes-requested/rejected/approved states. |
| Store settings/team | Public name/contact/media, operating/return locations; invitation email and scoped capabilities | Save/cancel/invite/revoke; unsaved changes; permission and verification boundaries. |
| Product proposal | Category, brand/model, identifiers, description, typed technical attributes, variants, images/documents | Save draft/preview/submit; duplicate candidates, missing category attributes and requested revisions. |
| Seller offer | Product/variant, seller SKU, condition if supported, price/currency, warranty, fulfillment/lead time | Save/cancel/preview/request publication; scoped identity, SKU uniqueness, positive valid money and revision state. |
| Stock adjustment | Warehouse, inventory identity, adjustment quantity, reason and reference | Review/confirm; invalid quantities, conflicting state and preserved adjustment history. |
| Shipment preparation | Seller-order lines, quantities, package, serials if required, service/pickup | Review/create preview; remaining-quantity bounds; real booking/label is backend-gated. |
| Admin review decision | Target/version, evidence, findings, decision/revision requests, reason | Review/confirm; stale version, missing reason, insufficient capability and audit record. |
| Refund review | Order/payment/item references, quantities/amount, allocations, reason, previous/pending refunds | Review/authorize preview; refund bounds; approval/provider execution/outcome separated. |
| Payout/hold review | Merchant, statement/amount/currency, verified beneficiary status, reason and approval context | Prepare/review/approve/execute as permitted; independent capability gates and real provider outcome. |
| Policy/content editor | Type/title/body, relevant links/assets, version, effective/publish dates | Save draft/preview/publish state; invalid dates/links; preserve applicable historical versions. |

### 05.3 Do not use integration gaps to omit the frontend journey

BACKEND_REQUIRED is an integration tag, not permission to leave a menu item, blank panel or permanently disabled form and call that journey complete.

In the explicitly identified local demo, forms may create linked in-memory draft/request records and navigate to their detail/status views. Label the action/result as a demo preview where needed. Keep related lists, counts and timelines consistent. Real payment, document verification, shipment booking, financial execution and privilege changes remain unexecuted.

For external outcomes, provide clearly separated development fixture scenarios rather than pretending a normal action succeeded. For example, Preview payment pending can open a fictional pending result; it must not state that a real charge was confirmed. Small fixture scenarios and direct preview links are sufficient; do not build a general simulation engine.

## 06. Customer journey — discovery to purchase

### C01. First visit, navigation and help — P0

1. Open Home; understand what is sold and how to browse.
2. Use category navigation, search or a product collection.
3. Open category/brand/seller destinations without dead links.
4. Find account/orders, cart, support and relevant policy links.
5. Use mobile menu/search without losing the current page unexpectedly.
6. If location is requested, explain its delivery purpose; do not demand a full address merely to browse.

Acceptance: a first-time visitor can reach a supported product and understand the next shopping action without encountering development instructions.

### C02. Search and catalog — P0

1. Enter a query; trim accidental surrounding spaces and retain the meaningful query.
2. Show useful suggestions when supported by local data; maintain keyboard selection and dismissal.
3. Submit to the results route; show query, actual result count and sort control.
4. Apply category, brand, price, protocol, hub requirement, installation requirement and supported compatibility filters where data exists.
5. Show active filters, remove one, or clear all.
6. On mobile, edit draft filters in a drawer; Apply commits them and Cancel restores the previous applied state.
7. Changing filters resets invalid pagination. Back/refresh preserve URL state.
8. Handle no results with clear recovery; do not show unrelated products as exact matches.
9. Handle invalid query parameters safely and show a usable default.

Do not display filters with fabricated data. Preserve existing tested search/filter behavior during restyling.

### C03. Product cards and product decision — P0

Cards must show a useful image, readable name/model, important specification, price/currency, offer context and appropriate action. Hide empty optional review/discount rows instead of repeating placeholder messages.

Product detail steps:

1. Open a supported product; handle unknown, archived and unavailable products distinctly.
2. Browse gallery thumbnails; indicate selected image; support accessible zoom when implemented.
3. Understand brand/model, condition, included items, specification and setup requirements.
4. Select a variant. Changing variant clears an incompatible seller offer.
5. Compare eligible seller offers by price, warranty provider, fulfillment/delivery information and seller identity.
6. Select an offer; atomically update its price, warranty and applicable purchase details.
7. Set a valid quantity and use Add to cart, or receive a meaningful reason it is unavailable.
8. Review confirmation and choose Continue shopping or View cart.

Do not automatically choose a different seller after a selection becomes invalid without telling the customer. Price labels such as From must reflect actual applicable offers. Do not present an unavailable offer as purchasable.

### C04. Smart-home compatibility — P0

Provide structured information where known: protocol, frequency/band, required hub/controller, supported ecosystems, neutral-wire requirement, voltage/load, gang count, plug/socket standard, installation dimensions, connectivity, local/cloud requirements, app, subscriptions, included accessories and warranty source.

Compatibility states must distinguish Supported, Unsupported, Conditional and Unknown. Same protocol does not establish complete interoperability. A certification/logo requires product-specific supporting data.

Where compatibility depends on a hub or wiring choice, expose the condition before purchase. Give a clear support/help path. Keep installation booking as a separate later feature unless explicitly included in scope.

### C05. Wishlist, comparison and seller storefront — P1

- Wishlist: add/remove, readable saved list, unavailable item handling, and a clear path to choose a current offer. Anonymous local persistence may contain public product IDs; do not store personal details.
- Comparison: choose a small documented maximum, compare normalized attributes, remove/clear items, distinguish Unknown from No, and link back to product selection.
- Seller storefront: public identity, supported products, published business information and policy links. Do not expose private verification documents or invent seller ratings.
- Reviews: show actual supported records, useful sorting and report actions. A verified-purchase label requires a qualifying order relationship validated by the backend; do not invent reviews to improve appearance.

### C06. Cart management and invalidation — P0

1. Add a valid product/variant/offer combination.
2. Merge repeated additions of the same offer/variant; keep distinct seller offers separate.
3. Show a linked product thumbnail/title, variant, seller, warranty, unit price, quantity, line total and removal action.
4. Group lines by seller, display seller subtotals and overall items subtotal.
5. Change quantities with valid integer limits; provide removal and empty-cart recovery.
6. Restore only validated identifiers and quantities from local storage. Recalculate prices from the current data source.
7. If an offer disappears, becomes unavailable, changes variant or changes price, explain which line needs attention. Do not silently charge another offer or retain a trusted stored price.
8. Separate items subtotal, discounts when supported, estimated shipping, tax treatment when configured, and final/estimated total.
9. Provide a usable checkout action only when the cart is valid.

Do not reserve stock merely because an item is in the cart. Do not auto-fill the user's cart with sample items to make screenshots appear busy. Save-for-later is useful only when its list and return action exist.

### C07. Authentication, verification and account recovery — P0 UI / BACKEND_REQUIRED

Real journey requirements:

1. Sign up with the required customer fields and explicitly presented password requirements.
2. Handle field validation, duplicate/unsuccessful registration safely, terms versions when required, and verification pending.
3. Verify the configured email/phone channel; show resend, cooldown, expired code/link, incorrect attempt and successful verification states.
4. Sign in; handle incorrect credentials, unverified account, locked/suspended state and expired session appropriately.
5. Recovery request uses a neutral response; do not reveal account existence unnecessarily.
6. Open recovery link/code; handle invalid/expired/used links; set and confirm a new password; show the real result.
7. Sign out, view/revoke sessions and change password/email through the real backend when integrated.
8. Preserve only a safe internal return destination; never redirect to an arbitrary external return URL.

Current local demo sign-in is explicitly a preview convenience. Preserve its development-only boundary. Do not create real JWTs or claim route security from client state. Customer registration must not assign seller or admin privileges. The existing 15–128 character sign-up rule is provisional until the real authentication contract is decided; keep it consistent and documented.

### C08. Checkout address, delivery and review — P0

1. Enter checkout from a valid cart; preserve the cart on every failure.
2. Establish the intended customer/session context. The initial live launch expects authenticated checkout; guest checkout is a separate decision, not an accidental bypass.
3. Choose a saved address or enter a new address. Existing demo addresses may be connected through a small shared state; do not duplicate conflicting address stores.
4. Validate fields for the selected country, delivery area and contact requirements. Show unsupported-area states.
5. Select delivery per seller/shipment group; show item coverage, costs and estimated windows.
6. Changing the address invalidates delivery options/prices that no longer apply and may invalidate payment eligibility.
7. Choose an actually supported payment method. Explain COD restrictions, installment costs, subscriptions or other conditions only when configured.
8. Apply a promotion only through supported rules; show invalid, expired, ineligible and removed-promotion states. Avoid client-authoritative discounts.
9. Review items, seller splits, variants, address, delivery, payment, costs, warranty source and relevant policies.
10. Allow editing each section without losing unrelated valid values.
11. Block URL step changes that bypass incomplete prerequisites.
12. On real submission the server revalidates identity, offer, quantity, stock, price, delivery, tax and eligibility. If changed, show a review/acceptance step rather than silently charging different terms.

Use integer minor units and a documented currency. Avoid double-counting tax when prices are tax-inclusive. Discounts and seller allocations must remain consistent during partial cancellation/refund.

In preview mode, final order/payment execution stays unavailable or is an explicitly labeled development scenario preview. Do not turn a fake success toast into apparent order creation.

### C09. Payment, return and result states — P0 UI / BACKEND_REQUIRED

Required screen states: starting payment, customer action/hosted provider step, cancelled, declined, processing/pending, unknown outcome, confirmed paid, and expired attempt.

1. Create/reuse the server-authorized order/payment attempt using idempotent submission semantics.
2. Redirect to the provider or use its supported hosted UI; do not collect/store card PAN or CVV in this frontend.
3. Return from the provider to an internal attempt/order reference.
4. Ask the backend for authoritative payment state. Redirect/query parameters alone never mean Paid.
5. Pending and unknown outcomes must show a useful status/resume/support path; they are not automatically failed.
6. Retry only when allowed; avoid duplicate orders and duplicate charges.
7. On confirmed order creation, show reference, seller splits, next steps and receipt/order link.
8. Clear or reconcile cart items only after actual confirmed order creation, not after a button click or provider redirect.

Preview scenarios may use separate fixture links for success/pending/failure/unknown screens. Keep their fictional nature clear. They do not execute payments.

## 07. Customer journey — after purchase and account management

### C10. Orders, shipment tracking and documents — P0/P1

1. Find an order through history search/filter and open its detail.
2. Show purchased snapshots of product, variant, seller, price, address and policies where needed. Do not rebuild past orders from current catalog prices.
3. Show the customer order split into seller orders and item-level quantities.
4. Display separate order, payment, fulfillment and delivery states.
5. Support several shipments per seller order, partial shipments and partial delivery.
6. Show each shipment's items, quantities, carrier/tracking reference, ETA when known and dated event timeline.
7. Distinguish carrier handover, attempted delivery, delivered, refused, lost and return-to-origin.
8. Make invoice/receipt/warranty documents available only when actually generated and authorized; never ship placeholder downloads as real invoices.
9. Make eligible Cancel, Return, Warranty and Contact support entry points discoverable.
10. If Buy again is offered, resolve current variants/offers and prices before adding to cart; never charge historical order prices automatically.

### C11. Cancellation — P1

1. Start from a specific order/seller-order line.
2. Select eligible items and quantities; show ineligible reasons.
3. Enter a reason and review financial/delivery consequences.
4. Confirm once; present requested/under review/accepted/rejected/too-late states.
5. Handle shipment-versus-cancellation races through authoritative server state.
6. Keep refund progress separate from cancellation approval.
7. Preserve the status of unaffected items and seller orders.

The customer cannot cancel quantities already cancelled or otherwise ineligible. A cancelled order is not proof that money was refunded.

### C12. Return request and inspection — P1

1. Choose delivered items and allowed quantities from order detail.
2. Show policy eligibility and explanation; unknown policy must not become an invented return window.
3. Select reason and requested remedy where supported.
4. Attach appropriate evidence using private, validated uploads once integrated.
5. Review pickup/drop-off details and any disclosed costs.
6. Submit a request and obtain a real request ID only from the backend.
7. Track review, information requested, approved/rejected, label/pickup, in transit, received, inspection and outcome.
8. Handle damaged/wrong item, missing accessories, serial mismatch, partial acceptance and appeal.
9. Show refund/replacement progress separately from return approval.
10. Prevent quantities exceeding purchased eligibility after previous/pending returns.

For smart devices, provide manufacturer-appropriate data removal/unpairing guidance. Never ask the customer to disclose home Wi-Fi passwords, pairing secrets, or account passwords in a support form.

### C13. Warranty and replacement — P1

- Explain who provides the coverage: seller, manufacturer, or another named service.
- Capture the qualifying order item, serial when applicable, issue, evidence and contact preference.
- Show coverage start/end and exclusions only from the applicable policy/contract.
- Track request, information needed, assessment, repair/replacement/rejection and escalation.
- Preserve the original order and any replacement item/shipment relationships.
- Do not treat a warranty claim as an ordinary return or assume every product has identical coverage.

### C14. Customer support, disputes and notifications — P1

- Open a case linked to an order, shipment, return, warranty or payment attempt.
- Show case reference, category, status, participant-visible timeline and permitted attachments.
- Distinguish public replies from internal staff notes.
- Support information requests, response deadlines, escalation, resolution and reopening/appeal according to defined policy.
- Provide a clear route for non-delivery, wrong product, unauthorized charge concerns and seller disagreements.
- Separate notification creation from actual email/SMS delivery. Do not claim messages were sent when no provider is connected.
- Notifications link to the relevant resource and support unread/read state where implemented.

### C15. Profile, addresses, security and privacy — P0/P1

- Profile edits need validation, save/cancel, pending/error feedback and a consistent overview summary.
- Email/phone changes use the real verification process once integrated.
- Address add/edit/delete/default behavior remains deterministic. Deleting the last address leaves a real empty state.
- Historical order addresses stay unchanged after address-book edits.
- Password/session changes require real backend support; client-only toggles provide no security.
- Privacy/export/deletion requests require status tracking and actual fulfillment rules. Do not silently hard-delete transactional records or claim export completion without a file.
- Persist personal data only through the authorized real storage contract; current demo profile/address changes remain in memory.

## 08. Seller journey — onboarding, catalog, offers and inventory

### S01. Seller application and business verification — P1

1. Explain the selling model, eligibility, fees and required information from configured policies.
2. Start an application linked to the user's account; this does not grant an approved merchant membership.
3. Enter legal/business information, public store information, authorized contact and operating country.
4. Enter required registration/tax/payment details only where applicable.
5. Upload each required document with purpose, allowed type/size, progress, errors and replacement/version handling.
6. Separate public store content from private verification evidence.
7. Save a draft, review completeness and submit once.
8. Show submitted, in review, changes requested, approved, rejected, expired-document and suspended states where applicable.
9. Show specific correction requests and resubmission history.
10. After approval, show remaining setup steps such as payout verification, warehouse/return address and first offer.

UI document validation is not verification. Real uploads require private storage, access controls, validation/scanning and authoritative review. Keep these as backend dependencies.

### S02. Merchant context, team and settings — P0/P1

- A customer may belong to more than one merchant; do not use one global Role field as the entire membership model.
- List only assigned merchants in the selector. Unknown or unassigned IDs show unavailable/access states without falling back to another merchant.
- Switching merchants scopes every list, count, draft, selected row, warehouse, order and finance view. Clear stale selections and unsaved-change conflicts deliberately.
- Team invitations need recipient, merchant role/capabilities, pending/accepted/expired/revoked states and a permitted management path.
- Owner/catalog/operations/support/finance capabilities are merchant-scoped; platform admin access is separate.
- Store settings include public profile, logo, contact details, fulfillment/return locations and policy references.
- Bank/payout changes require the backend's verification and additional authorization process; never make a frontend Save button establish verification.

### S03. Existing catalog matching and new product proposals — P1

1. Search canonical products by model/brand/identifier before creating duplicates.
2. Inspect an existing product and its variants; choose the exact variant to create an offer.
3. If absent, start a product proposal linked to the submitting merchant.
4. Select category and enter its required attributes: model, descriptions, technical specifications, identifiers and compatible product evidence where applicable.
5. Upload actual gallery images and supported manuals/specification documents.
6. Define variants using explicit attribute values and stable identities; avoid a generic variant engine when a simple editor is sufficient.
7. Validate required fields, duplicate candidates, inconsistent units and invalid combinations.
8. Save draft, preview and submit for review.
9. Track pending, changes requested, approved/rejected and revision history.
10. Do not let a seller directly overwrite a shared approved product used by other merchants.

### S04. Offer creation, revisions and lifecycle — P0/P1

1. Select an approved product and compatible variant.
2. Enter merchant SKU, condition when supported, price/currency, warranty source/details, fulfillment information and relevant lead time.
3. Validate SKU uniqueness within that merchant and integer minor-unit money.
4. Keep merchantId and offerId non-editable identities.
5. Save/cancel a draft; preserve draft state across portal navigation in the agreed demo mode.
6. Preview what the customer would see without publishing it accidentally.
7. Submit for review/publication under the actual configured policy.
8. Display draft, pending review, changes requested, published, paused, rejected and archived states as applicable.
9. Preserve the published version while a proposed revision is under review.
10. Show pause/resume/archive consequences and allowed actions. Do not self-approve publication through a seller control.
11. Bulk import/export is P2 unless already required; simple individual flows come first.

Current published fixture offers remain read-only until a properly scoped preview revision workflow exists. Never mutate historical customer order snapshots when an offer changes.

### S05. Inventory and warehouses — P1

- List merchant warehouses/locations and their relevant fulfillment/return information.
- Show inventory by merchant, offer/variant and warehouse with on-hand, reserved, available and other explicitly defined quantities.
- Choose and document one inventory calculation; do not subtract reserved stock twice. Available quantity is derived, not an unrelated editable field.
- Add stock adjustments with quantity, reason, reference, actor and confirmation. Preserve adjustment history.
- Prevent negative or otherwise invalid results according to the server rules.
- Show low-stock/out-of-stock states and useful filters using actual data.
- Explain reservations and releases from orders/cancellations; cart addition is not a reservation.
- Support loading, empty warehouse, unknown offer, insufficient permission and conflicting-update states.
- Barcode scanning, purchase-order procurement and advanced WMS are P2.

## 09. Seller journey — orders, fulfillment, aftersales and finance

### S06. Seller order operations — P1

1. Search/filter seller orders by reference, date and separate operational/payment statuses.
2. Open detail with purchased snapshots, eligible customer/fulfillment information, items and quantities.
3. See only actions allowed by the server's order/payment/fulfillment state.
4. Pending online payment must not be treated as permission to ship. A confirmed eligible COD order may be fulfillable before cash collection; do not apply an online-payment rule blindly to COD.
5. Confirm available items, identify shortages, and follow cancellation/substitution rules. Do not silently substitute products.
6. Prepare one or more packages with item quantities, serials when applicable, dimensions and required documentation.
7. Keep order, payment and shipment states distinct; seller users cannot mark an online payment Paid.
8. Show canceled quantities and remaining fulfillable quantities clearly.

### S07. Shipment creation, handover and delivery exceptions — P1

1. Select eligible unshipped item quantities; support partial shipments.
2. Choose a configured shipping service/address and review actual costs/constraints.
3. Request a real label/booking only through an integrated backend; preview fixtures must not masquerade as booked shipments.
4. Display label/document availability, pickup date, package reference and tracking.
5. Distinguish packed, ready for pickup, handed to carrier, in transit, delivery attempted, delivered and return-to-origin.
6. Show carrier events, failed pickup/delivery, address issues, loss/damage and escalation paths.
7. Prevent shipping more units than remain eligible; one item can be divided across shipments through quantity records.
8. Carrier handover, delivery proof, COD collection and COD remittance are separate events.

### S08. Seller aftersales and disputes — P1

- List cancellation, return, warranty, non-delivery and other cases with filters and deadlines.
- Open the linked order/items, request reason, customer evidence and timeline.
- Request information, respond with permitted evidence, and record a reasoned recommendation.
- Record received return quantities, serial/accessory checks and inspection results.
- Escalate disagreements to the platform; do not let a seller unilaterally erase a customer's case.
- Distinguish seller recommendation, platform decision, physical return, refund authorization and actual refund result.
- Keep evidence private and participant-scoped. Do not expose unrelated customer orders or internal-only notes.

### S09. Statements, payouts and reconciliation — P1 UI / BACKEND_REQUIRED

Provide read-only, traceable views before enabling financial actions:

- Gross sales, seller-funded discounts, platform-funded promotions, shipping allocations, commissions, fees, taxes when applicable, refunds, adjustments and net proceeds.
- Separate pending, reserved/held, available, requested, processing, paid and failed amounts where the agreed finance model uses them.
- Link statement lines to seller orders, refunds, fee versions and payout batches.
- Display payout beneficiary verification and provider status without exposing full sensitive account data unnecessarily.
- Support statement date range, currency, download availability and an explanation of holds.
- Track payout requests, approvals, execution, failures, returns and disputes independently.
- Show COD carrier collection/remittance and reconciliation states separately from delivery.
- Do not sum different currencies into an unlabeled total or equate Paid customer order with immediately available seller funds.
- Do not call the flow escrow unless that legal/provider arrangement actually exists.

### S10. Seller support and notifications — P1

Seller support needs category, linked merchant/resource, attachments, public replies, case status, response history and escalation. Notifications should link to review requests, low stock, orders, shipments, cases and statement/payout events without inventing external message delivery.

## 10. Admin journey — marketplace operation

### A01. Workspace, access and overview — P0/P1

- Provide a coherent application shell with navigation grouped by real work.
- Derive counts from records and support date/status context where useful.
- Prioritize actionable queues: merchant reviews, catalog/offer reviews, delivery issues, customer/seller cases and financial exceptions.
- Link every queue/card to a meaningful filtered destination.
- Scope capabilities per resource/action. A visible client control is not authorization.
- Separate view, edit, approve, execute, export and access-management capabilities.
- Keep the current admin entry an explicitly fictional local preview until real authentication/authorization exists.

### A02. Merchant and document review — P1

1. Search/filter applications by state, country, submission date and assigned reviewer where supported.
2. Open business information, submitted document metadata, private document access and version history.
3. Record review findings, missing information and category/provider eligibility checks.
4. Request changes with specific reasons; retain the old submission and new version relationship.
5. Approve/reject/suspend/reactivate only through permitted, reasoned actions with confirmation.
6. Distinguish merchant approval from payout-account verification and product/category approval.
7. Show consequences for existing offers/orders when suspension occurs; do not invent automatic destructive behavior.
8. Record actor, decision, timestamp, reason and relevant version.

### A03. Catalog, categories, proposals and offer moderation — P1

- Manage category/brand/attribute definitions with validation and impact awareness.
- Inspect duplicate product candidates and proposal differences.
- Review images, technical attributes, identifiers, descriptions and supported claims.
- Request changes or approve/reject a specific proposal version.
- Review seller offer price/warranty/condition revisions separately from shared product content.
- Preserve order snapshots and the previously published version while a new version is pending.
- Handle archived/restricted/recalled products through configured policies and impact views, not silent record deletion.
- Keep certification/compatibility claims evidence-linked; do not manufacture badges.

### A04. Customer orders, seller orders and shipments — P1

- Search by customer order, seller order, shipment, payment reference and merchant.
- Display the full parent-to-seller-to-shipment hierarchy and item quantities.
- Show order/payment/delivery history and permitted actions with explanations.
- Inspect payment attempts, cancellation requests, returns and related support cases.
- Do not expose an arbitrary Edit status dropdown that can make an order Paid or Delivered without an authoritative event.
- Record manual operational adjustments through explicit authorized actions with reasons and audit history.
- Handle partial cancellation, fulfillment, delivery and refunds without overwriting unaffected seller orders.

### A05. Refunds, returns, warranty and dispute resolution — P1

1. Review the relevant order/item, eligibility, customer/seller evidence and previous decisions.
2. Request information and manage participant-visible versus internal notes.
3. Determine allowed remedy according to the configured policy.
4. Review item amounts, shipping allocation, discounts and prior/pending refunds.
5. Prevent refund commitments exceeding the remaining refundable amount; pending refund requests must not permit duplicate commitments.
6. Separate refund approval from provider submission, provider success, failure, pending and unknown outcome.
7. Track replacement shipments independently when used.
8. Provide appeal/escalation and a decision history.

Do not force a store-credit refund or invent a legal return entitlement. Financial/policy decisions need the agreed model and authoritative backend.

### A06. Finance, holds, payouts and reconciliation — P1 UI / BACKEND_REQUIRED

- Separate users/capabilities that prepare, approve and execute a payout or sensitive adjustment where required by the operating model.
- Show settlement batches and immutable statement/ledger references.
- Reconcile order/payment records, provider settlements, carrier COD statements and bank/payout outcomes.
- Queue missing, duplicate, mismatched, failed and unknown records for investigation.
- Show scoped holds/reserves, reason, affected amounts, release conditions and history.
- Display payout beneficiary verification separately from merchant approval.
- Keep approvals, execution, provider callbacks and reconciled outcomes distinct.
- No self-approval or frontend-only execution of money movements.
- Preserve audit history; do not edit posted statement lines to make totals appear correct.

### A07. Users, memberships and access — P1

- Search users and inspect account status with appropriately limited personal information.
- Distinguish customer account, merchant memberships and platform capabilities.
- Show invitations, role/capability changes, suspensions, reactivation and session/security events when supported.
- Privileged changes require backend authorization, confirmation and reasons.
- Do not add a self-service platform-admin checkbox or a generic superuser bypass.
- Handle privacy/deletion requests through the defined retention/anonymization process, preserving required transaction/audit relationships.

### A08. Support, reviews and communication — P1

- Unified case queues with category, priority, assignment, resource links, participants, status and deadlines.
- Timeline with public/internal visibility, attachments, decision reasons and linked cases.
- Review moderation with policy reasons and appeals; merchant dissatisfaction alone is not a reason to erase valid criticism.
- Notification templates/events with channel and delivery status. Configuration and a successful backend/provider result are required before claiming email/SMS delivery.
- Help-center content and contact routes must be reachable from customer/seller contexts.

### A09. Policies, content and platform settings — P1

- Terms/privacy/shipping/returns/warranty/help content with published version and effective date where applicable.
- Banners and merchandising collections with valid destinations, start/end dates, image/alt text and preview.
- Supported countries/currencies/regions, shipping/payment eligibility, fee/commission rules and business-calendar/timezone configuration.
- Show the impact of changing rules. Existing transactions retain their applicable snapshots/versions.
- Keep secrets and provider credentials out of frontend settings/source; frontend may show configured/not configured status without secret values.

### A10. Audit and operational exceptions — P1

- Filter audit events by actor, merchant/resource, action, date and result.
- Show immutable event references, relevant before/after information, reason, timestamp and trace/reference IDs with sensitive fields redacted.
- Provide operational visibility for failed webhook processing, duplicate events, unprocessed notifications and reconciliation failures when integrated.
- Replays/retries must be explicit authorized backend actions with idempotency; a UI button is not proof an external action ran.

## 11. Data relationships and state invariants

Keep the existing architecture simple. These are domain relationships to respect, not a requirement to build a large ORM/model framework in React.

| Relationship | Required behavior |
|---|---|
| User → merchant memberships | One user may shop and belong to several merchants; platform privileges remain separate. |
| Product → variants → seller offers | Canonical product definition differs from merchant-specific SKU/price/warranty. |
| Offer → warehouse inventory | Inventory is scoped to merchant and location, with a documented stock calculation. |
| Cart line → variant + offer | Stored identifiers/quantity must resolve to a current valid offer; stored money is not authoritative. |
| Customer order → seller orders | The customer purchase may span multiple sellers, fulfillment groups and remedies. |
| Seller order items → shipment items | Partial and multiple shipments require explicit quantities, not one shipment field on the whole order. |
| Order item → purchase snapshot | Current catalog/offer/address changes do not rewrite historical purchase details. |
| Order → payment attempts | Several attempts can exist; only authoritative outcomes affect payment state. |
| Return/refund/replacement → order items | Quantity and money eligibility must account for previous and pending operations. |
| Statements/payouts → traceable transactions | Delivery, payment, refund authorization and seller availability are separate states. |

Minimum operational distinctions:

- Order status is not payment status.
- Payment pending is not payment failed; unknown outcome is a separate recovery state.
- Eligible COD fulfillment can precede cash collection.
- Carrier handover is not delivery.
- Delivery is not COD remittance.
- Approved cancellation/return is not completed refund.
- Merchant approval is not payout verification.
- A seller's proposed content is not an approved published product.
- Shared protocol is not verified compatibility.
- Demo access is not authentication or authorization.

The server ultimately owns permissions, prices, inventory reservations, tax/fees, final order creation, payment verification, refund execution, payouts and business approvals.

## 12. Component and code organization

Retain one application with explicit routes and the existing five layout families where appropriate: Store, Auth, Checkout, Account and Portal. Seller/admin may share small structural primitives while keeping their navigation and capabilities explicit.

Useful reusable components include:

- StoreHeader, CategoryNavigation, ProductCard, ProductImage, Money, QuantityControl, OfferSummary.
- Field, Select, Button variants, StatusBadge, EmptyState, ErrorState, Dialog/Drawer where genuinely reused.
- AccountNavigation, OrderSummary, SellerOrderGroup, ShipmentTimeline, CaseTimeline.
- PortalShell, PortalPageHeader, TableToolbar, FilterBar and Pagination.

Do not create a generic page-schema renderer, universal workflow engine, excessive wrapper hooks, parallel state frameworks, or components whose sole purpose is forwarding every prop.

State guidance:

- Local form state by default.
- Existing shared cart state remains small and coherent.
- Reuse a small demo account/seller state only where several screens need the same data.
- Merchant identity remains explicit in routes and selectors.
- Separate immutable base fixtures from in-memory preview edits.
- Do not maintain contradictory copies of the same product/order in different page files.
- Keep public product identifiers/quantities separate from personal/sensitive data persistence.
- Use one small HTTP wrapper and feature-specific service functions when integration is authorized; no fake successful APIs.

For future backend contracts, record operation, input fields, expected IDs, success result, field errors, permission/state errors, pending/unknown states, idempotency needs and the source of authority. Do not invent definitive .NET endpoints without reconciling the backend plan.

## 13. UI protections for customers and merchants

### Customer-facing protections

- Know who sells/fulfills each item, who provides the warranty and what the total includes.
- See compatibility conditions before purchase.
- Never be silently moved to a different offer, shipping service or price at submission.
- Have traceable order, shipment, cancellation, return, refund and dispute references.
- Retain access to purchased snapshots, policy versions and generated documents.
- Recover from uncertain payment outcomes without encouraged duplicate charges.
- Reach support and escalation from the relevant transaction.

### Merchant-facing protections

- Preserve ownership and isolation of offers, inventory, orders, cases and finance data.
- See decision reasons, correction requests and version history.
- Submit packing/delivery/inspection evidence through scoped channels.
- Understand fees, promotion funding, refunds, holds and settlement status.
- Respond to disputes and appeal through an explicit process.
- Keep customer criticism, case decisions and financial adjustments subject to platform policy and audit, not arbitrary UI actions.

These are requirements for a trustworthy design. They do not establish legal compliance or production security in the present frontend preview.

### 13.1 Launch-quality details that also need a frontend plan

- Give public pages useful titles, descriptions, headings and canonical destination rules. Product structured data must reflect actual published product/offer data; do not publish fictional demo availability/reviews as live commerce metadata.
- Keep development/fictional previews out of public indexing when deployment is eventually configured. The present local server is not a production deployment.
- Handle direct route refreshes and genuine unknown resources deliberately; a visually attractive SPA still needs working deep links.
- Avoid oversized images and layout shifts. Use appropriate dimensions, responsive assets and below-the-fold loading where useful.
- Split major route areas only where the existing toolchain makes it straightforward; do not add a new performance framework.
- Keep filters/navigation usable on touch and keyboard. Check sticky summaries/headers do not cover fields or error messages.
- Preserve text readability and focus contrast. Test meaningful error recovery, not just the first successful path.
- Document timezone/currency/date formatting and avoid mixing ambiguous dates or monetary units.
- External tracking, marketing subscriptions and consent behavior require an explicit product/policy decision. Do not add tracking scripts or preselected marketing consent to make the site resemble a competitor.
- Avoid dead social/contact/help/footer links and invented telephone numbers, addresses, certifications or business guarantees.

### 13.2 Enhancements to record without confusing them with missing core steps

The following can be P2 rather than being silently promised: social sign-in, advanced recommendation engines, advertising/sponsored placements, gift cards, loyalty/subscriptions, cross-border commerce, multi-currency settlement, used/refurbished grading, business-credit purchases, bulk import at scale, warehouse scanning, advanced procurement, installation scheduling and elaborate smart-home bundle configurators.

For a supported product bundle, however, disclose its actual included components, compatibility conditions and price. Do not advertise a complete smart-home setup when essential hubs/accessories or installation are omitted without explanation.

These distinctions keep the implementation manageable. They do not justify deferring essential product selection, checkout recovery, aftersales, seller operations or administration.

## 14. Traceable gap checklist

Create a project-local tracker using these IDs. For each item record status, actual route/component, backend/asset/decision dependency, acceptance evidence and completion commit. Do not pre-check this list from this document; inspect the source first.

### Foundation and visual quality

- [ ] F01 Confirm branch/HEAD and the directories served on 4173/5173; provide one consistent review URL.
- [ ] F02 Reconcile current routes with the agreed frontend page map.
- [ ] F03 Establish shared colors, type, spacing, controls, icons and focus states.
- [ ] F04 Rebuild retail header/navigation/search proportions.
- [ ] F05 Replace oversized empty hero with real imagery or compact fallback.
- [ ] F06 Rebuild category entry and shared product cards.
- [ ] F07 Support every featured product destination or remove unsupported promotion.
- [ ] F08 Rebuild cart product rows and summary proportions.
- [ ] F09 Rebuild seller/admin application shell and operational table density.
- [ ] F10 Remove repeated development copy and long disabled roadmap lists from normal content.
- [ ] F11 Correct primary-button contrast and consistent action hierarchy.
- [ ] F12 Inventory missing individual images; keep critical asset gaps open.
- [ ] F13 Define manual checks for 1440, 1280, 1024, 768 and 390 CSS-pixel viewports.
- [ ] F14 Handle keyboard, focus, zoom/reflow and reduced-motion requirements.

### Customer discovery, purchase and account

- [ ] C01 Home/category/brand/support entry points.
- [ ] C02 Search query, suggestions, filters, sorting, URL state and no-results recovery.
- [ ] C03 Product gallery, variants, offer comparison and valid Add to cart.
- [ ] C04 Smart-home compatibility and installation prerequisites.
- [ ] C05 Wishlist, comparison, seller storefront and supported review surfaces.
- [ ] C06 Cart persistence, quantities, grouping, stale offer/price recovery and totals.
- [ ] C07 Registration, sign-in, verification, recovery and session-state UI/contracts.
- [ ] C08 Complete address/delivery/payment/review checkout with prerequisite guards.
- [ ] C09 Distinct payment/order result, pending, failed and unknown-state screens/contracts.
- [ ] C10 Order hierarchy, multiple shipments, event timeline and real document states.
- [ ] C11 Item/quantity cancellation request and refund-status separation.
- [ ] C12 Return request, pickup/inspection/outcome and quantity eligibility.
- [ ] C13 Warranty/repair/replacement journey.
- [ ] C14 Linked support/dispute cases and notification states.
- [ ] C15 Profile/address/security/privacy management states.

### Seller workflows

- [ ] S01 Application, private documents, review, revision and onboarding status.
- [ ] S02 Merchant switching, team/invitation states and store settings.
- [ ] S03 Canonical catalog lookup and new product proposal workflow.
- [ ] S04 Offer draft/revision/review/publication-state UI.
- [ ] S05 Warehouse inventory, adjustments, availability and low-stock states.
- [ ] S06 Seller order list/detail and method-aware processing eligibility.
- [ ] S07 Partial packages/shipments, labels, tracking and exceptions.
- [ ] S08 Cancellation/return/warranty/dispute response and inspection.
- [ ] S09 Statements, fee allocation, holds, payouts and COD reconciliation UI/contracts.
- [ ] S10 Merchant support, notifications and deadlines.

### Admin workflows

- [ ] A01 Operational overview, meaningful queues and explicit capability boundaries.
- [ ] A02 Merchant/document review, correction requests and decision history.
- [ ] A03 Category/product/proposal/offer moderation and published version handling.
- [ ] A04 Parent/seller order and shipment inspection with item-level state.
- [ ] A05 Return/warranty/dispute decisions and refund lifecycle.
- [ ] A06 Settlement/payout/reconciliation/hold views and approval separation.
- [ ] A07 User/membership/access/invitation/privacy-request management.
- [ ] A08 Support queues, review moderation and communication history.
- [ ] A09 Content, policy versions, business settings and effective dates.
- [ ] A10 Audit history and operational exception visibility.

### Cross-cutting completion gates

- [ ] X01 Every visible control has a working behavior or a precise applicable unavailable reason.
- [ ] X02 Every entity destination handles unknown/unavailable IDs.
- [ ] X03 Every merchant screen and mutation is scoped; switching clears stale selections.
- [ ] X04 Money and quantity calculations preserve existing invariants and snapshots.
- [ ] X05 Personal data/credentials are not persisted by preview convenience code.
- [ ] X06 Demo authentication stays development-only; no privileged access claims.
- [ ] X07 Real payment, stock, refund, approval and payout operations are explicitly backend-gated.
- [ ] X08 No fake reviews, certificates, message delivery, invoices or financial success states.
- [ ] X09 Existing tests/build checked appropriately; visual verification recorded honestly.
- [ ] X10 Checkpoint, descriptive commit/body, push and remote commit verification.

An item can be split into smaller local tasks, for example C12.1 reason selection or C12.2 inspection status. Keep the parent ID and acceptance criteria; do not build a task-management framework inside the app.

## 15. Delivery milestones and reading map

The owner asked for the whole set of missing details. Avoid another broad cosmetic pass that silently leaves the journeys unfinished. Implement in this sequence, keeping the gap tracker current.

| Milestone | Scope | Read sections | Completion evidence |
|---|---|---|---|
| M00 | Actual source/route/state/asset audit and served-version check | 00–03, 14 | Gap tracker with concrete source mappings; no unsupported completion claims. |
| M01 | Shared visual foundation; representative Home, ProductCard, Cart and portal shell | 04–05 | Changed reviewable screens; critical assets identified; user visual review remains a separate gate. |
| M02 | Discovery, product decision, compatibility, wishlist/compare | 06 C01–C05 | Connected browsing and product-choice journey with meaningful states. |
| M03 | Cart and complete checkout/result UI/contracts | 06 C06–C09 | Consistent totals, prerequisite/error/recovery states; no fake payment execution. |
| M04 | Customer orders/tracking/cancellation/returns/warranty/support | 07 C10–C15 | Linked aftersales request/detail/status surfaces and accurate snapshots. |
| M05 | Seller entry, verification application, membership/settings | 08 S01–S02 | Draft/review/revision UI and explicit merchant context. |
| M06 | Seller catalog proposals, offers, warehouses and inventory | 08 S03–S05 | Product-versus-offer distinction and stock operation UI. |
| M07 | Seller orders, shipments and aftersales | 09 S06–S08 | Item-level operations and method-aware fulfillment scenarios. |
| M08 | Seller statements/payout/support UI and contracts | 09 S09–S10 | Traceable amounts/states; actual money movement remains backend-gated. |
| M09 | Admin merchant/catalog/user/access workflows | 10 A01–A03, A07 | Detail/review/history and explicit capability boundaries. |
| M10 | Admin operations, aftersales, finance and support | 10 A04–A06, A08 | Connected case/order/financial inspection and decision-state UI. |
| M11 | Policies/content/settings/audit and coherent end-to-end preview | 10 A09–A10, 11–13 | Versioned content/state links and representative connected scenarios. |
| M12 | Cross-screen consistency, accessibility checklist, final handoff | 16–18 | Honest route coverage, open dependencies, tests/build and Git handoff. |

Do not treat each row as one enormous commit if it contains several independent changes. Split naturally into readable commits. Do not create empty commits or commit generated noise.

### Frontend preview versus integration

Use the existing fixtures and small in-memory updates to demonstrate form/list/detail relationships. Keep scenario records consistent across related screens. Do not invent a mock backend framework or turn every request into a fake HTTP 200.

For operations that need a backend, implement the states, validation, permitted-action presentation and contract notes. Clearly disable real execution or expose a separately labeled development scenario preview. Do not claim those requirements are live-integrated.

## 16. End-to-end acceptance scenarios

These scenarios establish missing steps; they are not all requests for automated browser tests. With browser work prohibited, record unexecuted visual/interaction checks as NOT_VERIFIED.

1. **Browse to purchase decision:** Home → category/search → filters → product → variant → eligible offer → cart; no dead featured destination.
2. **Two sellers:** Add items from different merchants; quantities/grouping and checkout delivery remain consistent.
3. **Invalidated offer:** Withdraw/change an offer in a controlled development scenario; cart identifies the affected line without substituting another seller.
4. **Address change:** Change delivery area after choosing shipping; incompatible delivery/payment selections require revalidation.
5. **Checkout recovery:** Required fields, invalid URL steps and an invalid/empty cart cannot bypass validation.
6. **Payment outcomes:** Preview confirmed/pending/declined/cancelled/unknown screens separately; none claims an actual charge occurred.
7. **Historical purchase:** Change current catalog/offer/address data; the order snapshot remains unchanged.
8. **Split fulfillment:** One seller order ships across two packages; item quantities and partial delivery remain understandable.
9. **COD difference:** Confirmed eligible COD order can be ready for fulfillment while cash collection/remittance are still pending.
10. **Partial cancellation:** Cancel eligible quantities; unaffected seller orders stay intact and refund progress is separate.
11. **Return:** Select a delivered item → reason/evidence → pickup/review → inspection → outcome → refund/replacement status.
12. **Warranty:** A covered issue creates a linked request and assessment path; missing/unknown coverage is not invented.
13. **Merchant onboarding:** Application draft → missing documents → submit → changes requested → revise → decision.
14. **Catalog contribution:** Match an existing product or propose a new one; an offer cannot self-approve canonical publication.
15. **Merchant isolation:** Switch merchants across offers/inventory/orders/cases/finance; no previous merchant data or selection leaks into the new context.
16. **Admin review:** Open a queue record → inspect a specific version → request changes/decision state → inspect history; real decisions remain gated.
17. **Financial exception:** Inspect a payout/refund/reconciliation pending or failed scenario without falsely reporting funds paid.
18. **Support escalation:** Customer and seller see participant-safe case content; internal notes remain distinct in the model/UI.
19. **Navigation/access:** Direct unknown IDs, unavailable capabilities, empty states and browser Back have deliberate outcomes.
20. **Responsive/manual review:** Representative screens at the listed widths, keyboard use, 200% text/zoom reflow, dialogs/drawers and no document overflow.

## 17. Verification, credit control and Git workflow

### Verify the actual change

- Run existing relevant logic tests after touching behavior. Add tests for meaningful rules such as quantity eligibility, merchant scoping, snapshot totals, refund bounds or state transitions.
- Do not write tests that mirror JSX classes, border radii or the exact fixture implementation.
- Run one production build after a coherent milestone. Repeat only after new changes/failures justify it.
- No dependency installation, full-document rereads, repeated scans or repeated builds without a concrete need.
- A production build does not establish visual quality, keyboard accessibility, responsiveness or real backend integration.
- Use supplied screenshots for evidence. Keep new browser/visual checks NOT_VERIFIED when they were not performed.
- After a milestone, give the user accurate local review URLs. Do not assume an old preview server serves current source.

### Persist progress

Update project_state.md with completed requirement IDs, touched routes, current branch, verification, known gaps, data mode, dependencies and next bounded task. Keep the gap tracker aligned. Avoid redoing completed work after context changes.

### Commit and push

Routine commits/pushes on integration/storefront-20261123 are already authorized. Preserve the two unrelated reference files unless the owner explicitly changes their scope. Stage only relevant source/docs/assets and the package lockfile when genuinely changed. Exclude secrets, dependencies and build output.

Use clear English titles naming the actual result, for example:

- Rebuild retail header and product cards from visual feedback
- Add item-level return requests and case tracking
- Add merchant application documents and review status
- Add warehouse inventory and stock adjustment history
- Add seller shipment preparation and partial fulfillment views
- Add admin refund review and reconciliation screens

Avoid update, fixes, step numbers or timestamps as the entire title. A commit SHA is generated by Git; report the meaningful title alongside it.

The body explains behavior changed, relevant checks and remaining limitations. Preserve history; no force-push or unrelated resets. If connectivity blocks a normal push, try once, report pending honestly and supply the exact local PowerShell command. Do not create another commit just to retry a push.

Report full title, short SHA and whether the remote branch matches. Do not call a local commit pushed without evidence.

## 18. Final review and honest completion criteria

### Visual gate

Consistent typography, spacing, imagery, control proportions, grid alignment, retail hierarchy and operational density across the same foundation. No huge empty asset panels, repeated development copy, unsupported featured cards or long disabled primary navigation lists. Critical product photography remains an open issue until supplied and integrated.

### Journey gate

Every P0/P1 journey has a reachable entry, meaningful steps, validation, review/confirmation where needed, result/status view, useful error recovery and links to its related records. A sidebar label or static table is not completion.

### Integrity gate

Product/variant/offer identity, merchant isolation, integer money, historical snapshots, item quantities, partial operations and distinct statuses remain intact. No fake authentication, reviews, financial execution, verification or shipment claims.

### Integration gate

List each BACKEND_REQUIRED and DECISION_REQUIRED item, its frontend state, required contract and real completion condition. Do not count a provider placeholder as a working production integration.

### Delivery gate

Provide a concise final report containing:

1. Completed requirement IDs and route families.
2. Open P0/P1 gaps, P2 items, ASSET_PENDING and unresolved decisions.
3. Tests/build actually run and checks not verified.
4. Local preview links and development-only demo access instructions.
5. Full commit titles, short SHAs and verified push status.
6. Explicit distinction between frontend preview completeness, visual approval and production readiness.

Do not describe the marketplace as professionally approved, ready to sell, secure in production, or equivalent to a major marketplace merely because this checklist was written or a build passed. The owner reviews the actual result, and live business operations require the remaining integrations.
