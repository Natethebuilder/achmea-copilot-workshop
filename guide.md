# My Contoso with GitHub Copilot: step-by-step guide

Follows Matt Pocock's main flow: grill → (prototype detour) → spec → tickets → implement per ticket → PR → retro. Impeccable's audit and polish come before the final PR.

The outcome is a customer-facing insurance app: My Contoso, where customers of the fictional insurer Contoso Insurance see what they're covered for and what they pay. Tags such as (L2) show where a step moves the repo up Achmea's AI-readiness ladder: L1 global guidance, L2 scoped guidance, L3 skills, L4 specialized agents, and L5 hooks and guardrails.

## Preparation (before the session)

### Step 1: Add the project
_Why:_ every agent session runs in its own isolated worktree, so parallel work never clashes. The repo starts with no context at all (L0).
Create a private repo with only a README, for example with `gh repo create my-contoso --private --add-readme`. Open the GitHub Copilot App and add the project `<your account>/my-contoso`. Start a new session in Autopilot mode.

### Step 2: Install skills
_Why:_ skills package engineering habits as files in the repo, so every teammate's agent works the same way (L3). Impeccable also adds design agents (L4) and a design hook (L5), and the accessibility skill checks the UI against WCAG 2.2 AA.
```
Install the agent skills for this repo for GitHub Copilot, with no interactive prompts:

1. `npx -y skills@latest add mattpocock/skills -a github-copilot --copy -y -s ask-matt grilling grill-with-docs domain-modeling prototype handoff to-spec to-tickets implement tdd code-review codebase-design pr retro writing-for-agents diagnosing-bugs research wayfinder setup-matt-pocock-skills`
2. `npx -y skills@latest add multica-ai/andrej-karpathy-skills -a github-copilot --copy -y -s karpathy-guidelines`
3. `npx -y impeccable@latest install --providers=github --scope=project -y`. If it reports that there is no windows-arm64 binary, set `IMPECCABLE_BIN` to the x64 engine from `npm pack @impeccable/cli-windows-x64` (it runs under emulation) and run it again.
4. `npx -y skills@latest add addyosmani/web-quality-skills -a github-copilot --copy -y -s accessibility`

Then:
- Add `.github/skills/impeccable/scripts/bin/` to `.gitignore`.
- In `.github/hooks/impeccable.json`, add a `powershell` command next to the `bash` command and set `timeoutSec` to 30. Use this command: `$r = git rev-parse --show-toplevel; $l = Join-Path $r '.github/skills/impeccable/scripts/impeccable.cmd'; if (Test-Path $l) { $input | & $l hook }`
- Check that every skill folder has a SKILL.md and that the hook file is valid JSON.
- Commit with the message `chore: add agent skills` and push.
```

### Step 3: Configure the skills
_Why:_ tells the skills where specs and tickets go, so planning becomes visible, linkable work.
```
/setup-matt-pocock-skills

My answers: issue tracker = GitHub Issues for this repo; keep the default triage labels; single context; create AGENTS.md.

Also create these GitHub labels if they don't exist yet: ready-for-agent, ready-for-human, needs-triage, needs-info, wontfix.

Then commit with the message `chore: configure agent skills` and push.
```

### Step 4: Working rules
_Why:_ AGENTS.md is loaded into every session, so these rules apply without repeating them (L1). Scoped instruction files load only when the agent works on matching files, so the UI and data rules stay out of other work (L2).
```
Add a `## Working rules` section to AGENTS.md. Keep it short and use these rules:

- Always follow the `karpathy-guidelines` skill: think before coding, keep it simple, change only what's needed, and define success criteria, then verify them.
- The app runs at http://localhost:5174 (Vite `strictPort`). Parallel sessions check their work on port 5176 with `npm run dev -- --port 5176`.
- Build one vertical slice (one ticket) at a time. After each slice, run tests, type checking and the build, then check the page in the browser at 390px and 1280px wide. Finally, give the human a 3–5 step acceptance script. In interactive mode, wait for their approval before committing.
- Use Tailwind CSS only, with no other UI libraries. Follow PRODUCT.md and DESIGN.md when they exist.
- Don't add dependencies without asking first.
- Use synthetic data only. Never use real personal data.
- A customer may only ever see their own policies. When a change loads customer data or sends it to the browser, run the security-review agent before you give the acceptance script, and fix what it finds.
- Reviews and audits judge the work against its ticket. If a finding is already covered by another open ticket, list it with that ticket's number instead of fixing it.
- If a prompt starts with `/<name>` and that skill isn't loaded, read `.agents/skills/<name>/SKILL.md` or `.github/skills/<name>/SKILL.md` and follow it.
- Never skip or work around the hooks in `.github/hooks/`, and change them only when the human asks. If the quality gate blocks a commit, fix what fails.

Then add two scoped instruction files:
- `.github/instructions/ui.instructions.md` with `applyTo: "src/**/*.tsx"`: write for customers in plain language (B1), use the terms in GLOSSARY.md when it exists, and explain insurance terms such as deductible where they appear. Design mobile-first. Meet WCAG 2.2 AA and check it with the `accessibility` skill. Fix what the Impeccable hook reports before you finish.
- `.github/instructions/data.instructions.md` with `applyTo: "data/**,scripts/**"`: never edit `data/` by hand; change `scripts/generate-data.ts` and run `npm run generate:data` instead. Keep all data synthetic, with no BSN, IBAN, email address, phone number or street address. Pin each new edge case in the generator and its test.

Commit with the message `docs: add working rules`, then push.
```

### Step 5: Scaffold the app
_Why:_ a tested shell on a fixed port gives agents a reliable feedback loop from the first minute.
```
Scaffold the web app in the repo root. You may add these dependencies for this step:

- Vite + React + TypeScript (the official react-ts template, latest versions), merged into this repo without prompts. Keep the existing files. If the template includes a linter, make it ignore `.agents/` and `.github/`.
- Tailwind CSS 4 through `@tailwindcss/vite`.
- Vitest. Make `npm test` run `vitest run --passWithNoTests`, and add an `npm run typecheck` script.
- In `vite.config.ts`, set the dev server to port 5174 with `strictPort: true`.
- Replace the template demo with a minimal, mobile-first app shell: a header with the product name "My Contoso" and the fictional insurer "Contoso Insurance", plus an empty main area that says "Policy overview coming soon". Remove unused template assets and CSS.

Run `npm test`, `npm run typecheck` and `npm run build`, and confirm that all three pass. Commit with the message `feat: scaffold app shell` and push.
```

### Step 6: Add the prepared data sources
_Why:_ the data exists before the session, as it would in a real hackathon, so generating it doesn't use demo time. The quality gate blocks every commit and PR while type checking or tests fail, whatever the prompt says (L5).
Copy the kit's `data/` folder (`policy-admin-export.csv`, `coverage-feed.json`), `scripts/` folder (`generate-data.ts`, `generate-data.test.ts`) and the two files in its `.github/hooks/` folder (`quality-gate.json`, `quality-gate.mjs`) to the same paths in the repo, then:
```
Wire up the prepared mock data. Add `"generate:data": "tsx scripts/generate-data.ts"` to the package.json scripts, and add `@faker-js/faker` (exactly version 10.6.0) and `tsx` as dev dependencies. Run `npm run generate:data` and confirm the files in `data/` are unchanged. Run `npm test`, and check that `.github/hooks/quality-gate.json` is valid JSON. Commit with the message `feat: add prepared mock data sources and quality gate` and push.
```

### Step 7: Product context
_Why:_ Impeccable designs from who the users are and what the product is for, and its hook checks every UI edit.
```
/impeccable init

