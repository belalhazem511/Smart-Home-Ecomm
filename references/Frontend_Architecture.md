# Smart Home Marketplace — frontend architecture

Version 1.0 | 2026-11-23 | Status: ARCHITECTURE_PROPOSED / IMAGE_DESIGN_NOT_STARTED / APPLICATION_NOT_IMPLEMENTED.

## 1. Confirmed decisions and scope

Build one React web application using **JavaScript/JSX + Tailwind**, with simple CSS transitions. The first complete product is **English / LTR** across store, account, seller and admin. Arabic / RTL is phase L01 after the English product and its final review are complete. Brand name, final palette and final font are still provisional.

The current deliverable is architecture and a complete page inventory for the agreed commerce baseline. The user wants to review it, then see the design as images before application implementation. Do not interpret this document as authorization to scaffold 88 placeholder screens, charge money, publish a site or generate every image immediately. The current stage is complete when the architecture is concrete and reviewable.

The inventory contains **88 page families and 118 route patterns**. A family can have several URLs or explicit list/create/detail modes. Checkout has four views inside one page. This count describes the entire planned product, not an initial sprint or a required count of duplicated designs. Build only the current coherent slice when implementation is requested.

Core coverage includes discovery, identity, exact variant/offer selection, checkout, fulfillment, cancellation/return/warranty, customer/seller support and appeals, seller documents/stock/team, financial review/reconciliation, privacy and audit. Optional installation, promotion engine, platform WMS, cross-border selling, advanced compatibility automation and mobile-app implementation remain extensions governed by `01_ANALYSIS.md`.

Read this file selectively: the current area and linked page IDs. `Frontend_Page_Map.json` is a review inventory, **not a production configuration engine** or a replacement for explicit JSX routes/forms. Page data capability names are proposed requirements; real endpoint paths and DTO fields must come from the implemented API/OpenAPI.

## 2. Application areas and navigation

| Area | Page families | Navigation |
| --- | --- | --- |
| Store | 11 | Search, Categories, Brands, Compare, Cart, Help, account entry and Sell with us |
| Auth | 7 | One identity flow shared by all areas; verification, recovery, MFA and invitation acceptance |
| Checkout | 3 | Address → Delivery → Payment → Review, then provider return and server-confirmed result |
| Account | 15 | Overview, Orders, Requests, Wishlist, Reviews, Addresses, Support, Profile, Security, Privacy |
| Seller | 19 | Store switcher/application, Dashboard, Catalog, Offers, Inventory, Orders, Shipments, After-sales, Finance, Support, Settings |
| Admin | 30 | Overview, Commerce, Reviews, Finance, People & Access, Content & Policy, Governance & Operations |
| System | 3 | Access denied, not found, maintenance/unavailable; most data errors stay within their current page |

Store header: brand, large search, delivery context, account, cart, then useful category links. Account uses the store header with its own side navigation. Checkout has a compact header, safe exit, steps and summary. Seller/admin share a portal frame with different static navigation and permission-filtered items. No dashboard exposes an action solely because a user is called Admin.

Admin navigation groups:

| Group | Page IDs |
| --- | --- |
| Overview | D01 |
| Commerce | D03, D04, D05, D07, D08, D09, D10, D11, D12 |
| Reviews & Support | D02, D06, D13, D26 |
| Finance | D14–D21 |
| People & Access | D22, D23 |
| Content & Policy | D24, D25, D30 |
| Governance & Operations | D27, D28, D29 |

On mobile, the portal sidebar becomes a keyboard-accessible drawer. Use compact record cards for ordinary queues, or an explicitly labelled horizontal table region when side-by-side data is essential. Actions, reasons, money and deadlines stay readable. Route changes close the drawer and move focus to an appropriate heading.

## 3. Five reusable layouts

| Layout | Responsibility | Boundaries |
| --- | --- | --- |
| StoreLayout | Store header, category navigation, constrained content, footer | W pages and safe whole-page states; no account data assumptions |
| AuthLayout | Minimal identity/application frame, clear heading and safe return | A pages plus store chooser/application; a wider form is a normal page section |
| CheckoutLayout | Compact purchase frame, summary/step context | X pages; no promotional distractions or forced success message |
| AccountLayout | Account navigation and outlet inside StoreLayout | U pages; do not render a second store header/footer |
| PortalLayout | Portal top bar, static area navigation, outlet | Seller/admin pass a small explicit area/nav set; domain behavior stays in feature components |

`PageHeader`, `PageState`, `DataTable`, `StatusBadge`, `Dialog`, `FormField`, `Tabs`, `Pagination` and `Money` are shared as needed. Keep each component's props small. Five layouts do not mean one huge layout with dozens of switches.

The component relationship is explicit: the root router selects a layout and guard; the page composes domain components; those components call a small feature API module through one HTTP wrapper. The .NET API owns authorization, stock, money and provider outcomes. An application-level error boundary handles unexpected render failures without leaking details; ordinary API errors use PageState or inline field messages.

## 4. Folder and file architecture

The following are proposed paths, not files already implemented. Create them only as the current slice requires.

| Path | Files / purpose |
| --- | --- |
| `src/main.jsx` | React mount and stylesheet import |
| `src/app/App.jsx` | One BrowserRouter, necessary providers and AppRoutes |
| `src/app/routes.jsx` | Explicit route composition; split into role route groups when it becomes hard to read |
| `src/app/guards.jsx` | RequireAuth, RequireMerchant and RequirePermission, with pending/denied behavior |
| `src/pages/store`, `auth`, `checkout`, `account`, `seller`, `admin`, `system` | Thin page compositions corresponding to inventory families |
| `src/components/layout` | The five layouts, Header, Footer and small static portal navigation |
| `src/components/ui` | Small shared controls/state/table primitives actually used |
| `src/features/catalog` | ProductCard, Gallery, Filters, VariantSelector, OfferSelector, Compatibility, catalog API functions |
| `src/features/cart` | CartProvider, item/group sections, cart API and anonymous-to-account reconciliation |
| `src/features/checkout` | AddressStep, DeliveryStep, PaymentStep, ReviewStep, OrderSummary and quote/order API |
| `src/features/auth` | AuthProvider, credentials/challenge forms, identity API |
| `src/features/orders` | OrderItems, SellerOrderGroup, TrackingTimeline and role-appropriate order API functions |
| `src/features/aftersales` | Explicit cancellation/return/warranty forms, request timeline, inspection and appeal sections |
| `src/features/merchants` | Application steps, private documents, team, warehouses, bank-change sections and scoped merchant API |
| `src/features/inventory` | StockTable, movements, serial allocation and adjustment forms |
| `src/features/finance` | StatementLines, allocation views, refund/settlement/payout review panels; separate authorized API functions |
| `src/features/support` | CaseList, CaseComposer, CaseConversation and role-safe projections |
| `src/features/governance` | Privacy, audit, policy and operations sections added when needed |
| `src/lib/api.js` | One fetch transport, errors, CSRF/credentials policy and AbortSignal support |
| `src/lib/format.js` | Intl money/date/number helpers; English default en-EG and EGP |
| `src/content/en.js` | Simple grouped English UI text; no unfinished language switch or Arabic dictionary |
| `src/styles/index.css`, `tokens.css`, `motion.css` | Tailwind entry, one token source, small CSS motion rules; combine files while small |
| `src/mocks` | Explicit development fixtures only; no production fallback success |

Feature API files contain named functions for their domain, not a second HTTP client, generic repository or custom dependency-injection layer. A page may be only a small composition; a complex domain form can be its own readable component. File count and line count are not substitutes for understandable code. No empty folder scaffolding, universal form builder, runtime page DSL, microfrontends or default Redux.

Use a single routing mode initially: React Router declarative routing with nested layouts and Outlet. If role route groups are extracted, export route elements/normal route configuration supported by the chosen API; do not put arbitrary custom components directly under Routes and assume they are Route elements. Verify actual installed version/imports before coding; this document pins no unobserved package version. [T1]

## 5. State and data ownership

| State | Location | Update rule |
| --- | --- | --- |
| Identity/session summary | AuthProvider | Resolve initial unknown state before protected navigation; refresh on relevant 401/403/revocation |
| Shared customer cart | CartProvider in the common customer/store/checkout scope | Revalidate on sign-in and before quote; do not initialize customer-cart API calls in every admin page |
| Active merchant context | URL merchantId plus verified membership; small outlet context where useful | Changing store clears old scoped data and cancels stale requests |
| Search/filter/sort/page | URL query | Applied values are shareable and restored by Back; mobile draft stays local until Apply |
| Checkout step | URL `step` plus current server quote/draft | A direct URL cannot skip server requirements; preserve entered data across steps |
| Selected gallery/variant, open sheet, unsaved form | Local state or nearest common parent | Avoid duplicated derived copies and unrelated global state |
| Products/orders/statements/results | Feature API response | Abort/ignore older responses; refetch only when current action invalidates the relevant data |
| Display totals | Rendered from current data; purchase truth from quote/order | Never accept a browser-calculated payment/refund/payout amount as authoritative |

