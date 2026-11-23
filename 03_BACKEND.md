# Simple .NET backend implementation contract

Read with `01_ANALYSIS.md`, the security gates in `04_SECURITY.md`, and the current milestone in `05_EXECUTION_CHECKLIST.md`.

## Architecture default

Use one ASP.NET Core API application, one SQL Server database, EF Core migrations and one test project. Organize by feature. Keep controllers thin; put transaction/state rules in concrete feature services; use DbContext directly. Add interfaces at external-provider boundaries, not for every class.

For a new repository, default to .NET 10 LTS and the compatible EF Core/SQL Server provider major version. Verify the available supported SDK once at B00, pin the actual SDK/package versions, and record them. Keep an existing compatible stack unless a documented upgrade is required. Do not silently fall back to an unsupported runtime.

Avoid introducing microservices, CQRS/MediatR pipelines, generic repositories, a second Unit of Work, event sourcing, Redis, Kafka/RabbitMQ, Elasticsearch, Kubernetes or a general workflow engine for the initial product. A specific measured requirement may justify an exception; record it before expanding architecture. Do not create empty abstraction projects for future features.

## Project organization

Suggested paths; adapt to a healthy existing repository rather than restructuring it:

```text
src/Marketplace.Api/
  Features/Identity/
  Features/Merchants/
  Features/Catalog/
  Features/Inventory/
  Features/Orders/
  Features/Payments/
  Features/Shipping/
  Features/AfterSales/
  Features/Finance/
  Data/            # DbContext, EF configurations, migrations
  Integrations/    # provider adapters and options
  Infrastructure/  # small shared error/auth/file facilities
tests/Marketplace.Tests/
```

Use explicit request/response DTOs and manual mapping until complexity justifies another dependency. Do not expose tracked entities, identity internals or arbitrary navigation graphs. Use async I/O, cancellation tokens, bounded pagination and deterministic ordering. Return ProblemDetails with stable business codes, field errors where appropriate and a correlation ID.

## Identity and client boundary

1. Use ASP.NET Core Identity or an already configured maintained identity service for credential lifecycle, hashing, reset and lockout. Map the old reference identity entities to that framework; do not duplicate its password tables.
2. Initial browser/backend verification uses framework-managed secure HttpOnly cookies with CSRF protection, assuming a same-origin API/proxy. Do not store bearer secrets in browser localStorage. Deployment origins remain a frontend/integration decision.
3. Check active user status and current merchant membership on protected operations. Define and test server-side invalidation after sensitive changes. For the initial small system, correctness may use a database-backed status/security-stamp check; do not claim immediate revocation from client cookie deletion alone.
4. Mobile production authentication needs a recorded maintained token flow. Prefer OIDC/OAuth authorization code with PKCE when a token service is required. Built-in Identity API bearer tokens are opaque, not JWTs, and are for simpler closed first-party scenarios; their sign-out/revocation limitations must be addressed and tested before enabling that production mode. Do not implement a custom JWT/OAuth server to save a few files.
5. Do not block unrelated catalog/order development on the unresolved mobile identity provider. Mark the mobile-auth live gate OPEN, keep the API client-neutral and verify the initial protected API with supported cookie clients.
6. Platform roles and merchant membership roles are different. Derive seller access from the verified merchant and membership; public signup never supplies authoritative role or merchant approval fields.

## Data conventions

- Prefer Guid identifiers consistent with Identity's chosen key type. UTC `DateTimeOffset`/UTC date-time policy, documented currency minor units in `long`, and explicit enums/state values.
- Store historical product, price, warranty, address and policy snapshots on the purchase. Use JSON for snapshots/typed technical flexibility, not to hide order lines, money allocations or relationships.
- Add FK, unique and row-level CHECK constraints as needed. Protect cross-merchant/order/currency relationships with composite keys where practical. Validate aggregate invariants in controlled transactions; a RowVersion field alone does not prevent overselling.
- Use optimistic concurrency for edits and atomic conditional updates/appropriate transactional locks for stock and financial aggregates. Check affected row counts and return a meaningful conflict.
- No cascade deletion of purchases, financial records, private evidence or posted documents to implement account closure. Restrict access, close/anonymize eligible data and apply retention rules.
- Do not run the 148-table reference DDL wholesale. Generate coherent migrations for the implemented slice and record consolidation/deferment. Never create a parallel simplified schema beside another unused reference schema.

## Milestone implementation contracts

