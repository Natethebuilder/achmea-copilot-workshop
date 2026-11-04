import { useEffect, useState } from 'react'
import DeckView from './DeckView.jsx'
import { EVENT, HOME, SLIDES } from './content.js'
import { WorkshopAgenda } from './slides/Slides.jsx'
import styles from './App.module.css'

export default function App() {
  const [deck, setDeck] = useState(() => location.hash.startsWith('#/deck'))
  useEffect(() => {
    const update = () => setDeck(location.hash.startsWith('#/deck'))
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    document.title = `${EVENT.title} ${EVENT.highlight} / ${EVENT.eyebrow}`
  }, [])
  if (deck) return <DeckView />
  return (
    <main className={styles.site}>
      <header className="site-nav"><span>{EVENT.eyebrow}</span><a href="#/deck">Open presentation ↗</a></header>
      <section className="site-hero" data-panel id="welcome">
        <div className="site-hero-copy">
          <p className="eyebrow">{HOME.eyebrow}</p>
          <h1>{EVENT.title}<br /><em>{EVENT.highlight}</em></h1>
          <p className="site-tagline">{EVENT.tagline}</p>
          <p>{EVENT.description}</p>
          <div className="site-actions">
            <a className="primary-link" href="#/deck">{HOME.primary}<span>↗</span></a>
            <a href="#outline" onClick={event => { event.preventDefault(); document.getElementById('outline').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}>{HOME.secondary} ↓</a>
          </div>
          <div className="site-meta">{EVENT.meta.map(item => <span key={item}>{item}</span>)}</div>
        </div>
        <WorkshopAgenda />
      </section>
      <section className="site-index" data-panel id="outline">
        <p className="eyebrow">THE PROGRAMME</p>
        <h2>{HOME.indexTitle}</h2>
        <p className="index-description">{HOME.indexDescription}</p>
        <div className="outline-grid">
          {HOME.sections.map((section, index) => (
            <article key={section}>
              <span className="chapter-number">0{index + 1}</span>
              <h3>{section}</h3>
              <ol>{SLIDES.filter(slide => slide.section === section).map(slide => (
                <li key={slide.id}><a href={`#/deck?slide=${SLIDES.indexOf(slide)}`}>{slide.title} {slide.highlight}</a></li>
              ))}</ol>
            </article>
          ))}
        </div>
      </section>
      <footer className="site-footer"><span>{EVENT.footer}</span><span>{EVENT.scenario}</span></footer>
    </main>
  )
}
