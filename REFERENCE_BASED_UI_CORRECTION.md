# Reference-Based UI Correction and Implementation Review

> **Superseded visual brief (2026-11-23):** The owner has since selected `references/Screenshot 2026-11-23 064807.png` as the current Home/shared storefront-card baseline. Do not apply this document's conflicting visual direction to those surfaces. Its prior assessment and workflow history are retained here; `project_state.md` and `START_HERE.md` point to the current decision and active workflow requirements.

## 1. Authority and evidence

This file records a prior immediate visual correction brief. At the time, it superseded conflicting visual instructions in the master brief, including the text-only hero fallback. The owner has since selected a different screenshot baseline; the supersession notice above is current. This content remains as historical context.

Keep FRONTEND_UI_AND_WORKFLOW_MASTER_REWORK.md as the full business/workflow scope. Keep FRONTEND_GAP_AUDIT.md as the implementation tracker. Do not commission another audit instead of acting on the evidence already available.

Evidence reviewed:

- FRONTEND_IMPLEMENTED_PAGES_REPORT.md, describing source commit 112aa76b87c18599610afc79f39b75f48b41841b, 31 route templates and 16 top-level page components. The subsequent report commit is bb6bf01 and is documentation-only according to the handoff.
- Screenshot 2026-11-23 074519.png: current Home.
- Screenshot 2026-11-23 074528.png: current category catalog.
- Screenshot 2026-11-23 074558.png: current product detail.
- The supplied Ontas Global, INPOWER, BR.F, Gizmos, Voltix and Echoform reference images.

The report has been read in full. Source findings below are attributed to that report; the repository itself was not independently fetched for this review. The new screenshots provide direct visual evidence for the three storefront screens. They do not establish mobile, keyboard, seller/admin, payment or backend behavior.

The screenshots use port 4173. Their composition matches the reported M01 changes, including the text promotion and reduced featured set. Do not dismiss the design problem as a stale-server issue merely because previous review links used 5173. Verify the served source once, then fix the actual design.

No live competitor sites were inspected. Continue respecting the owner's text-only/no-browsing instruction.

## 2. The design direction is now explicit

| Page/type | Primary supplied reference | Adopt |
|---|---|---|
| Home and overall retail composition | Ontas Global desktop camera hero and its full-page reference | White retail canvas, photographic campaign, strong product subjects, six image-led categories and varied merchandising sections. |
| Product collections/cards | Gizmos and INPOWER product grids | Product photography first, concise readable product information, aligned prices and restrained action hierarchy. |
| Catalog and cart | INPOWER catalog/cart reference | Useful filtering, a full results region, compact retail rows, thumbnails and a distinct purchase summary. |
| Product detail | BR.F shoe product-detail reference | Two balanced main columns, substantial gallery, thumbnail strip, coherent title/price/options/purchase stack, full-width information below. |
| Editorial image placement | Voltix and Echoform | Deliberate image scale, art direction and section rhythm; use as supporting inspiration only. |

Do not combine every reference's palette, typography and shapes. Keep one blue/white Smart Home identity and adapt the selected compositions to smart-home products. This is not permission to turn the catalog into a pink audio-brand landing page or copy another brand's identity.

### What went wrong

| Supplied references | Current screenshot | Required change |
|---|---|---|
| A campaign image is a main visual subject | A large bordered sentence and two buttons replace the campaign | Build an actual image-led hero with a deliberate copy/media composition. |
| Product photography explains what is being sold | Generic socket/plug/sensor symbols stand in for products | Integrate individual product assets; fallback icons do not satisfy visual completion. |
| Grid density matches content | Home shows three products in a five-column structure, leaving a large unused region | Make the collection layout intentional for its actual supported item count. |
| Cards have a compact hierarchy | Large internal gaps and dominant identical blue actions | Rebalance media/name/specification/price/action into a retail card. |
| PDP has two usable columns | Wide shallow image strip, narrow information column and another purchase column | Remove the nested three-column composition; use two primary columns. |
| Gallery has visual weight and thumbnails | One small icon is placed in a very wide low-height panel | Give the gallery an explicit substantial frame, correct image fitting and thumbnails. |
| Product decision is one coherent stack | Title, specifications, compatibility and seller choice are split into separate narrow boxes | Put price/options/seller/quantity/purchase together; move detailed information below. |
| Whitespace separates meaningful groups | Large empty regions coexist with squeezed information | Correct grid proportions and content hierarchy; changing margins alone is insufficient. |

