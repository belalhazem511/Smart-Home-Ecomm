# Implemented Pages, UI Details, and Workflow Gaps

## Source snapshot

- **Branch:** `integration/storefront-20261123`
- **Source commit:** `112aa76b87c18599610afc79f39b75f48b41841b`
- **Application:** `frontend/`, React + JavaScript/JSX + Vite + Tailwind v4 and local CSS.
- **Coverage:** 31 explicit route templates across 16 top-level page components, plus the documented unknown-route fallbacks. Admin list/detail variants are described individually.
- **Scope of this report:** every explicit route pattern dispatched by `frontend/src/app/App.jsx`, including all page variants rendered by the admin preview. Route counts below are route templates, not the number of fixture IDs.
- **Evidence sources:** current `frontend/src` files and fixtures; `frontend/package.json`; `project_state.md`; `FRONTEND_GAP_AUDIT.md`; and the replacement brief, especially sections 03–05, 14–18. Source and styles describe intended layout; they do not establish rendered geometry or browser behavior.

## Complete implemented route inventory

There are **31 explicit route templates**. `:parameter` means the path segment is passed to a page component and resolved against local fixture data. Query parameters are noted separately.

| # | Route | Rendered page/component | Route-specific behavior |
|---:|---|---|---|
| 1 | `/` | `HomePage` | Home. Any unmatched non-admin route also falls through to this page. |
| 2 | `/shop` | `CatalogPage` | Whole fixture catalog. |
| 3 | `/categories/:categorySlug` | `CatalogPage` | Category is derived from the slug and applied as a fixture filter. An unknown category slug currently behaves like an unfiltered catalog. |
| 4 | `/search?q=...` (also `/search`) | `CatalogPage` | Query and supported filters are read from URL parameters; empty `q` is allowed. |
| 5 | `/products/:productSlug` | `ProductPage` | Product slug resolves against three detail fixtures; unknown/unconfigured products show an unavailable state. |
| 6 | `/cart` | `CartPage` | Valid cart renders seller groups; empty or invalid cart renders the unavailable/empty panel. |
| 7 | `/checkout?step=...` (also `/checkout`) | `CheckoutPage` | Address, delivery, payment, review; query step is guarded by prerequisites. |
| 8 | `/sign-in` | `AuthPage` → sign-in | Includes a development-only local demo credential preview. |
| 9 | `/sign-up` | `AuthPage` → sign-up | Local validation only; no registration. |
| 10 | `/forgot-password` | `AuthPage` → recovery request | Local email validation only; no message is sent. |
| 11 | `/account` | `AccountPage` | Fictional demo customer overview. |
| 12 | `/account/orders` | `OrderHistoryPage` | Independent purchase-time order fixtures. |
| 13 | `/account/orders/:orderId` | `OrderDetailPage` | Known snapshot or “Order not found”; malformed percent-encoding is not safely caught by the dispatcher. |
| 14 | `/account/profile` | `AccountProfilePage` | Name and phone edit; email read-only. |
| 15 | `/account/addresses` | `AccountAddressesPage` | In-memory address CRUD/default behavior. |
| 16 | `/seller` | `SellerChooserPage` | Lists explicitly assigned fictional merchant memberships. |
| 17 | `/seller/:merchantId` | `SellerDashboardPage` | Merchant-scoped overview or unavailable state; no fallback merchant. |
| 18 | `/seller/:merchantId/offers` | `SellerOffersPage` | Merchant-scoped offers/search. |
| 19 | `/seller/:merchantId/offers/new` | `SellerOfferEditorPage` | Create draft under route merchant. |
| 20 | `/seller/:merchantId/offers/:offerId/edit` | `SellerOfferEditorPage` | Edit only an existing draft belonging to that merchant. |
| 21 | `/admin` | `AdminPreviewPage` → overview | Fictional fixture queue counts and recent customer orders. |
| 22 | `/admin/reviews/sellers` | `AdminPreviewPage` → applications list | Static fictional merchant application queue. |
| 23 | `/admin/reviews/sellers/:applicationId` | `AdminPreviewPage` → application detail | Known fixture or unavailable record. |
| 24 | `/admin/users` | `AdminPreviewPage` → users list | Static fictional users/membership list. |
| 25 | `/admin/users/:userId` | `AdminPreviewPage` → user detail | Known fixture or unavailable record. |
| 26 | `/admin/catalog/products` | `AdminPreviewPage` → canonical products | Read-only product fixture table. |
| 27 | `/admin/catalog/reviews` | `AdminPreviewPage` → proposals list | Static fictional product-proposal queue. |
| 28 | `/admin/catalog/reviews/:proposalId` | `AdminPreviewPage` → proposal detail | Known fixture or unavailable record. |
| 29 | `/admin/offers` | `AdminPreviewPage` → offer review | Static fictional offer-review table; no detail route/action. |
| 30 | `/admin/orders` | `AdminPreviewPage` → orders list | Customer order snapshots; not seller orders. |
| 31 | `/admin/orders/:orderId` | `AdminPreviewPage` → order detail | Historical purchase-time snapshot or unavailable record. |

`App.jsx` implements client-side anchor navigation by intercepting same-origin root-relative links, using `history.pushState`, and listening to `popstate`. GET search forms still submit normally. Every `/admin/...` path enters `AdminPreviewPage`; unknown admin children show an unavailable destination inside the admin shell. The final catch-all returns `HomePage`, so an unknown public URL is not a not-found page. Account order IDs use direct `decodeURIComponent` in `App.jsx` without a try/catch; seller route IDs and admin record IDs catch decode errors and proceed to their unavailable lookup state.

## Shared layouts, components, and integration boundaries

| Shared element | Actual use and behavior |
|---|---|
| `StoreHeader` | Storefront, product, cart, checkout, and account pages. Sticky header; utility row on `sm` and wider; search GET form; mobile category toggle; categories; sign-in and cart-unit count. |
| `StoreFooter` | Storefront, catalog, product, cart, checkout, and account pages. Links to implemented shop/category/account/cart/seller/admin destinations. It is not used by auth, seller portal, or admin portal. |
| `ProductCard` | Home and catalog. Reads `featuredDevices` plus optional `productDetails`; selects the lowest-priced available detail offer for display. Home now filters promotion to products with a detail fixture. |
| `Icon` | Shared inline SVG path set: home, menu, close, search, info, user, cart, switch, light, sensor, security, curtains, hub and plug. Icons are decorative by default (`aria-hidden`). |
| `AuthLayout` | Sign-in, sign-up, recovery: standalone centered auth panel, brand link, and demo-account/store links. |
| `AccountLayout` | Overview, orders, order detail, profile and addresses. Store header/footer, repeated demo limitation banner, horizontal/mobile or vertical account navigation. |
| `SellerPortalLayout` | Seller overview, offer list and offer editor. Full-width portal shell, merchant selector, responsive sidebar, active Overview/Offers navigation, compact Demo preview disclosure. |
| `AdminPortalLayout` | All admin list/detail/overview and unknown-child pages. Full-width shell, responsive grouped sidebar, compact Demo preview disclosure. |
| Providers from `main.jsx` | App-wide `CartProvider`, `AccountProvider`, and `SellerOffersProvider`. No API/service provider is present. |

### Source styling specifications (not measured browser output)

- `styles/index.css` imports Tailwind and then defines base tokens: ink `#111827`, muted `#64748B`, canvas `#F5F6F8`, border `#E2E8F0`, white surfaces, primary `#1D4ED8`, hover `#1E40AF`; control/panel radii 8/12px. The primary blue with white text is calculated in the existing audit at 6.70:1. Focus-visible uses a 3px blue outline; reduced-motion CSS disables/shortens transitions and smooth scrolling.
- Body declares a 16px system sans stack beginning with `Inter`; no local Inter font file or remote font import exists. `market-shell` max width is 1320px, with 16px gutters by default, 24px at `min-width:768px`, 32px at `min-width:1280px` (the max-width belongs to this storefront wrapper, not portal shells).
- `.button-primary`, `.button-secondary`, `.button-quiet`, `.button-danger` define shared 42px minimum button height, 8px radius, 14px type, with 44px minimum on max-width 640px. `.field-control` and a global `:where(input/select/textarea)` rule define 42px fields, 1px slate border and 8px radius. Some components continue to combine Tailwind utility classes with these global declarations. Computed styles where utility/global precedence affects dimensions or colors are **UNKNOWN** without browser inspection.
- Portal CSS: `.portal-topbar` 64px minimum; `.portal-workspace` grid with 232px sidebar, flexible content, 24px gap and padding; at max-width 767px it becomes one column with 16px padding and static sidebar. `.portal-sidebar` is sticky at top 16px on desktop. `.portal-table` is 14px with 11px × 14px cell padding; wrappers contain horizontal overflow. These are authored CSS values, not viewport measurements.
- The breakpoint utility classes in markup also use Tailwind defaults (`sm`, `md`, `lg`, `xl`), so behavior at breakpoints where both utility and custom CSS rules compete is **UNKNOWN** pending rendered review. No browser viewport checks were performed for this report.

### Data mode and integration boundaries

