# Execution checklist and bounded work loop

## Start here

This is the entry point for the six project files. Execute the user's requested scope with small verified slices. Preserve progress; do not restart the project or repeatedly re-plan completed work. Frontend research is ready: React + JavaScript + Tailwind and simple CSS motion are confirmed. Frontend implementation has not started; visual choices remain provisional. The current request is architecture. D00 proposes the complete page map; D01 is image design after architecture review; application construction follows the reviewed direction and requested implementation scope. Confirmed language order: complete English/LTR first; add Arabic/RTL afterward in L01.

### First-run prompt

> Read this file first. Read 01_ANALYSIS.md for the business baseline and the global conventions in 03_BACKEND.md and 04_SECURITY.md. Inspect the actual repository before editing. Establish or resume project_state.md. For research, complete the requested study without scaffolding an app. For implementation, work on the next unblocked backend or frontend milestone within my requested scope. Implement a small coherent slice, verify its important behavior, update evidence and the checkpoint, then continue or finish according to scope. Do not expand a research task into interface implementation or enter an endless repair loop. Do not treat the 148-table reference as a required initial implementation.

### Resume prompt

> Read project_state.md and the relevant section of 05_EXECUTION_CHECKLIST.md. Confirm that the recorded files and verification still match the current repository. Read only the feature-specific analysis/backend/security sections needed for the next unblocked task. Resume from the checkpoint without rebuilding completed work. Respect the recorded frontend status and current requested scope; research does not imply implementation.

## Context-loading policy

| File | Load when |
| --- | --- |
| `01_ANALYSIS.md` | First run, business-rule changes, or the relevant journey/invariant needs checking. |
| `02_FRONTEND_PENDING.md` | Frontend research baseline; load only sections relevant to the active design or requested implementation task. The stack is confirmed; brand is provisional; implementation has not started. |
| `03_BACKEND.md` | Global conventions once; current milestone/transaction boundary as needed. |
| `04_SECURITY.md` | Global security rules once; affected SEC gates for each slice. |
| `05_EXECUTION_CHECKLIST.md` | Entry, milestone status and loop limits. |
| `06_FINAL_REVIEW.md` | Milestone/release review, not after every line edit. |
| `references/Frontend_Architecture.md` and `references/Frontend_Page_Map.json` | Current area/page IDs, layout, access and states. Read only the relevant page family, not the complete inventory every turn. |
| `references/Frontend_Design_Research_AR.md` | A specific visual decision needs detailed rationale or source evidence. Do not reload it every coding turn. |
| `references/Smart_Home_Analysis_v1.zip` | Only to extract a specific original UC, entity or rule needed now. Never ingest every diagram/HTML/JSON by default. |

On return, load the checkpoint first. Read changed/relevant sections instead of all six documents. Record useful conclusions so the next run does not repeat the same search. Re-check online documentation only for a concrete unknown/version change; prefer official sources. Do not browse repeatedly for unchanged implementation facts.

## Durable checkpoint

Maintain one repository-local `project_state.md`. Create it only if absent; merge verified existing progress. These supplied documents are plans, so no milestone is initially DONE merely because its document exists.

```markdown
# Project state
Updated: <timestamp>
Requested scope: <actual user objective>
Current milestone: <D00 architecture / D01 images / B00..B11 / F00..F06 / later L01>
Frontend: RESEARCH_READY / ARCHITECTURE_PROPOSED / IMAGE_DESIGN_NOT_STARTED / IMPLEMENTATION_NOT_STARTED; English/LTR first, Arabic/RTL later; brand provisional
Repository/API/test paths: <observed paths>
SDK/packages/database: <observed versions; no secret values>
Relevant source revision: <HEAD plus relevant working-tree/diff identity>

## Verified completed work
| Task | Files or API evidence | Verification command/result | Remaining limit |
| --- | --- | --- | --- |

## Current task
Goal: <one observable outcome>
Acceptance: <specific success and important failure path>
Affected rules/security gates: <BR/SEC identifiers>
Changed files: <paths>
Status: NOT_STARTED / IN_PROGRESS / VERIFIED / BLOCKED / DEFERRED

## Decisions and deviations
<scope, data-model mapping, adapter modes, reason and effect>

## Blockers and live gates
<what is missing, affected capability, safe unblocked work>

## Verification evidence
<command, environment/provider mode, exit/result, date, scope>
<NOT_VERIFIED items are explicit>

## Next exact step
<one actionable step; do not write a new full project plan>

## Loop history for current failure
Error signature: <short stable signature>
Hypotheses tried: <at most two, with actual changes/results>
```

Keep the active checkpoint concise, preferably under 600 words. Move detailed historical logs to a linked file only when necessary. Never include secret values, huge compiler logs, duplicated source code or payment payload dumps. Preserve decision/evidence references when compacting history.

## Milestone checklist

