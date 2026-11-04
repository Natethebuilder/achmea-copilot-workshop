# Achmea Copilot workshop: My Contoso

This is the facilitator kit for a 2-hour GitHub Copilot workshop with Achmea. In the live demo, agents build the first slice of My Contoso, a customer-facing insurance app for the fictional insurer Contoso Insurance. Along the way, the project repo climbs Achmea's AI-readiness ladder from L0 to L5: same result, less in the prompt, more in the repo.

## What's here

| Path | What it is |
| --- | --- |
| [`guide.md`](guide.md) | The step-by-step guide: Steps 1–11 before the session, a 45-minute live demo (Steps 12–22), and an optional wayfinder step. It keeps the Total Rewards guide's structure and prompt shapes, retargeted to My Contoso. |
| [`presentation/`](presentation/) | The customer-facing Achmea event presentation: 19 slides with interactive readiness, data, workflow, validation and next-step explorers. |
| `kit/data/` | The two prepared data sources that Step 6 copies into the project. |
| `kit/scripts/` | The seeded generator for that data, and its test. |
| `kit/.github/hooks/` | The quality gate (L5) that Step 6 copies into the project. |
| `tests/` | Tests for the quality gate. |

Keep this repo separate from the project repo you create in Step 1.

## Event presentation

The customer-facing **Achmea × Microsoft** presentation combines a warm off-white and teal editorial style with the My Contoso scenario and the L0–L5 readiness model. It follows the two-hour agenda below. The delivered site and slides contain audience-facing material only: no facilitator notes, rehearsal instructions, fallback branches, private repository links, internal scan figures, rankings or source attachments.

```powershell
npm ci --prefix .\presentation
npm run dev --prefix .\presentation
```

Open `http://127.0.0.1:5217/achmea-copilot-workshop/` for the overview, or append `#/deck` to present. Use the arrow keys or on-screen arrows to navigate and **All slides** to jump. The index also deep-links to individual slides. Interactive examples explore readiness levels, complete/missing coverage data, delivery responsibilities, required quality checks and a next-step checklist. Checklist selections remain in page memory only: nothing is submitted or saved.

Edit audience-facing copy and slide order in `presentation/src/content.js`; edit the visual components in `presentation/src/slides/Slides.jsx`. Keep facilitator instructions in this README and `guide.md`, outside the presentation package. Run `npm run build --prefix .\presentation` to create the static output in `presentation/dist/`, or `npm run preview --prefix .\presentation -- --port 5217 --strictPort` to preview a build. Distribute only `presentation/dist/`, not the facilitator repository.

