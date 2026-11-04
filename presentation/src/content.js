export const EVENT = {
  title: 'My Contoso',
  highlight: 'GitHub Copilot workshop',
  eyebrow: 'ACHMEA × MICROSOFT',
  tagline: 'Matt Pocock’s workflow · Karpathy guidelines · Impeccable',
  description: 'Build a policy overview: questions, prototype, specification, tickets, implementation and review.',
  footer: 'ACHMEA × MICROSOFT',
  meta: ['2 hours', 'Live build', 'Work in pairs'],
  scenario: 'My Contoso is a fictional insurance application. All examples use synthetic data.',
}

export const HOME = {
  eyebrow: 'MY CONTOSO / WORKSHOP',
  primary: 'Explore the presentation',
  secondary: 'See the programme',
  indexTitle: 'The workshop flow',
  indexDescription: 'Follow the My Contoso build, then try one of the same skills in an approved repository.',
  sections: ['The example', 'The build', 'Hands-on'],
}

export const AGENDA = [
  { at: '0:00', mins: 10, title: 'Example and setup', detail: 'Policy data and installed skills' },
  { at: '0:10', mins: 55, title: 'Live build', detail: 'Planning, implementation and review' },
  { at: '1:05', mins: 5, title: 'Break', detail: 'Find a partner' },
  { at: '1:10', mins: 35, title: 'Hands-on', detail: 'One change in your repository' },
  { at: '1:45', mins: 15, title: 'Debrief', detail: 'Show the change and its checks' },
]

export const SKILLS = [
  {
    label: 'Workflow', title: 'Matt Pocock',
    text: 'Question the scope, compare layouts, write a spec and split it into testable tickets. Implement one ticket, then review and reflect.',
    code: '/grill-with-docs → /prototype\n/to-spec → /to-tickets\n/implement → /pr → /retro',
  },
  {
    label: 'Working rules', title: 'Karpathy guidelines',
    text: 'Applied through AGENTS.md: state assumptions, keep the solution simple, make surgical changes and verify against success criteria.',
    code: 'karpathy-guidelines\nThink before coding\nSimplicity · Surgical changes\nGoal-driven execution',
  },
  {
    label: 'Product and UI', title: 'Impeccable',
    text: 'Record the users and product constraints. Audit the completed policy page, then polish the scoped findings.',
    code: '/impeccable init → PRODUCT.md\n/impeccable audit\n/impeccable polish',
  },
]

export const PLANNING = [
  {
    title: 'Questions', label: '/grill-with-docs',
    prompt: '/grill-with-docs Grill me on the Policy Overview slice. Start with the open decisions in PRODUCT.md. Don’t write code.',
    artifact: 'GLOSSARY.md + decisions',
    output: 'Shared terms, ADRs and updated product context.',
    example: 'What counts as a running policy? How do we explain missing coverage?',
  },
  {
    title: 'Prototype', label: '/prototype + /handoff',
    prompt: 'Use the prototype skill: three structurally different policy overview layouts, using the synthetic data. Design mobile-first.',
    artifact: 'Three layouts + a choice',
    output: 'Use /handoff to return the layout decision to planning, without copying prototype code into the implementation.',
    example: 'Choose a monthly total at the top and expanded cards for cover, deductible and premium.',
  },
  {
    title: 'Spec', label: '/to-spec',
    prompt: '/to-spec for the Policy Overview slice. Include the layout decision from the handoff.',
    artifact: 'A specification issue',
    output: 'Review the acceptance criteria and proposed test seams before approving the specification.',
    example: 'One selected customer, joined policy and coverage data, and a comparable monthly total.',
  },
  {
    title: 'Tickets', label: '/to-tickets',
    prompt: '/to-tickets for the spec. Make the first ticket an end-to-end overview for a customer whose policies all run and are paid monthly.',
    artifact: 'Small, linked tickets',
    output: 'The first ticket establishes the complete path. Missing coverage and other payment terms follow.',
    example: 'First slice: three monthly-paid policies, totalling €98.40. Keep the missing-coverage case separate.',
  },
]

export const DESIGN = [
  {
    title: 'Audit', label: '/impeccable audit',
    prompt: '/impeccable audit the Policy Overview page. List findings with severity. Mark findings already covered by an open ticket. Don’t change anything.',
    artifact: 'A prioritised findings list',
    output: 'Inspect accessibility, responsiveness and UI integrity against the agreed policy overview.',
    example: 'Check the page at 390px and 1280px. Can a customer understand cover, deductible and premium?',
  },
  {
    title: 'Polish', label: '/impeccable polish',
    prompt: '/impeccable polish the policy overview: fix the P2 and P3 findings. Run tests, type checking and the build; check phone and desktop.',
    artifact: 'A scoped change + a PR',
    output: 'Explain what was fixed and list P0/P1 findings as “must fix before real data”. Do not merge automatically.',
    example: 'Keep the agreed layout and ticket scope. Polish is not permission to redesign the whole app.',
  },
]

