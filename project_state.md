# Project state
Updated: 2026-11-23
Requested scope: Orientation only; no implementation, installation or image generation.
Current milestone: D00 architecture proposed; awaiting review.
Frontend: RESEARCH_READY / ARCHITECTURE_PROPOSED / IMAGE_DESIGN_NOT_STARTED / IMPLEMENTATION_NOT_STARTED.

## Verified notes
- Workspace contains six root planning documents (01 through 06) and references/ containing Frontend_Architecture.md, Frontend_Design_Research_AR.md, Frontend_Page_Map.json and Smart_Home_Analysis_v1.zip.
- No existing project_state.md or application files were found in the inspected root. Package/API/test paths and versions are not established.
- Read entry/checkpoint instructions in 05_EXECUTION_CHECKLIST.md, decision sections in 01_ANALYSIS.md and 02_FRONTEND_PENDING.md, and architecture overview, layouts, folders and state ownership.
- Large reference archive and page-map JSON were not opened. Planning documents are not evidence of implemented milestones.

## Confirmed decisions
- One React application; JavaScript/JSX, Tailwind and simple CSS animation.
- Complete and review English/LTR across all areas first; Arabic/RTL later in L01.
- Architecture review precedes representative UI images (D01); reviewed visual direction precedes application implementation.
- Store, auth, checkout, account, seller and admin pages use five layouts: StoreLayout, AuthLayout, CheckoutLayout, AccountLayout inside StoreLayout, and PortalLayout for seller/admin.
- Explicit routes and guards; thin pages compose feature components; named feature API functions use one HTTP wrapper.
- Local state near its owner; URL for filters, pagination and merchant context; small auth/cart providers only where shared. Server responses own commerce facts.
- Working business baseline: Egypt/EGP, .NET/SQL Server, shared product/variant catalog with independent seller offers, seller-held stock, registered checkout initially.

## Mandatory simplicity and safety rules
- Descriptive names, straightforward functions and explicit data flow; readability over short line counts.
- Extract shared components only when useful; avoid giant components, excessive fragmentation and deeply nested logic.
- No default Redux, generic repositories, dependency injection, universal form/page engines or extra libraries without concrete need.
- Small configuration and centralized visual tokens; create files only as needed.
- Preserve validation, scoped authorization and server-authoritative money, stock and payment outcomes. UI guards never replace API enforcement.

## Missing decisions and limits
- Brand name, final palette and font remain provisional; architecture is proposed, not approved.
- Live commerce requires legal supplier/collector/invoice issuer/liability decisions, provider contracts, commission/payout policy and delivery integration or documented manual pilot.
- Mobile technology/authentication and production hosting/SEO behavior remain unresolved; these do not block current architecture review.
- No contradiction found in the inspected decisions. No runtime/build/security verification performed during orientation.

## Next exact step
Review the proposed simple architecture with the user. On subsequent instruction, settle representative visual direction starting with Home desktop before implementation. Stop after this checkpoint and await instruction.

## Communication preference
- Respond in English only for explanations, progress updates, questions, summaries and code comments; Arabic renders incorrectly in the user's terminal.
- This communication preference preserves the product language sequence and all existing decisions. Code simplicity, readability and ease of modification remain top priorities.
- No implementation is authorized by this preference update; await the next instruction.

## Current authorized slice: homepage (W01 / F00)
- Stage updated from orientation-only to homepage implementation, authorized 2026-11-23. Remaining pages and concept images are postponed for review.
- Created a new Vite React + JavaScript app in `frontend/` because the workspace had no application. Homepage uses small semantic components and development fixture data; Tailwind utility classes load from CDN, with local CSS for tokens/accessibility/reduced motion and hero placeholder.
- Desktop and mobile references are present in `design-references/`. They contain combined screenshot imagery rather than individual assets; no reusable production image assets found. Hero and product photo areas remain illustrative placeholders and are `ASSET_PENDING`. Inter is requested from Google Fonts with system fallback; offline font availability is not verified.
- Interactions: section anchors and accessible mobile category menu. Header account/cart, search, offer/product destinations are visual entry points only; no auth, live search, cart, offers or checkout is implemented.
- Current paths: `frontend/index.html`, `frontend/package.json`, `frontend/src/main.jsx`, `frontend/src/pages/HomePage.jsx`, `frontend/src/components/StoreHeader.jsx`, `frontend/src/data/homeContent.js`, `frontend/src/styles/index.css`.
- Verification: build and viewport/browser checks NOT_VERIFIED yet. Next exact step: install dependencies and run production build; then inspect responsive behavior at required widths and launch local preview if available. Stop for homepage visual review after verification.

