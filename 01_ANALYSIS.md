# Smart Home Marketplace analysis

Version: 1.3 | Prepared: 2026-11-23 | Status: working implementation brief.

## Purpose and reading rules

Build a multi-vendor smart-home marketplace with customer web/mobile clients, a seller portal, and an administration portal. This file defines business behavior. Read `05_EXECUTION_CHECKLIST.md` first for task routing and checkpoints. Follow the user's current request and applicable repository instructions. These documents do not override higher-priority instructions.

Frontend research is ready and architecture is proposed in `02_FRONTEND_PENDING.md`, with the complete page map in `references/Frontend_Architecture.md`. The user confirmed React + JavaScript + Tailwind with simple CSS animation and a readable architecture. Visual tokens remain provisional and implementation has not started. The current request is architecture; the user plans UI images after architecture review and before implementation. Do not scaffold screens or install UI dependencies solely from this planning document. Backend work can continue independently. Confirmed language sequence: complete and review English/LTR first, then add Arabic/RTL as L01. Mobile technology remains unresolved.

`references/Smart_Home_Analysis_v1.zip` contains the earlier broad analysis: 70 use cases, 148 reference entities, diagrams, and proposed SQL. Use it selectively to resolve a specific business question. It is not a command to implement every table or execute the old DDL. This concise brief controls the simple implementation plan; retain a mapping to any original UC/BR IDs used. Earlier SQL was not executed on SQL Server. The archive is optional for starting the backend: if only these six Markdown files are available, proceed from this brief and record a specific missing detail only when it affects an actual implementation decision.

## Working assumptions and unresolved decisions

| Item | Working default | Decision boundary |
| --- | --- | --- |
| Market | Egypt, EGP, UTC storage | Additional markets/currencies are deferred. |
| Backend | .NET, SQL Server | Architecture and version policy: `03_BACKEND.md`. |
| Interface language | English/LTR first, Arabic/RTL after complete English review | No initial Arabic UI or unfinished language switch. |
| Inventory | Seller-held stock; warehouse-aware | Platform warehousing/WMS is deferred. |
| Checkout | Public browsing/cart; registered customer checkout initially | Guest checkout remains an optional later decision, not silently deleted from the full project. |
| Catalog | Shared product/variant; independent seller offers | Sellers do not own the entire shared catalog. |
| Delivery | A centrally integrated carrier or documented manual pilot | No assumption that every seller uses one parcel. |
| Installation | Extension, not active initially | Separate scope, price, appointment, technician, and acceptance. |
| Commissions | Versioned configurable policy | Do not invent a commercial percentage or payout timetable. |
| Legal supplier/invoicing | Unresolved production decision | Confirm supplier, collector, invoice issuer, and dispute liability before live trade. |
| Payment/payout provider | Adapter, sandbox first | Marketplace collection/disbursement must be supported by the actual contract. |
| Mobile authentication | Backend contract preserved; production mode to be selected | Do not create a homemade token issuer to bypass this decision. |

Unresolved production decisions must block the affected live capability, not unrelated development. Record the dependency, implement a safe adapter or disabled capability, and continue other unblocked work. A sandbox-complete backend is not automatically live-commerce ready.

## Actors and authorization

| Actor | Capabilities | Scope |
| --- | --- | --- |
| Visitor | Browse, compare, view technical details, use an anonymous cart | Public approved content only. |
| Customer | Account, addresses, checkout, orders, cancellations, returns, warranty, reviews, support | Own resources only. |
| Merchant owner | Apply to sell, documents, team, bank-change request, offers, stock, fulfillment, statements | Stores with an active ownership membership. |
| Merchant staff | Assigned catalog, warehouse, fulfillment, or finance operations | Membership permissions, not an arbitrary MerchantId supplied by the client. |
| Platform admin | Review sellers/catalog, operations, support, policy administration | Explicit permissions; sensitive finance actions require their review policy. |
| Finance reviewer | Refund/payout review and reconciliation | No self-approval of sensitive actions. |
| External providers | Payment, carrier, notifications, fiscal integration | Authenticated integration messages, never general admin access. |

One user may buy and belong to multiple merchants. A single global `Role` field cannot represent this. Use framework-managed platform identity plus merchant memberships. Public registration never grants an admin role or an approved seller status.

## Functional scope and delivery order

