export const EVENT = {
  title: 'Build with agents.',
  highlight: 'Deliver with confidence.',
  eyebrow: 'ACHMEA × MICROSOFT',
  tagline: 'Less in the prompt. More in the repo.',
  description: 'A hands-on journey from repository context to a working insurance experience.',
  footer: 'ACHMEA × MICROSOFT',
  meta: ['2-hour workshop', 'Live walkthrough', 'Hands-on exploration'],
  scenario: 'My Contoso is a fictional insurance application. All examples use synthetic data.',
}

export const HOME = {
  eyebrow: 'FROM CONTEXT TO CONFIDENCE',
  primary: 'Explore the presentation',
  secondary: 'See the programme',
  indexTitle: 'A practical path to agentic delivery.',
  indexDescription: 'Explore the ideas, follow the workflow, and choose one improvement for your team.',
  sections: ['The foundation', 'The workflow', 'Your next step'],
}

export const LEVELS = [
  {
    level: 'L0', title: 'No explicit context', file: 'A repository without agent guidance',
    detail: 'The agent must infer the purpose, structure, commands and conventions.',
    next: 'Create a shared starting point.',
    action: 'Add repository guidance',
    example: 'Document the project’s purpose, key folders, working commands and non-negotiable rules.',
    evidence: ['Describe the purpose and structure', 'Document the checks that must pass', 'Try a fresh session without repeating the rules'],
  },
  {
    level: 'L1', title: 'Repository guidance', file: 'AGENTS.md',
    detail: 'Every session can start from the same project context and working rules.',
    next: 'Put specific rules where they apply.',
    action: 'Add scoped instructions',
    example: 'Separate customer-facing UI rules from data-processing conventions.',
    evidence: ['Choose one area with distinct conventions', 'Write concise, file-scoped instructions', 'Check that a task in that area follows them'],
  },
  {
    level: 'L2', title: 'Scoped instructions', file: '.github/instructions/',
    detail: 'UI, data, tests and infrastructure get relevant guidance without overloading every task.',
    next: 'Package a task your team repeats.',
    action: 'Create one reusable skill',
    example: 'Capture the steps and acceptance criteria for a recurring review or implementation task.',
    evidence: ['Choose a recurring task', 'Define its inputs, steps and expected result', 'Use the skill on a small real example'],
  },
  {
    level: 'L3', title: 'Reusable skills', file: 'Skills and repeatable workflows',
    detail: 'Common engineering tasks become consistent, reusable capabilities.',
    next: 'Give a recurring role a clear contract.',
    action: 'Introduce a specialist agent',
    example: 'Give a review agent a narrow scope, explicit criteria and a clear handoff.',
    evidence: ['Define a bounded specialist role', 'Specify its output and handoff', 'Review the result against the same criteria'],
  },
  {
    level: 'L4', title: 'Specialist agents', file: 'Purpose-specific implementation and review roles',
    detail: 'Agents collaborate on bounded tasks while people retain decisions and acceptance.',
    next: 'Add feedback that can stop an invalid action.',
    action: 'Add a validation hook',
    example: 'Run the project’s tests and type checking before a recognised commit or pull-request action.',
    evidence: ['Choose a useful validation boundary', 'Configure a check using approved tooling', 'Show a failing check stopping the intended action'],
  },
  {
    level: 'L5', title: 'Controlled workflows', file: 'Hooks, automated validation and guardrails',
    detail: 'Repeatable checks support a safer workflow alongside CI, reviews and access controls.',
    next: 'Make a proven pattern reusable by another team.',
    action: 'Share a reference pattern',
    example: 'Document a working example, including what it checks and where its limits are.',
    evidence: ['Choose a pattern with observed value', 'Explain its prerequisites and limits', 'Have another team try it and give feedback'],
  },
]

export const AGENDA = [
  { at: '0:00', mins: 10, title: 'The foundation', detail: 'Context, readiness and today’s outcome' },
  { at: '0:10', mins: 55, title: 'The live journey', detail: 'From product intent to a verified slice' },
  { at: '1:05', mins: 5, title: 'A short break', detail: 'Pause and find a partner' },
  { at: '1:10', mins: 35, title: 'Your next step', detail: 'Improve one repository together' },
  { at: '1:45', mins: 15, title: 'Share and reflect', detail: 'Show the evidence; choose what follows' },
]