## Local setup and verification update — homepage slice
- Node: `v24.13.0`; npm: `11.6.2`.
- `frontend/` had no lockfile. `npm.cmd install` completed successfully, then `npm.cmd install --save-dev tailwindcss @tailwindcss/vite` completed successfully. npm generated `frontend/package-lock.json`; zero vulnerabilities reported in both install audits.
- Tailwind v4 now uses `@tailwindcss/vite` with the existing React plugin in `frontend/vite.config.js`, and `@import "tailwindcss"` in `frontend/src/styles/index.css`. Removed browser CDN scripts and external Inter import. No local Inter font files found; system UI font stack is used.
- `npm.cmd run build` in `frontend/`: PASS (Vite 8.3.8; output in `frontend/dist/`).
- Preview started with `npm run preview -- --host 127.0.0.1`; HTTP GET `http://127.0.0.1:4173/` returned 200. Local preview URL: `http://127.0.0.1:4173/`.
- Browser check attempted through CUA: in-app browser unavailable; Edge browser unavailable for new tab. 390px, 1440px, 360/768/1280/1920/320px, keyboard navigation, text enlargement, and page-overflow visual inspection are `NOT_VERIFIED`.
- No test or lint scripts are defined in `frontend/package.json`; production build is the available project check.
- Hero and product image areas remain placeholders: `ASSET_PENDING`. Do not treat visual fidelity as final until individual assets are provided and reviewed.
- Next step: user reviews the running homepage at the URL above; then address review feedback and/or provide individual visual assets.

## Focused homepage cleanup
- Replaced placeholder account/cart anchors and product-option links with clearly labelled disabled controls; seller-offer text is marked available later. Replaced the invalid all-products anchor with the existing featured section. Implemented section links continue to use valid IDs.
- Added shared inline SVG icon component for menu, home, search, user, cart and device/category symbols. No emoji or text-symbol icons remain in the UI.
- `npm.cmd run build` in `frontend/`: PASS (Vite 8.3.8). Focused `rg` check found no stale `#offers`, `#account`, `#cart` links or listed symbol glyphs.
- Image gaps remain `ASSET_PENDING`; no imagery was generated or substituted.

## Catalog + Search slice
- Added simple same-origin history routing for `/shop`, `/categories/:categorySlug`, and `/search?q=...`; header search uses GET navigation, category navigation and home category tiles route to implemented catalog pages.
- Expanded demo fixtures with category, connectivity, and hub requirement values. Product filtering/sorting and URL parsing/building live in `frontend/src/lib/catalog.js`; search, category, connectivity, hub requirement, minimum/maximum price, price sorting, URL-backed pagination, no-results state, and Clear filters are implemented. Mobile filters use a dialog panel with draft Apply/Cancel behavior.
- Catalog reuses StoreHeader and ProductCard, preserving the existing visual tokens and explicit deferred account/cart/product actions. Asset gaps remain `ASSET_PENDING`; no imagery or browser automation used.
- `npm.cmd test`: PASS, 3 focused catalog tests. `npm.cmd run build`: PASS, Vite 8.3.8. No browser verification performed for this slice.
- Next: stop for review of catalog/search behavior.

## Product Details slice
- Added `/products/:productSlug` and linked product names/gallery areas from Home and Catalog for the three products with explicit detail fixtures. Products without detail fixtures remain marked as later availability.
- Fixtures keep product IDs, variant IDs, and seller offer IDs separate. Product detail renders variant specifications and known protocol/hub requirements, explicitly states ecosystem compatibility is unknown, and uses gallery placeholders labeled `ASSET_PENDING`.
- Seller offer selection controls displayed price and seller warranty. Unavailable offers are visible but disabled. Variant changes preserve a selection only when that offer remains valid for the new variant; otherwise the offer is cleared. Unknown product paths show a clear not-found state. Cart remains deferred.
- `npm.cmd test`: PASS, 6 tests including variant-offer mismatch, unavailable offer, selection preservation/clearing, and existing catalog logic. `npm.cmd run build`: PASS (Vite 8.3.8).
- Visual behavior remains unverified: no browser automation was used. Production imagery remains `ASSET_PENDING`; displayed data is illustrative fixture content, with no backend integration.