export const SOURCE_VIEW = {
  files: [
    { type: 'CSV', title: 'Policy administration', path: 'policy-admin-export.csv', detail: 'Customer, product, dates, payment term and premium.' },
    { type: 'JSON', title: 'Coverage information', path: 'coverage-feed.json', detail: 'Cover, deductible and add-ons.' },
  ],
  join: { label: 'Joined on', key: 'policyNumber' },
  label: 'MY CONTOSO / EXAMPLE RESULT',
  hint: 'Compare the first ticket with the missing-coverage follow-up.',
}

export const POLICY_EXAMPLES = [
  {
    id: 'complete', label: 'Complete information', name: 'Your policy overview',
    premium: '€98.40', term: 'per month',
    summary: 'Three running policies, all paid monthly.',
    policies: ['Car', 'Home contents', 'Liability'],
    state: 'All three policies have matching coverage information.',
  },
  {
    id: 'missing', label: 'Missing information', name: 'Missing coverage record',
    premium: 'Cover unavailable', term: 'not the same as “not covered”',
    summary: 'The policy exists, but its coverage information is absent.',
    policies: ['Home contents / coverage pending'],
    state: 'Keep the policy visible. Never invent insurance cover.',
  },
]

export const GATE_VIEW = {
  label: 'QUALITY-GATE HOOK / SIMULATION',
  checks: [{ id: 'types', label: 'Type checking' }, { id: 'tests', label: 'Behavior tests' }],
  hint: 'Toggle a result. These controls do not run commands.',
  explanation: 'The kit’s hook runs available typecheck and test scripts before recognised commit or PR-creation actions.',
  limitation: 'Illustration only. Hooks complement CI, review and access controls; they are not a security boundary.',
  command: 'Proposed commit',
  passing: 'Required example checks passed. Continue to the normal approval process.',
  failing: 'Fix the failing check before retrying the commit or pull request.',
  followUp: '/pr records the accepted change. /retro proposes improvements to the repo’s guidance, skills or checks.',
}

export const EXERCISE = {
  label: 'CHOOSE A TASK',
  prompt: 'Use an installed, approved skill. If it is unavailable, inspect its guidance with your partner instead of installing unapproved tooling.',
  actionLabel: 'TRY IT ON A SMALL TASK',
  evidenceLabel: 'CHECK THE RESULT',
  completed: 'of 3 checks completed',
  privacy: 'Selections stay in this page. Nothing is submitted or stored.',
  timings: [
    { time: '5 min', title: 'Choose a task', detail: 'Use an approved repository and agree a small scope.' },
    { time: '20 min', title: 'Use the skill', detail: 'Make or propose one change, not a whole feature.' },
    { time: '10 min', title: 'Check and compare', detail: 'Show the result, its checks and one limitation.' },
  ],
  options: [
    {
      id: 'planning', label: 'Matt Pocock', action: 'Clarify a task',
      prompt: '/grill-with-docs Grill me on one small change in this repository. Don’t write code.',
      evidence: ['Resolve one ambiguous requirement', 'Record the decision in the repository', 'Define a testable first ticket'],
    },
    {
      id: 'implementation', label: 'Karpathy', action: 'Make a smaller change',
      prompt: 'Apply karpathy-guidelines to one small task. State assumptions, limit the diff and verify the success criteria.',
      evidence: ['Write down the success criteria', 'Remove changes outside the task’s scope', 'Run the relevant checks'],
    },
    {
      id: 'design', label: 'Impeccable', action: 'Audit one page',
      prompt: '/impeccable audit one customer-facing page. List findings and severity. Don’t change anything yet.',
      evidence: ['Inspect phone and desktop layouts', 'Identify one scoped accessibility or UI issue', 'Propose a fix and how to verify it'],
    },
  ],
}