Keep local state near its owner and lift it only to the nearest component that genuinely shares it. Start without a general caching framework; add a maintained cache library only when recurring invalidation needs justify it. Never build a large custom cache to reduce a dependency count. [T2]

Session UI distinguishes unknown/loading, anonymous, challenge-required, authenticated and restricted cases. An MFA challenge can be a server-issued partial flow, not a completed authenticated session. A public signup never chooses a privileged role. Browser token secrets, passwords and private proofs are not stored in localStorage.

## 6. Routes, guards and tenant boundaries

| Route group | Required check | Failure behavior |
| --- | --- | --- |
| Public storefront | Published public resource | Public not-found/unavailable state without private details |
| `/account/...` | Authenticated user; API resource belongs to them | Safe sign-in return or owned-resource denial |
| `/checkout` and order results | Authenticated owner plus valid server prerequisites | Preserve cart/draft; show expired quote or sign-in; no payment replay |
| `/seller`, apply and application status | Current identity; ownership of draft/application | Applicant keeps access to their application without entering active store operations |
| `/seller/:merchantId/...` | Current membership, permitted operation and relevant merchant status | Store switcher or reasoned denial; suspended merchants may retain supported read-only/existing-obligation access |
| `/admin/...` | Current platform permissions for each action and private field | Forbidden page/action; no blanket financial powers from menu access |
| Privileged finance/access changes | MFA/reauthentication and independent approval where required | Explicit challenge or denial; server enforces no self-approval |

All IDs, slugs, query values and return destinations are untrusted input. MerchantId in a URL is context, not authority. The backend checks every list/detail/file/export/mutation. Guard components and hidden menu items improve UX and never replace server authorization. Reused customer/admin presentation pieces receive only their role-safe projection.

Prefer current merchant scope in the path so refreshing, deep-linking and switching stores are explicit. Never reuse a previous merchant's query result because a component stayed mounted. Public store slug and private merchant identifier have different purposes. Static paths such as `new`, `apply` and `applications` are declared deliberately beside dynamic paths. Unknown private resources must not leak their existence.

Keep one BrowserRouter, with AccountLayout nested inside StoreLayout. Checkout shares customer cart state but uses its own layout. Portal users authenticate through the same identity, with separate customer/store/platform permissions. Safe `returnTo` accepts only intended same-origin internal paths; reject protocol-relative or external redirects.

Production hosting must support direct public route opening and the chosen client routing fallback, while excluding API/assets from blanket rewrites. Public 404/maintenance HTTP status and SEO rendering require a hosting decision; the client screen alone cannot set those HTTP response codes.

## 7. Core navigation journeys

| Journey | Page IDs | Important branch |
| --- | --- | --- |
| Discover and buy | W01 → W03 → W04 → W07 → A01 when needed → X01 → X02 when provider redirects → X03 → U07 | Address/offer/price/stock changes return to review; COD is confirmed/unpaid, not captured |
| Find compatible products | W03 → W04 → W06 → W04 | Unknown compatibility remains unknown; required hub/model conditions stay visible |
| Track and claim remedy | U06 → U07 → U08 or U09 → U11 → U14 if disputed | Partial quantities, inspection, refund approval and actual return of money are separate states |
| Become a seller | W11 → A01/A02 → A03 → S02 → S03 → S01 → S04 | More-information/rejected applications preserve their submitted snapshot and reason |
| Publish an offer | S05 → S06 if catalog entry missing → D06 → S08 → S07 → S09 | Product approval does not auto-publish an ineligible offer or create stock |
| Fulfill seller order | S10 → S11 → S13 → S14 | Payment hold, partial allocation and handover exceptions are explicit |
| Seller after-sales | S15 → S16 → S19 if disputed; finance visible in S17 | Inspection does not auto-mark returned stock new or pay a refund |
| Seller money | S17 ↔ S18 bank-change request → D21 → D16 → D17 → D18 | Eligible, approved, dispatched and settled outcomes differ; no self-approval |
| Admin customer protection | D09 → D10 → D12/D13 → D15 → D18 | Backend quantities, refund bounds and verified provider outcome control available actions |
| Privacy | U15 → D27 → authorized result/download | Identity/retention/hold checks; no loss of unresolved financial evidence |

Arrows describe navigation and operational links, not a promise that all actions happen synchronously or that one user performs the whole sequence.

## 8. Checkout views and money states

| URL view | Page section | Required validation |
| --- | --- | --- |
| `/checkout?step=address` | AddressForm with saved-address choice | Owner, contact and supported address |
| `/checkout?step=delivery` | Delivery choices per seller/package | Coverage, actual eligibility and updated delivery charges |
| `/checkout?step=payment` | Provider-supported payment methods | Method eligibility, known quote and truthful provider mode |
| `/checkout?step=review` | Exact item/variant/offer summary, requirements, all charges and final action | Server quote still valid, any changed total acknowledged, stock and idempotent confirmation |

Use one CheckoutPage and four explicit step components. Draft inputs remain stable when moving between steps; refreshed quotes can invalidate later choices. Payment redirect is optional for eligible COD or other provider flows. A client `step=review`, a return `success=true` or an image that says paid cannot create the corresponding business fact.

OrderResultPage renders server-confirmed confirmed/COD-unpaid/pending/unknown/failed/cancelled states. Poll only safe status reads using a bounded strategy while the page is open; after the short automatic window provide a manual check and support reference. Do not mark an unknown outcome failed just because polling stopped or retry order confirmation as a new purchase.

Refunds, settlements, payouts and ledger views follow `01_ANALYSIS.md` and `04_SECURITY.md`. All money views show currency and source references. Unsupported live provider/fiscal actions remain visibly unavailable with the affected prerequisite; avoid false-success mocks. Core after-sales and financial failure handling cannot be skipped in a product claimed ready to trade.

## 9. Page patterns and reusable components

| Pattern | Used by | Reused parts |
| --- | --- | --- |
| Discovery grid | Home, catalog, wishlist, storefront | ProductCard, Price, CompatibilitySummary, empty/loading states |
| Product decision | PDP and comparison | Gallery, VariantSelector, evidence-backed specs; role-specific purchasing context |
| List plus detail | Reviews, merchant administration, support, finance queues | Toolbar, FilterBar, Pagination, row/card layout, explicit detail panel |
| Record detail | Orders, shipment, request, statement | PageHeader, StatusBadge, Timeline, ItemList, amounts and allowed actions |
| Form | Identity, address, offer, stock adjustment | Field, ValidationSummary, FileUpload status, SubmitButton; domain rules remain explicit |
| Wizard | Seller application, checkout | StepNavigation, draft persistence boundary, ReviewSummary; separate business steps |
| Settings sections | Security, merchant settings, taxonomy, platform settings | Tabs/sections with permission-aware fields and independent saves |
| Informational/system | Policy/help/403/404/maintenance | ReadableContent, PageState and safe navigation |

List/detail workspaces have small explicit components such as `RefundList` and `RefundReviewPanel`. The architecture does not ask for one component that can render every entity by changing a giant JSON schema. Short repeated fields can remain local until genuine reuse exists.

Shared overlays/subviews rather than extra pages: address add/edit, variant/offer choice, cart item removal, short review form, quantity/stock adjustment, invitation form, statement/payout detail, confirm-with-reason dialog and mobile filter sheet. Large multi-item after-sales requests keep their own full-width page. Long forms must remain usable on phones and with keyboard/zoom.

Logout is an authenticated action with CSRF protection, not a GET page. Header counts/messages are scoped projections; an in-app notification center is not silently invented if the backend only supports transactional notifications. Forms preserve safe inputs on recoverable failure, but never persist passwords/OTPs/private proofs.

## 10. Adaptive rules and visual baseline

Keep the previously researched baseline: content cap 1320px excluding external padding; gutters 16/24/32; body/input 16px; control targets 44–48px; one icon family; simple CSS motion respecting reduced-motion. Palette P1 and Inter remain proposals until visual review. No framework or icon dependency is installed by this architecture task.

| Screen type | Desktop | Mobile |
| --- | --- | --- |
| Catalog | Sidebar from suitable width, readable product grid | Filter sheet; one/two columns based on real content; no tiny type to force a count |
| PDP | Gallery + decision column | Gallery then requirements, selection, purchase and details; sticky CTA only if unobscured |
| Cart/checkout | Items/form + summary where space allows | Stacked sections; transparent total and safe keyboard behavior |
| Account | Account navigation + content | Compact navigation; full-width readable details |
| Portal queue | Sidebar + filters + table/detail | Drawer + record cards or labelled contained scroll; essential decisions remain reachable |
| Financial detail | Source/amount/approval/outcome sections | Same facts and permissions; no cut-off currency or hidden status |

Tailwind breakpoints are tools, not proof that all content fits. Verify 390 and 1440 for each representative composition, then 360/768/1024/1280 and 320 CSS-pixel reflow, 200% text enlargement and narrow landscape. Logical CSS works in English now and reduces later RTL rework. A responsive React website is not automatically a mobile app. [T3]

## 11. Image-first review plan

The user requested images after architecture review. Create the first representative image only when that next step is activated. Use realistic English content and neutral temporary brand naming; do not invent final brand approval, verified compatibility claims or provider promises.