## Cart slice
- Added a shared CartContext around the existing app routes and a working `/cart` page. Header cart link reports total units; account remains deferred.
- Add to cart is enabled only after a valid available variant and seller offer are selected. Repeated same product/variant/offer additions merge, while different offers remain distinct. Quantity updates (1–99), removal, empty state, seller groups/subtotals, and overall item subtotal are implemented.
- Cart localStorage schema stores only productId, variantId, offerId, and quantity. Restore validates all identifiers and availability against fixtures, drops stale/malformed entries, merges duplicates, strips untrusted fields, and handles corrupt/unavailable storage. Displayed prices are resolved from current offer fixtures and totals use integer minor units. Delivery says “Calculated at checkout”; total is “Total before delivery.” Checkout is deferred.
- Focused cart tests cover merging, separate offers, quantity bounds, corrupt/stale storage recovery, stripping stored prices, seller grouping, and totals. `npm.cmd test`: PASS, 10 tests total. `npm.cmd run build`: PASS, Vite 8.3.8.
- Remains a fixture-backed preview: no stock reservation or live price verification. Gallery/product assets remain `ASSET_PENDING`. No browser, backend, or visual verification was performed.

## Repository connection workflow (in progress)
- User authorized connecting this existing workspace to `https://github.com/belalhazem511/Smart-Home-Ecomm.git`, preserving prior files/features, inspecting remote history, committing the completed storefront work, and pushing a safe working branch. No Git repository or remotes existed at task start.
- Added root `.gitignore` rules for Node dependencies, generated build output, environment secrets/credentials and local logs. Local scan found no matching secret/environment files. `frontend/node_modules/` and `frontend/dist/` are excluded.
- Next: initialize Git, add origin, fetch and inspect remote refs/history; choose a branch that preserves the remote default branch and existing commits; stage relevant source/docs/lockfile; commit and push.

## GitHub repository connection workflow
- User authorized connecting this existing workspace to `https://github.com/belalhazem511/Smart-Home-Ecomm.git`, preserving all files, inspecting remote history, committing storefront work and pushing the working branch. At setup, no `.git`, commits, branch, or remotes existed. Git identity is already configured as Belal Hazem / belalhazem511@gmail.com.
- Added root `.gitignore` excluding all `node_modules/`, `frontend/dist/`, `.env` variants (except `.env.example`), credential/key patterns, logs and local editor files. `git check-ignore` confirmed `frontend/node_modules/` and `frontend/dist/` are ignored; no local env/credential files were found by the targeted scan.
- Initialized Git and added `origin` with the requested URL. `git fetch origin` and `git ls-remote` failed with `Failed to connect to github.com port 443`; an elevated retry of `git fetch origin` returned no refs, while subsequent `ls-remote` again failed. Remote branch/default history is therefore UNKNOWN; no push will be attempted until inspected.
- Local storefront work has no previous commits. Prepare one commit on separate branch `integration/storefront-20261123`, preserving any remote default branch. Commit relevant source, project markdown, architecture/design references and lockfile; omit the bulky source archive and page-map JSON. Push remains blocked pending GitHub connectivity and history inspection.
- Local commit created: `feat(storefront): add home, catalog, product details and cart` on `integration/storefront-20261123`; SHA before checkpoint update: `e22fb49`. Staged source/docs passed `git diff --cached --check`. Push is BLOCKED: `git ls-remote origin` failed with `fatal: unable to access 'https://github.com/belalhazem511/Smart-Home-Ecomm.git/': Failed to connect to github.com port 443`. Remote history could not be verified, so no push was attempted. Retry fetch/history inspection and push only after connectivity returns.

## Checkout preview slice
- User confirmed the prior manual push succeeded; branch `integration/storefront-20261123` is tracking `origin/integration/storefront-20261123` at base commit `cf170da`. The two pre-existing files `references/Frontend_Page_Map.json` and `references/Smart_Home_Analysis_v1.zip` remain unchanged and uncommitted.
- Added `/checkout` as a fixture-backed demo with Address, Delivery, Payment and Review steps. Address validation is required before Delivery; seller delivery selection is required before Payment; payment selection is required before Review. URL `?step=` requests are resolved against completed in-memory prerequisites; refresh cannot bypass them.
- Checkout uses in-memory address values, separate per-seller fixture delivery choices/charges, integer minor-unit item/delivery/estimated totals, selection-only COD/card methods, and a disabled final submission. Empty, stale or invalid cart entries show an unavailable state. No auth, order creation, payment, stock reservation or cart clearing occurs.
- `npm.cmd test`: PASS, 14 total tests; focused cases cover required address validation, step guards, seller delivery charges/totals and empty/invalid carts. `npm.cmd run build`: PASS (Vite 8.3.8). No browser or visual checks performed. Assets remain `ASSET_PENDING`.
- Next workflow: commit this bounded feature on the current integration branch and attempt one normal push.