Product facts, so you don't need to ask:
- Primary users: Contoso Insurance customers viewing their own policies in My Contoso. Secondary users: Contoso customer service staff, who see the same page when they help a customer on the phone.
- Purpose: answer "what am I covered for, and what do I pay?": each policy's cover, deductible and premium, plus the total premium per month. Success means a customer understands their insurance in under a minute, and customer service can answer questions about it without switching systems.
- Context: a customer-facing web app, designed mobile-first. There's no sign-in yet, so the demo picks the customer with `?customer=C1001`. Data is synthetic and comes from `data/policy-admin-export.csv` and `data/coverage-feed.json`.
- Privacy: a customer only ever sees their own policies, and the browser never receives another customer's data.
- Stack: the existing React, TypeScript and Tailwind 4 app.
- Voice: clear, reassuring and honest, in plain language (B1) with no insurance jargon. Explain terms such as deductible.
- Accessibility: WCAG 2.2 AA.
- Build path: code-first. Skip live mode setup.

Write PRODUCT.md, then commit with the message `docs: add product context` and push.
```

### Step 8: Merge the foundation
_Why:_ every later session starts from `main`, and the stage branch is a fallback if the demo goes wrong.
```
Open a PR from this branch to main titled "Foundation: agent skills, working rules, app shell, data and product context", then merge it with a merge commit. Create the branch `stage/0-foundation` from the updated main and push it.
```
Rehearse Steps 9–22 in a throwaway copy of this repo first, and push `stage/1-first-ticket` and `stage/2-missing-information` there, so you can show those results if a live step overruns.

### Step 9: Grill the slice (new "Plan" session from main, Interactive)
_Why:_ misalignment is the most common way agents fail, so the agent interviews us first and records shared terms and decisions. Keep this session open through tickets, so grill, spec and tickets share one context.
Check that the session is Interactive, because in Autopilot the agent answers its own questions. Type `/` and check that `grill-with-docs` and `impeccable` are listed.
```
/grill-with-docs We're building the first slice of My Contoso: a customer's Policy Overview, built from `data/policy-admin-export.csv` and `data/coverage-feed.json`. Grill me on the decisions this slice needs, starting with the open decisions in PRODUCT.md. Don't write code. When we're done, commit GLOSSARY.md, the ADRs and PRODUCT.md, open a PR to main and merge it.
```
Then answer each round until the agent says there are no open questions. The README has suggested answers.

### Step 10: Hand off the layout question (Plan session)
_Why:_ "what should it look like?" needs something you can see, so it's a detour into its own session, which keeps the planning context clean.
```
/handoff Prototype the policy overview page layout in a separate session, then bring the decision back here.
```

### Step 11: Prepare the layout options (new "Prototype" session from main, Interactive)
_Why:_ three real layouts with real data settle the design faster than discussion.
```
Read the handoff document created with the previous prompt. Use the prototype skill for the policy overview page: 3 structurally different layouts on the real page, switched with `?variant=`, showing C1001's real data, designed mobile-first. Run the dev server on port 5176, keep it running, and give me the URLs.
```
Before the session, ask it to run `npm run typecheck` and `npm test` and fix any failures, because the quality gate blocks the Step 14 commit if they fail.

## Live demo (45 minutes)

### Step 12: Review the data sources (2 min, Plan session)
_Why:_ the data was prepared in advance, so we review it live to show what the agents build on, then move on.
```
Give me a short overview of the two data sources in `data/`: what each one holds, the main columns, how many customers and policies, which products and payment terms, which policies have ended or start later, and which policies are missing from the coverage feed. Don't change anything.
```

### Step 13: Where we are (3 min)
_Why:_ shows the audience the agreed language and decisions before any code, and how much of the work now lives in the repo instead of in prompts.
Show the grill rounds in the Plan session, `GLOSSARY.md` and the ADRs. Then walk up the ladder in the repo: `AGENTS.md` (L1), `.github/instructions/` (L2), `.agents/skills/` and `.github/skills/` (L3), `.github/agents/` (L4) and `.github/hooks/` (L5). Finish with the three layouts at http://localhost:5176/?variant=A, B and C, in a phone-sized window.

### Step 14: Choose the design (2 min, Prototype session)
_Why:_ the person who owns the product makes the call, and the variants are kept as evidence.
```
I choose A's top section with C's policy cards below it, always expanded, because the top answers "what am I covered for, and what do I pay?" in seconds, and the cards show every policy's cover, deductible and premium without tapping. Commit the three variants to a branch called `prototype/policy-overview-layouts`, push it, and stop the dev server.
```
Change the letters and the reasons to match the layouts you got.

### Step 15: Bring the decision back (1 min, Prototype session)
_Why:_ the handoff carries the decision to the Plan session without its prototype code.
```
/handoff The Plan session writes the spec with this layout decision.
```

### Step 16: Spec (5 min, Plan session)
_Why:_ `to-spec` turns the conversation into a durable spec issue with agreed test seams.
```
/to-spec for the Policy Overview slice. Include the layout decision from the handoff document at <path from step 15>.
```
Then review the proposed test seams and approve them, or push back.

### Step 17: Tickets (4 min, Plan session)
_Why:_ thin vertical slices with blocking links can be built and checked one at a time, and the rest can run in parallel.
```
/to-tickets for the spec. Make the first ticket the thinnest end-to-end policy overview for a customer whose policies all run and are paid monthly, such as C1002, so later tickets can run in parallel.
```
Then review the breakdown and approve it, or ask for changes.

### Step 18: Build the first ticket (15 min, new "Build" session from main, Interactive)
_Why:_ each ticket gets a fresh context. `implement` works test-first at the agreed seams and runs its own code review, and the quality gate blocks the commit if type checking or tests fail (L5).
```
/implement #<first ticket>. Keep the dev server running and give me the acceptance script.
```
Then run the acceptance script and reply:
```
Approved. Commit, use the pr skill to open a PR that closes the ticket, and merge it.
```
If the quality gate blocks a commit, show the audience its reason: that's L5 at work.

### Step 19: Parallel ticket (new "Parallel" session from main, Autopilot)
_Why:_ once ticket 1 is on main, the tickets it blocked are free, so a second agent picks one up in its own worktree and delivers it on its own (L4).
```
/implement #<missing information ticket>. Check your work in the browser on port 5176. When you're done, use the pr skill to open a PR that closes the ticket, and give me the acceptance script.
```
Review the PR when it's ready, run its acceptance script, and merge it.

### Step 20: Design audit (3 min, Build session)
_Why:_ the audit checks the feature for accessibility, responsiveness and integrity, and documents what to fix, apart from what open tickets already cover.
```
/impeccable audit the Policy Overview page on the latest main (pull it first). List the findings with severity, and mark each finding that an open ticket already covers with that ticket's number. Don't change anything.
```

### Step 21: Design polish and PR (7 min, Build session)
_Why:_ polish is the final pass on a complete feature, and the PR states what still blocks real data.
```
/impeccable polish the policy overview page: fix the P2 and P3 findings. Run tests, type checking and the build, and check the page at 390px and 1280px. Commit, then use the pr skill to open a PR. List each P0 and P1 finding in the PR as "must fix before real data", and don't merge it.
```

### Step 22: Retrospective (3 min, Build session)
_Why:_ `retro` turns what went wrong into environment changes (checks, standards, pointers), so the next build starts better: less in the prompt, more in the repo.
```
/retro
```

## Optional: plan the whole workshop program

### When the whole system is foggy, use wayfinder (new session from main)
_Why:_ wayfinder is Matt's on-ramp for efforts too big and unclear for one session. It maps decision tickets, not features, and joins the main flow at `/to-spec`.
```
/wayfinder Chart the map for My Contoso v1, beyond the policy overview slice. Destination: a v1 spec that teams can split into parallel tickets. Keep the map in GitHub Issues only.
```
Then work the map with `/wayfinder <map URL>`, one ticket per session. The last ticket runs `/to-spec`. Before the teams split the work, run `/impeccable document` on main, so every team builds from the same DESIGN.md.