Everything shown is fixture-backed or component/context state. `rg` across `frontend/src` found no fetch/axios/XHR integration. There is no server-authoritative validation, price/stock, authentication, order creation, payment, inventory, review approval or carrier operation.

- Store catalog fixtures are `homeContent.js`: eight `featuredDevices`, six categories, but only three `productDetails` (touch switch, Wi-Fi plug, motion sensor). Product, variant, seller offer, merchant, customer order, seller order, catalog proposal and admin review IDs are distinct in their fixture sources.
- Product detail offers in `homeContent.js` drive customer-visible product-page selection and cart prices. Seller portal published offers and draft offers are a separate data set; draft edits never update customer offer data.
- Cart stores only product/variant/offer identifiers and quantity in `localStorage` key `smart-home-cart-v1`; restored entries are validated and prices are recomputed from current fixtures. Cart quantities persist; account profile/addresses, seller draft offers and checkout address/delivery/payment state are memory-only. Seller draft state and account state survive in-app navigation while their providers remain mounted, not reloads.
- `demoOrders.js` contains independent customer order snapshots. Checkout does not create them. Historical item names/variants/prices, seller delivery descriptions/statuses/charges are snapshots; `orders.js` groups and totals these snapshots in integer minor units. Seller order list fixtures live separately in `demoSeller.js`; admin order pages inspect the customer snapshots, not seller-order fixture records.
- Demo sign-in compares the supplied fictional credentials only in `import.meta.env.DEV` via a dynamic import. It shows preview links without setting a token, session, route guard, or authorization state. Account/seller/admin paths are directly accessible.
- Local money formatting is `EGP`; catalog/product-card fixture prices are whole EGP, while cart/checkout/order and seller/admin amounts use integer minor units (hundredths). Catalog sorting/filtering uses the fixture `device.price`, not selected/current offer prices.

## Planned but not implemented

The replacement brief lists these as required page/workflow families; **these are not routes implemented by the current `App.jsx`**, and the names below are descriptive families rather than promises about final URL spelling:

- Store discovery: category index beyond the six Home links, brand directory/brand catalog, public seller storefront, wishlist, comparison, review browsing/reporting, compatibility-help and public help/contact/shipping/returns/warranty/terms/privacy information.
- Authentication/account: email/phone verification, resend/expiry/invalid-code states, recovery-link completion/reset-password, lock/suspension/session-expiry, sessions/security/privacy requests, and authenticated/forbidden states.
- Purchase lifecycle: payment provider return/resume and distinct started/cancelled/declined/pending/unknown/paid/expired outcomes; actual order-result page. Checkout submission is disabled.
- After purchase: shipment detail/timeline/documents, cancellation, return/pickup/inspection/refund, warranty/repair/replacement, support/disputes, notifications and review submission.
- Seller: sell-with-us/application/document/revision flow, teams/settings, catalog matching/product proposals, offer review/revisions/publication detail, inventory/warehouses, seller order detail/processing, packages/labels/tracking/exceptions, aftersales, statements/payouts/reconciliation and support/notifications.
- Admin: real access/capability handling; document correction/history; category/version/moderation actions; seller-order/shipment inspection; refund/return/warranty/dispute queues; finance/payout/holds; memberships/invitations/privacy; support/reviews/communications; content/policy/settings; audit and exception center.
- System: public not-found page, general unavailable/forbidden state, service error and maintenance states. Current non-admin unknown URLs fall back to Home.

# Page-by-page source report

For each shared family below, the common layout/control behavior is documented once. Each route variant is called out explicitly. A table row marked **Working (demo)** describes local behavior, not server execution or authorization. “Disabled” is reserved for actual disabled controls; a static text label is not a working control.

## 1. Home — `/`

**Identity/navigation.** Intended for shoppers; `pages/HomePage.jsx`. Entry is root plus the current fallback for all unrecognized non-admin paths. Header links to search, shop/categories, sign-in and cart; footer links to shop/categories, account/order history, seller chooser and admin preview. Onward links include category catalog, `/shop`, and product detail for the three supported Home products.

**Composition and source styling.** `StoreHeader`; `main.market-shell` with `py-4 sm:py-6`; one white border/rounded promotion section with `px-5 py-6 sm:px-8 sm:py-7`, compact title and two actions; category section `mt-6`, two-to-six columns (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`) with 48px icon tiles; featured collection `mt-7`, two-to-five columns (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`); final text-only product-requirements panel; `StoreFooter`. The hero no longer has an image column. Heading is `text-3xl sm:text-4xl`; collection heading `text-xl sm:text-2xl`; product title and metadata come from `ProductCard`. Cards contain 112px media on mobile and 160px at `sm`. White panels use slate borders and utility-defined rounded corners. Tailwind/global cascade and actual geometry remain **UNKNOWN** until browser review.

**Controls.**

| Control label | Trigger | Preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| Shop products | Click | None | `/shop` | Opens catalog | Working |
| Browse categories | Click | None | `#categories` | Scrolls to category section | Working |
| Shop all | Click | None | `/shop` | Opens catalog | Working |
| Category name | Click | Category fixture | `/categories/:slug` | Opens filtered catalog; bad slug currently shows general catalog | Working with unknown-slug gap |
| View all products | Click | None | `/shop` | Opens catalog | Working |
| Featured product media / Choose options | Click | Product has `productDetails` | `/products/:slug` | Detail route with variant/offer selection | Working |
| Product card Browse catalog fallback | Click | Product lacks detail fixture (not promoted on Home) | `/shop` | Opens catalog, not that product’s own detail | Misleading fallback in catalog; see backlog |
| Header/footer controls | See Shared controls below | Varies | Internal routes/forms | Shared behavior | Working or limitation documented there |

**Data/state/exceptions.** `promotedProducts` filters `featuredDevices` by existence of a matching `productDetails` record. It does not independently verify that each item has an available offer, though current three fixtures have available offers. Categories come from six fixture objects. No page-local state. There is no loading/network state. The final “Check product requirements before buying” panel is static copy, not a compatibility tool.

**Assets/content.** Product/category media uses shared inline SVG symbols, not photographs. Home labels include “Smart home essentials”, “Make your home work a little smarter.”, “Featured devices”, and “Products with supported detail and seller offer data”. No dev credential/status copy appears in these cards. Individual product/category images and local font files remain `ASSET_PENDING`; screenshots are not page assets.

**Verification/gaps.** Catalog, product selection and related logic tests exist, but no Home component/UI test. Relevant audit IDs: F03–F07, F11–F14, C01–C04, X01/X02/X08/X09. Browser behavior/visuals `NOT_VERIFIED`.

## 2–4. Store header, category/search catalog, product details

### Shared StoreHeader and StoreFooter controls

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| SMART HOME logo | Click | None | `/` | Root/Home | Working |
| Search smart-home devices | Type + Enter/Search icon | No client validation; `name=q`; GET form | `/search?q=...` | Catalog reads query from URL | Working |
| Open/Close categories (mobile menu icon) | Click | None | Local `menuOpen` toggle; `aria-expanded` updated | Shows/hides category nav at mobile breakpoint | Working; keyboard focus/drawer behavior not tested |
| All categories / category links | Click | Fixture links | `/shop` or `/categories/:slug` | Opens catalog | Working |
| Sign in icon/link | Click | None | `/sign-in` | Opens auth screen; account routes remain open independently | Working; no authentication implied |
| Cart icon/count | Click | None | `/cart` | Opens cart; count is total units from CartContext | Working |
| Sell with us | Click | None | `/seller` | Opens demo merchant chooser, not an application | Working link to different, narrower destination |
| Footer All products/categories | Click | None | `/shop` or category route | Catalog | Working |
| Footer Sign in / Order history / Shopping cart | Click | None | `/sign-in`, `/account/orders`, `/cart` | Target page | Working |
| Footer Seller preview / Admin preview | Click | None | `/seller`, `/admin` | Demo entry/overview | Working; not protected |

Header source is `components/StoreHeader.jsx`. It is sticky (`sticky top-0 z-30`), has a 24px utility row at `sm`, 64px minimum main row, search as its flexible central region, and 40px category items. On smaller widths the search is placed on a second row and the category nav is hidden until the menu control is used; at `md` nav is shown. Logo text is hidden below 380px. Account/cart text is only shown at `lg`; the links retain `aria-label`s. Source classes specify the behavior but no visual measurement was performed. `StoreFooter.jsx` uses a max-width shell, `sm:grid-cols-2`, `lg:grid-cols-4`, `gap-8`, `py-8` and a lower language/currency strip.

**Shared controls that do not exist:** no search suggestions, clear-input control, location/currency selector, orders shortcut in the header, public Help/support link, active category indicator, or expandable category submenu. “Sell with us” is a preview chooser link rather than seller onboarding. Existing shell applies to Home, catalog, product, cart, checkout and account pages.

### Catalog/search/category — `/shop`, `/categories/:categorySlug`, `/search?q=...`

**Identity/navigation.** `pages/CatalogPage.jsx`, shopper. Entry from header search/categories, Home actions/cards and footer. Onward to product cards (supported details only for three fixture products), cart via header, or prior URL state via browser Back. `pathname` identifies category mode; URL parameters carry `q`, `connectivity`, `hub`, `min`, `max`, `sort`, `page`.