## Authentication UI slice
- User confirmed the previous checkout commit was pushed. Working branch remains `integration/storefront-20261123`; the two unrelated reference files remain untouched and uncommitted.
- Added `/sign-in`, `/sign-up`, and `/forgot-password` using one responsive AuthLayout. Header Sign in is enabled. Forms include semantic labels, autocomplete, inline validation, cross-links and an accessible show/hide password control.
- Forms validate locally and state clearly that authentication/recovery is unavailable. No sessions/tokens/accounts/recovery messages are simulated; passwords remain component memory only and are never logged or persisted. Customer account pages and backend integration remain deferred.
- Validation follows `04_SECURITY.md`: provisional UI sign-up password length 15–128 characters (never truncated). Server-side common/breached-password rejection, credential hashing, verification and bounded recovery remain backend requirements. Sign-in requires nonempty password; email uses basic format validation.
- `npm.cmd test`: PASS, 19 tests including auth email, required fields, password length and confirmation cases. `npm.cmd run build`: PASS (Vite 8.3.8). No browser/visual verification performed; assets remain `ASSET_PENDING`.
- Commit naming preference: descriptive English titles explaining the change. Use exactly `Add sign-in, sign-up, and password recovery screens` when these three screens are complete. Include changes, checks and limitations in the commit body; follow this preference for future commits.
- Next workflow: commit this auth UI slice and push the existing integration branch.

## Customer account overview and order history slice
- Added `/account`, `/account/orders`, and `/account/orders/:orderId`, using a shared responsive account layout with simple Overview/Orders navigation and clearly deferred profile/address destinations.
- Added fictional demo customer and standalone demo order fixtures. Order item names, variants, unit prices, line totals, seller delivery information and charges are purchase-time snapshots; helpers group by seller and total only those snapshots, without reading current catalog offers. Checkout creates none of these records.
- Added an explicit `View demo account` link from auth screens. Account views identify the fictional demo and state that they provide no authentication/access control. Unknown order IDs and empty histories have clear states. Order actions remain deferred. No real customer records, tokens, or sessions are created.
- `npm.cmd test`: PASS, 23 total; focused order checks cover lookup, empty/unknown IDs, seller grouping and snapshot totals. `npm.cmd run build`: PASS (Vite 8.3.8). No browser/visual verification performed. Asset gaps remain `ASSET_PENDING`.
- Commit naming preference remains: clear descriptive English titles, include changes/checks/limitations in commit body. This slice uses requested title `Add demo account overview, order history, and order details`.

## Demo profile and shipping address slice
- Added `/account/profile` and `/account/addresses` to the existing account navigation/layout. A small AccountContext keeps fictional profile edits and address changes in memory for the current demo session; no personal data is written to browser storage or sent over the network.
- Profile edits validate name and phone; email is read-only. Save/Cancel is supported and saved name/phone immediately update the account overview. Password changes and verification remain deferred.
- Address create/edit/remove/default flows use stable IDs and field-level errors. Existing checkout `validateAddress` rules are reused for required full name, phone, city and street. First address becomes default; editing preserves ID/default status; choosing default clears other defaults; deleting the default selects a remaining address; deleting the last leaves the empty state. Removal uses an explicit confirmation panel.
- Historical order snapshots were not changed. Checkout does not consume saved addresses. No authentication/access control is established. Existing imagery gaps remain `ASSET_PENDING`.
- `npm.cmd test`: PASS, 27 total, including profile/address validation, address lifecycle and default invariant checks. `npm.cmd run build`: PASS (Vite 8.3.8). No browser/visual checks performed.

## Demo seller portal and merchant-scoped overview
- Added explicit `/seller` demo entry and `/seller/:merchantId` overview route. Storefront header links to “Demo seller portal.” Entry and portal label demo behavior and state that no authentication or seller approval is simulated.
- Added a responsive portal header, assigned-merchant selector, collapsible mobile navigation, and sidebar. Only Catalog, Offers, Inventory, Orders, Shipments, Aftersales, Finance and Settings appear as clearly deferred labels; they are not dead links.
- Added two explicit fictional merchant memberships and merchant-scoped seller order fixtures, distinct from customer order snapshots. Dashboard filters all records by selected assigned merchant and derives counts from that scoped fixture list. Pending-payment and paid/ready-for-processing counts are separate. No write actions or financial balances are exposed.
- Unknown/unassigned merchant IDs show an unavailable state without fallback to another merchant. These client-side demo memberships are not authorization or access control. Assets remain `ASSET_PENDING`.
- `npm.cmd test`: PASS, 31 tests; focused seller checks cover merchant lookup, membership filtering, scoped counts and unknown/unassigned merchants. `npm.cmd run build`: PASS (Vite 8.3.8). No browser/visual verification performed.

