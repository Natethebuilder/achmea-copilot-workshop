import { Fragment, useId, useState } from 'react'
import { BottomBar, Slide, useSlides } from '@deckio/deck-engine'
import { AGENDA, EVENT } from '../content.js'

const pad = number => String(number).padStart(2, '0')
const duration = at => {
  const [hours, minutes] = at.split(':').map(Number)
  return `PT${hours}H${minutes}M`
}

function rich(text) {
  if (typeof text !== 'string' || !text.includes('`')) return text
  return text.split('`').map((part, index) => (index % 2
    ? <code className="chip" key={index}>{part}</code>
    : <Fragment key={index}>{part}</Fragment>))
}

function Choice({ label, visibleLabel, options, value, onChange, className = '' }) {
  const id = useId()
  return (
    <>
      {visibleLabel && <p className="mini-label" id={id}>{visibleLabel}</p>}
      <div className={`choice ${className}`} role="group" aria-label={visibleLabel ? undefined : label} aria-labelledby={visibleLabel ? id : undefined}>
        {options.map((option, index) => (
          <button key={option} type="button" aria-pressed={value === index} onClick={() => onChange(index)}>{option}</button>
        ))}
      </div>
    </>
  )
}

const Status = ({ state, labels }) => <span className={`status status-${state}`}>{labels[state]}</span>
const Arrow = ({ down }) => <span className={down ? 'down-arrow' : 'phase-arrow'} aria-hidden="true">{down ? '↓' : '→'}</span>

function Heading({ slide }) {
  const heading = (
    <header className="slide-heading">
      <p className={`eyebrow${slide.mono ? ' eyebrow-mono' : ''}`}>{slide.mono || slide.eyebrow}</p>
      <h1>{slide.title}{slide.highlight && <>{' '}<span className="title-highlight">{slide.highlight}</span></>}</h1>
      {slide.subtitle && <p className="slide-subtitle">{rich(slide.subtitle)}</p>}
    </header>
  )
  if (!slide.task) return heading
  return (
    <div className="heading-row">
      {heading}
      <div className="task-card">
        <p className="mini-label">{slide.task.label}</p>
        <p>{rich(slide.task.text)}</p>
      </div>
    </div>
  )
}

function Takeaway({ takeaway }) {
  if (!takeaway) return null
  return (
    <div className="takeaway">
      <p className="mini-label">{takeaway.label}</p>
      <p>{rich(takeaway.text)}</p>
    </div>
  )
}

function Cards({ cards }) {
  return (
    <div className="cards">
      {cards.map((card, index) => (
        <article className="card" key={card.title}>
          <span className="card-number">{pad(index + 1)}</span>
          <h3>{card.title}</h3>
          <p>{rich(card.text)}</p>
        </article>
      ))}
    </div>
  )
}

function AgendaBar() {
  return (
    <div className="agenda-bar" aria-hidden="true">
      {AGENDA.map(item => <span key={item.at} className={`tone-${item.tone}`} style={{ flexGrow: item.mins }} />)}
    </div>
  )
}

export function WorkshopAgenda() {
  return (
    <div className="workshop-agenda">
      <p className="eyebrow">{EVENT.agendaLabel}</p>
      <AgendaBar />
      <ol>
        {AGENDA.map(item => (
          <li key={item.at} className={`tone-${item.tone}`}>
            <span className="agenda-dot" aria-hidden="true" />
            <time dateTime={duration(item.at)}>{item.at}</time>
            <div><strong>{item.title}</strong><p>{item.detail}</p></div>
            <small>{item.mins} min</small>
          </li>
        ))}
      </ol>
    </div>
  )
}

