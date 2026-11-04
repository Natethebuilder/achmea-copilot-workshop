import { useEffect, useRef, useState } from 'react'
import { SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import project from '../deck.config.js'
import { EVENT, SLIDES } from './content.js'

function DeckControls() {
  const { current, totalSlides, goTo } = useSlides()
  const [contents, setContents] = useState(false)
  const dialog = useRef(null)
  const menuButton = useRef(null)

  useEffect(() => {
    const readSlide = () => {
      const requested = new URLSearchParams(location.hash.split('?')[1]).get('slide')
      if (requested !== null && /^\d+$/.test(requested)) goTo(Math.min(Number(requested), totalSlides - 1))
    }
    readSlide()
    window.addEventListener('hashchange', readSlide)
    return () => window.removeEventListener('hashchange', readSlide)
  }, [goTo, totalSlides])

  useEffect(() => {
    if (contents) dialog.current.showModal()
    else if (dialog.current.open) dialog.current.close()
  }, [contents])

  return (
    <>
      <div className="deck-progress" aria-hidden="true"><div style={{ width: `${((current + 1) / totalSlides) * 100}%` }} /></div>
      <header className="deck-chrome">
        <a className="deck-brand" href="#/" aria-label="Workshop overview">{EVENT.eyebrow}</a>
        <button ref={menuButton} onClick={() => setContents(true)} aria-haspopup="dialog" aria-expanded={contents}>All slides <span aria-hidden="true">☰</span></button>
      </header>
      <nav className="deck-navigation" aria-label="Slide navigation">
        <span className="nav-section">{SLIDES[current].section}</span>
        <button aria-label="Previous slide" disabled={current === 0} onClick={() => goTo(current - 1)}>←</button>
        <span className="slide-counter" aria-live="polite">{String(current + 1).padStart(2, '0')} <span>/ {totalSlides}</span></span>
        <button aria-label="Next slide" disabled={current === totalSlides - 1} onClick={() => goTo(current + 1)}>→</button>
      </nav>
      <dialog ref={dialog} className="slide-menu" aria-label="Slide index" onClose={() => { setContents(false); menuButton.current.focus() }} onClick={event => { if (event.target === event.currentTarget) setContents(false) }}>
        <div className="panel-heading"><div><p className="eyebrow">PRESENTATION</p><h2>Slides</h2></div><button onClick={() => setContents(false)} aria-label="Close slide index">×</button></div>
        <div className="menu-list">
          {SLIDES.map((item, index) => (
            <button key={item.id} aria-current={current === index ? 'step' : undefined} onClick={() => { goTo(index); setContents(false) }}>
              <span>{String(index + 1).padStart(2, '0')}</span><span>{item.title}{item.highlight ? ` ${item.highlight}` : ''}<small>{item.section}</small></span><span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </dialog>
    </>
  )
}

export default function DeckView() {
  return (
    <SlideProvider totalSlides={project.slides.length} project={project.id} slides={project.slides} theme={project.theme} mode="present">
      <DeckControls />
      <main className="deck" data-project-id={project.id} aria-label={`${EVENT.eyebrow} presentation`}>
        {project.slides.map((Component, index) => (
          <SlideErrorBoundary key={SLIDES[index].id} index={index}>
            <Component index={index} project={project} />
          </SlideErrorBoundary>
        ))}
      </main>
    </SlideProvider>
  )
}