**Composition/styling.** Shared StoreHeader, `main.market-shell py-6`, breadcrumb, result heading/count and sorting/mobile-filter actions. Active filters appear as removable bordered controls. Main content grid is `md:grid-cols-[220px_minmax(0,1fr)] gap-5`: desktop white filter panel `p-4`; results are two columns by default, three at `sm`, four at `lg/xl`. Cards are shared `ProductCard`. Pagination panel appears only when results span more than one page; page size is 4. Mobile drawer is fixed full-screen translucent backdrop with a right-aligned `max-w-sm` panel, `p-5`, scrollable content, close, Clear, Apply filters, Cancel. Inputs/classes include 11-unit min heights, slate borders and white backgrounds; shared CSS global controls also applies. Product cards use 112/160px media. Drawer focus/escape/focus-return behavior is not implemented/verified. **Computed layout UNKNOWN** where global CSS and Tailwind classes overlap.

**Controls.**

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| Header search | GET submit | None beyond query read | `/search?q=...` | Query filters fixture text | Working |
| Sort | Change select | Relevance, low-high, high-low only | Updates filters and URL; page reset to 1 | `relevance` sorts alphabetically by name, not ranked relevance | Working with label/semantics limitation |
| Filters button | Click (mobile) | Mobile breakpoint | Copies applied values to draft, opens drawer | Shows staged filter values | Working |
| Connectivity | Change select | Wi-Fi/Zigbee/Thread/Multi-protocol | Apply immediately on desktop, draft on mobile | Exact fixture match | Working |
| Hub requirement | Change select | Any/required/not required | Same as above | Boolean fixture filter | Working |
| Minimum/Maximum | Change numeric field | `min=0`; filter helper numeric comparison | Same as above | Filters `device.price` (whole EGP), not selected offers | Partial; no custom invalid/range message |
| Clear all / Clear filters | Click | No precondition | Clears connectivity/hub/min/max, resets sort/page but retains query/category | Results update | Working; category/search retained |
| Active filter x | Click | Filter active | Clears that field and page resets | URL/results update | Working |
| Previous / Next | Click | Page within bounds; disabled at boundaries | Updates page parameter | Shows next/previous four results | Working; no page-size selector |
| Close filters | Click | Drawer open | Draft discarded; applied filters restored | Closes panel | Working |
| Apply filters | Click | Drawer open | Applies draft, writes URL, closes | Results update | Working |
| Cancel | Click | Drawer open | Draft discarded | Closes panel | Working |
| ProductCard | See product card controls below | Matching detail may be absent | Product detail or `/shop` fallback | Unknown products do not get a detail state from this card | Partial |

**Form/data/states.** No `<form>` wraps filter fields. Search query comes from URL; filter/sort/page state is local React state synchronized on `popstate` and serialized by `buildCatalogUrl`. `readCatalogFilters` defaults missing fields but does not robustly validate all unknown enum values/ranges. Unknown category slug maps to `category=null`, title/breadcrumb effectively become Shop rather than explicit category-not-found. No loading/error/network states. Empty result copy: “No products match these filters”; buttons offer Clear filters. `catalog.test.js` verifies composing filters, sorting/empty sets and URL round-trip. Audit: C02/C03, F02/F13/F14, X01/X02/X09.

### Shared ProductCard

`components/ProductCard.jsx`, used on Home and catalog. Article is a flex column, border, white surface, `p-3 sm:p-4`; media is `h-28 sm:h-40`; name two-line-clamped (`text-sm sm:text-base`), specification line-clamped at 13px, price 18px, seller context 13px, action full width. When a matching `productDetails` exists it chooses the lowest numeric available offer, displays “Sold by {seller}” and a “Choose options” link to that product. Otherwise it uses `device.price`, omits seller text and shows “Browse catalog”, linking to `/shop`; both the media and CTA lead to catalog, not a product detail. That fallback is not a meaningful destination for the specific device. No star/review/discount/savings/scarcity message is rendered. No card-level variant selection/add-to-cart. M01 uses SVG media fallback; no real image. Tests cover underlying product selection, not ProductCard UI. Audit: C03, F06/F07, X01.

### Product detail — `/products/:productSlug`

**Identity/navigation.** `pages/ProductPage.jsx`; shopper. Entry from supported ProductCard links. Breadcrumb links Home and category. “Added.” offers View cart. Unknown fixture yields “Product details unavailable” and Browse products. Product detail matching uses slug in `productDetails` and product identity in `featuredDevices`; only three slugs: `zigbee-touch-switch`, `smart-wi-fi-plug`, `motion-sensor`.

**Composition/styling.** Store header, `market-shell py-5 sm:py-7`, breadcrumb, main grid `lg:grid-cols-[minmax(0,1.15fr)_minmax(350px,.85fr)]` with `gap-6 lg:gap-10`. Gallery first, then title/spec/compatibility and seller offer purchase panel. At `sm` detail content may use two columns; at `lg` one; at `xl` content/purchase panel is split again. Gallery has a bordered rounded `product-media` container containing only a 96px SVG icon; no explicit gallery width/height, aspect ratio or thumbnails. Variant choices are radios in bordered labels. Specifications are divided bordered rows. Compatibility is a separate white bordered panel. Seller purchase panel `p-4 sm:p-5`, bordered rounded; offer cards `p-3`; selected price is 24px. Shared CSS and Tailwind cascade geometry not browser-measured (**UNKNOWN**).

**Controls.**

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| Home/category breadcrumb | Click | None | Home/category route | Opens destination | Working |
| Variant option | Radio selection | Must be one of fixture variants | Calls `changeVariant`; clears incompatible offer | Updates specs and eligible offer list | Working; tested |
| Seller offer | Radio selection | Available and same variant | `selectOffer` | Selected offer controls displayed seller, price and warranty | Working; unavailable rows are disabled |
| Add to cart | Click | Current offer valid/available | CartContext add product+variant+offer | Merges matching entry; shows “Added. View cart” | Working (demo) |
| Choose options (disabled purchase action) | Button | No valid offer | No state change | Disabled until offer selected | Disabled but accurate prompt |
| View cart | Click after add | `added` true | `/cart` | Opens cart | Working |

**Data/forms/states.** No form submit. Variant and seller selection are component-local React state. Product detail seller offers in `homeContent.js` include offer id, variant id, seller, amount in whole EGP, warranty string and availability. An unavailable offer remains visible with “Unavailable” and a fixture note; selection input is disabled. Empty/invalid current selection asks “Select an available seller offer to view its price and terms.” Product specs vary by variant. Compatibility text states protocol and hub requirement only, then explicitly says specific ecosystem/home compatibility is unknown. An unavailable product detail shows a clear page-level panel but still uses shared header/footer. No archived state, image gallery, zoom, fulfillment comparison, delivery availability, quantity selector, add confirmation choices, or price-change recovery. `productSelection.test.js` covers variant/offer validity. Audit: C03/C04/C06, F07/F12, X01/X02/X04.

**Visible content/assets.** Product names/categories/specs/offers are fixture values. Label on page includes “Compatibility”, “Seller offers”, “Choose a variant”, and “Fixture preview. Stock is not reserved and delivery is calculated at checkout.” SVG icons only; photography `ASSET_PENDING`.

## 5. Cart — `/cart`

**Identity/navigation.** `pages/CartPage.jsx`; shopper. Entry from sticky header/footer cart. Links back Home, product detail when it has a detail record (otherwise `/shop`), Browse products for empty/invalid, and checkout if valid.

**Composition/styling.** StoreHeader; `market-shell py-6`, breadcrumb, 24/30px title. Empty/invalid state is one max-width-3xl white bordered panel (`p-6 sm:p-8`). Valid state grid is `lg:grid-cols-[minmax(0,1fr)_320px]`, `gap-4`; left is seller-group panels, right order summary `p-5`, sticky at `lg:top-24`. Seller item row uses 80px icon thumbnail (88px at `sm`), flexible detail, separate 156px total column at `lg`; variant/seller at 13px, warranty 12px, price 14px, quantity/removal row; seller grouping has header/subtotal separators. Footer follows main. CSS defines white surfaces, slate borders and 8/12px radii; media are placeholders. Actual computed geometry remains **UNKNOWN** pending browser review.

**Controls.**

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| Home breadcrumb | Click | None | `/` | Home | Working |
| Product thumbnail/title | Click | Product route fixture if present | Product details or `/shop` fallback | Opens destination | Partial for products without details |
| Qty | Edit number (`min=1`, `max=99`) | `setCartQuantity` accepts valid integer bound; invalid values are handled by helper | Updates context/localStorage | Line and seller totals recalculate | Working (demo); UI invalid value recovery not component-tested |
| Remove | Click | Cart line | Remove entry matching offer/variant | Totals/groups/count update | Working |
| Proceed to checkout | Click | Entire cart has valid entries and offers | `/checkout` | Opens preview checkout | Working (demo); link only rendered for valid cart |
| Browse products | Click | Cart empty or invalid | `/shop` | Catalog | Working |