## Merchant-scoped seller offers and draft editing
- Enabled the Offers destination in the seller portal and added merchant-scoped offer lists at `/seller/:merchantId/offers`, draft creation at `/seller/:merchantId/offers/new`, and draft editing at `/seller/:merchantId/offers/:offerId/edit`.
- Published fixture offers display product, variant, SKU, EGP price, warranty information and status as read-only. Search and empty/no-match states are included. New drafts use existing product and variant fixtures; product changes clear the selected variant. Merchant identity comes from the assigned route membership.
- Drafts live in a small shared in-memory seller context and survive portal navigation without changing source fixtures. SKU uniqueness is merchant-scoped; price uses positive integer minor units; warranty is seller-provided text only. Unknown, cross-merchant and published offer IDs cannot be edited. Offers are never published or copied into customer-facing product data. Inventory remains deferred.
- Focused checks: `npm.cmd test` PASS, 36 tests total, including merchant isolation, product/variant validity, merchant-local SKU uniqueness, money parsing, and draft-only editing. `npm.cmd run build` PASS (Vite 8.3.8). No browser/visual behavior verified; imagery remains `ASSET_PENDING`.
- Preview data and membership checks are client-side only, with no persistence, authorization, approval, inventory, or backend integration.

## Local demo sign-in for customer and seller previews
- Offers slice commit `c72d739` (`Add merchant-scoped offer lists and draft offer editing`) was pushed successfully to `origin/integration/storefront-20261123` before this separate preview sign-in change.
- Reused `/sign-in`. In development only, the supplied fictional demo credentials enable a page-level preview message and direct links to `/account`, `/seller/merchant-nile`, and `/seller/merchant-cairo`. The UI is labeled “Demo preview.” Routes remain unprotected and no authentication is established.
- Credential comparison code is dynamically imported only inside Vite's development branch. Form values and the preview indicator remain in page memory; no tokens, sessions, stored credentials, or logs are created. Production build inspection confirms the demo email and password are absent from built JavaScript.
- Focused checks: `npm.cmd test` PASS, 39 tests total, including accepted credentials, incorrect email/password rejection, and disabled mode. `npm.cmd run build` PASS (Vite 8.3.8); production credential absence check PASS. No browser interaction or visual behavior verified. Imagery remains `ASSET_PENDING`.
- Local development server started and `/sign-in` returned HTTP 200 at `http://127.0.0.1:5173/`.
- Demo preview does not grant authentication or access control; data remains fictional and frontend-only.

## Visual redesign phase 1: storefront and product browsing
- Reworked the shared storefront header into a compact search-led marketplace header with category navigation, account access, cart unit count, mobile search layout, and a reusable footer. Central visual tokens now use a white surface system, restrained blue accent, gray canvas, consistent borders, a 1320px content width, and visible focus treatment.
- Rebuilt the homepage around a restrained promotional hero, category links, a responsive 4/5-column product collection and a focused compatibility note. Product cards now show existing specifications, current available fixture offer and seller when available, price in EGP, and a clear product/options action. No unsupported ratings, savings, compatibility badges, delivery promises, or scarcity claims were added.
- Refined catalog result hierarchy, counts, sorting, active filter chips, clear controls, responsive 4-column wide product grids, pagination, and the mobile filters drawer with Apply/Cancel. URL-backed filters and search behavior are preserved.
- Refined product details with proportioned gallery placeholders, readable specifications and compatibility, explicit variant and seller-offer selection, seller terms, selected-offer price, and a clear add-to-cart action. Existing selection validation and cart handoff remain intact.
- No individual product image or font files are present in the app. The supplied homepage references are combined screenshots and were not reused as page content or cropped assets. Image gaps remain `ASSET_PENDING`; SVG icons provide restrained neutral placeholders. No competitor sites were inspected.
- Verification: `npm.cmd test` PASS (39 existing tests); `npm.cmd run build` PASS (Vite 8.3.8). Browser and visual checks are `NOT_VERIFIED` as requested; no browser automation was used.
- Commit workflow remains: update this checkpoint, create a focused descriptive commit, and push `integration/storefront-20261123` after each phase. Next phase: redesign cart, checkout, authentication, and customer account pages.