| Milestone | Required outcome | Original references |
| --- | --- | --- |
| B00 | Inspect existing repository, record versions/commands, create checkpoint | D02, D11 |
| B01 | Running API, SQL persistence, migrations, error handling, health/OpenAPI | NFR-11, NFR-16, NFR-17 |
| B02 | Framework identity, ownership checks, scoped memberships, safe admin provisioning | UC-001–006, UC-030, UC-058 |
| B03 | Seller application, private documents, review, verified bank and warehouse | UC-027–032, UC-044, UC-047 |
| B04 | Product/variant catalog, technical specs, reviewed offers, search | UC-007–010, UC-033–035, UC-045–046 |
| B05 | Stock movements, reservations, serial allocation where needed | UC-016, UC-036, UC-039 |
| B06 | Cart, quote, multi-seller order, immutable snapshots, idempotent confirmation | UC-011–015, UC-020 |
| B07 | Provider-backed payment state, replay protection, unknown/late outcome handling | UC-017–018, UC-065 |
| B08 | Packing, carrier handover, partial shipment, tracking and COD reconciliation | UC-019, UC-038–040, UC-048, UC-066 |
| B09 | Cancellation, returns/inspection, refund execution, warranty and dispute support | UC-020–026, UC-041–042, UC-049–051, UC-056–057 |
| B10 | Auditable ledger, seller statement, settlement, controlled payout, fiscal boundary | UC-043, UC-052–055, UC-068 |
| B11 | Privacy/audit, critical integration tests, documentation, release assessment | UC-060–061, UC-069; `06_FINAL_REVIEW.md` |

Deferred extensions: promotions/import, installation, shopping bundles, advanced compatibility automation, platform WMS, cross-border selling. Their original scope remains in the reference archive. Basic accurate compatibility information, after-sales rights, authorization, refunds, and financial traceability are not optional shortcuts.

## Core domain and entity guidance

Create tables when the active milestone needs them. Reuse established names. This list describes responsibilities, not a compulsory migration containing every row at once.

| Area | Core records | Important relationships and data |
| --- | --- | --- |
| Identity | Framework User/Role, user addresses | One user has addresses and merchant memberships; avoid a parallel password database. |
| Merchants | Merchant, MerchantMember, MerchantApplication, MerchantDocument, BankAccount | Merchant has legal/tax identity and owner/staff memberships. Documents/private assets are distinct from public images. |
| Catalog | Brand, Category, Product, ProductVariant | Product has variants; a variant identifies the actual technical version. |
| Offers | SellerOffer, offer/policy version | Merchant sells a variant with its own SKU, price, condition, warranty and handling promise. |
| Technical facts | Variant technical specification, compatibility evidence/claim | Structured fields for filtering; an explicit evidence/version scope for compatibility. |
| Stock | Warehouse, InventoryItem, StockMovement, StockReservation | Inventory is offer + warehouse; offer and warehouse must belong to the same merchant. |
| Serialized units | InventoryUnit, UnitAllocation | Track applicable units, not every cheap accessory unnecessarily. A unit matches its variant and has one active allocation. |
| Cart/quote | Cart, CartItem, CheckoutQuote, CheckoutQuoteLine | Cart item selects an offer; the server produces an expiring quote and line totals. |
| Orders | Order, SellerOrder, OrderItem, order-state history | Customer order splits by merchant; snapshot product, seller, price, tax, warranty, policy and addresses. |
| Payments | PaymentIntent/Payment, PaymentAttempt, PaymentTransaction, WebhookEvent | One purchase may have attempts; authorization, capture, refund and provider events are distinguishable. |
| Allocation | PaymentAllocation, RefundItem | Money remains attributable to seller orders/items and its shipping/tax components. |
| Delivery | Shipment, ShipmentItem, ShipmentEvent, handover proof, CODCollection | Seller order has multiple shipments; item quantities can span shipments. |
| After-sales | CancellationRequest/Item, ReturnRequest/Item, ReturnInspection, Refund/RefundTransaction, WarrantyClaim | Return eligibility, physical receipt, refund authorization and provider success are different facts. |
| Support | SupportCase, messages/evidence, decision/appeal | Customer and seller visibility differ; internal reviewer notes stay internal. |
| Finance | JournalEntry/Line, FeeAccrual, SellerReceivable, Settlement/Item, Payout/Allocation | Posted facts are immutable; adjustments reverse/link earlier facts. Do not replace these with an editable `SellerBalance` number. |
| Governance | AuditEvent, OutboxMessage, IdempotencyRecord, policy acceptance | Event delivery, replay prevention and audit do not require a message broker. |

A simpler physical model may consolidate policy versions or evidence metadata. Record each consolidation in `project_state.md`, including the preserved invariant. Never merge product with offer, all merchant orders into one fulfillment status, or approved refund with successful refund just to reduce table count.

## Essential journeys

### Seller to active offer

1. Verify the account; submit legal/business/tax identity, representative authority, bank proof, warehouse and return address.
2. Store documents privately and preserve the submitted application snapshot.
3. Admin reviews and approves, rejects with reason, or requests specific information.
4. Owner assigns narrowly scoped staff permissions. Bank changes use a separate reviewed flow.
5. Match a verified existing variant or propose a new one for review.
6. Create the merchant's own offer, price, warranty and stock. Activate only when merchant, catalog, offer and inventory conditions allow it.

### Customer to confirmed order