**Data/persistence/states.** `CartContext` restores from `localStorage` key `smart-home-cart-v1`, storing only IDs and quantities; malformed/stale entries are dropped, stored prices stripped; fixture offers supply price/seller/warranty. `getCartSummary` groups by seller and calculates line/seller/item minor-unit totals. Header count is sum of units, not line count. Delivery shows “Calculated at checkout”; overall label is “Total before delivery”. No real stock reservation. Empty: “Your cart is empty”; invalid: “Some cart items are unavailable”. The invalid panel suggests return to shop rather than identifying each bad line. No separate stale-price/removed-offer repair, discounts, tax, shipping quote or save-for-later. Cart tests cover merging, quantity, corrupt/stale restoration and grouping/totals. Audit C06, F08, X04/X05.

**Assets/content.** 80/88px gray `product-media` rectangles contain device SVGs, not thumbnails. Copy discloses fixture price and no reservation. `ASSET_PENDING` for product images.

## 6. Checkout — `/checkout?step=...`

**Identity/navigation.** `pages/CheckoutPage.jsx`; shopper testing a four-step fixture preview. Entry from valid Cart. Back to cart; step buttons, Back/Continue, review. Empty/invalid cart shows “Checkout unavailable” plus Review cart.

**Composition/styling.** StoreHeader, `market-shell py-5 sm:py-7`, page heading/“Demo checkout”, back link; step nav in two columns then four at `sm`; content grid `lg:grid-cols-[minmax(0,1fr)_320px]`; form/step panel `p-4 sm:p-6`, summary `p-4 sm:p-5`, sticky at `xl:top-40`; footer. Step surfaces are grouped in cards/fieldset borders. Address grid 2 columns at `sm`; review items grouped per seller. Header/body sizes use Tailwind `text-xs` to `text-3xl`; exact cascade remains **UNKNOWN** without browser inspection.

**Controls and steps.**

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| Back to cart / Review cart | Click | None | `/cart` | Cart view | Working |
| Address / Delivery / Payment / Review step | Click | Disabled above `highestAllowedStep` | Updates local step and `?step=` history entry | Cannot jump ahead of required address/delivery/payment | Working; helper tested |
| Address field | Type | Full name, phone, city, street must be nonempty; apartment optional | Component memory state; URL guard recomputes | Error appears after address continuation attempt for missing required values | Working locally |
| Continue to delivery | Click | Address valid | Delivery step | Advances; otherwise errors shown | Working locally |
| Seller delivery option | Select radio | Fixture choices for each seller | `deliveries[seller]` state | Per-seller charge/time label shown | Working demo; fixture estimates only |
| Continue to payment | Click | Every seller has a delivery selection; button disabled otherwise | Payment step | Advances | Working locally |
| Cash on delivery / Card payment | Select radio | Selection only, no eligibility rules | `paymentMethod` state | Review displays selected method | Working preview selection; no execution |
| Review order | Click | Payment selected; disabled otherwise | Review step | Shows address, seller groups, delivery option, payment and totals | Working locally |
| Back | Click | Not first step | Previous step | Previously entered values remain in memory | Working locally |
| Final submission disabled in demo | Button | Always disabled | None | Explicitly no order/payment/stock action | Disabled |

**Forms/data/states.** Address fields: fullName text/name autocomplete; phone tel; city text; street text; apartment/floor optional text. `validateAddress` checks trimmed nonempty values only, not phone/country/area. Address values, delivery choice and payment method are component state, not `AccountContext` addresses. Delivery options are estimates per seller from `homeContent.js`; `calculateDeliveryMinor` and totals use integer minor units. Step query is normalized by `resolveCheckoutStep`, including direct URL and Back/Forward. No submit, authentication, saved address, unsupported delivery area, address-change re-quote, promotions, payment errors/results, or server quote. Cart preserved. `checkout.test.js` tests required fields, step guards, delivery sum/totals and empty/invalid cart. Audit C08/C09, X04/X07.

**Visible limitations/assets.** “Demo checkout”, “Charges are fixture estimates for this preview”, “No payment details are requested or processed”, “Final submission disabled in demo”. No product imagery beyond shared cart/product cards; `ASSET_PENDING`.

## 7–9. Authentication pages

### Shared layout and controls

`AuthLayout.jsx` renders a min-height slate background with `px-4 py-8 sm:py-12`, centered `max-w-md`, home SVG/brand link, white border panel `mt-6 p-5 sm:p-7`, centered intro/title/description, form children, optional footer, then “View demo account” and “Storefront”. No StoreHeader/Footer. Input controls use labels, `min-h-12`, white surface, slate border; password visibility button is absolutely positioned. No page-level loading state.

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| SMART HOME | Click | None | `/` | Home | Working |
| View demo account | Click | None | `/account` | Directly opens fictional account without sign-in | Working; explicitly not access control |
| Storefront | Click | None | `/` | Home | Working |
| Show password / Hide password | Click | Password field present | Local visible toggle; `aria-pressed` | Toggles input type text/password | Working |
| Form fields | Type | Per route rules below | Component memory state | Inline local checks on submit | Working locally |
| Form submit | Submit/Enter | Route validation | Sets status message; no backend request | Explains operation unavailable or enables dev preview links | Preview-only |
| Cross-screen link | Click | None | Sign-in, sign-up or recovery route | Opens corresponding form | Working |

### `/sign-in`

`AuthPage` renders `SignInForm`. Fields: Email address (`email`, email autocomplete, required); Password (`password`, current-password autocomplete, required) plus show/hide. Custom validator says “Enter a valid email address.” and “Enter your password.” No password-strength rule for sign-in. Submit: invalid fields clear status; valid non-demo/production displays “Authentication is unavailable in this preview.” In dev, exact fictional credentials are shown in a “Demo preview” aside; valid pair displays “Demo preview enabled in this page. This does not authenticate you or protect routes.” and links to `/account`, Nile seller and Cairo seller previews. Invalid pair says “Demo preview credentials were not accepted. Authentication is unavailable.” Values stay in component memory only. Credentials are checked by a development-only dynamic import. No session/token, storage, password logging or route protection.

### `/sign-up`

`SignUpForm`; fields Full name, Email address, Password, Confirm password. Email format regex; name trimmed nonempty; password 15–128 characters (provisional UI rule); confirmation must equal password. Error text: “Enter your name.”, email message above, “Use at least 15 characters.”, “Use no more than 128 characters.”, “Passwords do not match.” Valid submit says “Demo mode: account creation is unavailable. No account was created.” There is no checkbox/terms field, no role selector, no account creation or verification.

### `/forgot-password`

`ForgotPasswordForm`; Email address only, email autocomplete/required. Same email error. Valid submit says “Demo mode: password recovery is unavailable. No recovery email was sent.” No reset route/token or account-existence response.

For all auth routes, no account/session/backend state exists; form values and password are component memory only. Existing tests: `authValidation.test.js` covers email/required/password length/confirmation; `demoPreviewAuth.test.js` covers accepted/rejected credentials and disabled non-development mode. Gaps: verification, invalid/expired recovery, locked/unverified states, neutral recovery response contract, sessions/sign-out, safe return destination; audit C07/X05/X06/X07. Auth pages have no StoreFooter, no images. Demo credentials appear on the sign-in form in dev; this development copy is intentionally present there.

## 10–14. Customer account pages

### Shared `AccountLayout`

Routes: `/account`, `/account/orders`, `/account/profile`, `/account/addresses`, `/account/orders/:orderId`. Intended for a fictional customer. `AccountLayout.jsx` includes StoreHeader, `market-shell py-5 sm:py-7`, repeated blue “Demo customer preview” banner describing no authentication/route protection and session-memory changes, two-column `md:grid-cols-[200px_minmax(0,1fr)]` with `gap-5`; account nav is horizontal overflow on mobile and vertical on `md`; content is min-width 0; StoreFooter. Nav labels: Overview, Orders, Profile, Addresses; static text “Security and privacy tools later” is not a link. Banner repeated on every account route. Styles use slate borders/white panels, page headings `text-2xl sm:text-3xl`; responsive actual behavior remains **UNKNOWN**.

Shared controls:

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| Overview / Orders / Profile / Addresses | Click | None | Corresponding account route | Switches page | Working; no auth required |
| Security and privacy tools later | None | N/A | None | Static span | Decorative/deferred, not a control |
| Store header/footer controls | As in shared header/footer | Same as above | Store routes | Shared behavior | Working/limited as previously stated |

### `/account` — overview

`AccountPage.jsx`; derives name/email/phone from `AccountContext`, counts from independent `demoOrders`. Top intro “Hello, {name}”, email and “Fictional customer”; three count cards Orders/Processing/Completed; Recent orders lists first three with order number/date/status/purchase snapshot total and whole-card links to detail; profile/addresses card has phone and Edit profile/Manage addresses links. Layout uses `mt-6` count grid one column then three at `sm`, `mt-8` recent orders, `mt-7` profile panel; cards white border p4/p5. Control table: “View all orders”→`/account/orders`; each recent order card→`/account/orders/:id`; “Edit profile”→profile; “Manage addresses”→addresses. No forms. Counts use `getOrderCounts`, totals use purchase snapshots. Empty state text “No demo orders yet.” and profile links remain. Tests `orders.test.js` cover counts/empty/snapshots, not UI. Historical orders are not changed by profile state.

