import { useState } from 'react'
import { BottomBar, Slide, useSlides } from '@deckio/deck-engine'
import { AGENDA, EVENT, EXERCISE, GATE_VIEW, POLICY_EXAMPLES, SOURCE_VIEW } from '../content.js'

export function WorkshopAgenda() {
  return (
    <div className="workshop-agenda" aria-label="Two-hour programme">
      <p className="eyebrow">THE PROGRAMME</p>
      {AGENDA.map(item => (
        <div className="programme-row" key={item.at}>
          <span>{item.at}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div><small>{item.mins} min</small>
        </div>
      ))}
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

function SkillFlow({ steps }) {
  const [selected, setSelected] = useState(0)
  const step = steps[selected]
  return (
    <div className="workflow-widget">
      <div className="workflow-phases" style={{ '--step-count': steps.length }} role="group" aria-label="Skill step">{steps.map((item, index) => (
        <button key={item.title} onClick={() => setSelected(index)} aria-pressed={selected === index}>
          <span>0{index + 1}</span><strong>{item.title}</strong><code>{item.label}</code>
        </button>
      ))}</div>
      <div className="flow-detail" aria-live="polite">
        <div className="prompt-panel"><p className="eyebrow">EXAMPLE PROMPT</p><pre>{step.prompt}</pre></div>
        <div className="flow-output"><p className="eyebrow">EXPECTED OUTPUT</p><h3>{step.artifact}</h3><p>{step.output}</p><p className="flow-example">{step.example}</p></div>
      </div>
    </div>
  )
}

function TaskBrief({ brief }) {
  return (
    <div className="task-brief">
      <div className="prompt-panel"><p className="eyebrow">EXAMPLE PROMPT</p><pre>{brief.prompt}</pre><p className="task-context">{brief.context}</p></div>
      <div className="task-checks"><p className="eyebrow">{brief.label}</p>{brief.checks.map(check => <div key={check.title}><h3>{check.title}</h3><p>{check.text}</p></div>)}</div>
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
  const option = EXERCISE.options[selected]
  const checked = evidence[option.id] || []
  const toggle = index => setEvidence(current => {
    const previous = current[option.id] || []
    return { ...current, [option.id]: previous.includes(index) ? previous.filter(item => item !== index) : [...previous, index] }
  })
  return (
    <div className="exercise-widget">
      <div className="exercise-picker">
        <p className="eyebrow">{EXERCISE.label}</p>
        <div className="exercise-options" role="group" aria-label="Exercise task">{EXERCISE.options.map((item, index) => (
          <button key={item.id} onClick={() => setSelected(index)} aria-pressed={selected === index}>{item.label}</button>
        ))}</div>
        <p className="interaction-hint">{EXERCISE.prompt}</p>
        <div className="exercise-timing">{EXERCISE.timings.map(item => <div key={item.time}><strong>{item.time}</strong><span><b>{item.title}</b><small>{item.detail}</small></span></div>)}</div>
      </div>
      <div className="exercise-plan">
        <p className="eyebrow">{EXERCISE.actionLabel}</p>
        <div className="exercise-recommendation" aria-live="polite"><h3>{option.action}</h3><pre>{option.prompt}</pre></div>
        <p className="eyebrow evidence-label">{EXERCISE.evidenceLabel}</p>
        <div className="evidence-list">{option.evidence.map((item, index) => <label key={`${option.id}-${index}`}><input type="checkbox" checked={checked.includes(index)} onChange={() => toggle(index)} /><span>{item}</span></label>)}</div>
        <p className="evidence-progress" role="status">{checked.length} {EXERCISE.completed}</p>
        <small className="exercise-privacy">{EXERCISE.privacy}</small>
      </div>
    </div>
  )
}

export function WorkshopSlide({ index, slide }) {
  const active = useSlides().current === index
  const hero = slide.type === 'title'
  return (
    <Slide index={index} className={`workshop-slide ${hero ? 'hero-slide' : ''}`}>
      <div className="slide-rule" aria-hidden="true" />
      <div className={`slide-content ${active ? 'is-active' : ''}`} inert={!active} aria-hidden={!active}>
        <div className={hero ? 'hero-layout' : 'slide-main'}>
          <header className="slide-heading">
            <p className="eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}{slide.highlight && <>{' '}<br className={hero ? '' : 'optional-break'} /><em>{slide.highlight}</em></>}</h1>
            {slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}
            {hero && <div className="title-meta">{EVENT.meta.map(item => <span key={item}>{item}</span>)}</div>}
          </header>
          {hero && <WorkshopAgenda />}
        </div>
        {slide.cards && <div className="cards">{slide.cards.map(card => <article className="card" key={card.title}><p className="card-label">{card.label}</p><h3>{card.title}</h3><p>{card.text}</p>{card.code && <pre>{card.code}</pre>}</article>)}</div>}
        {slide.type === 'sources' && <Sources />}
        {slide.type === 'flow' && <SkillFlow steps={slide.steps} />}
        {slide.type === 'brief' && <TaskBrief brief={slide.brief} />}
        {slide.type === 'gate' && <Gate />}
        {slide.type === 'exercise' && <Exercise />}
        <div className="takeaway"><span>{hero ? 'TOOLING' : 'NOTE'}</span><p>{slide.takeaway}</p></div>
      </div>
      <BottomBar text={<span className="slide-footer"><span>{EVENT.footer}</span><span>MY CONTOSO / SYNTHETIC EXAMPLES</span></span>} />
    </Slide>
  )
}