- [ ] B00 Repository inspected; real paths, versions, commands and scope recorded.
- [ ] B01 API/SQL foundation and migration verified.
- [ ] B02 Identity, permissions, ownership and membership verified.
- [ ] B03 Seller review, private documents, bank/warehouse boundaries verified.
- [ ] B04 Catalog/variants/offers and accurate technical information verified.
- [ ] B05 Stock reservation/concurrency and necessary serial controls verified.
- [ ] B06 Quote/order snapshots, merchant split and command idempotency verified.
- [ ] B07 Authenticated provider outcomes, replay, late/unknown payment handling verified.
- [ ] B08 Fulfillment/custody/tracking/COD behavior verified.
- [ ] B09 Cancellation/returns/refunds/warranty/support boundaries verified.
- [ ] B10 Ledger/statements/settlement/payout/fiscal scope verified or live gates explicitly blocked.
- [ ] B11 Final assessment and honest readiness status recorded.
- [ ] Requested frontend scope is implemented and reviewed — research is ready; implementation has not started. Do not check this box from documentation alone.

These boxes belong in the evolving checkpoint/backlog. Update them from observed evidence. A requested smaller scope need not implement the whole checklist; name its boundary explicitly.

## Frontend routing

D00 is the architecture proposal. The user plans to review it, then activate D01 UI images before coding. Use page IDs from the architecture map and the first representative Home desktop image to settle direction; do not generate all screens/images at once. Architecture or a picture is not an implemented page.

When frontend implementation is requested, use F00–F06 from section 12 of `02_FRONTEND_PENDING.md`. Start with one representative header/card and its responsive/content states; verify the shared component before spreading it across screens. Reuse the same checkpoint and bounded loop. Record only the active slice, relevant tokens/contracts, changed files, viewport evidence and unresolved decisions. Do not reread every source or regenerate all designs for a local change. Backend-only work does not activate UI implementation.

## Work loop

1. **Select:** choose the smallest next task that satisfies one useful outcome in the requested milestone. Write its acceptance and affected rules. Do not select unrelated refactors.
2. **Inspect:** check git/worktree state and only relevant files, routes, migrations and tests. Reuse functioning code. Do not overwrite the user's work or scaffold a duplicate application.
3. **Implement:** make the focused change. Introduce only the entities/dependencies needed now. Keep business/security guarantees from 01/04.
4. **Verify:** run the focused meaningful test/check once. Once code is stable, build the affected project and perform required checks. Use SQL Server for database-engine/concurrency claims.
5. **Repair if needed:** classify the failure; inspect the short relevant log; change one justified cause; rerun the failed check. Apply the limits below.
6. **Checkpoint:** record result, changed files, actual commands and limitations. Mark VERIFIED only after acceptance passes.
7. **Decide:** continue the next task if inside requested scope and budget; otherwise finish with the next exact step. Stop on success, a genuine blocker, a user-set budget or cancellation. Do not ask for confirmation for routine reversible steps already authorized.

A slice should generally implement one or two related outcomes. The default unit of a task is one milestone unless the user requests broader work. A request to build the whole backend may proceed through its finite milestones in sequence; it is not authorization for unbounded redesign or infinite retries.

## Loop limits and cost discipline

- Maximum **two cause-directed repair attempts per unchanged failure signature**. If still failing, preserve work and report BLOCKED with the minimal cause and next evidence needed. A new hypothesis must be stated; do not relabel the same failed action as progress.
- Do not rerun an identical failed command with unchanged inputs/code unless a known transient condition has been identified. Respect required repository checks and sensible transient retry policies.
- Run the full suite at a milestone/release boundary, or when new changes/failures justify it. Use targeted tests while editing; do not run every test after every trivial edit.
- Do not repeatedly reinstall packages, rebuild containers, regenerate migrations, replace the architecture or reread the entire repository to fix a local error.
- Do not generate speculative tests, boilerplate documentation or abstractions unrelated to current acceptance. Never save credits by skipping payment, ownership, quantity or money verification.
- Do not paste full unchanged files into chat. Keep routine progress/outcome summaries short, normally under 150 words, with paths and evidence.
- Respect a user-specified time/tool/spend limit if the tool exposes it. Do not claim to know exact credit consumption or guarantee a savings percentage.

## Evidence invalidation

After a material code/config/schema change, invalidate affected verification and rerun its meaningful checks. Keep unrelated valid evidence. An old build, a mock response or the reference archive's 19 relational-shadow tests cannot certify new API code. If SQL Server/provider access is unavailable, label that check NOT_VERIFIED and isolate the blocker instead of endlessly retrying or silently substituting another engine.

## Finish a work session

Report: completed scope, important verification, remaining blockers/live gates and next exact step. Persist the checkpoint before stopping. Do not say the entire platform is complete when frontend, mobile authentication, provider contracts or other requested capabilities remain unresolved.