| ID | Deliverable | Minimum verification |
| --- | --- | --- |
| B00 | Inspect repository, instructions, git state, SDK, database access, existing tests; establish `project_state.md` | Record actual paths/commands and blockers, without printing secrets. |
| B01 | API host, DbContext, first migration, errors, health, versioned API/OpenAPI convention | Clean build; migration applies to a disposable SQL Server database. |
| B02 | Identity, confirmation/reset/lockout, authorization and scoped membership helpers | Unauthenticated rejection, cross-user/store rejection, privilege escalation rejection, session invalidation evidence. |
| B03 | Merchant application/review, document access, warehouse/bank proof and change control | Unapproved seller cannot publish; private docs cannot be fetched by another user; bank ownership/review enforced. |
| B04 | Catalog/variants/offers, technical facts, reviewed publication, basic database search | Two merchants can offer the same variant; seller edits do not rewrite shared facts or old purchases. |
| B05 | Inventory, movements, timed reservations, optional serial tracking | Concurrent attempts for the last unit cannot both succeed; wrong-variant/double serial allocation fails. |
| B06 | Cart/quote/order/seller-order/items/snapshots and confirmation idempotency | Two-seller order; price tampering; quote change; repeated submission; partial cancellation boundary. |
| B07 | Payment adapter, provider events, persisted attempts/results, allocation and reconciliation | Validated success, invalid signature, wrong amount/currency, duplicate/late event and unknown outcome. |
| B08 | Shipment quantities, custody evidence, tracking and COD collection/remittance | Partial shipment, repeated event, failed delivery/RTO, Delivered without matched COD funds. |
| B09 | Return/inspection, bounded refunds, warranty/support and reasoned decisions | Duplicate/concurrent refund prevention, wrong returned serial, return after seller payout and dispute escalation. |
| B10 | Posted ledger, fees/receivables, statements/settlements, payout/fiscal adapters | Balanced posting; no duplicate settlement source; verified legal-entity bank; payout outcome and reversal evidence. |
| B11 | Release gates, privacy/audit, runbook and final report | `06_FINAL_REVIEW.md`; frontend and unresolved live integrations reported accurately. |

## Transaction and integration rules

**Checkout:** validate the saved quote; reserve inventory; persist order, merchant parts, lines and outbox in one local transaction. Make provider network calls after the commit. Deduplicate both command and provider outcome. Do not keep a SQL lock while waiting for a payment page.

**Unknown payment:** keep a reconcilable pending/unknown attempt. Query by the stable provider reference. Do not create a fresh charge blindly. Verify late success even if checkout expired; safely reacquire stock or execute a tracked refund.

**Refund:** lock/check the refundable aggregate against successful captures, prior successful/in-flight refunds and relevant dispute overlap. Create one durable command and allocations before calling the provider. A provider creation acknowledgement is not successful refund completion.

**Background work:** use one simple SQL-backed outbox/work queue and a `BackgroundService` where adequate. Persist attempt count, next attempt, claim/lease and outcome; handle crash recovery and multiple worker instances without duplicate effects. Use bounded backoff and a dead-letter/manual review state. Do not substitute an in-memory queue for required durable money work.

**Providers:** use narrow `IPaymentGateway`, `IShippingGateway`, notification and fiscal/file adapters as required by the current slice. Use sandbox modes. Test fakes are confined to tests/development; never expose production `mark-paid`, fake delivery or fake payout-success endpoints. Unconfigured real capabilities fail clearly or remain disabled.

**Seller money:** use a small explicit ledger with balanced immutable entries and source references. Keep tax/fee/funding/commission versions explainable. Statements, eligible receivables and actual payouts are distinct. Financial dispatch requires verified destinations and the applicable independent approval; a manual pilot records verified bank/provider evidence instead of pretending an unintegrated transfer happened.

## API boundary and tests

Start from `/api/...` resource contracts; document actual routes in OpenAPI rather than inventing a frontend now. Use `Idempotency-Key` for order confirmation, refund dispatch and payout dispatch with actor/operation scope and request hash. Return 409 for state/idempotency conflicts and 202 for accepted asynchronous work; do not equate 202 with success.

Use real SQL Server integration tests for relational constraints, migrations, transactions and concurrency. EF InMemory/SQLite-only tests cannot certify SQL Server behavior. Unit-test isolated business calculations when useful. Include at least two users, two merchants and two technical variants in isolation tests. Use provider sandbox or deterministic adapters for failure/replay tests; label the evidence type.

Keep validation proportional to changes. Do not generate repetitive CRUD tests that mirror implementation; prioritize ownership, transitions, quantities, money, provider outcomes and migration correctness. Record unavailable runtime/provider checks as NOT_VERIFIED, not PASS.

## Sources and version note

Verified for preparation on 2026-11-23; re-check only when a dependency decision changes:

- [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy)
- [ASP.NET Core Identity API and cookie/token behavior](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-10.0)
- [JWT bearer authentication and standard token-service guidance](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication?view=aspnetcore-10.0)

Do not copy example credentials, weak tutorial password policies or database substitutes into production configuration.
