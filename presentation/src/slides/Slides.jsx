import { useState } from 'react'
import { BottomBar, Slide, useSlides } from '@deckio/deck-engine'
import { AGENDA, EVENT, EXERCISE, GATE_VIEW, HERO, LEVELS, POLICY_EXAMPLES, SOURCE_VIEW, TICKET_VIEW, WORKFLOW } from '../content.js'

export function DeliveryLoop() {
  return (
    <div className="delivery-loop" aria-label="The agentic delivery loop">
      <div className="loop-orbit" aria-hidden="true" />
      <p className="eyebrow">{HERO.eyebrow}</p>
      <div className="loop-steps">{HERO.steps.map((step, index) => (
        <div className="loop-step" key={step.title}>
          <span className="loop-symbol" aria-hidden="true">{index === 0 ? '◎' : index === 1 ? '⌘' : '✓'}</span>
          <div><small>0{index + 1}</small><strong>{step.title}</strong><p>{step.detail}</p></div>
        </div>
      ))}</div>
      <p className="loop-footer">{HERO.footer}</p>
    </div>
  )
}

function Ladder() {
  const [selected, setSelected] = useState(1)
  const item = LEVELS[selected]
  return (
    <div className="ladder-widget">
      <div className="ladder-levels" role="group" aria-label="Readiness level">
        {LEVELS.map((level, index) => (
          <button key={level.level} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <span>{level.level}</span><strong>{level.title}</strong><i style={{ height: `${18 + index * 12}px` }} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="level-detail" aria-live="polite">
        <div><p className="eyebrow">{item.level} / {item.title}</p><code>{item.file}</code><p>{item.detail}</p></div>
        <div><p className="eyebrow">THE NEXT MOVE</p><h3>{item.next}</h3><p>{item.example}</p></div>
      </div>
    </div>
  )
}

function Sources() {
  const [selected, setSelected] = useState(0)
  const example = POLICY_EXAMPLES[selected]
  return (
    <div className="sources-widget">
      <div className="source-stack">
        {SOURCE_VIEW.files.map((file, index) => <div key={file.path}>
          {index > 0 && <div className="join-key"><span>{SOURCE_VIEW.join.label}</span> <code>{SOURCE_VIEW.join.key}</code></div>}
          <div className="source-file"><span className="file-type">{file.type}</span><div><h3>{file.title}</h3><code>{file.path}</code><p>{file.detail}</p></div></div>
        </div>)}
        <p className="interaction-hint"><span aria-hidden="true">↗</span> {SOURCE_VIEW.hint}</p>
      </div>
      <div className="policy-example">
        <div className="widget-tabs" role="group" aria-label="Synthetic customer example">
          {POLICY_EXAMPLES.map((item, index) => <button key={item.id} onClick={() => setSelected(index)} aria-pressed={selected === index}>{item.label}</button>)}
        </div>
        <div className="policy-result" aria-live="polite">
          <p className="eyebrow">{SOURCE_VIEW.label}</p>
          <h3>{example.name}</h3>
          <p>{example.summary}</p>
          <div className={`premium ${selected ? 'unknown' : ''}`}><strong>{example.premium}</strong><span>{example.term}</span></div>
          <div className="policy-chips">{example.policies.map(policy => <span key={policy}>{policy}</span>)}</div>
          <p className="policy-state">{example.state}</p>
        </div>
      </div>
    </div>
  )
}

function Workflow() {
  const [selected, setSelected] = useState(0)
  const phase = WORKFLOW[selected]
  return (
    <div className="workflow-widget">
      <div className="workflow-phases" role="group" aria-label="Delivery phase">{WORKFLOW.map((item, index) => (
        <button key={item.title} onClick={() => setSelected(index)} aria-pressed={selected === index}>
          <span>0{index + 1}</span><strong>{item.title}</strong><small>{item.label}</small>
        </button>
      ))}</div>
      <div className="phase-detail" aria-live="polite">
        <div className="phase-summary"><span className="phase-big" aria-hidden="true">0{selected + 1}</span><div><h3>{phase.title}</h3><p>{phase.result}</p></div></div>
        <div className="phase-roles">
          {[['People decide', phase.human], ['Agents do', phase.agent], ['Evidence to inspect', phase.evidence]].map(([label, text]) => <div key={label}><p className="eyebrow">{label}</p><p>{text}</p></div>)}
        </div>
      </div>
    </div>
  )
}

function Gate() {
  const [checks, setChecks] = useState({ types: true, tests: false })
  const passing = GATE_VIEW.checks.every(check => checks[check.id])
  return (
    <div className="gate-widget">
      <div className="gate-controls">
        <p className="eyebrow">{GATE_VIEW.label}</p>
        <div className="quality-checks" role="group" aria-label="Example check results">
          {GATE_VIEW.checks.map(check => <button key={check.id} onClick={() => setChecks(current => ({ ...current, [check.id]: !current[check.id] }))} aria-pressed={checks[check.id]}>
            <span className={checks[check.id] ? 'check-pass' : 'check-fail'} aria-hidden="true">{checks[check.id] ? '✓' : '×'}</span><strong>{check.label}</strong><span>{checks[check.id] ? 'Pass' : 'Fail'}</span>
          </button>)}
        </div>
        <p className="interaction-hint">{GATE_VIEW.hint}</p>
        <p>{GATE_VIEW.explanation}</p>
      </div>
      <div className={`gate-result ${passing ? 'pass' : 'fail'}`} aria-live="polite">
        <p className="eyebrow">{GATE_VIEW.command}</p>
        <span className="result-symbol" aria-hidden="true">{passing ? '✓' : '!'}</span>
        <h3>{passing ? 'Ready to proceed' : 'Change needs attention'}</h3>
        <p>{passing ? GATE_VIEW.passing : GATE_VIEW.failing}</p>
        <small>{GATE_VIEW.limitation}</small>
      </div>
    </div>
  )
}

function Exercise() {
  const [selected, setSelected] = useState(0)
  const [evidence, setEvidence] = useState({})
  const level = LEVELS[selected]
  const checked = evidence[level.level] || []
  const toggle = index => setEvidence(current => ({ ...current, [level.level]: checked.includes(index) ? checked.filter(item => item !== index) : [...checked, index] }))
  return (
    <div className="exercise-widget">
      <div className="exercise-picker">
        <p className="eyebrow">{EXERCISE.label}</p>
        <div className="exercise-levels" role="group" aria-label="Exercise starting level">{LEVELS.map((item, index) => (
          <button key={item.level} onClick={() => setSelected(index)} aria-pressed={selected === index}>{item.level}</button>
        ))}</div>
        <p className="interaction-hint">{EXERCISE.prompt}</p>
        <div className="exercise-timing">{EXERCISE.timings.map(item => <div key={item.time}><strong>{item.time}</strong><span><b>{item.title}</b><small>{item.detail}</small></span></div>)}</div>
      </div>
      <div className="exercise-plan">
        <p className="eyebrow">{EXERCISE.actionLabel}</p>
        <div className="exercise-recommendation" aria-live="polite"><h3>{level.action}</h3><p>{level.example}</p></div>
        <p className="eyebrow evidence-label">{EXERCISE.evidenceLabel}</p>
        <div className="evidence-list">{level.evidence.map((item, index) => <label key={`${level.level}-${index}`}><input type="checkbox" checked={checked.includes(index)} onChange={() => toggle(index)} /><span>{item}</span></label>)}</div>
        <p className="evidence-progress" role="status">{checked.length} {EXERCISE.completed}</p>
        <small className="exercise-privacy">{EXERCISE.privacy}</small>
      </div>
    </div>
  )
}

function TicketMap() {
  return (
    <div className="ticket-map">
      <article className="spec-ticket"><p className="eyebrow">{TICKET_VIEW.spec.command}</p><h3>{TICKET_VIEW.spec.title}</h3><p>{TICKET_VIEW.spec.detail}</p></article>
      <div className="ticket-arrow" aria-hidden="true">→</div>
      <div className="ticket-branches">
        <article className="first-ticket"><p className="eyebrow">{TICKET_VIEW.first.command}</p><h3>{TICKET_VIEW.first.title}</h3><p>{TICKET_VIEW.first.detail}</p><span className="ticket-label">{TICKET_VIEW.first.label}</span></article>
        <div className="following-tickets">{TICKET_VIEW.next.map(ticket => <article key={ticket.title}><h3>{ticket.title}</h3><p>{ticket.detail}</p></article>)}</div>
      </div>
    </div>
  )
}

export function WorkshopSlide({ index, slide }) {
  const active = useSlides().current === index
  const statement = slide.type === 'statement'
  const hero = slide.type === 'title'
  return (
    <Slide index={index} className={`workshop-slide ${statement ? 'statement-slide' : ''} ${hero ? 'hero-slide' : ''}`}>
      <div className="slide-rule" aria-hidden="true" />
      <div className={`slide-content ${active ? 'is-active' : ''}`} inert={!active} aria-hidden={!active}>
        <div className={hero ? 'hero-layout' : 'slide-main'}>
          <header className="slide-heading">
            <p className="eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}{slide.highlight && <>{' '}<br className={statement || hero ? '' : 'optional-break'} /><em>{slide.highlight}</em></>}</h1>
            {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
            {hero && <div className="title-meta">{EVENT.meta.map(item => <span key={item}>{item}</span>)}</div>}
          </header>
          {hero && <DeliveryLoop />}
        </div>
        {slide.cards && <div className="cards">{slide.cards.map(card => <article className="card" key={card.title}><p className="card-label">{card.label}</p><h3>{card.title}</h3><p>{card.text}</p>{card.code && <pre>{card.code}</pre>}</article>)}</div>}
        {slide.type === 'ladder' && <Ladder />}
        {slide.type === 'agenda' && <div className="agenda">{AGENDA.map(item => <article key={item.at}><p className="agenda-time">{item.at}</p><h3>{item.title}</h3><p>{item.detail}</p><span>{item.mins} min</span></article>)}</div>}
        {slide.type === 'sources' && <Sources />}
        {slide.type === 'workflow' && <Workflow />}
        {slide.type === 'tickets' && <TicketMap />}
        {slide.type === 'gate' && <Gate />}
        {slide.type === 'exercise' && <Exercise />}
        <div className="takeaway"><span>{statement || hero ? 'THE IDEA' : 'TAKEAWAY'}</span><p>{slide.takeaway}</p></div>
      </div>
      <BottomBar text={<span className="slide-footer"><span>{EVENT.footer}</span><span>MY CONTOSO / SYNTHETIC EXAMPLES</span></span>} />
    </Slide>
  )
}