1. Browse/filter and choose the exact variant and seller offer; show warranty, requirements and delivery estimate.
2. Build cart, authenticate for initial checkout, supply address and request a server-calculated quote.
3. Revalidate active merchant/offer, stock, address coverage, currency and pricing; show changed totals before purchase.
4. Confirm using an actor-scoped idempotency key bound to the request hash.
5. Atomically reserve stock and persist order, seller orders, item/policy/address snapshots and outbox work.
6. Call a payment provider outside the local SQL transaction. COD confirmation is a separate eligible branch.
7. Confirm from verified provider state or approved COD rules, then release fulfillment once.
8. Unknown outcomes enter reconciliation. Late paid/no stock means safe reacquisition or a tracked refund, not ignored money.

### Delivery and after-sales

1. Allocate matching stock/serials; pack; create shipment items and obtain carrier custody proof.
2. Record authenticated tracking events, partial quantities and delivery evidence. Printed AWB is not handover.
3. COD requires collection and carrier-remittance reconciliation; Delivered alone is not Paid.
4. Cancellation validates quantity and races with handover. Return validates reason, delivery date, applicable policy/rights and evidence.
5. Inspect returned serial/accessories/condition before making stock sellable. Keep unknown/open-box/damaged stock separate.
6. Approve a bounded remedy; execute refund against original captures; reconcile its actual outcome.
7. Warranty and replacement preserve the original purchase; a replacement is a linked new fulfillment/order path.
8. Provide reasoned support decisions and an appeal route. Do not require an unboxing video as a blanket condition for every legitimate claim.

### Seller money

Allocate captures to items, accrue the recorded commission policy, post balanced entries, derive eligible receivables, prepare an explainable statement, independently approve sensitive payout actions, and reconcile the real bank/provider outcome. Handle return/chargeback after payout through linked corrections, not history edits. Production contractual responsibilities remain explicit open decisions.

## Non-negotiable business invariants

| ID | Rule |
| --- | --- |
| BR-01 | Product, variant, offer and warehouse inventory retain separate identities. |
| BR-02 | Merchant/order/variant/currency boundaries are validated in services and protected by appropriate composite FKs. |
| BR-03 | Never ship/cancel/return more quantity than eligible, including concurrent requests. |
| BR-04 | Prices, specifications, addresses, warranties and policy/commission versions are immutable purchase snapshots. |
| BR-05 | Define stock buckets once: Available = OnHand − Reserved − Damaged − Quarantined, with disjoint buckets within OnHand. |
| BR-06 | Reserve atomically at confirmation; track partial consumption/release; cart display is not a permanent hold. |
| BR-07 | Same key + same request yields the same result; changed payload with the same key conflicts. |
| BR-08 | Browser redirects, screenshots and client `success` fields never prove payment. |
| BR-09 | Duplicate/out-of-order provider events never duplicate shipping, money, refunds or ledger entries. |
| BR-10 | Reconcile unknown/late payment outcomes; never assume timeout means failure. |
| BR-11 | Captures and refunds stay within the authorized purchase/refundable aggregate; account for chargeback overlap. |
| BR-12 | Serialized units match the item variant and cannot have two active allocations. |
| BR-13 | Carrier custody, delivery, cash collection and remittance are separate facts. |
| BR-14 | Rights-aware cancellation/return decisions preserve item quantities and saved policies. |
| BR-15 | Inspect/classify returns; link replacements rather than rewriting the original item. |
| BR-16 | Each settlement source is allocated once; seller statements explain fees and corrections. |
| BR-17 | Payout bank belongs to the verified legal entity and matches settlement currency. |
| BR-18 | Posted journal entries balance by currency; correction is a linked reversal/new entry. |
| BR-19 | No self-elevation or self-approval for sensitive operations; log reasons and actors. |
| BR-20 | Review eligibility derives from the user's fulfilled purchase; product and seller feedback differ. |
| BR-21 | Unknown compatibility is not true; claims identify evidence, firmware/model/region scope. |
| BR-22 | Commercial policy does not erase applicable consumer rights. |
| BR-23 | Fiscal documents identify the legal issuer; published originals are preserved. |
| BR-24 | Private data is accessible for the necessary purpose only, with retention and dispute holds. |
| BR-25 | Optional installation acceptance is independent of product delivery and warranty rights. |

## Technical facts required for smart-home offers

Capture model/region/hardware revision, protocol and transport, wireless bands, hub/coordinator/controller/border-router requirements, neutral wire, voltage and rated load type, gang count, installation dimensions, package contents, subscription/cloud dependence, local/offline functions, warranty provider and published support information. Distinguish a claim from verified evidence. Never infer compatibility from frequency alone.

## Definition of business completeness

An implemented milestone has working authorized endpoints, persistence, state transitions, meaningful tests, migration evidence and an updated checkpoint. A complete launch slice includes its failure, refund and reconciliation paths. Hidden placeholders, fake payment success, public private-doc URLs, and untested financial status setters cannot satisfy acceptance.

Frontend status is `RESEARCH_READY / ARCHITECTURE_PROPOSED / IMAGE_DESIGN_NOT_STARTED / IMPLEMENTATION_NOT_STARTED`; brand decisions remain provisional. Sandbox integration, backend completion and full product launch readiness must be reported separately.