export const WORKFLOW = [
  {
    title: 'Align', label: 'Make intent explicit',
    result: 'A shared understanding of the customer problem.',
    human: 'Decide what the customer needs and resolve ambiguities.',
    agent: 'Surface questions, inspect the domain and compare possible approaches.',
    evidence: 'Shared terms, recorded decisions and a chosen layout.',
  },
  {
    title: 'Plan', label: 'Define a small success',
    result: 'A specification and testable, end-to-end tickets.',
    human: 'Agree the scope and the behaviors that demonstrate success.',
    agent: 'Turn decisions into a specification and dependency-aware tickets.',
    evidence: 'Acceptance criteria, test seams and a first vertical slice.',
  },
  {
    title: 'Build', label: 'Implement one slice',
    result: 'A working change with a focused feedback loop.',
    human: 'Answer product questions and keep the task bounded.',
    agent: 'Implement test-first, run checks and review against the ticket.',
    evidence: 'A running feature, tests and a clear acceptance script.',
  },
  {
    title: 'Verify', label: 'Inspect the evidence',
    result: 'An informed human acceptance decision.',
    human: 'Try the customer journey, review the change and decide whether to accept it.',
    agent: 'Check behavior, accessibility, responsiveness and data boundaries.',
    evidence: 'Check results, review findings and a scoped pull request.',
  },
  {
    title: 'Improve', label: 'Make the next run better',
    result: 'A better repository, not just another completed ticket.',
    human: 'Choose which lessons are durable enough to standardise.',
    agent: 'Suggest targeted improvements to guidance, skills or validation.',
    evidence: 'One useful change that the next session can rely on.',
  },
]

export const SOURCE_VIEW = {
  files: [
    { type: 'CSV', title: 'Policy administration', path: 'policy-admin-export.csv', detail: 'Customer, product, dates, payment term and premium.' },
    { type: 'JSON', title: 'Coverage information', path: 'coverage-feed.json', detail: 'Cover, deductible and add-ons.' },
  ],
  join: { label: 'Connected by', key: 'policyNumber' },
  label: 'MY CONTOSO / ILLUSTRATIVE CUSTOMER VIEW',
  hint: 'Choose a scenario to explore how the same data model handles uncertainty.',
}

export const POLICY_EXAMPLES = [
  {
    id: 'complete', label: 'Complete information', name: 'Your policy overview',
    premium: '€98.40', term: 'per month',
    summary: 'Three running policies, all paid monthly. One clear view of cover and cost.',
    policies: ['Car', 'Home contents', 'Liability'],
    state: 'All three policies have matching coverage information.',
  },
  {
    id: 'missing', label: 'Missing information', name: 'Be clear about what is unknown',
    premium: 'Cover unavailable', term: 'not the same as “not covered”',
    summary: 'A home contents policy is present, but its coverage information has not arrived.',
    policies: ['Home contents / coverage pending'],
    state: 'Show an honest missing-information state. Never invent insurance cover.',
  },
]

export const TICKET_VIEW = {
  spec: { command: 'THE SPECIFICATION', title: 'Policy overview', detail: 'One customer question, explicit data rules and agreed acceptance criteria.' },
  first: { command: 'FIRST VERTICAL SLICE', title: 'A complete monthly view', detail: 'Read two sources, select one customer and show their policies and monthly total.', label: 'Deliver and verify the whole path first' },
  next: [
    { title: 'Missing information', detail: 'An honest state when a coverage record is absent.' },
    { title: 'More policy journeys', detail: 'Other payment terms, dates and policy states.' },
  ],
}

export const GATE_VIEW = {
  label: 'TRY THE FEEDBACK LOOP',
  checks: [{ id: 'types', label: 'Type checking' }, { id: 'tests', label: 'Behavior tests' }],
  hint: 'Toggle a check to see how this example responds.',
  explanation: 'A configured validation hook can stop a recognised commit or pull-request action when a required check fails.',
  limitation: 'Illustration only. Repository configuration determines the checks; hooks complement CI and access controls.',
  command: 'Proposed commit',
  passing: 'Required checks passed. Continue to the normal approval process.',
  failing: 'Resolve the failing check before continuing.',
}