export const SLIDES = [
  {
    id: 'opening', type: 'title', section: 'The example', eyebrow: EVENT.eyebrow,
    title: EVENT.title, highlight: EVENT.highlight,
    subtitle: EVENT.description,
    takeaway: EVENT.tagline,
  },
  {
    id: 'scenario', type: 'sources', section: 'The example', eyebrow: 'MY CONTOSO / THE TASK',
    title: 'The policy overview',
    subtitle: '“What am I covered for, and what do I pay?” Two data sources, one customer view.',
    takeaway: EVENT.scenario,
  },
  {
    id: 'skills', section: 'The example', eyebrow: 'REPOSITORY SETUP',
    title: 'The skills used in this build',
    subtitle: 'Community tooling installed for this workshop, not built-in Copilot features.',
    cards: SKILLS,
    takeaway: 'L1: AGENTS.md · L2: scoped instructions · L3: skills · L4: design agents · L5: validation hooks.',
  },
  {
    id: 'planning', type: 'flow', section: 'The build', eyebrow: 'MATT POCOCK / PLANNING',
    title: 'From questions to tickets',
    subtitle: 'Select a step to see the prompt, the expected output and the My Contoso example.',
    steps: PLANNING,
    takeaway: 'Keep questions, specification and tickets in one planning context. Use /handoff for the prototype detour.',
  },
  {
    id: 'implement', type: 'brief', section: 'The build', eyebrow: 'MATT POCOCK + KARPATHY GUIDELINES',
    title: 'Implement the first ticket',
    subtitle: 'A fresh session, one end-to-end slice, then human acceptance.',
    brief: {
      prompt: '/implement #<first-ticket>. Keep the app running and give me the acceptance script.',
      context: 'First slice: load one customer’s running, monthly-paid policies. Show cover, deductible, premium and a €98.40 monthly total.',
      label: 'KARPATHY GUIDELINES IN THIS TICKET',
      checks: [
        { title: 'Think before coding', text: 'Confirm “running” and “per month” from the agreed spec.' },
        { title: 'Keep it simple', text: 'Build the monthly case first; leave other payment terms to their tickets.' },
        { title: 'Make surgical changes', text: 'Change the data join and overview, not unrelated app code.' },
        { title: 'Verify the goal', text: 'Work test-first; run acceptance and security-review for data-loading changes.' },
      ],
    },
    takeaway: 'The implement skill works test-first and reviews against the ticket. Approval comes before the commit and PR.',
  },
  {
    id: 'parallel', type: 'brief', section: 'The build', eyebrow: 'FOLLOW-UP TICKET / SEPARATE WORKTREE',
    title: 'Delegate the missing-coverage case',
    subtitle: 'Start after the first ticket is merged, so the follow-up has a working foundation.',
    brief: {
      prompt: '/implement #<missing-information-ticket>. Use the pr skill to open a PR that closes the ticket. Give me the acceptance script.',
      context: 'Use a separate session and worktree. The policy is present, but its matching coverage record is missing.',
      label: 'ACCEPTANCE FOR THIS TICKET',
      checks: [
        { title: 'Keep the policy', text: 'A missing coverage record must not remove the policy from the overview.' },
        { title: 'Explain the unknown', text: 'Show “cover unavailable”, not “not covered”. Never invent coverage.' },
        { title: 'Review the result', text: 'Try the acceptance script and inspect the PR before merging.' },
      ],
    },
    takeaway: 'A separate agent delivers a bounded ticket; the product decision and merge remain human.',
  },
  {
    id: 'design', type: 'flow', section: 'The build', eyebrow: 'IMPECCABLE / COMPLETED POLICY PAGE',
    title: 'Audit and polish the page',
    subtitle: 'Product context from /impeccable init is in PRODUCT.md. Review the implemented page against it.',
    steps: DESIGN,
    takeaway: 'The UI rules also call for the accessibility skill and WCAG 2.2 AA. This remains a synthetic-data demo.',
  },
  {
    id: 'gate', type: 'gate', section: 'The build', eyebrow: 'VALIDATION / PULL REQUEST / RETROSPECTIVE',
    title: 'Checks before the commit',
    subtitle: 'Try the quality-gate simulation. No commands run here.',
    takeaway: GATE_VIEW.followUp,
  },
  {
    id: 'exercise', type: 'exercise', section: 'Hands-on', eyebrow: '35 MINUTES / IN PAIRS / AFTER THE BREAK',
    title: 'Try one repository change',
    subtitle: 'Choose a task using the same tooling as the My Contoso build.',
    takeaway: 'Use approved repositories, synthetic examples and your organisation’s existing policies.',
  },
  {
    id: 'debrief', section: 'Hands-on', eyebrow: '15 MINUTES / SHARE THE RESULT',
    title: 'Debrief',
    subtitle: 'Show the work and the evidence, not just a new file.',
    cards: [
      { label: 'The task', title: 'What changed?', text: 'Name the skill, the task and the repository change you made or proposed.' },
      { label: 'The check', title: 'How did you verify it?', text: 'Show a resolved question, a focused test, an acceptance step or a UI finding.' },
      { label: 'The follow-up', title: 'What is still missing?', text: 'Name one limitation and the next ticket, instruction or check the repository needs.' },
    ],
    takeaway: 'Use /retro to turn a repeated problem into a specific improvement to guidance, skills or checks.',
  },
]