### `/account/orders` — order history

`OrderHistoryPage.jsx`; same layout. Heading “Your orders”; explanatory text separates order/payment/delivery status and calls records fictional snapshots; each `demoOrders` article shows order number link, placed date, snapshot total and three status fields. `mt-6 space-y-4`, white border panel p4 sm:p5, `sm:grid-cols-3` status definition list. No search, filter, sort, pagination, cancel or return buttons. Order-number links lead to details. Empty state “No orders to show” / “This demo account has no order history.” / Browse devices. Snapshot fixtures independent from checkout. `orders.test.js` covers lookup, empty history, seller grouping and snapshot totals. Missing journey: shipment split/detail/timeline/docs and aftersales; audit C10–C14.

### `/account/orders/:orderId` — order details

`OrderDetailPage.jsx`; shared account layout. Known ID shows Back to orders; order number/date and fictional label; overall status; separate order/payment/delivery status panel (`sm:grid-cols-3`); Purchased items grouped by seller; item purchase-time name/variant/quantity/unit price/line amount; seller subtotal; delivery method/status/tracking snapshot/charge; right-aligned max-width-md purchase-time total panel; final dashed panel says order actions (cancellation, returns, support) are deferred. No buttons for those actions. Unknown ID shows “Order not found”, explanatory text, Back to orders. Snapshot helper ignores catalog/current offers. Data from `demoOrders.js`, not checkout. `orders.test.js` is relevant. No multiple-shipment timeline or documents; audit C10–C14/X02/X04.

### `/account/profile` — profile editor

`AccountProfilePage.jsx`; form panel `mt-6 max-w-2xl`, p5 sm:p7, vertical `space-y-5`. Fields Name (text; required by `validateProfile`); Email address (email/read-only; note that changes/verification are deferred); Phone number (tel; required and 7–15 digits after stripping nondigits, with allowed phone punctuation). Error copy: “Enter your name.”, “Enter your phone number.”, or “Enter a phone number with 7–15 digits.” Save validates and updates `AccountContext` name/phone in memory; shows “Demo profile changes saved for this session only.” Cancel resets input values to current context and clears errors/message. Password changes/contact verification are explicitly deferred. Header updates account Overview name; historical orders remain snapshots. No persistence or network. `accountState.test.js` covers profile validation; visual UI behavior not tested. Audit C15/X05.

### `/account/addresses` — address manager

`AccountAddressesPage.jsx`; heading and demo-session copy; two equal columns at `lg` (`lg:grid-cols-[1fr_1fr]`), `gap-6`; left saved-address cards or empty panel, right form p5. Fields: Full name text/name autocomplete required; Phone number tel required (actual reused `validateAddress` only checks trimmed nonempty despite message “Enter a valid phone number.”); City text required; Street address text required; Apartment/floor optional. Address entry state is `AccountContext` memory and stable generated IDs; first becomes default; exactly one default is retained, deleting default selects first remaining; deleting last shows empty state. Address cards show default label, contact/address lines; Edit populates form, Make default changes default, Remove opens inline `role=alertdialog` confirmation with Confirm remove and Cancel. No native `<dialog>`, focus trap or keyboard containment. Form Add an address/Edit address uses Add address/Save address submit labels; errors inline; after save clears form and says “Demo address saved for this session only.” Edit-only Cancel resets. No localStorage/network and no checkout integration. Existing `accountState.test.js` covers validation, add/edit/default/delete. Audit C08/C15/X05; confirmation accessibility and checkout link are gaps.

## 15–19. Seller preview pages

### `/seller` — merchant chooser

`SellerChooserPage.jsx`; seller preview entry; linked from StoreHeader “Sell with us”, StoreFooter Seller preview and successful development demo sign-in. One white utility header (logo and “Seller preview”), `market-shell py-7 sm:py-10`; “Seller workspace” eyebrow, “Choose a demo merchant”, disclosure, two-column cards at `sm`; each card displays region, “Demo membership”, merchant and two actions. No footer. Cards use p5, border and rounded corners. Mobile one column. Controls: “Open seller workspace”→merchant overview; “View offers”→merchant offers. If membership list empty, shows “No demo merchant memberships are assigned.” Current fixture memberships assign demo seller to `merchant-nile` (Nile Smart Store/Cairo) and `merchant-cairo` (Cairo Connected/Giza). No login, application, approval or selection state. `sellerOverview.test.js` verifies membership filtering; audit S01/S02.

### Shared SellerPortalLayout routes

Routes `/seller/:merchantId`, `/seller/:merchantId/offers`, `/seller/:merchantId/offers/new`, `/seller/:merchantId/offers/:offerId/edit`. Header is full-width `.portal-topbar`; brand, Seller workspace label, merchant select, one `<details>` “Demo preview” disclosure and Storefront link. Disclosure text says fictional data/no seller authentication/access/approval. Workspace is full width, 232px sidebar, 24px gap/padding, sticky at top 16px; mobile single-column at max 767px, padding16, mobile “Workspace navigation” toggle controls collapsed sidebar. Sidebar shows Current merchant/name and only Overview/Offers links; no disabled roadmap list. Content panel carries merchant and active page. Switching merchant updates path to `/seller/:newMerchantId` (overview, even if invoked from offers/editor); seller context stays mounted during SPA navigation. Source is `SellerPortalLayout.jsx`; tables use shared `.portal-table`/overflow wrapper. Demo membership is not authorization.

Shared controls:

| Control label | Trigger | Validation/preconditions | State change/destination | Actual result | Classification |
|---|---|---|---|---|---|
| Merchant selector | Change select | Options only explicit demo memberships | `/seller/:merchantId` | Switches merchant and lands on overview; records/counts re-scope | Working (demo); loses current subroute |
| Overview / Offers | Click | Current merchant | Merchant overview/offers | Opens implemented pages | Working |
| Workspace navigation | Click on mobile | Toggle | `mobileNavigationOpen` | Shows/hides sidebar | Working; focus handling unverified |
| Demo preview disclosure | Click/keyboard summary | None | Native details open/close | Explains no auth/approval/access | Working informational disclosure |
| Storefront | Click | None | `/` | Home | Working |

### `/seller/:merchantId` — seller overview

`SellerDashboardPage.jsx`. `getSellerOverview` requires both merchant fixture and membership; unknown or unassigned shows “Merchant unavailable” plus Choose a merchant, no fallback. Content: region eyebrow, Overview, merchant context, Manage offers; four count cards Seller orders/Pending payment/Ready for processing/In fulfillment; Recent seller orders table with order/date/items/order status/payment/processing, records count. Cards min-h-24; 2 columns then 4 at xl; table in contained overflow. Current derived counts (also tested): Nile 3 total, 1 pending, 1 ready, 1 fulfillment; Cairo 2 total, 1 pending, 1 ready, 0 fulfillment. These are separate `demoSellerOrders`, not customer order records, and no money/balances shown. Only control in body is Manage offers; table rows are not links/actions. No loading or empty state beyond “No seller orders for this merchant.” Status text is fixture-derived; only pending payment gets amber text. Test `sellerOverview.test.js` covers lookup/membership/scoped counts/unknown. Audit S02/S06/X03.

### `/seller/:merchantId/offers` — offers list

`SellerOffersPage.jsx`. Shared shell; header merchant eyebrow, Offers, copy (“Published offers are read-only. Draft edits stay in memory.”), Create draft. Toolbar Search input filters client-side over product/variant/SKU/status and shows visible-of-total count. Table columns Product and variant, Seller SKU, Price, Warranty information, Status, Action; rows resolve product/variant against shared catalog. Drafts have Edit draft link, published offers show static Read-only. Empty copy distinguishes “No matching offers” from “No offers for this merchant”; only true empty gets Create a draft. Search state does not update URL; no clear-search button. Unknown/unassigned merchant gives Offers unavailable with chooser link, not another merchant. `getOffersForMerchant` scopes fixtures and drafts; published offers from `demoSeller.js`, mutable drafts from `SellerOffersContext`. Search input only actual form-like control. Tests `sellerOffers.test.js` cover isolation, SKU, product/variant, price, draft-only. Audit S04/X01/X03.

### `/seller/:merchantId/offers/new` and `/seller/:merchantId/offers/:offerId/edit` — create/edit draft