function TitleSlide({ slide }) {
  return (
    <div className="title-layout">
      <p className="eyebrow">{slide.eyebrow}</p>
      <h1>{slide.title}{' '}<br />{slide.highlight}</h1>
      <p className="slide-subtitle">{slide.subtitle}</p>
      <ul className="title-meta">{EVENT.meta.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="title-note">{EVENT.scenario}</p>
    </div>
  )
}

function WhyBody({ slide }) {
  return (
    <>
      <Cards cards={slide.cards} />
      <div className="agenda-strip">
        <p className="section-label">{EVENT.agendaLabel}</p>
        <AgendaBar />
        <ol className="agenda-columns">
          {AGENDA.map(item => (
            <li key={item.at} className={`tone-${item.tone}`}>
              <time dateTime={duration(item.at)}><span className="agenda-dot" aria-hidden="true" />{item.at}</time>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
              <small>{item.mins} min</small>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}

function SourceCard({ source }) {
  return (
    <article className="card source-card">
      <div className="source-top"><h3>{source.title}</h3><span className="file-type">{source.type}</span></div>
      <ul className="field-list">{source.items.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="source-count">{source.count}</p>
    </article>
  )
}

function ContosoBody({ slide }) {
  const [selected, setSelected] = useState(0)
  const example = slide.examples[selected]
  return (
    <>
      <div className="label-row"><p className="section-label">{slide.sourcesLabel}</p><span className="tag">{slide.sourcesTag}</span></div>
      <div className="source-equation">
        <SourceCard source={slide.sources[0]} />
        <div className="join">
          <span className="operator" aria-hidden="true">+</span>
          <small>{slide.join.label}</small>
          <code className="chip">{slide.join.key}</code>
        </div>
        <SourceCard source={slide.sources[1]} />
        <span className="operator" aria-hidden="true">=</span>
        <div className="result-block">
          <p className="mini-label">{slide.result.label}</p>
          <h3>{slide.result.title}</h3>
          <p>{slide.result.text}</p>
        </div>
      </div>
      <div className="example-row">
        <div className="example-picker">
          <Choice visibleLabel={slide.exampleLabel} options={slide.examples.map(item => item.label)} value={selected} onChange={setSelected} className="choice-stack" />
        </div>
        <div className="worked" aria-live="polite">
          <p className="worked-name"><strong>{example.name}</strong> <code className="chip">{example.ref}</code></p>
          <div className="worked-sum">
            {example.lines.map((line, index) => (
              <Fragment key={line.name}>
                {index > 0 && <span className="operator" aria-hidden="true">+</span>}
                <span className="sum-line">
                  <small>{line.name}</small>
                  <strong>{line.amount}</strong>
                  {line.flag && <span className="flag">{line.flag}</span>}
                </span>
              </Fragment>
            ))}
            <span className="operator" aria-hidden="true">=</span>
            <span className="sum-line sum-total"><strong>{example.total}</strong><small>{example.unit}</small></span>
          </div>
          <p className="worked-note">{example.note}</p>
        </div>
      </div>
    </>
  )
}

function WorkflowBody({ slide }) {
  return (
    <>
      <div className="workflow">
        {slide.phases.map((phase, index) => (
          <Fragment key={phase.title}>
            {index > 0 && <Arrow />}
            <div className={`phase phase-${index + 1}`}>
              <h3>{phase.title}</h3>
              <p className="phase-text">{rich(phase.text)}</p>
              <ol className="phase-steps">
                {phase.steps.map(step => (step.detour ? (
                  <li className="detour" key={step.label}>
                    <p className="mini-label">{step.label}</p>
                    <p className="detour-cmds">{step.cmds.map((cmd, cmdIndex) => (
                      <Fragment key={cmdIndex}>{cmdIndex > 0 && <span aria-hidden="true"> → </span>}<code>{cmd}</code></Fragment>
                    ))}</p>
                    <p className="step-out"><span aria-hidden="true">→ </span>{step.out}</p>
                  </li>
                ) : (
                  <li className="phase-step" key={step.n}>
                    <span className="step-square">{step.n}</span>
                    <div><code>{step.cmd}</code><p className="step-out"><span aria-hidden="true">→ </span>{step.out}</p></div>
                  </li>
                )))}
              </ol>
              {phase.box && (
                <div className="runs-itself">
                  <p className="mini-label">{phase.box.label}</p>
                  <p>{phase.box.cmds.map(cmd => <code className="chip" key={cmd}>{cmd}</code>)}</p>
                </div>
              )}
            </div>
          </Fragment>
        ))}
      </div>
      <div className="workflow-footer">
        <div className="onramp">
          <p className="mini-label">{slide.onramp.label}</p>
          <p>{rich(slide.onramp.text)}</p>
          <span className="tag">{slide.onramp.tag}</span>
        </div>
        <p className="router">{slide.router.text} <code className="chip">{slide.router.cmd}</code></p>
      </div>
    </>
  )
}

const countWords = text => text.trim().split(/\s+/).length

function ReadinessBody({ slide }) {
  const [focus, setFocus] = useState(null)
  const words = slide.levels.map(level => countWords(level.prompt))
  const most = Math.max(...words)
  const [, availableLabel, promptLabel, wordsLabel, whyLabel] = slide.columns
  const { from, to } = slide.arrow
  return (
    <>
      <div className="card readiness">
        <table className="readiness-table">
          <caption className="sr-only">{slide.caption}</caption>
          <colgroup>{slide.columns.map(column => <col key={column} />)}</colgroup>
          <thead><tr>{slide.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>
            {slide.levels.map((level, index) => (
              <tr key={level.level} className={focus === null ? undefined : focus === index ? 'is-focus' : 'is-dim'} style={{ '--i': index }}>
                <th scope="row">
                  <button type="button" aria-pressed={focus === index} onClick={() => setFocus(focus === index ? null : index)}>
                    <span className={`level-chip level-${index}`}>{level.level}</span>{' '}
                    <span className="level-state"><strong>{level.state}</strong> <small>{level.alt}</small></span>
                  </button>
                </th>
                <td data-label={availableLabel}>
                  <span className="available">{rich(level.available)}</span>
                  {level.detail && <> <small className="available-detail">{level.detail}</small></>}
                </td>
                <td data-label={promptLabel}>{level.same ? <span className="same-prompt">{level.same}</span> : <q>{level.prompt}</q>}</td>
                <td data-label={wordsLabel}>
                  <span className="words">
                    <span className="words-n">{words[index]}</span>
                    <span className="words-bar" aria-hidden="true"><span style={{ '--w': words[index] / most }} /></span>
                  </span>
                </td>
                <td data-label={whyLabel}>{level.why.map(line => <span key={line} className="why-line">{line}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prompt-repo">
        <p><strong>{from.label}</strong> <span>{from.text}</span></p>
        <span className="prompt-repo-arrow" aria-hidden="true" />
        <p><strong>{to.label}</strong> <span>{to.text}</span></p>
      </div>
    </>
  )
}

function LadderBody({ slide }) {
  const [selected, setSelected] = useState(slide.defaultLevel)
  const level = slide.levels[selected]
  const rungs = slide.levels.map((item, index) => ({ ...item, index })).reverse()
  return (
    <div className="ladder">
      <div className="rungs" role="group" aria-label={slide.choiceLabel}>
        {rungs.map(item => (
          <button key={item.level} type="button" aria-pressed={selected === item.index} className={item.index < selected ? 'is-below' : undefined} style={{ '--step': item.index }} onClick={() => setSelected(item.index)}>
            <span className="rung-level">{item.level}</span>{' '}<span className="rung-name">{item.name}</span>
          </button>
        ))}
      </div>
      <article className="card ladder-detail" aria-live="polite">
        <p className="ladder-kicker"><span className="step-square solid">{level.level}</span>{level.name}</p>
        <h3>{level.text}</h3>
        <ul className="ticks">{level.items.map(item => <li key={item}>{rich(item)}</li>)}</ul>
        <code className="ladder-path">{level.path}</code>
      </article>
    </div>
  )
}

function GrillBody({ slide }) {
  return (
    <div className="grill">
      <div className="grill-left">
        <p className="statement">{slide.statement}</p>
        <p className="body-text">{rich(slide.text)}</p>
        <p className="quote">{slide.quote}</p>
        <article className="card card-dark-top question-card">
          <p className="mini-label">{slide.question.label}</p>
          <h3>{slide.question.text}</h3>
          <p>{slide.question.answer}</p>
        </article>
      </div>
      <div className="grill-right">
        <div className="file-block">
          <p className="file-head"><code>{slide.glossary.file}</code><span className="tag">{slide.glossary.tag}</span></p>
          <div className="terms">
            {slide.glossary.terms.map(item => (
              <article className="card term" key={item.term}><h3>{item.term}</h3><p>{item.text}</p></article>
            ))}
          </div>
        </div>
        <div className="file-block">
          <p className="file-head"><code>{slide.adrs.file}</code><span className="tag">{slide.adrs.tag}</span></p>
          <ul className="adr-list">
            {slide.adrs.items.map(item => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Wireframe({ kind, total }) {
  const cards = kind === 'C' || kind === 'AC'
  return (
    <span className={`wire wire-${kind.toLowerCase()}`} aria-hidden="true">
      {(kind === 'A' || kind === 'AC') && <span className="wire-total"><span className="wire-line" /><b>{total}</b></span>}
      {kind === 'A' && <span className="wire-rows">{[0, 1, 2, 3].map(item => <span key={item} />)}</span>}
      {kind === 'B' && <span className="wire-table">{Array.from({ length: 20 }, (_, item) => <span key={item} />)}</span>}
      {cards && <span className="wire-cards">{[0, 1, 2, 3].map(item => <span key={item}><span className="wire-line" /><span className="wire-line short" /></span>)}</span>}
    </span>
  )
}

function PrototypeBody({ slide }) {
  const [selected, setSelected] = useState(0)
  const variant = slide.variants[selected]
  return (
    <div className="prototype">
      <div className="prototype-main">
        <div className="variants" role="group" aria-label={slide.choiceLabel}>
          {slide.variants.map((item, index) => (
            <button key={item.id} type="button" className="variant" aria-pressed={selected === index} onClick={() => setSelected(index)}>
              <Wireframe kind={item.id} total={slide.total} />
              <span className="variant-name"><span className="step-square">{item.id}</span>{' '}{item.name}</span>
            </button>
          ))}
        </div>
        <div className="variant-detail" aria-live="polite">
          <div><p className="mini-label">{slide.labels.strength}</p><p>{variant.strength}</p></div>
          <div><p className="mini-label">{slide.labels.tradeoff}</p><p>{variant.tradeoff}</p></div>
        </div>
      </div>
      <article className="card card-dark-top decision">
        <p className="mini-label">{slide.decision.label}</p>
        <Wireframe kind="AC" total={slide.total} />
        <h3>{slide.decision.title}</h3>
        <p>{rich(slide.decision.text)}</p>
      </article>
    </div>
  )
}

function TicketsBody({ slide }) {
  const [state, setState] = useState(0)
  const statusFor = ticket => (state === 0 ? 'blocked' : state === 2 && ticket.tag ? 'done' : 'open')
  return (
    <div className="tickets">
      <div className="spec-steps">
        {slide.steps.map((step, index) => (
          <Fragment key={step.cmd}>
            {index > 0 && <Arrow down />}
            <article className="card spec-step">
              <p className="spec-cmd"><code>{step.cmd}</code><span aria-hidden="true"> → </span>{step.out}</p>
              <p>{rich(step.text)}</p>
            </article>
          </Fragment>
        ))}
      </div>
      <div className="ticket-centre">
        <article className="card card-dark-top first-ticket">
          <div className="ticket-top"><p className="mini-label">{slide.first.label}</p><Status state={state === 0 ? 'open' : 'done'} labels={slide.statusLabels} /></div>
          <h3>{slide.first.title}</h3>
          <code className="chip">{slide.first.customer}</code>
        </article>
        <div className="progress-picker">
          <Choice visibleLabel={slide.progressLabel} options={slide.states} value={state} onChange={setState} className="choice-stack" />
        </div>
      </div>
      <div className="ticket-list">
        <p className="mini-label">{slide.ticketsLabel}</p>
        <ul>
          {slide.tickets.map(ticket => (
            <li key={ticket.customer}>
              <span className="ticket-title">{ticket.title}{ticket.tag && <>{' '}<span className="tag">{ticket.tag}</span></>}</span>
              <code className="chip">{ticket.customer}</code>
              <Status state={statusFor(ticket)} labels={slide.statusLabels} />
            </li>
          ))}
        </ul>
        <p className="caption">{slide.ticketsNote}</p>
      </div>
    </div>
  )
}

function TddBody({ slide }) {
  const { seam, loop, proof } = slide
  return (
    <div className="tdd">
      <div className="seam">
        <p className="section-label">{seam.label}</p>
        <p className="seam-inputs">{seam.inputs.map(item => <code className="chip" key={item}>{item}</code>)}</p>
        <Arrow down />
        <div className="seam-module"><strong>{seam.module}</strong><small>{seam.moduleText}</small></div>
        <Arrow down />
        <div className="seam-page"><strong>{seam.page}</strong><small>{seam.pageText}</small></div>
      </div>
      <div className="loop">
        <p className="section-label">{loop.label}</p>
        <div className="red-green">
          <div className="rg rg-red"><strong>{loop.red}</strong><small>{loop.redText}</small></div>
          <span className="cycle" aria-hidden="true">⇄</span>
          <div className="rg rg-green"><strong>{loop.green}</strong><small>{loop.greenText}</small></div>
        </div>
        <h3>{loop.rule}</h3>
        <p className="mini-label">{loop.testsLabel}</p>
        <ul className="test-list">{loop.tests.map(item => <li key={item}><code>{item}</code></li>)}</ul>
      </div>
      <div className="card proof">
        <p className="section-label">{proof.label}</p>
        <ul className="ticks">{proof.checks.map(item => <li key={item}>{rich(item)}</li>)}</ul>
        <p className="mini-label">{proof.expectedLabel}</p>
        <ul className="expected">
          {proof.expected.map(item => (
            <li key={item.customer}><code className="chip">{item.customer}</code><span>{item.value}</span><span className="ok" aria-hidden="true">✓</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function SessionsBody({ slide }) {
  return (
    <>
      <div className="swimlanes" style={{ '--columns': slide.columns }}>
        {slide.lanes.map(lane => (
          <div className="lane" key={lane.name}>
            <div className="lane-head"><strong>{lane.name}</strong><small>{lane.meta}</small></div>
            <ol className="lane-track">
              {lane.nodes.map(node => (
                <li key={`${node.label}-${node.from}`} className={`node${node.kind ? ` node-${node.kind}` : ''}`} style={{ gridColumn: `${node.from} / ${(node.to ?? node.from) + 1}`, gridRow: 1 }}>{node.label}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <p className="caption">{slide.caption}</p>
    </>
  )
}

function DesignBody({ slide }) {
  const [selected, setSelected] = useState(0)
  const option = slide.triage.options[selected]
  return (
    <div className="design-flow">
      <div className="design-setup">
        <article className="card"><code className="card-cmd">{slide.product.file}</code><p>{rich(slide.product.text)}</p></article>
        <Arrow down />
        <article className="card"><h3>{slide.hook.title}</h3><p>{slide.hook.text}</p><code className="path">{slide.hook.path}</code></article>
      </div>
      <Arrow />
      <article className="card audit-card">
        <code className="card-cmd">{slide.audit.cmd}</code>
        <p>{slide.audit.text}</p>
        <ul className="audit-areas">{slide.audit.areas.map(area => <li key={area}><span>{area}</span><code>{slide.audit.scale}</code></li>)}</ul>
        <p className="audit-total"><strong>{slide.audit.totalLabel}</strong><code>{slide.audit.total}</code></p>
        <p className="caption">{slide.audit.note}</p>
      </article>
      <Arrow />
      <div className="triage">
        <Choice visibleLabel={slide.triage.label} options={slide.triage.options.map(item => item.label)} value={selected} onChange={setSelected} className="choice-stack" />
        <article className="card triage-result" aria-live="polite"><h3>{option.result}</h3><p>{option.text}</p></article>
      </div>
      <Arrow />
      <article className="card polish-card">
        <code className="card-cmd">{slide.polish.cmd}</code>
        <ul className="ticks">{slide.polish.items.map(item => <li key={item}>{item}</li>)}</ul>
      </article>
    </div>
  )
}

function VerifyBody({ slide }) {
  const [checks, setChecks] = useState({ typecheck: true, test: false })
  const passing = slide.gate.checks.every(check => checks[check.id])
  return (
    <>
      <ol className="verify-rows">
        {slide.rows.map((row, index) => (
          <li className="card verify-row" key={row.title}>
            <span className={`step-square${row.solid ? ' solid' : ''}`}>{index + 1}</span>
            <h3>{row.title}</h3>
            {row.gate ? (
              <>
                <div className="gate-checks" role="group" aria-label={slide.gate.label}>
                  {slide.gate.checks.map(check => (
                    <button key={check.id} type="button" aria-pressed={checks[check.id]} onClick={() => setChecks(current => ({ ...current, [check.id]: !current[check.id] }))}>
                      <code>{check.label}</code>{' '}
                      <span className="gate-mark" aria-hidden="true">{checks[check.id] ? '✓' : '✗'}</span>
                      <span className="sr-only">{checks[check.id] ? slide.gate.pass : slide.gate.fail}</span>
                    </button>
                  ))}
                </div>
                <span className={`owner gate-result ${passing ? 'is-pass' : 'is-fail'}`} aria-live="polite">{passing ? slide.gate.allowed : slide.gate.blocked}</span>
              </>
            ) : (
              <>
                <p className="verify-chips">{row.chips.map(chip => <code className="chip" key={chip}>{chip}</code>)}</p>
                <span className={`owner${row.solid ? ' is-solid' : ''}`}>{row.owner}</span>
              </>
            )}
          </li>
        ))}
      </ol>
      <p className="caption">{slide.caption}</p>
    </>
  )
}

function HandsOnBody({ slide }) {
  const [level, setLevel] = useState(0)
  const [done, setDone] = useState([])
  const option = slide.levels.options[level]
  const toggle = index => setDone(current => (current.includes(index) ? current.filter(item => item !== index) : [...current, index]))
  return (
    <div className="handson">
      <div className="card before">
        <p className="section-label">{slide.before.label}</p>
        <ul className="ticks">{slide.before.items.map(item => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="levels">
        <Choice visibleLabel={slide.levels.label} options={slide.levels.options.map(item => item.from)} value={level} onChange={setLevel} className="choice-row" />
        <div className="level-plan" aria-live="polite">
          <p className="level-move">
            <span className="step-square">{option.from}</span>
            <span className="move-arrow" aria-hidden="true">→</span>
            <span className="step-square solid">{option.to}</span>
          </p>
          <p>{rich(option.text)}</p>
          {option.tools.length > 0 && <p className="level-tools">{option.tools.map(tool => <code className="chip" key={tool}>{tool}</code>)}</p>}
        </div>
      </div>
      <div className="card show">
        <p className="section-label">{slide.show.label}</p>
        <div className="checklist">
          {slide.show.items.map((item, index) => (
            <label key={item}><input type="checkbox" checked={done.includes(index)} onChange={() => toggle(index)} /><span>{item}</span></label>
          ))}
        </div>
        <p className="checklist-status" role="status">{slide.show.progress.replace('{done}', done.length).replace('{total}', slide.show.items.length)}</p>
        <p className="caption">{slide.show.privacy}</p>
      </div>
    </div>
  )
}

function SkillsBody({ slide }) {
  const [filter, setFilter] = useState(0)
  return (
    <>
      <div className="skills-head">
        <ul className="skill-sources">
          {slide.sources.map(source => <li key={source.id} className={`src-${source.id}`}><span className="count">{source.count}</span>{' '}{source.name}</li>)}
        </ul>
        <Choice label={slide.filterLabel} options={slide.filters} value={filter} onChange={setFilter} className="choice-row" />
      </div>
      <p className="caption skills-note">{slide.note}</p>
      <ul className="skill-grid">
        {slide.skills.map(skill => (
          <li key={skill.name} className={`skill src-${skill.src}${filter === 1 && !skill.used ? ' is-dim' : ''}`}>
            <code>{skill.name}</code><span>{skill.text}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

const BODIES = {
  why: WhyBody,
  contoso: ContosoBody,
  workflow: WorkflowBody,
  readiness: ReadinessBody,
  ladder: LadderBody,
  grill: GrillBody,
  prototype: PrototypeBody,
  tickets: TicketsBody,
  tdd: TddBody,
  sessions: SessionsBody,
  design: DesignBody,
  verify: VerifyBody,
  handson: HandsOnBody,
  skills: SkillsBody,
  debrief: ({ slide }) => <Cards cards={slide.cards} />,
}

export function WorkshopSlide({ index, slide }) {
  const active = useSlides().current === index
  const hero = slide.type === 'title'
  const Body = BODIES[slide.type]
  return (
    <Slide index={index} className={`workshop-slide slide-${slide.type}${hero ? ' hero-slide' : ''}`}>
      <div className="slide-rule" aria-hidden="true" />
      <div className={`slide-content${active ? ' is-active' : ''}`} inert={!active} aria-hidden={!active}>
        {hero ? <TitleSlide slide={slide} /> : (
          <>
            <Heading slide={slide} />
            <div className="slide-body"><Body slide={slide} /></div>
            <Takeaway takeaway={slide.takeaway} />
          </>
        )}
      </div>
      <BottomBar text={<span className="slide-footer"><span>{EVENT.footer}</span><span>{EVENT.footerRight}</span></span>} />
    </Slide>
  )
}
