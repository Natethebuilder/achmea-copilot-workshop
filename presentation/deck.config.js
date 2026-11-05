import { createElement } from 'react'
import { EVENT, SLIDES } from './src/content.js'
import { WorkshopSlide } from './src/slides/Slides.jsx'

export default {
  id: 'achmea-copilot-workshop',
  title: `${EVENT.title} ${EVENT.highlight}`,
  subtitle: EVENT.tagline,
  description: EVENT.description,
  theme: 'light',
  appearance: 'light',
  accent: '#1f5c63',
  slides: SLIDES.map((slide) => {
    const Component = ({ index }) => createElement(WorkshopSlide, { index, slide })
    Component.displayName = slide.id
    return Component
  }),
}
