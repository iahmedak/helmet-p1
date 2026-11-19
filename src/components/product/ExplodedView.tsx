import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { EXPERIENCE } from '../../data'
import { cx } from '../../lib/cx'
import { HelmetRender } from './HelmetRender'

/*
  The anatomy view. A 2D callout diagram rather than a fake 3D exploded render:
  the helmet is drawn once, the four documented parts are pinned to the places
  they actually sit, and selecting one explains what it does and what it is.
*/
export function ExplodedView() {
  const parts = EXPERIENCE.parts
  const [activeId, setActiveId] = useState(parts[0].id)
  const [showAll, setShowAll] = useState(false)
  const active = parts.find((p) => p.id === activeId) ?? parts[0]
  const index = parts.indexOf(active)

  const step = (d: number) => setActiveId(parts[(index + d + parts.length) % parts.length].id)

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="caps text-muted">
          {parts.length} parts · annotated
        </p>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-pressed={showAll}
          className={cx(
            'round inline-flex h-10 items-center rounded-full border px-4 text-[13px] font-medium transition-colors',
            showAll ? 'border-violet bg-violet text-white' : 'border-line-strong text-ink hov:border-ink',
          )}
        >
          {showAll ? 'Hide all callouts' : 'Show all callouts'}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[var(--radius-card-sm)] bg-soft px-2 py-4 sm:px-6">
        <div className="relative mx-auto max-w-[640px]">
          <HelmetRender tone="light" />

          {parts.map((p) => {
          const isActive = p.id === active.id
          const label = showAll || isActive
          return (
            <div
              key={p.id}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                type="button"
                onClick={() => setActiveId(p.id)}
                aria-pressed={isActive}
                aria-label={`${p.n}. ${p.title}`}
                className={cx(
                  'round grid size-9 place-items-center rounded-full border text-[12px] font-semibold transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] sm:size-10',
                  isActive
                    ? 'border-violet bg-violet text-white shadow-[0_0_0_6px_rgb(0_113_227/0.18)]'
                    : 'border-ink/25 bg-white/95 text-ink hov:border-ink',
                )}
              >
                {p.n}
              </button>
              {label && (
                  <motion.span
                    initial={{ opacity: 0, x: p.x > 55 ? 6 : -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22 }}
                    className={cx(
                      'pointer-events-none absolute top-1/2 hidden -translate-y-1/2 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-ink shadow-[var(--shadow-card)] sm:block',
                      p.x > 55 ? 'right-[calc(100%+10px)]' : 'left-[calc(100%+10px)]',
                    )}
                  >
                    {p.title}
                  </motion.span>
              )}
            </div>
          )
        })}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
        >
            <p className="caps text-violet">
              {String(active.n).padStart(2, '0')} · {active.title}
            </p>
            <p className="mt-2 font-mono text-[12px] text-muted">{active.spec}</p>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink-2">{active.body}</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous part"
            className="round grid size-10 place-items-center rounded-full border border-line-strong text-ink transition-colors hov:border-ink"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <span className="font-mono text-[12px] text-muted tabular-nums">
            {index + 1}/{parts.length}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next part"
            className="round grid size-10 place-items-center rounded-full border border-line-strong text-ink transition-colors hov:border-ink"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
