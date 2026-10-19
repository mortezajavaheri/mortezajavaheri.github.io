import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { highlightCSharp } from '@/lib/highlight'
import { cn } from '@/lib/cn'
import { revealViewport } from '@/animations/tokens'

interface CodePanelProps {
  filename: string
  code: string
  language?: string
  className?: string
}

/** Editor-style code panel: tab bar, line numbers, syntax colours, lines revealed in sequence. */
export function CodePanel({ filename, code, language = 'C#', className }: CodePanelProps) {
  const lines = useMemo(() => highlightCSharp(code), [code])

  return (
    <figure className={cn('overflow-hidden border border-line bg-ink-900/70', className)}>
      <figcaption className="flex h-9 items-center justify-between border-b border-line pr-3 font-mono text-[11px]">
        <span className="flex h-full items-center gap-2 border-r border-line bg-ink-850 px-3 text-fg">
          <span className="size-1.5 bg-accent" aria-hidden="true" />
          {filename}
        </span>
        <span className="text-fg-dim">{language}</span>
      </figcaption>
      <motion.pre
        className="scrollbar-thin overflow-x-auto py-4 font-mono text-[12.5px] leading-[1.7]"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={{ visible: { transition: { staggerChildren: 0.035 } } }}
      >
        <code>
          {lines.map((tokens, i) => (
            <motion.span
              key={i}
              className="flex"
              variants={{ hidden: { opacity: 0, x: -6 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.3 }}
            >
              <span className="w-10 shrink-0 select-none pr-4 text-right text-ink-600" aria-hidden="true">
                {i + 1}
              </span>
              <span className="whitespace-pre pr-6">
                {tokens.length === 0 ? ' ' : tokens.map((t, j) => <span key={j} className={t.kind === 'plain' ? 'text-fg' : `tok-${t.kind}`}>{t.text}</span>)}
              </span>
            </motion.span>
          ))}
        </code>
      </motion.pre>
    </figure>
  )
}