| Order | Image to review | Design question resolved |
| --- | --- | --- |
| I01 first | Home desktop, 1440px layout intention | Header/search, palette, typography, hero, category and product-card direction |
| I02 | Home mobile, 390px layout intention | Information priority, readable cards, touch spacing and compact header |
| I03 | Catalog and mobile filter-sheet state | Density, comparison/filter affordances and applied state |
| I04 | Product details, desktop then mobile | Variant/offer selection, compatibility/hub requirements, warranty and buying hierarchy |
| I05 | Cart and checkout review | Multi-seller groups, complete totals and safe confirmation hierarchy |
| I06 | Seller dashboard and one fulfillment detail | Operational navigation, deadline/actions and table/card pattern |
| I07 | Admin seller-review or refund-review detail | Evidence, permissions, reasoned decision and financial-state visibility |

This is a finite sequence, not a request to generate all images in one call. Stabilize I01 before propagating its style. Later use representative views plus important failure-state examples rather than 88 unrelated generated styles. Image generation is for product UI concepts; exact route/ERD/architecture diagrams must use precise diagram tools if requested. Generated image text/dimensions are conceptual; actual CSS and accessibility must be checked during implementation.

## 12. Implementation and review routing

| Stage | Outcome |
| --- | --- |
| D00 current | Architecture and page inventory proposed for review |
| D01 next when activated | I01 visual concept, then remaining representative images after direction is settled |
| F00–F02 | Actual repository inspection, tokens/header/card, catalog and product, using reviewed direction |
| F03–F04 | Cart/checkout and customer account/after-sales with real integration and failure states |
| F05 | Seller/admin operational and financial areas in bounded slices; build all in-scope core pages before claiming complete English product |
| F06 | Complete English scope review with security, responsive, accessibility, integration and performance evidence |
| L01 later | Arabic content/UI, RTL, font and all affected journeys reviewed again |

Follow `05_EXECUTION_CHECKLIST.md`: checkpoint, current page IDs, actual files/contracts, targeted verification, bounded repair and honest status. Do not load the whole page inventory and research archive for each small edit. No milestone is implemented because a route has a placeholder. No image proves working authentication, financial integrity or accessibility.

Acceptance for this architecture: every route belongs to a page family/layout; access and data capabilities are explicit; core business journeys have matching pages; merchant scope, uncertain money states, private documents and after-sales remain covered; English-first and later Arabic are coherent; no deferred extension is accidentally active.

## 13. Sources and project inputs