Same `SellerOfferEditorPage.jsx` and seller shell; heading differs Create draft offer/Edit draft offer. Back to offers link. White max-width-2xl form, p5 sm:p7, vertical gap5. Merchant text is route-derived, not editable. Fields: Approved product select (only `productDetails` approved fixture products; on product change variant is cleared); Variant select (disabled until product selected); Seller SKU text (required, case-insensitive unique within merchant); Price (EGP) text/inputMode decimal (positive, at most two decimals, converted to integer minor units); Warranty information optional textarea (seller-entered only, no coverage assertion). Inline error text: “Choose an approved product and one of its variants.”; “Enter a seller SKU.”; “This SKU is already used by this merchant.”; “Enter a positive price with up to two decimal places.” Save draft validates and adds/updates in-memory state then redirects to scoped offer list. Cancel redirects to scoped offer list; it does not ask about unsaved changes. New drafts remain status Draft and do not alter customer product offers. Invalid merchant, unknown/cross-merchant ID, or published offer edit shows one “Draft unavailable” page, link Choose a demo store; not wrapped in seller shell. A rare create failure shows “This draft could not be saved. Check the values and try again.” Draft state survives portal SPA navigation only, not reload. `sellerOffers.test.js` relevant. Audit S03/S04/X03/X04/X07.

## 20–31. Admin preview pages

### Shared `AdminPortalLayout`

Every `/admin` route uses same full-width 232px sidebar/64px top bar shell, mobile workspace-nav toggle, SMART HOME link, Admin workspace label, one compact Demo preview disclosure, Seller preview and Storefront links. Disclosure explains fictional read-only records and that admin authentication/permissions/review actions are not simulated. Sidebar contains implemented routes only, grouped Overview, Reviews, Catalog, Operations, People: Dashboard; Merchant applications; Products; Product proposals; Offer review; Orders; Users. Current item is `aria-current=page`; active style is blue tinted. `AdminNavigation` labels “Admin preview navigation”. Shared `.portal-table-wrap` horizontally contains tables, `.portal-table` is 14px with muted 12px header and compact cell padding. CSS and Tailwind output was not visually measured; interactions at breakpoints remain **UNKNOWN**.

| Shared control | Trigger | Result | Classification |
|---|---|---|---|
| Dashboard/merchant applications/products/product proposals/offer review/orders/users | Click | Corresponding implemented admin route | Working route navigation |
| Seller preview | Click | `/seller` chooser | Working |
| Storefront | Click | `/` | Working |
| Demo preview | Click/keyboard summary | Opens explanatory disclosure | Working informational control; not auth |
| Workspace navigation | Click mobile | Toggles sidebar | Working; no manual keyboard test |

Admin uses `demoAdmin.js` applications, proposals, offer-review entries and users; `demoOrders.js` customer snapshots; and canonical `homeContent.js` products. Lists are read-only. No approval/rejection, account changes, payments, financial figures, charts or real documents.

### `/admin` — overview

`AdminDashboard` within `AdminPreviewPage.jsx`. Page header Overview and fixture-derived queue disclaimer. Five metric links in 2 columns then five at xl: Merchant applications, Catalog proposals, Offers awaiting review, Fictional users, Orders to inspect. The first two counts represent awaiting-review records. Cards min-h-24, p4, each “Open list”. Recent customer orders panel/table gives order, placed, order status, payment, purchase total for first four; “View all” and order-number links. Amounts are snapshot totals. Controls: metric cards open the corresponding list; View all→`/admin/orders`; order number→detail. No filters or actions. `adminPreview.test.js` covers exact fixture counts and unknown record lookup. Audit A01/X04/X08.

### `/admin/reviews/sellers` and `/:applicationId` — merchant applications

List heading Merchant applications with copy that approve/reject/request-information are deferred; table Business/City/Submitted/Preview status; business links to detail; empty row “No applications in this preview.” No search/status filter/action. Detail shows back link; business heading; application reference, submitted date, city, fixture status and documents statement “No documents are included in this preview fixture.” Unknown ID shows Record unavailable and Return to list. `StatusLabel` uses text plus amber for “Awaiting review” and gray for other states. Controls are only row link and back link. Data `demoMerchantApplications`; `adminPreview.test.js` tests generic lookup/count but no component test. Audit A02/A10/X02.

### `/admin/users` and `/:userId` — user list/detail

List table Name, Email, Type, Memberships; name links to detail; empty row available. No search, pagination or action controls. Detail has back link and fictional preview statement, then user reference, preview type, email and merchant memberships. Unknown record uses generic unavailable panel. Fixtures are two fictional users (customer shares `demoCustomer`; seller memberships resolve names). No permission change, invitation, suspension or privacy operation. Test generic fixture lookup only. Audit A07/X02/X06.

### `/admin/catalog/products` — canonical product fixture list

Page header Catalog products, text says canonical fixtures are read-only and product/variant editing deferred; Review proposals link. Table Product/Category/Specifications/Fixture price, one row per `featuredDevices`, empty row if none. Price uses whole device price multiplied by 100 and `formatMinorUnits`. Product rows do not link or expose controls. The catalog product display is not the offer-review queue; prices are current fixture placeholders, not merchant offer quotes. Audit A03/X04.

### `/admin/catalog/reviews` and `/:proposalId` — catalog proposals

List page header and explanation that proposals have separate fixture identities and do not change canonical products; table Proposal/Category/Submitted by/Status; proposal name and ID link to detail; empty row. Detail back link, proposal name, fictional submission note, reference, submitter, category, date and status. Unknown ID shows generic unavailable. No approve/reject/request changes. Data `demoCatalogProposals`; generic admin lookup test. Audit A03/A10/X02.

### `/admin/offers` — offer review queue

Header Offer review and copy: fictional moderation examples; nothing approved/published/copied to customer data. Table Merchant/Product and variant/Seller SKU/Submitted price/Status. Merchant display resolves against `demoMerchants`, unknown identity prints “Unknown merchant”. No rows link to detail; no controls beyond navigation. Empty row “No offer review examples.” Fixtures `demoOfferReviews` are separate from seller portal published offers and offer drafts. Generic admin count test only. Audit A03/S04/X01.

### `/admin/orders` and `/:orderId` — customer order inspection

List heading Orders, read-only snapshot explanation; table Order/Placed/Order status/Payment/Purchase total; order number links to detail; empty row. Detail back link; order number and date; separate order/payment/delivery status panel; seller snapshot groups show items and purchase-time unit/line amounts, delivery method/status/charge; compact Purchase-time totals panel. No actions or shipment links. Unknown ID shows generic Record unavailable/Return to list. Uses `demoOrders.js` and snapshot grouping/totals from `orders.js`; never recalculates against current offers. It is not seller order operations. `orders.test.js` covers snapshot grouping/totals, and `adminPreview.test.js` record lookup. Audit A04/A05/X02/X04.

### Admin unmatched route state

Any `/admin/...` not covered above receives the admin shell, ScreenHeading “Destination not available” and generic Record unavailable with link to `/admin`. This is an explicit fallback but does not identify which planned workflow is missing. No service-error/permission state or support link.

## Route-specific visible control inventories

The shared header/footer, account navigation, seller shell and admin shell tables above apply to each corresponding route. These inventories record the page-specific controls and outcomes; they complement the structure/state notes, and distinguish static text from actual controls.

### Authentication route controls

| Page / route | Control label | Trigger | Validation/preconditions | State change or destination | Actual result | Working/demo/disabled |
|---|---|---|---|---|---|---|
| Sign in `/sign-in` | Email address | Type/submit | Email regex | Local value/error | “Enter a valid email address.” | Working locally |
| Sign in `/sign-in` | Password | Type/submit | Required nonempty | Component memory; local error | “Enter your password.” | Working locally |
| Sign in `/sign-in` | Show password / Hide password | Click | Field present | `visible` boolean/input type | Toggles current value visibility | Working locally |
| Sign in `/sign-in` | Forgot password? | Click | None | `/forgot-password` | Opens recovery form | Working |
| Sign in `/sign-in` | Sign in | Submit/Enter | Email and password valid | Dev credential branch or unavailable message | Exact dev credentials expose preview links; other values rejected; production says unavailable | Demo only |
| Sign in `/sign-in` | Customer account preview / Nile Smart Store seller preview / Cairo Connected seller preview | Click, shown only after dev demo match | Dev-only preview flag | `/account`, `/seller/merchant-nile`, `/seller/merchant-cairo` | Opens unprotected fixture pages | Working demo; no auth |
| Sign-up `/sign-up` | Full name | Type/submit | Required trimmed text | Local value/error | “Enter your name.” | Working locally |
| Sign-up `/sign-up` | Email address | Type/submit | Email regex | Local value/error | “Enter a valid email address.” | Working locally |
| Sign-up `/sign-up` | Password | Type/submit/show-hide | 15–128 characters | Local value/error | Minimum/maximum messages above | Working locally |
| Sign-up `/sign-up` | Confirm password | Type/submit/show-hide | Must equal password | Local value/error | “Passwords do not match.” | Working locally |
| Sign-up `/sign-up` | Create account | Submit/Enter | All fields valid | Local status only | Says creation unavailable; creates nothing | Demo-only preview result |
| Forgot password `/forgot-password` | Email address | Type/submit | Email regex | Local value/error | “Enter a valid email address.” | Working locally |
| Forgot password `/forgot-password` | Continue | Submit/Enter | Valid email | Local status only | Says recovery unavailable; sends nothing | Demo-only preview result |
| Sign-up/Forgot password | Sign in / Back to sign in | Click | None | `/sign-in` | Opens sign-in | Working |
| Sign in | Create an account | Click | None | `/sign-up` | Opens registration form | Working |
| All auth pages | View demo account / Storefront | Click | None | `/account` / `/` | Opens destinations without authentication | Working but not access control |