The [event website](https://natethebuilder.github.io/achmea-copilot-workshop/) and [interactive deck](https://natethebuilder.github.io/achmea-copilot-workshop/#/deck) are hosted on GitHub Pages. `.github/workflows/deploy-presentation.yml` runs the browser and customer-disclosure checks before publishing **only** `presentation/dist/`. Presentation changes pushed to `main` or the initial `natethebuilder-achmea-event-presentation` branch redeploy the site. The repository itself is public; the narrower customer-facing Pages site does not include this facilitator guide or source attachments.

The presentation's browser checks run separately from the kit's Vitest tests: `npm exec --prefix .\presentation -- playwright install chromium` (first run only), then `npm test --prefix .\presentation`. They check navigation, interactions, all 19 slides at desktop and 320px phone widths, and the absence of backstage content and private links in production assets, using a temporary production preview on port 5218.

```
npm install
npm run generate:data   # regenerates kit/data; the output stays identical while @faker-js/faker is 10.6.0
npm test                # checks the data and the quality gate
npm run typecheck
```

## Agenda (2 hours)

| Time | Block |
| --- | --- |
| 0:00 | **Opening** (10 min): Achmea's ladder, and today's outcome, a customer-facing insurance app. |
| 0:10 | **Live demo** (55 min): Steps 12–22 take 45 minutes, plus 10 minutes of buffer. Steps 1–11 are done before the session. |
| 1:05 | **Break** (5 min) |
| 1:10 | **Hands-on** (35 min): as Achmea's deck says, every team can move one level higher. Pairs place one of their own repos on the ladder and add the next level, using the matching guide step as a template. Pairs without a suitable repo join another pair. |
| 1:45 | **Debrief** (15 min): what each pair added, what blocks their next level, and which repos could become reference implementations. |

## Achmea's ladder in this repo

| Level | On Achmea's ladder | In My Contoso | Step |
| --- | --- | --- | --- |
| L0 | No context | A repo with only a README | 1 |
| L1 | Global guidance | `AGENTS.md`: where specs and tickets go, and the working rules | 3, 4 |
| L2 | Scoped guidance | `.github/instructions/`: UI rules for `src/**/*.tsx`, and data rules for `data/` and `scripts/` | 4 |
| L3 | Reusable capabilities | `.agents/skills/` (Matt Pocock's flow, the Karpathy guidelines and accessibility) and `.github/skills/impeccable/` | 2 |
| L4 | Specialized agents | Impeccable's agents in `.github/agents/`, the built-in code-review and security-review agents, and the Autopilot agent that delivers a ticket on its own | 2, 18, 19 |
| L5 | Controlled workflow | `.github/hooks/`: Impeccable's design check after UI edits, and the quality gate that blocks commits and PRs while checks fail | 2, 6 |

The demo also covers the deck's three domains: code (skills and `implement`), test (test-first tickets and the quality gate) and security (the privacy rule and the security-review agent).


## Facilitator checklist

A week before:

- [ ] On an Achmea laptop on Achmea's network, do Steps 1–8 in a throwaway copy of the project, for example `my-contoso-rehearsal`. This checks that `npx` reaches the npm registry or Achmea's mirror, and that Impeccable can download its engine from GitHub releases. If it can't, set `IMPECCABLE_BIN` as a user environment variable that points to a preinstalled engine. It also checks that Achmea's Copilot policies allow the GitHub Copilot App, the CLI, MCP servers and the models you plan to use.
- [ ] Rehearse Steps 9–22 in that copy. Push `stage/1-first-ticket` after Step 18 and `stage/2-missing-information` after Step 19.
- [ ] In the rehearsal, make a test fail and ask the agent to commit. The quality gate should block the commit and show the failing test. Then revert the change.

The day before:

- [ ] Do Steps 1–11 in the live repo on the presenting laptop. The suggested answers below keep the grill short.
- [ ] In a new session, type `/` and check that `grill-with-docs` and `impeccable` are listed. If Impeccable reports problems, run `/impeccable doctor`.
- [ ] Leave the Prototype session's dev server running on port 5176, with `npm run typecheck` and `npm test` passing in its worktree.

On the day:

- [ ] Port 5174 is free.
- [ ] Start Steps 18 and 19 in new sessions from main, and start Step 19 only after the Step 18 PR is merged.
- [ ] If Step 18 runs more than 5 minutes over, switch to `stage/1-first-ticket` in the rehearsal repo and continue there.
- [ ] Only synthetic data and the Contoso brand appear on screen.

## The kit

### Data

`kit/scripts/generate-data.ts` generates both files from a fixed seed, as of 30 September 2026: 50 customers, 127 policies (123 of them running) and 126 cover records. All names and values are fake.

- `policy-admin-export.csv` has one row per policy, with the columns `policyNumber`, `customerId`, `firstName`, `lastName`, `product`, `startDate`, `endDate`, `paymentTerm` and `premium`. The premium is what's charged each payment term, in euros, including insurance premium tax. Yearly payers get 3% off. `endDate` is the last day of cover, and is empty while the policy runs on.
- `coverage-feed.json` has one record for every policy except P100109, with `policyNumber`, `cover`, `deductible` (whole euros; 0 means none) and `addOns` (included in the premium).

Products: car (30), home contents (30), liability (28), home building (16), travel (15) and legal aid (8). Payment terms: monthly (87), yearly (29) and quarterly (11).

The generator pins these customers. Its test checks the ones the guide depends on: C1001, C1002, C1033 and C1042.

| Customer | Name | What's special | Used for |
| --- | --- | --- | --- |
| C1001 | Benthe Kuypers | Car and home contents paid monthly, liability and travel paid yearly, a €0 deductible and add-ons. About €96.11 per month. | The prototype (Step 11) |
| C1002 | Lucie den Adel | Car, home contents and liability, all running and paid monthly: €98.40 per month. | The first ticket (Step 17) |
| C1004 | Jara de Haan | Pays quarterly. | Payment terms |
| C1007 | Maeve van Iersel | Home contents starts on 1 November 2026. | Starts later |
| C1012 | Diede van Doorn | Car cancelled, with cover until 31 December 2026. Travel ended on 30 April 2026. | Ending and ended |
| C1019 | Anne-Marie van der Veldhuizen-Kortenhoeven | A long name. | Layout |
| C1033 | Nikki Jansen | Both policies ended on 30 June 2026. | No running policies |
| C1042 | Puk Kuijpers | Home contents policy P100109 has no cover record. | Missing information (Step 19) |

### Quality gate

`kit/.github/hooks/quality-gate.json` runs `quality-gate.mjs` before every shell command and every `create_pull_request` call. When the call is a `git commit` (including forms such as `git -C . commit` and `git --no-pager commit --amend`), a `gh pr create` or a `create_pull_request`, the gate runs the project's `typecheck` and `test` scripts, whichever exist, for up to 50 seconds each. If one fails or runs longer, the gate denies the call and shows the last 20 lines of output. Otherwise it prints nothing, and the normal permission flow continues.

- Pushes and merges aren't gated, because they only move commits that already passed.
- Hooks load when a session starts, so the gate applies from the first session after Step 6.
- It's a guardrail for agents, not a security boundary, so CI should still run the same checks. It doesn't recognize `git -C "a path with spaces" commit`, and if the whole hook runs longer than 120 seconds, the call goes through.
- Natural next guardrails, from the L5 examples in Achmea's deck: lint before completion, a vulnerability scan such as `npm audit` when dependencies change, and secret checks such as secret scanning with push protection.

## Decisions and assumptions

- **Fictional brand.** The insurer is Contoso Insurance and the app is My Contoso. No Achmea brand (Centraal Beheer, Interpolis, Zilveren Kruis or FBTO) and no real customer data appears anywhere.
- **First slice: the Policy Overview.** Like the Total Rewards Statement, it shows one person's view, built from two sources that can disagree, so every prompt keeps its shape.
- **English in plain language (B1).** This matches the guide and its prompts. To build the app in Dutch, change the Voice line in Step 7.
- **Dutch non-life products** (car, home contents, home building, liability, travel and legal aid) with three payment terms, because they create the edge cases worth grilling.
- **Skills.** Impeccable stays in `.github/skills/`, because its hook runs the engine from that path. The other skills go to `.agents/skills/`. The `accessibility` skill from addyosmani/web-quality-skills adds WCAG 2.2 AA checks. Vercel's `web-design-guidelines` isn't included, because it downloads its rules every time it runs.
- **Private repo**, because it's prepared for one customer and builds on their internal deck.
