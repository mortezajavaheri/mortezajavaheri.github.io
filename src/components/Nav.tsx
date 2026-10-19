import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, SquareTerminal, X } from 'lucide-react'
import { navItems, sectionIds } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/lib/cn'
import { pad2 } from '@/lib/format'
import { duration, ease, stagger } from '@/animations/tokens'
import { StatusDot } from './StatusDot'

function Logo() {
  return (
    <a href="#system" className="group flex items-center gap-2.5" aria-label={`${profile.name} — back to top`}>
      <span className="relative grid size-7 place-items-center border border-line-strong bg-ink-900 font-mono text-[11px] font-semibold text-fg transition-colors group-hover:border-accent">
        mj
        <span className="absolute -right-px -top-px size-1.5 bg-accent" aria-hidden="true" />
      </span>
      <span className="hidden font-mono text-[12px] tracking-tight text-fg-muted sm:inline">
        {profile.firstName.toLowerCase()}
        <span className="text-fg-dim">.</span>
        {profile.lastName.toLowerCase()}
      </span>
    </a>
  )
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-40 flex flex-col bg-ink-950/[0.98] px-5 pb-8 pt-20 backdrop-blur-sm lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: duration.fast } }}
        >
          <motion.ul
            className="flex flex-1 flex-col justify-center gap-1"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: stagger.tight, delayChildren: 0.05 } } }}
          >
            {navItems.map((item, i) => (
              <motion.li
                key={item.id}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  visible: { opacity: 1, x: 0, transition: { duration: duration.base, ease: ease.out } },
                }}
              >
                <a
                  ref={i === 0 ? firstLink : undefined}
                  href={`#${item.id}`}
                  onClick={onClose}
                  aria-current={active === item.id ? 'true' : undefined}
                  className="flex items-baseline gap-4 border-b border-line py-3.5"
                >
                  <span className="font-mono text-[11px] text-fg-dim">{pad2(i + 1)}</span>
                  <span className={cn('text-3xl font-semibold tracking-[-0.03em]', active === item.id ? 'text-fg' : 'text-fg-muted')}>
                    {item.label}
                  </span>
                  {active === item.id && <span className="ml-auto size-1.5 self-center bg-accent" aria-hidden="true" />}
                </a>
              </motion.li>
            ))}
          </motion.ul>
          <div className="label-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <StatusDot /> System online
            </span>
            <a href="#terminal" onClick={onClose} className="text-fg-muted">
              $ open terminal
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Sticky top navigation. Expands at the top of the page, compacts into a floating bar on scroll. */
export function Nav() {
  const scrolled = useScrolled(40)
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-4" data-component="Nav">
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex items-center justify-between gap-6 border px-3 transition-[max-width,margin,height,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-4',
            scrolled
              ? 'mt-3 h-12 max-w-[1080px] border-line-strong bg-ink-900/80 backdrop-blur-md'
              : 'mt-0 h-16 max-w-[1400px] border-transparent bg-transparent',
          )}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative block px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200',
                      isActive ? 'text-fg' : 'text-fg-dim hover:text-fg-muted',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-2.5 -bottom-px h-px bg-accent"
                        transition={{ duration: duration.base, ease: ease.out }}
                        aria-hidden="true"
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="label-mono hidden items-center gap-2 text-[10px] sm:flex">
              <StatusDot />
              <span className="text-fg-muted">System online</span>
            </span>
            <a
              href="#terminal"
              className="hidden size-8 place-items-center border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg lg:grid"
              aria-label="Open the interactive terminal"
              title="Terminal"
            >
              <SquareTerminal className="size-4" strokeWidth={1.5} />
            </a>
            <button
              type="button"
              className="grid size-9 place-items-center border border-line text-fg lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={open} onClose={close} active={active} />
    </>
  )
}