The missing photography is a separate real deficiency. It does not excuse the incorrect grid, narrow product information, text-only campaign, repeated development copy or disconnected journeys.

## 3. Shared visual foundation

Use these as authored CSS targets, not measurements of the reference JPEGs:

| Token/element | Direction |
|---|---|
| Main canvas | White; use #F6F8FB selectively for supporting sections rather than making the entire shop look like an operational dashboard. |
| Primary accent | Retain coherent cobalt #1D4ED8 and darker hover; light blue/cyan campaign surfaces may support product imagery. |
| Text | #111827 primary; restrained #64748B secondary; strong contrast for prices and actions. |
| Content width | Existing approximately 1320 CSS-pixel storefront maximum with responsive gutters. |
| Header | Compact utility row; approximately 72px main row and 40–44px category navigation; one dominant but proportionate search control. |
| Font | One available sans-serif stack; body 16px; card/table supporting text 13–14px; card title 14–16px; section heading 22–26px. |
| Large headings | Hero approximately 40–48px on desktop in a deliberate short composition; PDP title approximately 28–32px in a usable information column. |
| Spacing | A small 4/8/12/16/24/32/48 scale. Avoid nested padding and borders around every content fragment. |
| Shape | Modest 6–8px control/card corners; larger campaign corners only where appropriate. |
| Actions | Clear primary, secondary and text-link variants; approximately 40–44px controls; at least 44px mobile targets. |
| State | Focus, selected, disabled, hover, error and loading remain visible and consistent. |

The source report explicitly marks multiple Tailwind/global-CSS interactions UNKNOWN. Resolve the ownership of shared button/field styles in source. Do not keep appending global override blocks. Scope gallery/card/portal styles to their actual components. Keep the implementation readable without a theme engine or new UI library.

## 4. Home: rebuild the composition

### 4.1 Above the fold

1. Keep a retail header with logo, search, account and cart. Treat the logo as provisional identity, not a reason to invent another brand.
2. Render an image-led hero approximately 340–400px high on a wide desktop.
3. Allocate roughly 40% of the hero to short headline/supporting copy/one primary action and roughly 60% to a substantial smart-home product or lifestyle composition.
4. Use product imagery with deliberate scale and sufficient resolution. A small icon centered inside a large pale box is not hero art.
5. Use working category/product destinations. Do not advertise a sale, free shipping or a discount that has no underlying rule.
6. Follow with six compact image-led categories. Product cutouts may be reused appropriately; avoid making these six more generic bordered form controls.

The latest owner's direction explicitly rejects the current text-only promotion as the final hero. Do not repeat that fallback instruction from the older brief.

### 4.2 Product merchandising

- Remove customer-facing wording such as Products with supported detail and seller offer data. That describes the implementation, not the shopping proposition.
- Build a deliberate featured collection from supported products. When there are only three, use a balanced three-item arrangement with sensible maximum card widths; do not leave two empty fixed columns and call the layout finished.
- When four/five supported products are available, use the appropriate four/five-column composition. Never duplicate records or invent popularity/reviews merely to fill a row.
- Add two category-led promotional panels when images and meaningful destinations exist, followed by a distinct second product collection only when its data supports it.
- Keep section variation intentional: campaign, categories, products, paired image panels, useful information, footer. Avoid repeating an identical white rounded box for every purpose.
- Use a compact service-information row only for facts and destinations actually supported. Do not invent guarantees or an operational support service.

## 5. Shared ProductCard

The product photograph should identify the product before the user reads the title.