### Customer-account route controls

| Page / route | Control label | Trigger | Validation/preconditions | State change or destination | Actual result | Working/demo/disabled |
|---|---|---|---|---|---|---|
| Overview `/account` | View all orders | Click | None | `/account/orders` | History list | Working |
| Overview `/account` | Recent order card/number | Click | Fixture order | `/account/orders/:orderId` | Snapshot detail | Working |
| Overview `/account` | Edit profile / Manage addresses | Click | None | `/account/profile`, `/account/addresses` | Opens demo editors | Working |
| Orders `/account/orders` | Order number | Click | Known fixture ID | `/account/orders/:orderId` | Opens snapshot detail | Working |
| Orders `/account/orders` | Browse devices | Click, only empty history | `/shop` | Catalog | Working |
| Order detail `/account/orders/:orderId` | Back to orders | Click | None | `/account/orders` | Returns to history | Working |
| Order detail `/account/orders/:orderId` | Cancellation/returns/support text | No trigger | N/A | None | Explicitly deferred copy | Not a control |
| Profile `/account/profile` | Name | Type | Required nonempty | Local draft | Inline error if empty | Working locally |
| Profile `/account/profile` | Email address | Read only | Always | None | Cannot edit | Disabled/read-only |
| Profile `/account/profile` | Phone number | Type | 7–15 digits after normalization | Local draft | Inline plausible-phone validation | Working locally |
| Profile `/account/profile` | Save | Submit | Name/phone valid | `AccountContext` memory | Updates overview name; status confirms demo-only save | Working demo |
| Profile `/account/profile` | Cancel | Click | None | Resets draft to current profile | Clears errors/status | Working |
| Addresses `/account/addresses` | Full name/Phone/City/Street/Apartment | Type | First four required and nonempty; Apartment optional | Local form draft | Field errors; phone wording says valid but actual check only nonempty | Working with validation mismatch |
| Addresses `/account/addresses` | Add address / Save address | Submit | Required fields nonempty | Adds/updates `AccountContext` memory entry | First address default; form resets; demo-save status | Working demo |
| Addresses `/account/addresses` | Edit | Click | Existing address card | Loads values and ID into form | Shows Edit address form | Working |
| Addresses `/account/addresses` | Make default | Click | Non-default address | Changes default flag | Exactly one default | Working demo |
| Addresses `/account/addresses` | Remove | Click | Existing address | Sets confirm ID | Inline confirmation appears | Working |
| Addresses `/account/addresses` | Confirm remove | Click | Confirmation open | Deletes entry; default invariant selects remaining | Empty state if last deleted | Working demo |
| Addresses `/account/addresses` | Cancel (confirmation) | Click | Confirmation open | Clears confirmation ID | Leaves address | Working |
| Addresses `/account/addresses` | Cancel (form) | Click; only while editing | Editing ID present | Resets form | Exits editing | Working |

### Seller route controls

| Page / route | Control label | Trigger | Validation/preconditions | State change or destination | Actual result | Working/demo/disabled |
|---|---|---|---|---|---|---|
| Chooser `/seller` | Open seller workspace | Click | Assigned fixture membership | `/seller/:merchantId` | Scoped overview | Working demo |
| Chooser `/seller` | View offers | Click | Assigned membership | `/seller/:merchantId/offers` | Scoped offers list | Working demo |
| Overview `/seller/:merchantId` | Merchant selector | Change | Only assigned merchants listed | Navigates to selected overview | Counts/order rows re-scope | Working demo; subroute not retained |
| Overview `/seller/:merchantId` | Manage offers | Click | Merchant available | Offers route | Opens seller offers | Working |
| Overview `/seller/:merchantId` | Recent seller order table row | No row handler | N/A | None | Status/data only | Static, not a control |
| Offers `/seller/:merchantId/offers` | Search | Type | None | Local query | Filters product, variant, SKU and status; count changes | Working locally |
| Offers `/seller/:merchantId/offers` | Create draft | Click | Merchant available | `/seller/:merchantId/offers/new` | New form | Working |
| Offers `/seller/:merchantId/offers` | Edit draft | Click | Row status Draft and scoped ID | `/seller/:merchantId/offers/:offerId/edit` | Loads draft editor | Working |
| Offers `/seller/:merchantId/offers` | Published Read-only text | No trigger | N/A | None | Published fixture cannot be edited here | Static label |
| Create/Edit offer | Approved product | Select | Existing approved product fixture | Updates product and clears variant | Variant must be picked again | Working locally |
| Create/Edit offer | Variant | Select | Product selected; matching variant | Updates form value | Required compatible variant | Working locally |
| Create/Edit offer | Seller SKU | Type/save | Nonempty; unique in merchant | Local form/error state | Merchant-scoped uniqueness validation | Working locally |
| Create/Edit offer | Price (EGP) | Type/save | Positive, max 2 decimals | Parsed into integer minor units | Inline invalid-price message | Working locally |
| Create/Edit offer | Warranty information | Type/save | Optional | Seller-provided draft text | No verification/approval | Working locally |
| Create/Edit offer | Save draft | Submit | All validations pass; edit ID is scoped editable draft | SellerOffersContext memory; returns list | Draft remains Draft, not customer-visible | Working demo |
| Create/Edit offer | Cancel / Back to offers | Click | None | Scoped offer list | Leaves editor without save; no unsaved-warning prompt | Working, no warning |
| Seller pages | Demo preview | Click/keyboard | None | Native details disclosure | Explains fictional membership/no access control | Working informational |
| Seller pages | Unknown/unassigned merchant or bad offer ID | Route entry | Lookup fails | Unavailable message; chooser link | No cross-merchant fallback | Working unavailable state |

### Admin route controls

| Page / route | Control label | Trigger | Validation/preconditions | State change or destination | Actual result | Working/demo/disabled |
|---|---|---|---|---|---|---|
| Overview `/admin` | Merchant applications metric | Click | None | `/admin/reviews/sellers` | Opens review list | Working navigation |
| Overview `/admin` | Catalog proposals metric | Click | None | `/admin/catalog/reviews` | Opens proposal list | Working navigation |
| Overview `/admin` | Offers awaiting review metric | Click | None | `/admin/offers` | Opens offer queue | Working navigation |
| Overview `/admin` | Fictional users metric | Click | None | `/admin/users` | Opens users list | Working navigation |
| Overview `/admin` | Orders to inspect metric / View all | Click | None | `/admin/orders` | Opens customer snapshots | Working navigation |
| Overview `/admin` | Recent order number | Click | Known snapshot ID | `/admin/orders/:orderId` | Opens read-only order detail | Working |
| Applications list | Business name | Click | Fixture application | `/admin/reviews/sellers/:applicationId` | Opens detail | Working |
| Application detail | Back to applications | Click | None | `/admin/reviews/sellers` | Returns to list | Working |
| Application list/detail | Approve/reject/request info/documents | No control | N/A | None | Copy says actions/documents unavailable | Missing, not disabled controls |
| Users list | User name | Click | Fixture ID | `/admin/users/:userId` | Opens detail | Working |
| User detail | Back to users | Click | None | `/admin/users` | Returns to list | Working |
| Products list | Review proposals | Click | None | `/admin/catalog/reviews` | Opens proposal list | Working |
| Products list | Product row | No handler | N/A | None | Read-only row | Static |
| Proposals list | Proposal name | Click | Fixture ID | `/admin/catalog/reviews/:proposalId` | Opens detail | Working |
| Proposal detail | Back to proposals | Click | None | `/admin/catalog/reviews` | Returns to list | Working |
| Offer review | Offer row | No handler | N/A | None | Read-only status/terms row | Static |
| Orders list | Order number | Click | Snapshot ID | `/admin/orders/:orderId` | Opens purchase snapshot | Working |
| Order detail | Back to orders | Click | None | `/admin/orders` | Returns to list | Working |
| All admin | Sidebar destinations | Click | Route is implemented | Listed admin paths | Switches preview page | Working navigation |
| All admin | Workspace navigation | Click on mobile | Toggle | Sidebar open/closed state | Shows/hides nav | Working locally; keyboard behavior not reviewed |
| All admin | Demo preview / Seller preview / Storefront | Click | None | Disclosure, `/seller`, `/` | Explanation or destination | Working |
| Any unknown admin route/ID | Route entry or link | Resolver/lookup miss | Generic unavailable state/return link | No record changes | Working unavailable presentation |

## Controls and journeys with no meaningful behavior