export const EXERCISE = {
  label: 'WHERE IS YOUR REPOSITORY TODAY?',
  prompt: 'Select a starting point. Use the suggested action as a conversation starter, not a score.',
  actionLabel: 'YOUR NEXT PRACTICAL MOVE',
  evidenceLabel: 'MAKE THE RESULT OBSERVABLE',
  completed: 'of 3 evidence steps explored',
  privacy: 'Selections stay in this page. Nothing is submitted or stored.',
  timings: [
    { time: '5 min', title: 'Find the starting point', detail: 'Inspect one approved repository with a partner.' },
    { time: '20 min', title: 'Make one useful change', detail: 'Choose a capability that helps a real task.' },
    { time: '10 min', title: 'Show the difference', detail: 'Try it, inspect the evidence and name the next blocker.' },
  ],
}

export const HERO = {
  eyebrow: 'THE AGENTIC DELIVERY LOOP',
  steps: [
    { title: 'Human intent', detail: 'A clear customer outcome' },
    { title: 'Repository context', detail: 'Rules, skills and feedback' },
    { title: 'Verified change', detail: 'Evidence before acceptance' },
  ],
  footer: 'People direct. Agents execute. Evidence builds confidence.',
}

export const SLIDES = [
  {
    id: 'opening', type: 'title', section: 'The foundation', eyebrow: EVENT.eyebrow,
    title: EVENT.title, highlight: EVENT.highlight,
    subtitle: 'Build My Contoso with GitHub Copilot. Discover how repository context turns intent into a verifiable result.',
    takeaway: EVENT.tagline,
  },
  {
    id: 'direction', section: 'The foundation', eyebrow: 'THE OPPORTUNITY',
    title: 'More than faster code.', highlight: 'A better way to deliver.',
    subtitle: 'Give agents the context and feedback that help your team do good engineering.',
    cards: [
      { label: '01 / Shared context', title: 'Reduce repeated explanation', text: 'Keep project knowledge and conventions in the repository, ready for the next task.' },
      { label: '02 / Bounded work', title: 'Make delegation deliberate', text: 'Give each agent a clear task, an expected result and a useful feedback loop.' },
      { label: '03 / Visible evidence', title: 'Keep acceptance human', text: 'Use tests, reviews and the customer journey to judge the result—not the confidence of an answer.' },
    ],
    takeaway: 'The aim is reliable delivery and less rework, not simply more AI-generated output.',
  },
  {
    id: 'agenda', type: 'agenda', section: 'The foundation', eyebrow: 'OUR TWO HOURS TOGETHER',
    title: 'See the workflow.', highlight: 'Make it your own.',
    subtitle: 'A live build, a shared language and a practical next step for your team.',
    takeaway: 'Leave with one concrete repository improvement and a way to show its value.',
  },
  {
    id: 'ladder', type: 'ladder', section: 'The foundation', eyebrow: 'EXPLORE / AI READINESS',
    title: 'Prepare the repository.', highlight: 'Enable the agent.',
    subtitle: 'Explore the L0–L5 model: each capability gives agentic work a stronger foundation.',
    takeaway: 'Readiness describes explicit AI preparation. It is not a measure of overall engineering performance.',
  },
  {
    id: 'scenario', type: 'sources', section: 'The foundation', eyebrow: 'OUR SHARED EXAMPLE / MY CONTOSO',
    title: '“What am I covered for,', highlight: 'and what do I pay?”',
    subtitle: 'One customer-facing experience, built from two sources that may not always agree.',
    takeaway: EVENT.scenario,
  },
  {
    id: 'context', section: 'The foundation', eyebrow: 'CONTEXT THAT TRAVELS WITH THE WORK',
    title: 'Put knowledge', highlight: 'where agents can use it.',
    cards: [
      { label: 'Guidance', title: 'Explain the project', text: 'Capture purpose, commands and working rules. Apply specialised conventions to the right files.', code: 'AGENTS.md\n.github/instructions/' },
      { label: 'Capabilities', title: 'Reuse good habits', text: 'Turn recurring tasks into skills. Give specialist implementation and review roles clear boundaries.' },
      { label: 'Feedback', title: 'Make quality visible', text: 'Use automated checks and review criteria so agents can respond to evidence while they work.' },
    ],
    takeaway: 'A useful instruction is concise, current and specific enough to change behavior.',
  },
  {
    id: 'workflow', type: 'workflow', section: 'The workflow', eyebrow: 'EXPLORE / FROM INTENT TO ACCEPTANCE',
    title: 'One delivery loop.', highlight: 'Clear responsibilities.',
    subtitle: 'Select a phase to explore what people decide, what agents do and what evidence matters.',
    takeaway: 'People own direction and acceptance. Agents do bounded work with feedback.',
  },
  {
    id: 'decisions', section: 'The workflow', eyebrow: '01 / ALIGN ON THE CUSTOMER PROBLEM',
    title: 'Clarify the decisions', highlight: 'before writing the code.',
    subtitle: 'The most useful first step is often a better question.',
    cards: [
      { label: 'Policy state', title: 'What counts as running?', text: 'Agree how future start dates, ended policies and end-of-cover dates affect the overview.' },
      { label: 'Premiums', title: 'What does “per month” mean?', text: 'Agree how monthly, quarterly and yearly payment terms should contribute to a comparable total.' },
      { label: 'Uncertainty', title: 'What if cover is missing?', text: 'Agree how to explain incomplete information without inventing cover or implying there is none.' },
    ],
    takeaway: 'Record shared terms and decisions so the next session does not have to rediscover them.',
  },
  {
    id: 'prototype', section: 'The workflow', eyebrow: '02 / MAKE DESIGN DECISIONS VISIBLE',
    title: 'Compare the experience.', highlight: 'Choose with purpose.',
    subtitle: 'Use the same synthetic customer data to compare structurally different layouts.',
    cards: [
      { label: 'Explore', title: 'Show real alternatives', text: 'Compare what customers see first, how details are grouped and how the page works on a phone.' },
      { label: 'Decide', title: 'Explain the trade-off', text: 'Choose the layout that makes cover, deductible and premium easiest to understand.' },
      { label: 'Carry forward', title: 'Keep the reason', text: 'Hand the decision and its rationale into the specification—not just a screenshot or prototype.' },
    ],
    takeaway: 'A prototype answers a product question. It is not automatically production-ready code.',
  },
  {
    id: 'tickets', type: 'tickets', section: 'The workflow', eyebrow: '03 / PLAN A TESTABLE FIRST SLICE',
    title: 'Start end to end.', highlight: 'Then add the edge cases.',
    subtitle: 'One small working journey gives later work a reliable foundation.',
    takeaway: 'Parallel work becomes useful when its dependencies and acceptance criteria are clear.',
  },
  {
    id: 'implement', section: 'The workflow', eyebrow: '04 / BUILD WITH SHORT FEEDBACK LOOPS',
    title: 'A small change.', highlight: 'A clear definition of done.',
    cards: [
      { label: 'Specify', title: 'Make behavior testable', text: 'Define the customer-visible result and the boundary where a test can prove it.' },
      { label: 'Implement', title: 'Work one slice at a time', text: 'Load the right data, calculate the result and render a usable customer experience.' },
      { label: 'Demonstrate', title: 'Provide an acceptance path', text: 'Explain how to try the result in a few steps and report what the checks actually show.' },
    ],
    takeaway: 'For the simple synthetic example, three monthly-paid policies total €98.40 per month.',
  },
  {
    id: 'parallel', section: 'The workflow', eyebrow: '05 / COLLABORATE WITH CLEAR BOUNDARIES',
    title: 'Delegate the task.', highlight: 'Keep the accountability.',
    subtitle: 'A separate agent can work on a well-defined follow-on ticket once the first slice is accepted.',
    cards: [
      { label: 'A bounded task', title: 'One customer behavior', text: 'Handle a missing coverage record honestly, without expanding into unrelated features.' },
      { label: 'An isolated workspace', title: 'Independent execution', text: 'Use separate worktrees and clear dependencies to avoid competing edits in the same checkout.' },
      { label: 'A human decision', title: 'Review before acceptance', text: 'Inspect the pull request, try the acceptance steps and decide whether the result is ready.' },
    ],
    takeaway: 'More autonomy does not remove the need for review, ownership or product judgment.',
  },
  {
    id: 'gate', type: 'gate', section: 'The workflow', eyebrow: 'EXPLORE / FEEDBACK THAT CHANGES THE OUTCOME',
    title: 'Don’t just ask for quality.', highlight: 'Build in a check.',
    subtitle: 'Toggle the example checks to see how a validation gate responds. No commands run here.',
    takeaway: 'A guardrail is useful when it gives actionable feedback at the right moment.',
  },
  {
    id: 'verify', section: 'The workflow', eyebrow: '06 / VERIFY THE CUSTOMER EXPERIENCE',
    title: 'Working code is a start.', highlight: 'Trust needs evidence.',
    cards: [
      { label: 'Behavior', title: 'Does it meet the need?', text: 'Check calculations, data states and acceptance criteria. Review the change against its agreed scope.' },
      { label: 'Experience', title: 'Can people use it?', text: 'Check accessibility, plain language and responsiveness on phone and desktop.' },
      { label: 'Data boundaries', title: 'Is access appropriate?', text: 'Verify that each customer sees only their own data. Keep identity and authorization enforced server-side.' },
    ],
    takeaway: 'This workshop is a synthetic-data demonstration, not a production insurance service.',
  },
  {
    id: 'retro', section: 'The workflow', eyebrow: '07 / TURN EXPERIENCE INTO REUSABLE KNOWLEDGE',
    title: 'Improve the environment.', highlight: 'Not just the answer.',
    cards: [
      { label: 'Repeated explanation', title: 'Refine the guidance', text: 'Capture a durable rule in the right place so it does not depend on one person remembering to ask.' },
      { label: 'An escaped defect', title: 'Strengthen the feedback', text: 'Add a focused test or check that catches the same failure earlier next time.' },
      { label: 'A recurring task', title: 'Make it repeatable', text: 'Improve a skill or specialist role so the next task benefits from what the team learned.' },
    ],
    takeaway: EVENT.tagline,
  },
  {
    id: 'break', type: 'statement', section: 'Your next step', eyebrow: 'A FIVE-MINUTE PAUSE',
    title: 'Pause. Reflect.', highlight: 'Find a partner.',
    subtitle: 'Next, apply one idea to a repository your team is authorised to use.',
    takeaway: 'No suitable repository? Join another pair and explore the next step together.',
  },
  {
    id: 'exercise', type: 'exercise', section: 'Your next step', eyebrow: 'EXPLORE / 35 MINUTES / IN PAIRS',
    title: 'Your repository.', highlight: 'One useful next move.',
    subtitle: 'Choose a starting point and turn one capability into something you can demonstrate.',
    takeaway: 'Use approved repositories, synthetic examples and your organisation’s existing policies.',
  },
  {
    id: 'debrief', section: 'Your next step', eyebrow: 'SHARE / REFLECT / TAKE FORWARD',
    title: 'Show the difference.', highlight: 'Choose what follows.',
    cards: [
      { label: 'The change', title: 'What did you make explicit?', text: 'Name the capability, where it lives and the task it is intended to improve.' },
      { label: 'The evidence', title: 'What behaved differently?', text: 'Show a task following the guidance, using the skill or responding to a check.' },
      { label: 'The next step', title: 'What would help your team?', text: 'Name the next blocker and a pattern that another team could reuse.' },
    ],
    takeaway: 'Measure the usefulness of the change, not just the presence of a new file.',
  },
  {
    id: 'close', type: 'statement', section: 'Your next step', eyebrow: 'FROM TODAY TO YOUR NEXT SESSION',
    title: 'Better foundations.', highlight: 'More confident delivery.',
    subtitle: 'Context in the repository. Bounded work for agents. Evidence for people.',
    takeaway: 'Choose one repository. Make the next agent session better.',
  },
]