1. A clean media area around 180–210px at an appropriate desktop card width; use object-fit contain for product cutouts.
2. Product name is a real product-detail link with a two-line limit and stable line height.
3. One concise relevant specification line; unknown values are not marketing badges.
4. Clearly formatted price and currency. Show From only when the displayed value is genuinely a lowest applicable offer and options can vary.
5. Concise seller context where it helps distinguish the offer.
6. One compact shopping action. Choose options is correct when a valid variant/offer must be resolved. Do not add a fake Add to cart action that bypasses identity selection.
7. Wishlist/compare controls appear only when their behavior exists. Decorative inactive controls do not improve the card.

Use borders or subtle surface separation sparingly. Avoid a huge gray media block, distant text fragments, unnecessary empty-review messages and a large blue footer on every card. Hero and actual purchase actions should retain visual priority.

## 6. Catalog: use a real results layout

Adopt the INPOWER filtering/results hierarchy while keeping our current behavior.

- A concise breadcrumb and category header, followed by a results toolbar with actual count and meaningful sorting.
- Approximately 220–240px filter column, 24px gap, and a flexible results region with min-width 0.
- Three or four results columns at a wide desktop according to actual usable width; reduce columns deliberately at narrower widths.
- A category image/promotion strip may sit above results when an actual relevant asset and destination exist.
- Two results are legitimately two results. Do not fabricate items, stretch them into giant cards, or duplicate them to imitate a populated reference. Keep card widths and the surrounding composition intentional.
- Filters use clear labels and group spacing; preserve mobile Apply/Cancel and active-filter URL behavior.
- Preserve an actual no-results state and safe invalid-filter handling.
- Every product must lead to a product-specific detail or product-specific unavailable view. Linking a product back to the general catalog is a dead-end loop.

## 7. Product detail: replace the broken column structure

Use BR.F as the primary structural reference, adapted for merchant offers and smart-home options.

### 7.1 Primary grid

At desktop use two primary columns, approximately 55% gallery / 45% information, with around 40px gap. In source this can be a straightforward grid equivalent to minmax(0,1.1fr) minmax(380px,.9fr) while width permits it. Stack at a sensible tablet/mobile breakpoint.

Remove the nested desktop split that squeezes product information between a wide gallery and an additional seller-offer panel. Do not create an independent third purchase column in this reference pass.

### 7.2 Gallery

- Give the main gallery an intentional desktop frame approximately 480–540px high, adapting to available width; use a square-ish frame on mobile.
- Fit the actual product image within the frame; do not stretch or crop out the product.
- Render available thumbnail images below, approximately 64–72px each, with selected state and accessible controls.
- Handle missing/failed media without collapsing the gallery to the height of a 96px SVG.
- Do not imply several gallery photographs exist when only one asset is available.

### 7.3 Information and purchase stack

Use this order in the right column:

1. Brand/model/category context.
2. Product title, with enough width to read naturally.
3. Brief useful specifications.
4. A prominent price or honest From price; do not hide all useful price information behind a large instruction box.
5. Variant controls arranged as compact accessible chips/swatches where appropriate.
6. Seller selection/summary within this same column, with offer-specific price and warranty source.
7. Quantity control and primary Add to cart action when the current selection is valid.
8. Concise relevant delivery/warranty/compatibility conditions.

Keep current variant/offer validity rules. Clear incompatible offers when variants change. Do not silently select a different merchant or invent availability. Any new initial default-offer rule must be explicit, valid and tested rather than being hidden inside a styling change.

Move detailed description, structured specifications, compatibility and warranty information to full-width sections below the primary grid. If tabs are used, implement their behavior and keyboard semantics. Avoid several small vertically stacked cards in a very narrow middle column.

## 8. Assets: a real completion dependency

The current report confirms that individual photography is absent. Reference screenshots demonstrate art direction; they are not standalone product photos. Do not use reference screenshots as page backgrounds or copy an unrelated camera/shoe/headphone photograph into a smart-plug listing.

Wire a small shared ProductImage/gallery structure to actual local asset paths. Use the same product imagery consistently on Home, Catalog, PDP and Cart.

Minimum illustrative local asset request for the currently supported assortment:

| Asset group | Needed content |
|---|---|
| Hero | One wide smart-home campaign composition or suitable lifestyle image, with room for HTML text. |
| Touch switch | Front photo plus another available angle/detail; match the shown variant. |
| Wi-Fi plug | EU/UK variant-correct imagery and another available view. |
| Motion sensor | Front and another available view. |
| Categories | Six category visuals; appropriate product cutouts may be reused rather than requesting unnecessary additional files. |

Record exact asset keys/paths/subjects and which are present. Do not browse or generate images without the owner's permission. Implement the correct layout while resolving assets, but do not declare the photographic design finished with generic SVGs. Request the missing asset set once, concretely; do not spend repeated iterations polishing placeholders.

## 9. Source-report findings that remain actionable

These are grounded in the supplied report. Inspect the actual source before patching; do not misrepresent report evidence as a fresh repository audit.

| Priority | Reported finding | Correction and acceptance |
|---|---|---|
| P0 | Unknown public routes fall through to Home. | Render an explicit not-found screen with useful navigation; do not pretend an invalid URL is the homepage. |
| P0 | Account order IDs use unguarded decodeURIComponent. | Handle malformed encoding safely; navigation must not crash the app. |
| P0 | Unknown category silently becomes the general catalog. | Show category-unavailable/not-found and a deliberate Browse all action. |
| P0 | Eight catalog entries but only three product-detail fixtures. | Every card needs its own valid detail or product-specific unavailable destination; remove the /shop loop. |
| P0 | Catalog filters/sort use device.price while cards choose available-offer prices. | Define one effective display-price selector and use consistent currency units for card/filter/sort decisions. Actual fixture values may coincide now; the disconnected pricing rules are the risk. |
| P0/P1 | Relevance is described as alphabetical ordering; latest screenshot labels it Recommended. | Use an honest name-based label until ranking/recommendation semantics actually exist. Preserve old URLs safely. |
| P0 | Filter parsing lacks complete enum/range validation. | Normalize invalid enum/page values; reject or explain invalid/negative/inverted price ranges. |
| P0 | Cart drops stale restored entries and has only a general invalid-cart panel. | Distinguish corrupt storage from unavailable lines; provide line-level removal/review rather than silently losing a customer's selection. Keep stored prices untrusted. |
| P0 | Checkout has separate address state from the address book. | Connect selection through one small shared source; checkout may hold a reviewed snapshot. Preserve historical order addresses. |
| P0 | Address phone validation only checks nonempty text; profile checks digits. | Reuse consistent provisional validation and truthful error copy. Country-specific/live validation remains a contract decision. |
| P0 | Delivery/payment choices do not respond to address-area eligibility. | Revalidate dependent selections and totals; keep unsupported areas/methods explicit. |
| P0/P1 | Checkout ends at a disabled button with no outcome screens. | Build explicitly labeled development result scenarios for pending/failed/cancelled/unknown/confirmed states; do not claim an order or charge happened. |
| P1 | Authentication stops after local validation. | Build verification/reset/session-state UI when its milestone is reached; keep real security/backend work distinct. |
| P1 | Order detail has no cancellation/return/warranty/support actions. | Implement actual request/review/status journeys; a deferred text panel is not those workflows. |
| P1 | Sell with us opens the merchant chooser. | Give the preview chooser an accurate label and implement a separate onboarding journey. |
| P1 | Seller drafts, admin review records and customer offers are separate data sets. | Create a small consistent preview relationship: draft → submitted review → decision/version → published offer; distinguish every demo transition from live approval. |
| P1 | Customer order, seller order and admin records are disconnected examples. | Add shared IDs and quantity relationships so a single preview transaction can be traced across roles while preserving purchase snapshots. |
| P1 | Merchant switching always lands on overview; editors have no unsaved-change warning. | Preserve compatible workspace context, clear invalid selections and protect dirty drafts; never carry another merchant's offer ID into the new context. |
| P1 | Seller overview order rows cannot open details; inventory/shipping/aftersales/finance absent. | Continue the existing master milestones for meaningful operations, not new static tables. |
| P1 | Admin review means read-only rows; no correction/decision/history flow. | Add record detail, evidence/version, reasons, request-changes and clearly scoped demo decision states. Real approvals remain backend-gated. |
| P1 | Admin offer/product rows lack detail destinations. | Add meaningful record inspection and onward links before calling those areas review workflows. |
| P0 visual | Global CSS and utility ownership is unresolved in the report. | Consolidate the shared style source and remove conflicts instead of layering more overrides. |
| P0 visual | Cart sticky offset is 96px while the authored desktop header rows nominally total about 128px. | Use a coherent header offset for sticky panels; this is a source-derived overlap risk, not a browser-measured failure. |
| P0 interaction | Mobile filter drawer lacks Escape/focus handling; address confirmation lacks full dialog behavior. | Implement keyboard dismissal, appropriate focus containment/return and usable dialog semantics. |
| P1 visual | Checkout uses the full retail header; account repeats a large development banner. | Use a compact checkout shell and consistent small discoverable demo disclosure. |
| P1 | Public support/policies and wishlist/compare/seller storefront are absent. | Follow the master scope with working destinations and factual policy content; do not add empty navigation labels. |

