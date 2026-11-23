# Final review and evidence-based evaluation

## Role and scope

Assess the actual requested milestone/release against `01_ANALYSIS.md`, `03_BACKEND.md`, `04_SECURITY.md` and `project_state.md`. Read implementation and observed evidence. This is review-only unless the user also requested fixes; authorized fixes follow the bounded loop in `05_EXECUTION_CHECKLIST.md`.

State the review boundary first: backend milestone, backend sandbox, live-commerce readiness, or full web/mobile product. Frontend research is ready, architecture is proposed, UI image design has not started, and application implementation has not started. Stack is React + JavaScript + Tailwind with simple CSS motion; branding remains provisional. The confirmed first product is English/LTR; Arabic/RTL follows after complete English review. Do not fail the English scope for the absence of the deferred Arabic stage, or claim Arabic is implemented. Do not grade an unrequested frontend as implemented or call backend success full-platform completion.

## Review sequence

1. Inspect repository instructions, worktree, routes, migrations, configuration shape and recorded scope. Preserve user edits.
2. Check every claimed completed item against observable behavior, files and verification. Identify placeholder/stub/fake-success paths.
3. Review ownership, authentication, money, stock and state rules before visual polish or naming preferences.
4. Review the important integration/failure paths below and run the required available checks once. Reuse still-valid evidence; rerun affected checks after material changes.
5. Record precise findings with severity, path/location, trigger, impact and an actionable fix.
6. Publish the verdict, evidence-based score, unverified scope, blockers and next exact actions. Do not enter an automatic endless improvement loop.

## Mandatory acceptance inventory

| Test | Required observation |
| --- | --- |
| QA-01 | Signup cannot self-grant seller approval/admin; protected operations reject missing/invalid/revoked credentials. |
| QA-02 | Two users/two merchants cannot cross-read/write orders, memberships, documents, reports or exports. |
| QA-03 | Two merchants can offer the same variant with separate prices, warranties and stock; edits preserve old order snapshots. |
| QA-04 | Concurrent last-unit reservations do not oversell; serial allocation matches the variant and is unique while active. |
| QA-05 | Repeated order confirmation creates one order/payment intent; different payload under the same key conflicts. |
| QA-06 | Browser success, invalid signature, wrong amount/currency/account and duplicate provider events cannot falsely pay/ship. |
| QA-07 | Timeout/late payment remains reconcilable; late success without stock produces a safe remedy. |
| QA-08 | Partial shipment/cancellation quantities are correct, including a handover race and one failed merchant portion. |
| QA-09 | Return receipt/inspection/serial/condition and warranty handling preserve rights and do not blindly restock as new. |
| QA-10 | Concurrent/repeated refunds and chargeback overlap cannot refund the same value twice. |
| QA-11 | Money allocations preserve seller/order/currency boundaries and reconcile with their sources. |
| QA-12 | Posted entries balance; settlement sources do not duplicate; corrections preserve originals. |
| QA-13 | Unverified/wrong-entity bank, self-approval and duplicate payout allocation fail; actual payout outcome is verified. |
| QA-14 | COD delivery is separate from collection/remittance; cash discrepancies remain visible. |
| QA-15 | Private uploads/evidence, secret management, CSRF/CORS and privacy/audit controls meet affected SEC gates. |
| QA-16 | SQL Server migration, actual constraints and transaction/concurrency behavior are tested on SQL Server. |
| QA-17 | Durable work/reconciliation and restore/replay handling do not duplicate important side effects. |
| QA-18 | Application builds/runs; required checks pass; sandbox/fake/live modes and unresolved fiscal/provider decisions are honestly identified. |

Use NOT_APPLICABLE only for explicitly excluded scope, with a reason. NOT_VERIFIED is not PASS. Deferment cannot disguise an essential failure path for a feature claimed complete. New commerce code does not inherit test results from the old analysis archive.

## Blocking gates

Do not issue a release PASS if there is an unresolved critical/high-severity security or financial-integrity defect, an unverified critical behavior in the requested release scope, leaked secrets/private data, unsafe stock/refund concurrency, unbalanced posting, fabricated provider success or an unresolved required live-operation contract.

A gate can block a live capability while allowing a narrower sandbox milestone to pass. Name the narrower scope and the excluded live capability explicitly. Numerical scores never override blocking gates.

## Scorecard

| Category | Weight | Evaluate |
| --- | --- | --- |
| Business functionality | 30 | Requested journeys, real persistence, transitions and meaningful errors. |
| Data and financial integrity | 25 | Keys/constraints, concurrency, snapshots, quantities, money and reconciliation. |
| Security and privacy | 25 | Applicable SEC gates, not just authentication middleware presence. |
| Simplicity and maintainability | 10 | One coherent app, clear features/services/DTOs, proportionate dependencies and tests. |
| Operability and evidence | 10 | Migrations, setup/runbook, diagnostics, recovery and reliable verification records. |

Use measured category points and justify deductions. Proposed pass threshold: 85/100 **and** every applicable blocking gate satisfied. If evidence is insufficient, record NOT_VERIFIED for the category/item and withhold PASS rather than inventing points. Do not inflate a score because the code looks polished or contains many files.

## Verdicts

- **PASS within stated scope:** required behavior verified, no applicable blocker, score threshold met.
- **CONDITIONAL:** narrow non-release milestone works with named noncritical limitations; never use this to approve unsafe live trade.
- **FAIL:** required behavior or a blocking gate fails.
- **NOT_VERIFIED:** environment/evidence cannot support a conclusion on critical requested behavior.

## Required report structure

```markdown
# Final review
Scope and source revision:
Verdict:
Readiness: <backend milestone / sandbox / live commerce / full product>
Frontend research / implementation / brand status:
Frontend responsive/accessibility/API evidence (when in scope):
Mobile status:

## Findings, highest severity first
| ID | Severity | Path/location | Reproduction | Impact | Required fix |
| --- | --- | --- | --- | --- | --- |

## Verification
| Command/scenario | Environment/mode | Observed result | Limitation |
| --- | --- | --- | --- |

## Score
| Category | Earned/weight | Evidence/deduction |
| --- | --- | --- |

## Open gates and next actions
<exact blockers and prioritized actions; owner/input needed>
```

If no defects are found, say what was checked and what remains unverified. Avoid unsupported claims such as “100% secure,” “all tested,” or “production ready.” Save the report in the repository and link it from the checkpoint.

## Architecture and visual-review boundary

For D00, review page/route/layout coverage, tenant and permission boundaries, core journeys, unknown money states and English-first/later-Arabic sequencing. Use `references/Frontend_Architecture.md` and the relevant page IDs. For D01, review representative images and important states against that architecture; images cannot verify live behavior. For F00–F06, require actual implemented routes/components, role-safe API integration and evidence for the requested slice. Do not require all 88 planned families for a narrower requested milestone, and do not claim the complete English product until its entire agreed core scope and critical failure paths pass.