1. Global unknown public paths resolve to Home, so an invalid URL appears to work but reaches the wrong page. Unknown category slugs silently behave as Shop. Admin unknown paths have a generic state but no operation-specific destination.
2. ProductCard for catalog products without a detail fixture links both media and “Browse catalog” back to `/shop`; the card is not a specific product destination. M01 prevents these from Home promotion but catalog remains broader than product details.
3. Product Gallery is one SVG icon in a bordered panel. No image thumbnails, image selection or zoom control exists. Cart “thumbnails” are also SVG placeholders.
4. The last Home section is informational copy, not a compatibility checker/help route. Header “Sell with us” opens `/seller` demo chooser, not an application. No support/contact control exists.
5. Checkout “Card payment” is a radio selection only. “Final submission disabled in demo” is permanently disabled. No order/payment success, pending, declined or unknown result exists.
6. Account nav “Security and privacy tools later”, seller Published “Read-only”, admin no-action queue rows and explanatory copy are text, not controls. Account cancellation/returns/support are explicitly deferred text only.
7. Seller merchant selector always navigates to merchant overview. Switching from offers/editor does not preserve selected subroute, and draft editing has no unsaved-change warning.
8. Admin offer review has no clickable record detail; catalog product rows have no specific product detail; static review status text does not perform a review action. Admin and seller previews are not authorization boundaries.
9. Mobile catalog drawer lacks implemented Escape handling/focus trap/focus return. Address removal uses a `role=alertdialog` div without complete dialog focus behavior. These are controls but interaction accessibility is not established.

## Cross-page inconsistencies and disconnected journeys

- Authentication forms and demo credentials are a preview only; `/account`, `/seller` and `/admin` remain directly reachable without sign-in. “View demo account” bypasses sign-in by design. No route security exists.
- Checkout address state does not read or write saved addresses from AccountContext. Checkout creates no orders, while customer account and admin orders use independent fixed snapshots. Seller order examples are a third independent set.
- Product detail customer offers, seller portal published offers, seller drafts and admin offer-review queue entries are distinct datasets. Seller draft save does not create a customer-visible offer or admin review record. Admin catalog proposals do not modify canonical products.
- Product card/catalog filtering and sort use `featuredDevices.price` and fixture attributes; product detail selection uses per-offer price; cart re-resolves selected offer; order history uses snapshot price. These are intentional distinct sources, but no live reconciliation is present. Catalog may show rows without a supported product detail route.
- Global in-app anchor navigation updates React route state, while GET search performs a full navigation; checkout additionally writes its own query history. Browser Back behavior has unit coverage only for catalog helper serialization/checkout step guard, not UI-level routing.
- “Demo”/fictional disclosures vary: auth page lists credentials in development; account repeats a large banner on each route; seller/admin use a compact details disclosure; customer checkout says Demo checkout. All are preview data, none imply real authentication.
- Status wording differs between customer orders (`Processing (demo)`) and admin removes “(demo)” in tables/detail, while seller dashboard strips suffix. Seller groups/counts are separately scoped and do not correspond to customer order count.
- No consistent system-wide not-found/error/loading/saving indicator exists. Some pages show explicit empty/unknown states, while async/service error states do not exist because there is no API.

## M01 before/after: concrete changes

The supplied desktop/mobile combined screenshots were considered rejected “before” evidence, not adopted as the target output or reused as page content/assets. The implementation changes in commit `112aa76` are evidenced by the current source:

| Source | Before in source | Current source after M01 |
|---|---|---|
| `styles/index.css` | Prior brand/ink colors, 10px market panel radius, 20px shell gutters and only minimal global layout/focus/reduced-motion rules. | Replaced with #1D4ED8 primary/hover, ink/muted/border/canvas tokens, 8/12px radii, responsive 16/24/32px market gutters, shared button variants, global form controls, focus, reduced motion, portal layout/table styles. White on primary blue calculates 6.70:1. |
| `StoreHeader.jsx` | Separate wide desktop search vs duplicated mobile search form; larger utility strip and taller layout. | One search form adapts into second row on mobile; compact utility/main/category bars; categories, sign-in/cart count and responsive category menu. |
| `HomePage.jsx` | Two-column hero with empty icon media panel, tall media category tiles, 5 featured products regardless of detail support and generic “Compare devices” link to `/shop`. | Single text promotion with no image column; compact category icon tiles; only the three products with detail fixtures are promoted; compatibility note is informational. |
| `ProductCard.jsx` | Square oversized icon media, larger card padding, seller-unavailable text, larger spacing. | 112/160px media; clearer name/spec/price/action stack; seller-unavailable row removed; action uses shared button styles. |
| `CartPage.jsx` | 76px icon media, loose row/details arrangement, 330px summary at `xl`. | 80/88px compact placeholder, aligned line total and quantity/removal row, clearer seller group, 320px summary at `lg`; existing totals/state retained. |
| `SellerPortalLayout.jsx` | Store-width shell, full explanatory banner, 200px-ish content sidebar and long deferred destination list. | Full-width 232px portal shell, 64px bar, selector and compact demo disclosure; only Overview/Offers links. |
| `AdminPortalLayout.jsx` | Store-width shell, full explanatory banner and long deferred nav list. | Same full-width portal geometry; only actual admin routes in sidebar, disclosure instead of banner. |
| `SellerDashboardPage.jsx`, `SellerOffersPage.jsx`, `AdminPreviewPage.jsx` | Earlier loosely styled panels/tables. | Shared compact operational tables/headers, fixture-derived 96px-class metric cards and preserved read-only actions/data. |

No images, business fixtures, route identities or dependencies were added for M01. Existing regression suite and build results are recorded in the checkpoint; no tests/build were run to prepare this report.

## Prioritized corrective backlog with source evidence

| Priority | Gap / concrete next action | Source evidence | Related audit IDs |
|---|---|---|---|
| P0 | Add a real public not-found/unavailable state; safely decode account IDs and make unknown categories explicit. | `app/App.jsx` catch-all, direct `decodeURIComponent` for order ID, `CatalogPage` category lookup. | F02, X01, X02 |
| P0 | Finish catalog→supported product decision for all items: either add explicit detail records or remove misleading catalog fallback destinations; keep offer price/variant state coherent. | `homeContent.js` has eight products but three detail records; `ProductCard.jsx` fallback `/shop`; `CatalogPage.jsx` filters base prices. | F06, F07, C02–C04, X01/X04 |
| P0 | Add gallery assets and meaningful thumbnails; preserve compact fallbacks until files are approved. | `ProductPage.ProductGallery`, `.product-media`, `CartPage.CartItem`, no local individual images/fonts. | F05–F08, F12, C03 |
| P0 | Model cart stale/missing/unavailable/changed-price lines and recovery actions without silently selecting another offer; retain current identifier-only storage. | `CartContext.jsx`, `lib/cart.js`, current invalid-cart panel only. | F08, C06, X04/X05/X07 |
| P0 | Define auth contract and frontend verification, recovery, locked/unverified, reset and session states; preserve development-only demo helper and no route-security claims. | `AuthPage.jsx`, `authValidation.js`, `demoPreviewAuth.js`. | C07, X05–X07 |
| P0 | Connect saved addresses to checkout with one shared state owner; define address-area delivery invalidation and supported payment choices before wiring. | `AccountContext.jsx` vs local `CheckoutPage` address state; fixture delivery options. | C08, C15, X04/X07 |
| P0/P1 | Add result/resume screens for payment pending/declined/cancelled/unknown/confirmed, but keep all execution server-gated. | Checkout final button disabled; no result routes in App. | C09, X07 |
| P1 | Build customer shipment details/timeline and cancellation/return/warranty/support/notification states. | `OrderDetailPage.jsx` explicitly says actions are deferred; no such routes. | C10–C14 |
| P1 | Build seller onboarding, product proposals, inventory, order operations, shipments/aftersales, finance and support; keep merchant scope and distinct entity identities. | `SellerPortalLayout` only Overview/Offers; `demoSeller.js` lists fixture orders/offers only; no operational pages. | S01–S10, X03/X07 |
| P1 | Extend admin to operational review history, access/membership, shipment/aftersales, finance, support, policies and audit; keep fictional/read-only states honest until action contracts exist. | `AdminPreviewPage.jsx` route resolver and `demoAdmin.js` static fixtures; no action handlers. | A01–A10, X07/X08 |
| P1 | Replace demo credential and repeated demo-copy placement with concise role-appropriate disclosure; retain explicit demo entry points. | Dev-only aside in `AuthPage`, repeated `AccountLayout` banner, compact seller/admin disclosure. | F10, C07, X06/X08 |
| P0 completion gate | Perform the owner’s visual and keyboard review at 1440, 1280, 1024, 768 and 390px, including empty/error states, focus, zoom/reflow, drawer behavior and reduced motion; record observations separately from build success. | No browser/visual evidence in `project_state.md` or audit; current report has source-only class measurements. | F11/F13/F14, X01/X09 |

## Verification and explicit limits

The latest recorded M01 evidence in `project_state.md` is 41 existing Node tests passing once, a Vite 8.3.8 production build passing once, `git diff --check` passing, and loopback HTTP 200 checks for the development server source modules. The source-level test suite covers catalog helpers, selection helpers, cart helpers, checkout helpers, auth validation/demo credential helper, order snapshots, account-state helpers, seller scoping/offers, and admin fixture lookup/counts. It is not a page component/browser test suite. **No tests or build were rerun for this documentation-only report.** No browser automation, screenshot comparison, keyboard run, actual viewport measurement, or accessibility audit was performed. All browser/visual behavior is **NOT_VERIFIED**. Assets remain `ASSET_PENDING`.