Keep the working foundations: product/variant/offer identities, integer minor-unit totals, cart identifier-only persistence, merchant scoping, historical order snapshots and development-only demo credential boundary. Do not replace these with a broad rewrite or real payment/authentication implementation during visual repair.

## 10. Immediate execution order

The owner has already supplied the references and rejected the current screenshots. Do not ask for another implementation-report document before doing this visual work.

### Pass A: reference-accurate Home and ProductCard

- Inspect the actual supplied Ontas/Gizmos reference images and the current Home screenshot.
- Replace the rejected text-strip composition with the specified photographic hero structure, image-led category presentation and intentional product collection.
- Correct ProductCard hierarchy and grid behavior for the actual supported assortment.
- Integrate available approved local assets; record specific missing ones as an unresolved visual dependency.
- Preserve working search/category/product/cart navigation and selection logic.
- Update only relevant audit entries/checkpoint, run affected existing tests and one build, commit/push the coherent change.
- Stop at this concrete review point. Do not claim visual acceptance or propagate a rejected design to every page.

Suggested title: Rebuild homepage merchandising around the supplied visual references

### Pass B: catalog and product-detail geometry

After the direction is accepted, apply the INPOWER catalog and BR.F PDP structures. Fix the product-specific destination loop and relevant price/filter inconsistencies. Preserve honest no-results and unavailable-offer behavior. Do not introduce unsupported product claims to populate the view.

Suggested title: Rebuild catalog and product detail layouts from approved references

### Pass C: cart and operational UI

Apply the approved card/media/typography system to Cart using the INPOWER composition. Refine seller/admin operational presentation separately using their actual tasks; retail reference images are not dashboard specifications. Continue the master workflow milestones with connected state and meaningful operations.

## 11. Acceptance and limits

Visual acceptance requires a deliberate campaign/product composition, genuine asset integration, balanced grids, readable product information, consistent cards and a usable purchase stack. Smaller padding, a passed build, a fixed number of components or a count of 31 route templates do not establish it.

Functional acceptance requires working destinations, valid selection, consistent money and quantity rules, appropriate error recovery and honest demo/backend boundaries.

The owner has not approved browser automation, browsing or image generation. Do not run them. Report source specifications as source specifications and unperformed browser checks as NOT_VERIFIED. Use one consistent current local review URL.

Keep React + JavaScript + Tailwind, small readable components and simple CSS. No new libraries, generic page engines, dependency upgrades, inflated fixture records or unrelated backend changes.

Update the local master brief's conflicting visual clauses and project_state.md so future turns do not reintroduce the rejected compact text-only hero. Keep the full workflow backlog; this visual priority does not erase it.

Each completed bounded pass receives a descriptive English commit/body and normal push on integration/storefront-20261123. Preserve unrelated files; no force-push. Report full title, short SHA, actual push result and any asset/blocker honestly. A layout with unresolved critical photography is implemented work in progress, not a finished client presentation.
