# Website audit — 15 September 2026

## Scope
Initial source review, automated code checks, desktop and 390px mobile homepage inspection, and mobile navigation from Home to About. Existing uncommitted edits were preserved. This is not a complete production or authenticated-portal audit.

## Fixed locally
- Registration now validates an unused invitation and requires the invited email before account creation. Club name, community, and season come from the invitation rather than the request.
- Conditional invitation claiming prevents simultaneous requests from reusing a code. Reported club/player save failures trigger compensating cleanup instead of leaving a successful-looking registration.
- Newly generated invitation codes include cryptographically random data instead of predictable club initials alone. Existing codes are unchanged.
- All three newsletter form implementations recover from failed requests, release their busy state, provide accessible input/status labels, and use native form submission and email validation.
- Cookie banner uses a consistent server snapshot to avoid a hydration mismatch.
- Shared mobile navigation exposes its expanded state and navigation landmark.

## Remaining priorities
1. **Database compatibility and staging registration test.** `supabase/schema.sql` defines `season_id` and lacks the `used_by` and `community` fields already used by application routes; the running database has not been inspected. Reconcile migrations before deployment. Registration cleanup spans multiple database/auth calls; a service outage can still require manual reconciliation. Test with disposable staging accounts.
2. **Code quality.** Baseline lint reports 19 errors and 33 warnings. These include synchronous state updates in effects, unescaped JSX text, internal anchors, explicit `any` types, and a compiler memoization warning. TypeScript passes. Do not treat these findings as all equivalent to user-visible failures.
3. **Shared page structure.** Homepage duplicates navigation/footer logic from SiteLayout. This causes fixes to need multiple implementations. Contact and legal pages also use a different layout.
4. **Accessibility.** Complete keyboard focus and dismissal testing for menus/modals, verify image alternatives, add visible focus treatment to newsletter inputs, and audit contrast across every page. Homepage mobile menu opens and navigates to About successfully.
5. **Content and discoverability.** Facebook points to the generic Facebook homepage. About says three seasons have run while the homepage says Season 3 is upcoming. Confirm the intended facts and social URL. Add page-specific metadata and links to existing policy pages in the main footer.
6. **Consent behavior.** The AdSense script is loaded globally regardless of the banner choice. The current banner records acceptance only; it is not a mechanism for controlling script loading.
7. **Production verification.** Complete a production build, image/performance checks, and authenticated manager/admin workflows. No live registrations, emails, deployment, or production data changes were performed.

## Validation
- `npx tsc --noEmit`: passed after edits.
- `node --test tests/registration.test.cjs`: eight tests passed, using mocked services. Covers invalid/missing/used/mismatched invites, concurrent claim failure, club failure, player failure, and trusted invite values.
- Targeted ESLint on registration, invitation generation, standalone subscription, and cookie banner: passed.
- `git diff --check`: passed.
- Browser: desktop homepage and mobile homepage render; mobile menu opens and About navigation works. Cookie mismatch issue badge no longer appeared following the fix.
- Production build: did not complete during this session and was stopped; production readiness is unverified.
