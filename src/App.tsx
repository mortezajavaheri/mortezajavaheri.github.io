import { useCallback, useState } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { BootLoader } from '@/components/BootLoader'
import { BootContext } from '@/hooks/useBoot'
import { useKonami } from '@/hooks/useKonami'
import { usePreferences } from '@/hooks/usePreferences'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Stack } from '@/sections/Stack'
import { Experience } from '@/sections/Experience'
import { Projects } from '@/sections/Projects'
import { Thinking } from '@/sections/Thinking'
import { TerminalSection } from '@/sections/TerminalSection'
import { Contact } from '@/sections/Contact'

export default function App() {
  const { reducedMotion, inspect, setInspect, notify } = usePreferences()
  const [booted, setBooted] = useState(false)
  const onBooted = useCallback(() => setBooted(true), [])

  useKonami(() => {
    setInspect(!inspect)
    notify(inspect ? 'Inspect mode off.' : 'Inspect mode on — component boundaries visible.')
  })

  return (
    <BootContext.Provider value={booted}>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[80] -translate-y-20 bg-fg px-3 py-2 text-sm font-medium text-ink-950 focus:translate-y-0"
      >
        Skip to content
      </a>
      <BootLoader onDone={onBooted} reducedMotion={reducedMotion} />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Projects />
        <Thinking />
        <TerminalSection />
        <Contact />
      </main>
      <Footer />
    </BootContext.Provider>
  )
}