- Business source: `01_ANALYSIS.md`; security source: `04_SECURITY.md`; design tokens and implementation conventions: `02_FRONTEND_PENDING.md`.
- T1: [React Router declarative routing](https://reactrouter.com/start/declarative/routing): nested routes, layout routes, Outlet, dynamic segments and linking.
- T2: [React sharing state](https://react.dev/learn/sharing-state-between-components): keep a shared state in the nearest appropriate parent.
- T3: [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design): mobile-first responsive utilities and breakpoints.

Sources reviewed 2026-11-23. The screen inventory, path names and feature boundaries are project proposals derived from the user's requirements; they are not claimed to be Amazon/noon internal architecture.

## 14. Full page inventory

The generated area tables and page-detail sections follow. IDs are stable for discussion and image/code handoff. The page-map JSON contains each family's route patterns, component, layout, access, content sections, actions, capabilities, special states, links and subviews. State lists supplement universal loading/error/ready behavior; empty is used when meaningful.

### Store — 11 page families

| ID | Page | Route patterns | Component / Layout | Access |
| --- | --- | --- | --- | --- |
| W01 | Home | `/` | `HomePage.jsx` / StoreLayout | Public |
| W02 | Categories & Brands | `/categories`<br>`/brands` | `DirectoryPage.jsx` / StoreLayout | Public |
| W03 | Catalog & Search | `/shop`<br>`/categories/:categorySlug`<br>`/brands/:brandSlug`<br>`/search` | `CatalogPage.jsx` / StoreLayout | Public |
| W04 | Product Details | `/products/:productSlug` | `ProductPage.jsx` / StoreLayout | Public |
| W05 | Seller Storefront | `/stores/:storeSlug` | `StorefrontPage.jsx` / StoreLayout | Public approved store |
| W06 | Compare | `/compare` | `ComparePage.jsx` / StoreLayout | Public |
| W07 | Cart | `/cart` | `CartPage.jsx` / StoreLayout | Public cart; checkout requires account |
| W08 | Help Center | `/help` | `HelpPage.jsx` / StoreLayout | Public |
| W09 | Information & Policies | `/about`<br>`/shipping`<br>`/returns-policy`<br>`/warranty-policy`<br>`/terms`<br>`/privacy`<br>`/help/:articleSlug` | `ContentPage.jsx` / StoreLayout | Public published content |
| W10 | Contact | `/contact` | `ContactPage.jsx` / StoreLayout | Public channels; authenticated case creation |
| W11 | Sell With Us | `/sell` | `SellLandingPage.jsx` / StoreLayout | Public |

### Auth — 7 page families

| ID | Page | Route patterns | Component / Layout | Access |
| --- | --- | --- | --- | --- |
| A01 | Sign In | `/sign-in` | `SignInPage.jsx` / AuthLayout | Anonymous or expired session |
| A02 | Create Account | `/sign-up` | `SignUpPage.jsx` / AuthLayout | Public; never grants merchant/admin |
| A03 | Verify Contact | `/verify-email` | `VerifyContactPage.jsx` / AuthLayout | Valid verification flow; limited resend |
| A04 | Forgot Password | `/forgot-password` | `ForgotPasswordPage.jsx` / AuthLayout | Public rate-limited |
| A05 | Reset Password | `/reset-password` | `ResetPasswordPage.jsx` / AuthLayout | Valid purpose-bound proof |
| A06 | MFA & Reauthentication | `/auth/challenge` | `AuthChallengePage.jsx` / AuthLayout | Server-issued challenge context |
| A07 | Accept Invitation | `/invitations/accept` | `InvitationPage.jsx` / AuthLayout | Valid invitation and matching authenticated account |

### Checkout — 3 page families

| ID | Page | Route patterns | Component / Layout | Access |
| --- | --- | --- | --- | --- |
| X01 | Checkout | `/checkout` | `CheckoutPage.jsx` / CheckoutLayout | Authenticated owner; verified contact when required |
| X02 | Payment Return | `/payments/return` | `PaymentReturnPage.jsx` / CheckoutLayout | Order/session association verified by server |
| X03 | Order Result | `/checkout/result/:orderId` | `OrderResultPage.jsx` / CheckoutLayout | Authenticated order owner |

### Account — 15 page families

| ID | Page | Route patterns | Component / Layout | Access |
| --- | --- | --- | --- | --- |
| U01 | Account Overview | `/account` | `AccountPage.jsx` / AccountLayout | Authenticated current user |
| U02 | Profile | `/account/profile` | `ProfilePage.jsx` / AccountLayout | Authenticated current user |
| U03 | Security & Sessions | `/account/security` | `SecurityPage.jsx` / AccountLayout | Current user; reauth for sensitive changes |
| U04 | Addresses | `/account/addresses` | `AddressesPage.jsx` / AccountLayout | Own addresses |
| U05 | Wishlist | `/account/wishlist` | `WishlistPage.jsx` / AccountLayout | Own wishlist |
| U06 | Orders | `/account/orders` | `OrdersPage.jsx` / AccountLayout | Own orders |
| U07 | Order Details | `/account/orders/:orderId` | `OrderDetailsPage.jsx` / AccountLayout | Owned order, all nested resources bound to it |
| U08 | Track Shipment | `/account/orders/:orderId/shipments/:shipmentId` | `TrackingPage.jsx` / AccountLayout | Shipment belongs to owned order |
| U09 | Order Request | `/account/orders/:orderId/cancel`<br>`/account/orders/:orderId/return`<br>`/account/orders/:orderId/warranty` | `OrderRequestPage.jsx` / AccountLayout | Owned eligible item quantities |
| U10 | My Requests | `/account/requests` | `RequestsPage.jsx` / AccountLayout | Own after-sales requests |
| U11 | Request Details | `/account/requests/:requestId` | `RequestDetailsPage.jsx` / AccountLayout | Own request |
| U12 | Reviews & Seller Feedback | `/account/reviews` | `ReviewsPage.jsx` / AccountLayout | Own eligible fulfilled purchases |
| U13 | Support Cases | `/account/support`<br>`/account/support/new` | `SupportPage.jsx` / AccountLayout | Own cases |
| U14 | Support Case Details | `/account/support/:caseId` | `SupportCasePage.jsx` / AccountLayout | Own case; public-to-customer fields only |
| U15 | Privacy Requests | `/account/privacy` | `PrivacyPage.jsx` / AccountLayout | Current user; reauth when required |

### Seller — 19 page families

| ID | Page | Route patterns | Component / Layout | Access |
| --- | --- | --- | --- | --- |
| S01 | Store Switcher | `/seller` | `MerchantChooserPage.jsx` / AuthLayout | Authenticated current memberships |
| S02 | Seller Application | `/seller/apply` | `SellerApplicationPage.jsx` / AuthLayout | Verified account; own draft |
| S03 | Application Status | `/seller/applications/:applicationId` | `SellerApplicationStatusPage.jsx` / AuthLayout | Own application |
| S04 | Seller Dashboard | `/seller/:merchantId` | `SellerDashboardPage.jsx` / PortalLayout | Current merchant member + dashboard.read; merchant status policy from server |
| S05 | Shared Catalog | `/seller/:merchantId/catalog` | `SellerCatalogPage.jsx` / PortalLayout | Merchant member + catalog.propose |
| S06 | Catalog Proposal | `/seller/:merchantId/catalog/proposals/new`<br>`/seller/:merchantId/catalog/proposals/:proposalId` | `CatalogProposalPage.jsx` / PortalLayout | Merchant member + own proposal permissions |
| S07 | Offers | `/seller/:merchantId/offers` | `SellerOffersPage.jsx` / PortalLayout | Merchant offers.read; actions require offers.write |
| S08 | Offer Editor | `/seller/:merchantId/offers/new`<br>`/seller/:merchantId/offers/:offerId/edit` | `OfferEditorPage.jsx` / PortalLayout | Merchant offers.write |
| S09 | Inventory | `/seller/:merchantId/inventory` | `InventoryPage.jsx` / PortalLayout | Merchant inventory.read/write separately |
| S10 | Seller Orders | `/seller/:merchantId/orders` | `SellerOrdersPage.jsx` / PortalLayout | Merchant orders.read |
| S11 | Seller Order Details | `/seller/:merchantId/orders/:sellerOrderId` | `SellerOrderPage.jsx` / PortalLayout | Seller order belongs to merchant + fulfillment permission |
| S12 | Shipments | `/seller/:merchantId/shipments` | `SellerShipmentsPage.jsx` / PortalLayout | Merchant shipments.read |
| S13 | Create Shipment | `/seller/:merchantId/shipments/new` | `ShipmentCreatePage.jsx` / PortalLayout | Merchant fulfillment.write; scoped seller-order query |
| S14 | Shipment Details | `/seller/:merchantId/shipments/:shipmentId` | `SellerShipmentPage.jsx` / PortalLayout | Shipment belongs to merchant + action permission |
| S15 | After-sales Queue | `/seller/:merchantId/requests` | `SellerRequestsPage.jsx` / PortalLayout | Merchant aftersales.read |
| S16 | After-sales Details | `/seller/:merchantId/requests/:requestId` | `SellerRequestPage.jsx` / PortalLayout | Merchant request + aftersales action permission |
| S17 | Finance & Statements | `/seller/:merchantId/finance` | `SellerFinancePage.jsx` / PortalLayout | Merchant finance.read; sensitive actions separately scoped |
| S18 | Store Settings | `/seller/:merchantId/settings` | `SellerSettingsPage.jsx` / PortalLayout | Merchant permission per tab; owner/finance MFA and reauth where required |
| S19 | Seller Support | `/seller/:merchantId/support`<br>`/seller/:merchantId/support/new`<br>`/seller/:merchantId/support/:caseId` | `SellerSupportPage.jsx` / PortalLayout | Case belongs to merchant; support permission |

### Admin — 30 page families

| ID | Page | Route patterns | Component / Layout | Access |
| --- | --- | --- | --- | --- |
| D01 | Admin Dashboard | `/admin` | `AdminDashboardPage.jsx` / PortalLayout | Platform staff; permitted summaries only |
| D02 | Seller Application Reviews | `/admin/reviews/sellers`<br>`/admin/reviews/sellers/:applicationId` | `SellerReviewPage.jsx` / PortalLayout | Staff sellers.review; private document permission |
| D03 | Merchants | `/admin/merchants`<br>`/admin/merchants/:merchantId` | `MerchantsPage.jsx` / PortalLayout | Staff merchants.read; actions explicitly scoped |
| D04 | Canonical Products | `/admin/catalog/products` | `ProductsAdminPage.jsx` / PortalLayout | Staff catalog.read |
| D05 | Product & Variant Editor | `/admin/catalog/products/new`<br>`/admin/catalog/products/:productId/edit` | `ProductEditorPage.jsx` / PortalLayout | Staff catalog.write/review |
| D06 | Catalog Proposal Review | `/admin/catalog/reviews`<br>`/admin/catalog/reviews/:proposalId` | `CatalogReviewPage.jsx` / PortalLayout | Staff catalog.review |
| D07 | Categories, Brands & Attributes | `/admin/catalog/taxonomy` | `TaxonomyPage.jsx` / PortalLayout | Staff taxonomy permission by action |
| D08 | Offer Moderation | `/admin/offers` | `OfferModerationPage.jsx` / PortalLayout | Staff offers.review |
| D09 | Platform Orders | `/admin/orders` | `AdminOrdersPage.jsx` / PortalLayout | Staff orders.read |
| D10 | Platform Order Details | `/admin/orders/:orderId` | `AdminOrderPage.jsx` / PortalLayout | Staff order access; actions by operation |
| D11 | Shipment Operations | `/admin/shipments`<br>`/admin/shipments/:shipmentId` | `ShipmentOperationsPage.jsx` / PortalLayout | Staff shipping.read/write separately |
| D12 | After-sales Operations | `/admin/requests`<br>`/admin/requests/:requestId` | `AfterSalesAdminPage.jsx` / PortalLayout | Staff aftersales.read/review |
| D13 | Support & Disputes | `/admin/support`<br>`/admin/support/:caseId` | `SupportAdminPage.jsx` / PortalLayout | Staff support scope; internal-note permission |
| D14 | Payments & Attempts | `/admin/finance/payments`<br>`/admin/finance/payments/:paymentId` | `PaymentsAdminPage.jsx` / PortalLayout | Finance payments.read; reconciliation action separate |
| D15 | Refund Review | `/admin/finance/refunds`<br>`/admin/finance/refunds/:refundId` | `RefundsAdminPage.jsx` / PortalLayout | Finance refund permissions; reauth/independent approval policy |
| D16 | Settlements | `/admin/finance/settlements`<br>`/admin/finance/settlements/:settlementId` | `SettlementsAdminPage.jsx` / PortalLayout | Finance settlement permissions |
| D17 | Payout Review | `/admin/finance/payouts`<br>`/admin/finance/payouts/:payoutId` | `PayoutsAdminPage.jsx` / PortalLayout | Finance payout scope; MFA/reauth; independent approval |
| D18 | Reconciliation | `/admin/finance/reconciliation` | `ReconciliationPage.jsx` / PortalLayout | Finance reconciliation scope |
| D19 | Ledger | `/admin/finance/ledger` | `LedgerPage.jsx` / PortalLayout | Finance ledger.read; correction permission separately controlled |
| D20 | Fiscal Documents | `/admin/finance/documents` | `FiscalDocumentsPage.jsx` / PortalLayout | Finance fiscal read/issue permission |
| D21 | Bank Change Review | `/admin/finance/bank-changes`<br>`/admin/finance/bank-changes/:changeId` | `BankReviewPage.jsx` / PortalLayout | Finance bank.review; reauth; independence |
| D22 | Users | `/admin/users`<br>`/admin/users/:userId` | `UsersAdminPage.jsx` / PortalLayout | Staff users.read/manage separately |
| D23 | Staff & Permissions | `/admin/access` | `AccessAdminPage.jsx` / PortalLayout | Staff access.manage; MFA/reauth; no self-elevation |
| D24 | Versioned Policies | `/admin/policies` | `PoliciesAdminPage.jsx` / PortalLayout | Policy permission per legal/commerce/commission section |
| D25 | Store Content | `/admin/content` | `ContentAdminPage.jsx` / PortalLayout | Staff content permission |
| D26 | Feedback Moderation | `/admin/feedback` | `FeedbackAdminPage.jsx` / PortalLayout | Staff feedback.review |
| D27 | Privacy Requests | `/admin/privacy` | `PrivacyAdminPage.jsx` / PortalLayout | Purpose-limited privacy reviewer |
| D28 | Audit Trail | `/admin/audit` | `AuditPage.jsx` / PortalLayout | Staff audit.read/export separately |
| D29 | Operations & Recovery | `/admin/operations` | `OperationsPage.jsx` / PortalLayout | Operations scope; financial replay permission separately controlled |
| D30 | Platform Settings | `/admin/settings` | `PlatformSettingsPage.jsx` / PortalLayout | Explicit settings scope |

### System — 3 page families

| ID | Page | Route patterns | Component / Layout | Access |
| --- | --- | --- | --- | --- |
| E01 | Access Denied | `/access-denied` | `AccessDeniedPage.jsx` / StoreLayout | Safe public explanation; no resource disclosure |
| E02 | Not Found | `*` | `NotFoundPage.jsx` / StoreLayout | Public safe fallback |
| E03 | Maintenance / Unavailable | `/maintenance` | `MaintenancePage.jsx` / StoreLayout | Safe public status |

## 15. Page-by-page sections, actions and states

Shared loading/error/ready behavior, direct-route ownership, English copy and responsive acceptance apply to every page. Empty is used only when meaningful. Capability names below do not assert that endpoints exist.

### W01 — Home

**Content:** Search-led header → One hero → Room/use-case categories → Selected product rows → Compatibility guide → Support/footer.

**Actions:** Search; Open category; Open product.

**API capabilities:** Public home content; Catalog summaries.

**Special states:** No campaign; Empty product section; Image missing.

**Navigation links:** W03, W04, W08, W11.

### W02 — Categories & Brands

**Content:** Page title → Category or brand directory → Search within directory.

**Actions:** Open category/brand.

**API capabilities:** Public taxonomy; Public brands.

**Special states:** No categories; Brand logo missing.

**Subviews / constraints:** Explicit categories/brands mode.

**Navigation links:** W03.

### W03 — Catalog & Search

**Content:** Context heading → Result count/sort → Applied filters → Filter panel/sheet → Product grid → Pagination.

**Actions:** Filter; Sort; Open product; Compare.

**API capabilities:** Search products; Filter facets; Eligible offer summaries.

**Special states:** No results; Unknown filter; Stale response; Unavailable offer.

**Subviews / constraints:** URL q, protocol, ecosystem, hub, brand, priceMin, priceMax, sort, page; Mobile draft filters before Apply.

**Navigation links:** W04, W06, W07.

### W04 — Product Details

**Content:** Gallery → Title/rating → Variant selection → Requirements and evidence → Seller offers → Price/delivery/warranty → Specifications/reviews.

**Actions:** Select variant/offer; Add to cart; Compare; Save.

**API capabilities:** Product and variants; Eligible seller offers; Delivery estimate; Review summary.

**Special states:** Unknown compatibility; No eligible offer; Selection unavailable; Price changed.

**Subviews / constraints:** Seller-offer selection; Specs/compatibility/reviews sections.

**Navigation links:** W05, W06, W07, U12.

### W05 — Seller Storefront

**Content:** Store identity → Seller feedback → Approved offers → Store policies/contact boundary.

**Actions:** Browse offers; Open product; Read seller policies.

**API capabilities:** Public merchant profile; Approved offers; Seller feedback.

**Special states:** Store suspended; No offers; Insufficient feedback.

**Navigation links:** W03, W04, W08.

### W06 — Compare

**Content:** Selected products → Comparable specifications → Differences → Requirement explanations.

**Actions:** Remove/replace product; Open product.

**API capabilities:** Canonical variant specs; Compatibility evidence.

**Special states:** Fewer than two products; Unknown value; Mixed category.

**Subviews / constraints:** 2–4 products; Mobile two at a time with explicit selection.

**Navigation links:** W03, W04.

### W07 — Cart

**Content:** Seller groups → Items/variants → Quantity controls → Shipping estimate → Price summary.

**Actions:** Change quantity; Remove; Continue to checkout.

**API capabilities:** Cart contents; Revalidated offers; Quote preparation.

**Special states:** Empty; Price/stock changed; Seller unavailable; Update failed.

**Subviews / constraints:** Sign-in preserves cart; Merge requires server reconciliation.

**Navigation links:** W03, A01, X01.

### W08 — Help Center

**Content:** Search/topics → Buying help → Compatibility help → After-sales guidance → Contact route.

**Actions:** Open article; Contact support.

**API capabilities:** Published help articles.

**Special states:** No articles; Search empty.

**Navigation links:** W09, W10, U13.

### W09 — Information & Policies

**Content:** Document title → Effective date/version where applicable → Readable article → Related links.

**Actions:** Read; Follow related topic.

**API capabilities:** Published content; Versioned public policy.

**Special states:** Unpublished/not found; Retired policy; Missing translation later.

**Subviews / constraints:** Known content slugs only; No arbitrary untrusted HTML.

**Navigation links:** W08, W10.

### W10 — Contact

**Content:** Published support channels → Hours if configured → Existing-order help link.

**Actions:** Open support case; Use verified contact channel.

**API capabilities:** Published contact details.

**Special states:** Channel unavailable; No configured phone/email.

**Subviews / constraints:** No invented contact details or anonymous ticket backend.

**Navigation links:** A01, U13, W08.

### W11 — Sell With Us

**Content:** Seller proposition → Required documents → Process → Commercial terms link → Application CTA.

**Actions:** Start application; Check application.

**API capabilities:** Published seller guidance; Current seller terms.

**Special states:** Applications temporarily closed.

**Navigation links:** A01, S01, S02, S03.

### A01 — Sign In

**Content:** Email/identifier → Password → Recovery link → Safe return context.

**Actions:** Sign in; Recover account.

**API capabilities:** Session sign-in; Session summary.

**Special states:** Invalid credentials; Rate limited; Verification/MFA required.

**Subviews / constraints:** returnTo must be same-origin internal allowlisted path.

**Navigation links:** A02, A03, A04, A06, U01, S01, D01.

### A02 — Create Account

**Content:** Name/contact → Credentials → Terms acceptance.

**Actions:** Create account; Open terms.

**API capabilities:** Registration; Current terms version.

**Special states:** Invalid/duplicate input handled safely; Rate limited.

**Navigation links:** A03, A01, W09.

### A03 — Verify Contact

**Content:** Verification status → Resend control → Next destination.

**Actions:** Verify; Resend.

**API capabilities:** Contact-verification service.

**Special states:** Expired/used proof; Attempt limit; Already verified.

**Subviews / constraints:** No raw proof in logs/analytics; Scrub proof from URL when safely consumed.

**Navigation links:** A01, U01, S02.

### A04 — Forgot Password

**Content:** Account identifier → Neutral result → Recovery guidance.

**Actions:** Request recovery.

**API capabilities:** Framework recovery request.

**Special states:** Neutral accepted response; Rate limit; Network failure.

**Navigation links:** A01, A05.

### A05 — Reset Password

**Content:** New credentials → Requirements → Completion.

**Actions:** Reset password.

**API capabilities:** Framework recovery completion.

**Special states:** Expired/reused proof; Validation failure.

**Subviews / constraints:** Never persist reset proof; Server controls session invalidation.

**Navigation links:** A01, A04.

### A06 — MFA & Reauthentication

**Content:** Reason → Challenge input → Supported recovery method → Safe next destination.

**Actions:** Verify; Cancel; Recover.

**API capabilities:** Framework MFA/reauthentication.

**Special states:** Expired challenge; Attempts exceeded; Cancelled action.

**Subviews / constraints:** Required for privileged production use; No frontend bypass.

**Navigation links:** A01, U03, S18, D23.

### A07 — Accept Invitation

**Content:** Merchant/platform invitation context → Granted scope summary → Accept/decline.

**Actions:** Authenticate; Accept; Decline.

**API capabilities:** Invitation preview/redeem.

**Special states:** Expired/revoked; Wrong account; Already accepted.

**Subviews / constraints:** Do not expose raw proof in path/logs; Invitation does not grant extra scope beyond server record.

**Navigation links:** A01, S01, U01.

### X01 — Checkout

**Content:** Address → Delivery per seller/package → Eligible payment method → Review quote → Order summary.

**Actions:** Save step; Requote; Confirm order.

**API capabilities:** Addresses; Coverage; Expiring quote; Idempotent order confirmation.

**Special states:** Expired quote; Changed total; Stock loss; Payment method unavailable; Session expiry.

**Subviews / constraints:** ?step=address|delivery|payment|review; Server validates prerequisites even on direct step link.

**Navigation links:** A01, U04, X02, X03, U07.

### X02 — Payment Return

**Content:** Verifying state → Provider-independent explanation → Safe order link.

**Actions:** Check status; Reauthenticate.

**API capabilities:** Verified order/payment-status lookup.

**Special states:** Pending; Unknown; Rejected; Session expired.

**Subviews / constraints:** Return URL cannot mark Paid; No automatic duplicate purchase POST.

**Navigation links:** X03, U07, A01.

### X03 — Order Result

**Content:** Server-confirmed outcome → Order reference → Seller split → Next steps.

**Actions:** View order; Continue shopping; Contact support.

**API capabilities:** Owned order summary; Payment outcome.

**Special states:** Confirmed; COD confirmed but unpaid; Pending; Unknown; Failed/cancelled.

**Subviews / constraints:** Never force success from query string or image state.

**Navigation links:** U07, U13, W03.

### U01 — Account Overview

**Content:** Profile summary → Recent orders → Open requests → Security reminder.

**Actions:** Open order/request; Edit account.

**API capabilities:** Own account summary.

**Special states:** No orders; Verification needed.

**Navigation links:** U02, U03, U06, U10, U13.

### U02 — Profile

**Content:** Name/contact summary → Editable public profile → Saved-change status.

**Actions:** Save allowed profile fields.

**API capabilities:** Own profile.

**Special states:** Invalid input; Concurrent update; Session expired.

**Subviews / constraints:** Contact credential changes route to security flow.

**Navigation links:** U01, U03.

### U03 — Security & Sessions

**Content:** Password/contact change → MFA enrollment/recovery → Active sessions.

**Actions:** Change credentials; Enroll MFA; Revoke sessions.

**API capabilities:** Credential/MFA/session services.

**Special states:** Reauth needed; Current session revoked; Recovery unavailable.

**Subviews / constraints:** MFA recovery codes shown only in authorized flow; No secret screenshots.

**Navigation links:** A03, A06, A01.

### U04 — Addresses

**Content:** Saved address list → Default indicator → Address form.

**Actions:** Add/edit/delete address.

**API capabilities:** Address book; Address validation.

**Special states:** Empty; Invalid region; Address in use.

**Subviews / constraints:** One add/edit form in dialog or full-width sheet; Orders retain saved address snapshots.

**Navigation links:** X01, U01.

### U05 — Wishlist

**Content:** Saved products → Current offer availability.

**Actions:** Remove; Open product.

**API capabilities:** Own wishlist; Catalog summaries.

**Special states:** Empty; Product no longer available.

**Navigation links:** W04, W03.

### U06 — Orders

**Content:** Status filters → Order summaries → Pagination.

**Actions:** Filter; Open order.

**API capabilities:** Own order list.

**Special states:** No orders; Search empty.

**Navigation links:** U07, W03.

### U07 — Order Details

**Content:** Purchase snapshots → Seller orders → Item quantities → Payment state → Shipments → Eligible actions → Fiscal document links.

**Actions:** Track; Request cancellation/return/warranty; Open support.

**API capabilities:** Owned order detail; Eligibility; Private issued documents.

**Special states:** Partial shipment; Partial cancellation/refund; COD unpaid; Unknown payment.

**Subviews / constraints:** No editable historical purchase fields; Invoice issuer comes from actual legal model.

**Navigation links:** U08, U09, U11, U13, X03.

### U08 — Track Shipment

**Content:** Shipment items → Carrier events → Delivery/custody evidence summary.

**Actions:** Refresh status; Report problem.

**API capabilities:** Owned shipment/tracking.

**Special states:** Label created only; Delayed; Delivery exception; Split shipment.

**Navigation links:** U07, U13.

### U09 — Order Request

**Content:** Eligible item selection → Reason → Evidence where relevant → Remedy explanation → Request review.

**Actions:** Submit request; Save evidence.

**API capabilities:** Cancellation/return/warranty eligibility; Private upload; Request creation.

**Special states:** Quantity no longer eligible; Handover race; Upload quarantined; Policy explanation.

**Subviews / constraints:** Explicit cancel/return/warranty forms; No universal form-schema engine.

**Navigation links:** U07, U10, U11.

### U10 — My Requests

**Content:** Type/status filters → Request list → Linked order references.

**Actions:** Open request.

**API capabilities:** Own request list.

**Special states:** No requests; Filter empty.

**Navigation links:** U11, U07.

### U11 — Request Details

**Content:** Timeline → Requested quantities → Inspection/remedy → Refund actual state → Messages/evidence → Appeal option.

**Actions:** Provide information; Appeal/open support.

**API capabilities:** Owned request; Owned evidence; Refund status projection.

**Special states:** More info requested; Rejected with reason; Refund approved/pending/unknown/paid.

**Subviews / constraints:** Approval is different from money returned; Replacement links to its fulfillment.

**Navigation links:** U07, U13, U14.

### U12 — Reviews & Seller Feedback

**Content:** Eligible purchases → Product reviews → Seller feedback → Published/pending status.

**Actions:** Write/edit permitted feedback.

**API capabilities:** Review eligibility; Product review; Seller feedback.

**Special states:** No eligible items; Moderation pending; Purchase eligibility changed.

**Subviews / constraints:** Product rating and seller feedback are separate; Short forms open as labelled dialogs.

**Navigation links:** W04, W05, U07.

### U13 — Support Cases

**Content:** Case list → New case form → Order/request link → Evidence upload.

**Actions:** Create case; Open case.

**API capabilities:** Own support cases; Case creation; Private evidence.

**Special states:** No cases; Upload failed; Order not owned.

**Subviews / constraints:** List/create are explicit subviews; Prepurchase contact may link here after sign-in.

**Navigation links:** U14, U07, U11.

### U14 — Support Case Details

**Content:** Case status → Visible messages → Evidence → Decision and appeal.

**Actions:** Reply; Upload allowed evidence; Appeal.

**API capabilities:** Owned case/messages/decision.

**Special states:** Waiting for customer; Resolved; Appeal available/unavailable.

**Subviews / constraints:** Internal staff notes never arrive in this DTO.

**Navigation links:** U13, U07, U11.

### U15 — Privacy Requests

**Content:** Data export request → Account closure request → Retention/hold explanation → Request status.

**Actions:** Request export; Request closure.

**API capabilities:** Own privacy requests; Authorized short-lived download.

**Special states:** Export preparing/expired; Legal/dispute hold; Reauth needed.

**Subviews / constraints:** No blanket deletion of purchase/financial evidence.

**Navigation links:** U03, U13.

### S01 — Store Switcher

**Content:** Owned/joined stores → Membership state → Applications.

**Actions:** Choose store; Apply.

**API capabilities:** Current merchant memberships; Own applications.

**Special states:** No store; Pending; Suspended; Membership revoked.

**Navigation links:** S02, S03, S04, U01.

### S02 — Seller Application

**Content:** Business/representative → Legal/tax documents → Bank proof → Warehouse/return address → Terms → Review.

**Actions:** Save draft; Upload; Submit.

**API capabilities:** Own application draft; Private documents; Submission snapshot.

**Special states:** Missing proof; Quarantine; Expired document; Submission failed.

**Subviews / constraints:** ?step=business|representative|documents|bank|warehouse|review; Submitted snapshot preserved.

**Navigation links:** S03, W11, A03.

### S03 — Application Status

**Content:** Submitted snapshot → Review timeline → Information requests → Reasoned outcome.

**Actions:** Supply requested information; Resubmit allowed changes.

**API capabilities:** Own application review status; Private documents.

**Special states:** Draft; Under review; More info; Rejected; Approved.

**Subviews / constraints:** Unapproved applicant never enters active merchant operations.

**Navigation links:** S01, S02, S04.

### S04 — Seller Dashboard

**Content:** Store status → Action counts → Fulfillment deadlines → Operational/finance summaries by permission.

**Actions:** Open urgent queue; Switch store.

**API capabilities:** Merchant scoped summary.

**Special states:** Suspended/read-only scope; No sales; Partial permission.

**Navigation links:** S01, S07, S09, S10, S15, S17, S18.

### S05 — Shared Catalog

**Content:** Search canonical products/variants → Technical match → Existing proposals.

**Actions:** Select exact variant; Propose missing product.

**API capabilities:** Canonical catalog; Merchant proposals.

**Special states:** No match; Ambiguous model/region; Duplicate proposal.

**Subviews / constraints:** Matching a shared product does not grant ownership of its canonical facts.

**Navigation links:** S06, S08.

### S06 — Catalog Proposal

**Content:** Product/model facts → Variant requirements → Evidence → Review feedback.

**Actions:** Save/submit; Provide requested correction.

**API capabilities:** Merchant proposal; Private/public asset separation.

**Special states:** Pending read-only; Changes requested; Rejected; Approved.

**Subviews / constraints:** Create/read/correct modes; No direct overwrite of another merchant offer or global catalog.

**Navigation links:** S05, S08.

### S07 — Offers

**Content:** Offer list → Variant/SKU → Price/condition → Moderation and availability.

**Actions:** Create/edit offer; Request publish/pause.

**API capabilities:** Merchant seller offers.

**Special states:** Under review; Inactive merchant; No stock; Rejected content.

**Navigation links:** S08, S09, S05.

### S08 — Offer Editor

**Content:** Canonical variant → Seller SKU → Price/condition → Warranty provider → Handling promise → Review.

**Actions:** Save; Submit/publish when eligible.

**API capabilities:** Exact variant; Merchant offer; Versioned policy references.

**Special states:** Invalid price; Variant retired; Review required; Concurrent edit.

**Subviews / constraints:** One create/edit form; No direct global product edit or editable old purchase snapshot.

**Navigation links:** S07, S09.

### S09 — Inventory

**Content:** Warehouse filter → Stock buckets → Movements → Applicable serialized units → Adjustment reason.

**Actions:** Adjust authorized stock; View movements; Manage eligible serials.

**API capabilities:** Merchant warehouse inventory; Stock movements; Serial units.

**Special states:** Reserved unit; Quarantine; Conflicting adjustment; Wrong warehouse.

**Subviews / constraints:** ?tab=stock|movements|serials&warehouseId=...; Available is not a free-edit balance.

**Navigation links:** S07, S11, S18.

### S10 — Seller Orders

**Content:** Status/deadline filters → Seller-order list → Fulfillment exceptions.

**Actions:** Open seller order.

**API capabilities:** Merchant seller orders.

**Special states:** No orders; Limited staff scope.

**Navigation links:** S11, S12, S15.

### S11 — Seller Order Details

**Content:** Owned item quantities → Minimal shipping PII → Packing/serial allocation → Shipment list → Cancellation eligibility.

**Actions:** Pack; Create shipment; Respond to cancellation.

**API capabilities:** Scoped seller order; Allocation; Eligibility.

**Special states:** Partial fulfillment; Payment hold; Cancelled quantity; Allocation race.

**Subviews / constraints:** Never expose other sellers items/private customer history.

**Navigation links:** S09, S13, S14, S16.

### S12 — Shipments

**Content:** Shipment queue → Carrier/state → Handover exceptions.

**Actions:** Open shipment; Create eligible shipment.

**API capabilities:** Merchant shipments.

**Special states:** Label only; Handover pending; Carrier unavailable.

**Navigation links:** S13, S14, S11.

### S13 — Create Shipment

**Content:** Eligible quantities → Allocated serials → Package details → Carrier readiness → Review.

**Actions:** Create label/shipment; Cancel draft.

**API capabilities:** Eligible seller-order quantities; Shipment creation; Carrier adapter.

**Special states:** Quantity changed; Provider unknown; Duplicate creation; No coverage.

**Subviews / constraints:** sellerOrderId query is untrusted and verified by API; AWB is not custody proof.

**Navigation links:** S11, S14.

### S14 — Shipment Details

**Content:** Shipment items → Label → Packing status → Custody evidence → Tracking → COD summary if allowed.

**Actions:** Record permitted handover evidence; Track; Report exception.

**API capabilities:** Merchant shipment; Custody/tracking; COD projection.

**Special states:** Printed label only; Partial delivery; COD not remitted; Return to sender.

**Subviews / constraints:** A seller action cannot arbitrarily mark Paid or provider-delivered.

**Navigation links:** S11, S12, S16, S19.

### S15 — After-sales Queue

**Content:** Cancellation/return/warranty tabs → Deadlines → Requested quantities.

**Actions:** Open request.

**API capabilities:** Merchant after-sales queue.

**Special states:** No requests; Awaiting carrier; Escalated dispute.

**Navigation links:** S16, S11.

### S16 — After-sales Details

**Content:** Saved policy → Eligible quantities → Custody/serial evidence → Inspection → Response/appeal.

**Actions:** Inspect/classify; Respond; Propose authorized remedy.

**API capabilities:** Merchant request; Inspection; Private evidence; Support escalation.

**Special states:** More information; Damaged/quarantined; Disputed serial; Refund controlled by finance.

**Subviews / constraints:** No blanket unboxing-video condition; No unauthorized payout/refund dispatch.

**Navigation links:** S15, S09, S19, S17.

### S17 — Finance & Statements

**Content:** Receivable/held balances → Statement list → Fees/corrections → Settlements → Payout actual outcomes.

**Actions:** Inspect line/settlement/payout; Request permitted export.

**API capabilities:** Merchant statements; Settlements; Payout outcomes; Authorized exports.

**Special states:** Pending/held; Unknown payout; Correction after return; Provider not live.

**Subviews / constraints:** ?tab=statements|settlements|payouts&recordId=...; Explicit read-only detail panels; No editable balance or unsupported Withdraw.

**Navigation links:** S18, S19.

### S18 — Store Settings

**Content:** Public store profile → Business documents → Warehouses/return address → Team → Verified bank/change request.

**Actions:** Save allowed fields; Invite staff; Submit bank change.

**API capabilities:** Merchant settings; Private documents; Memberships; Bank-change workflow.

**Special states:** Document expiry; Insufficient tab permission; Pending bank review; MFA required.

**Subviews / constraints:** ?tab=profile|business|warehouses|team|bank; Separate explicit section components; No self-approval or secret display.

**Navigation links:** S01, A06, A07, S09, S17.

### S19 — Seller Support

**Content:** Scoped case list/create → Visible conversation → Evidence → Decision/appeal.

**Actions:** Create/reply; Appeal.

**API capabilities:** Merchant support cases; Allowed evidence.

**Special states:** Case escalated; Decision disputed; Upload denied.

**Subviews / constraints:** Known list/create/detail components; Customer-private/internal notes excluded by API.

**Navigation links:** S16, S17, S18.

### D01 — Admin Dashboard

**Content:** Review queues → Order/support exceptions → Finance/operations widgets by permission.

**Actions:** Open authorized queue.

**API capabilities:** Permission-filtered platform summary.

**Special states:** Restricted cards; No pending work.

**Navigation links:** D02, D06, D09, D12, D13, D18, D29.

### D02 — Seller Application Reviews

**Content:** Review queue → Submitted snapshot → Legal/bank/warehouse evidence → Decision reasons.

**Actions:** Request info; Approve/reject eligible application.

**API capabilities:** Seller review service; Authorized private documents; Audit.

**Special states:** Already reviewed; Missing evidence; Conflict; No self-approval where required.

**Subviews / constraints:** List and dedicated review subview; No public document URLs.

**Navigation links:** D03, D28, S03.

### D03 — Merchants

**Content:** Merchant list → Public/legal identity → Membership overview → Documents → Status/history.

**Actions:** Inspect; Suspend/reactivate when authorized.

**API capabilities:** Merchant administration; Audit; Private document views.

**Special states:** Suspension affects new selling; Existing obligations preserved; Limited viewer.

**Subviews / constraints:** Detail tabs profile/documents/team/status; Not a generic editable entity browser.

**Navigation links:** D02, D21, D28.

### D04 — Canonical Products

**Content:** Product list → Variant status → Technical completeness → Review links.

**Actions:** Open editor; Review proposal.

**API capabilities:** Canonical catalog administration.

**Special states:** Duplicate model; Missing required fact.

**Navigation links:** D05, D06, D07, D08.

### D05 — Product & Variant Editor

**Content:** Product identity → Variants → Structured technical fields → Compatibility evidence → Media → Change impact.

**Actions:** Save reviewed version; Retire variant.

**API capabilities:** Canonical catalog mutation; Evidence; Asset checks.

**Special states:** Conflicting edit; Unsupported claim; Orders retain prior snapshots.

**Subviews / constraints:** One create/edit composition with explicit variant forms.

**Navigation links:** D04, D06, D08.

### D06 — Catalog Proposal Review

**Content:** Proposal queue → Canonical match → Evidence → Proposed changes → Decision.

**Actions:** Merge/match approved facts; Request correction; Reject.

**API capabilities:** Catalog proposals; Canonical comparison; Audit.

**Special states:** Duplicate; Conflicting specification; Already resolved.

**Navigation links:** D04, D05, D08.

### D07 — Categories, Brands & Attributes

**Content:** Category tree → Brands → Category-specific attributes → Filter definitions.

**Actions:** Create/edit allowed taxonomy; Archive with dependency checks.

**API capabilities:** Taxonomy/brand/attribute services.

**Special states:** Category in use; Invalid hierarchy; Attribute change affects filters.

**Subviews / constraints:** ?tab=categories|brands|attributes; Three explicit forms, not arbitrary schema editing.

**Navigation links:** D04, D05.

### D08 — Offer Moderation

**Content:** Merchant/variant filters → Offer content → Policy and status → Decision drawer.

**Actions:** Approve/request correction/suspend when allowed.

**API capabilities:** Offer moderation; Merchant/catalog eligibility.

**Special states:** Merchant inactive; Variant retired; Price anomaly needs review.

**Subviews / constraints:** ?offerId=... opens authorized detail; Never edits historical order snapshots.

**Navigation links:** D03, D04, D09.

### D09 — Platform Orders

**Content:** Filters → Customer-order list → Seller split indicators → Exception flags.

**Actions:** Open order; Permitted export.

**API capabilities:** Platform order search; Purpose-limited projections.

**Special states:** No matches; Partial status; Export restricted.

**Navigation links:** D10, D11, D14, D12.

### D10 — Platform Order Details

**Content:** Immutable snapshots → Seller orders → Payments → Shipments → Eligible remedies → Audit.

**Actions:** Investigate; Start allowed corrective workflow.

**API capabilities:** Platform order detail; Related payments/shipments/requests.

**Special states:** Unknown payment; Split/partial fulfillment; Concurrent action.

**Subviews / constraints:** No arbitrary Mark Paid/Ship All override; PII limited by task.

**Navigation links:** D11, D12, D13, D14, D15.

### D11 — Shipment Operations

**Content:** Shipment queue → Custody → Tracking exceptions → Carrier evidence → COD projection.

**Actions:** Investigate; Perform supported carrier action.

**API capabilities:** Shipment operations; Carrier adapter; Custody evidence.

**Special states:** AWB only; Out-of-order event; Return to sender; COD discrepancy.

**Subviews / constraints:** List/detail share a workspace with explicit shipment components.

**Navigation links:** D10, D18, D29.

### D12 — After-sales Operations

**Content:** Type queues → Quantity eligibility → Saved policy → Inspection/evidence → Remedy decision.

**Actions:** Request evidence; Decide eligible remedy; Escalate.

**API capabilities:** After-sales review; Inspection; Replacement links.

**Special states:** Handover race; Partial return; Disputed inspection; Appeal.

**Subviews / constraints:** Refund authorization links to finance; Physical receipt is not refund success.

**Navigation links:** D10, D13, D15, D28.

### D13 — Support & Disputes

**Content:** Queue → Party-visible messages → Separated internal notes → Evidence → Decisions/appeals.

**Actions:** Reply; Assign; Record decision; Review appeal.

**API capabilities:** Support cases; Purpose-limited evidence; Audit.

**Special states:** Waiting party; Escalated; Conflicting party claims.

**Subviews / constraints:** Customer/seller/internal channels are separate; No accidental internal reply publication.

**Navigation links:** D10, D12, D14, D15.

### D14 — Payments & Attempts

**Content:** Payment queue → Attempts/events → Amount/currency/reference → Allocation → Outcome history.

**Actions:** Inspect; Request trusted reconciliation.

**API capabilities:** Payment detail; Redacted event summaries; Provider reconciliation.

**Special states:** Authorized vs captured; Unknown/late; Wrong amount; Duplicate event.

**Subviews / constraints:** No frontend/provider-secret access and no force-paid setter.

**Navigation links:** D10, D15, D18, D29.

### D15 — Refund Review

**Content:** Refund queue → Eligible capture/components → Prior/pending refunds → Approval → Actual provider outcome.

**Actions:** Approve/reject permitted request; Dispatch eligible approved refund.

**API capabilities:** Refund eligibility; Approval; Idempotent dispatch/status.

**Special states:** Concurrent refund; Chargeback overlap; Unknown provider result; Self-approval denied.

**Subviews / constraints:** Approve and paid-outcome are separate; Replay cannot send twice.

**Navigation links:** D10, D12, D14, D18.

### D16 — Settlements

**Content:** Eligible sources → Holds/fees/corrections → Currency → Statement links → Review.

**Actions:** Prepare/review supported settlement.

**API capabilities:** Settlement sources; Allocation; Ledger references.

**Special states:** Source already allocated; Unresolved hold; Currency mismatch.

**Subviews / constraints:** No duplicate source allocation; Do not rewrite posted accounting facts.

**Navigation links:** D17, D19, D18.

### D17 — Payout Review

**Content:** Verified destination → Settlement allocation → Maker/reviewer → Provider outcome.

**Actions:** Approve eligible payout; Dispatch once; Reconcile.

**API capabilities:** Verified bank; Payout workflow; Provider status.

**Special states:** Wrong entity/currency; Self-approval; Unknown payout; Provider not live.

**Subviews / constraints:** Live dispatch blocked until provider/legal gates pass; No optimistic financial success.

**Navigation links:** D16, D18, D21, D19.

### D18 — Reconciliation

**Content:** Payment/COD/carrier/chargeback queues → Trusted source comparison → Discrepancies → Corrective links.

**Actions:** Investigate; Record supported reconciliation; Link correction.

**API capabilities:** Provider/bank/carrier reconciliation; Audit.

**Special states:** Delivered but unpaid COD; Remittance mismatch; Late success; Chargeback after payout.

**Subviews / constraints:** ?type=payments|cod|carrier|chargebacks&caseId=...; No screenshot-only settlement proof.

**Navigation links:** D14, D15, D17, D19, D11.

### D19 — Ledger

**Content:** Journal search → Balanced lines → Currency → Source/reversal references.

**Actions:** Inspect; Open authorized correction workflow.

**API capabilities:** Immutable posted journal projections.

**Special states:** Unbalanced draft blocked; Correction linked to original.

**Subviews / constraints:** ?entryId=... detail; No inline edit/delete of posted entries.

**Navigation links:** D16, D17, D18.

### D20 — Fiscal Documents

**Content:** Document list → Legal issuer → Original version → Credit/replacement links → Provider status.

**Actions:** View authorized original; Issue only via approved integration.

**API capabilities:** Fiscal document adapter; Private originals.

**Special states:** Issuer unresolved; Provider pending/rejected; Original unavailable.

**Subviews / constraints:** No fabricated legal invoice; Unresolved contract disables affected issue action.

**Navigation links:** D10, D15, D18.

### D21 — Bank Change Review

**Content:** Request queue → Masked old/new destination → Entity proof → Evidence → Review history.

**Actions:** Request info; Approve/reject eligible change.

**API capabilities:** Bank change review; Authorized private proof; Audit.

**Special states:** Entity mismatch; Stale proof; Self-approval; Already reviewed.

**Subviews / constraints:** Never reveal full bank/document contents to unrelated staff.

**Navigation links:** D03, D17, D28.

### D22 — Users

**Content:** User search → Minimal account context → Membership summary → Status/security events.

**Actions:** Suspend/reactivate eligible account; Open relevant case.

**API capabilities:** User administration; Session revocation; Audit.

**Special states:** Protected account; Insufficient purpose/permission; Concurrent status.

**Subviews / constraints:** No arbitrary password viewing; Merchant membership is not one global Role.

**Navigation links:** D23, D13, D28.

### D23 — Staff & Permissions

**Content:** Platform staff → Permission assignments → Invitations → MFA readiness → Review history.

**Actions:** Invite; Change allowed permissions; Revoke.

**API capabilities:** Platform access administration; Invitations; Audit.

**Special states:** Self-elevation blocked; MFA incomplete; Last-admin safeguard.

**Subviews / constraints:** Initial admin is provisioned securely outside public signup.

**Navigation links:** A06, A07, U03, D22, D28.

### D24 — Versioned Policies

**Content:** Published/draft versions → Effective dates → Changed terms → Acceptance impact.

**Actions:** Draft; Review/publish allowed version.

**API capabilities:** Versioned policy service; Commission policy; Audit.

**Special states:** Overlapping effective policy; Required review; Existing snapshot preserved.

**Subviews / constraints:** ?tab=legal|commerce|commission; No invented commission percentage.

**Navigation links:** D25, D19, D28.

### D25 — Store Content

**Content:** One hero → Featured category/product references → Help articles → Public support/footer details.

**Actions:** Preview; Publish validated content.

**API capabilities:** Limited public content service; Reviewed public assets.

**Special states:** Unpublished product reference; Missing image; Unsafe markup.

**Subviews / constraints:** Small explicit content forms; No drag/drop page builder or promotion engine.

**Navigation links:** W01, W08, W09, W10, D24.

### D26 — Feedback Moderation

**Content:** Product reviews → Seller feedback → Reports → Moderation reasons.

**Actions:** Review report; Publish/hide per policy; Record reason.

**API capabilities:** Feedback moderation; Audit.

**Special states:** Abuse report; Appeal; Protected eligibility.

**Subviews / constraints:** Cannot manufacture positive ratings or combine seller/product scores.

**Navigation links:** D13, D28, W04, W05.

### D27 — Privacy Requests

**Content:** Export/closure queue → Identity verification → Retention/hold → Authorized outcome.

**Actions:** Review; Prepare authorized export; Explain hold.

**API capabilities:** Privacy workflows; Private export; Audit.

**Special states:** Identity unclear; Dispute hold; Download expired.

**Subviews / constraints:** No universal delete action that destroys required evidence.

**Navigation links:** D22, D28, D13.

### D28 — Audit Trail

**Content:** Actor/action/resource filters → Reason/outcome → Correlation → Safe detail.

**Actions:** Filter; Inspect; Export authorized scope.

**API capabilities:** Redacted audit search.

**Special states:** Restricted event detail; No matching events; Export limit.

**Subviews / constraints:** Read-only; No secrets, OTPs or raw private payload dumps.

**Navigation links:** D03, D10, D19, D23.

### D29 — Operations & Recovery

**Content:** Durable work → Redacted integration health → Failed job queue → Replay history.

**Actions:** Inspect; Retry only supported idempotent operation.

**API capabilities:** Outbox/job projections; Integration readiness; Audited replay.

**Special states:** Poison message; Retry limit; Provider unavailable; Already processed.

**Subviews / constraints:** No arbitrary webhook execution or editable Paid state.

**Navigation links:** D11, D14, D18, D28.

### D30 — Platform Settings

**Content:** Market/currency policy → Coverage/carrier configuration → Provider readiness → Notification templates.

**Actions:** Save approved nonsecret settings; Check readiness.

**API capabilities:** Operational configuration; Server secret readiness summaries.

**Special states:** Provider not configured; Coverage conflict; Unsupported live capability.

**Subviews / constraints:** No provider keys/passwords in client configuration or returned settings DTOs.

**Navigation links:** D24, D29, D28.

### E01 — Access Denied

**Content:** Reason category → Sign-in/switch-store/support options.

**Actions:** Choose valid destination.

**API capabilities:** Session summary only if signed in.

**Special states:** Membership revoked; Forbidden operation.

**Subviews / constraints:** No private object details in a 403 explanation.

**Navigation links:** A01, S01, W01, W10.

### E02 — Not Found

**Content:** Not-found explanation → Search → Safe navigation.

**Actions:** Search; Go home.

**API capabilities:** No private lookup required.

**Special states:** Unknown route; Deleted public item.

**Subviews / constraints:** Public unavailable resources may use this presentation; Production HTTP status remains a server concern.

**Navigation links:** W01, W03.

### E03 — Maintenance / Unavailable

**Content:** Service state → Support link → Retry guidance.

**Actions:** Retry read; Open support.

**API capabilities:** Configured service availability.

**Special states:** Offline; Service unavailable; Unknown payment remains linked to order.

**Subviews / constraints:** Read retries are bounded; Do not turn an uncertain mutation into a failed purchase.

**Navigation links:** W01, W10, U07.
