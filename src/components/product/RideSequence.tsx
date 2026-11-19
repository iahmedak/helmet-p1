import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, useState } from 'react'

import { CADENCES, EXPERIENCE } from '../../data'
import { cx } from '../../lib/cx'
import { HelmetRender } from './HelmetRender'

/*
  A scroll-driven ride. The stage pins while three moments pass: the junction,
  the bend and the arrival. Scroll position picks the moment, so the cue, the
  pulse pattern and the copy always describe the same thing.
*/
export function RideSequence() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [index, setIndex] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(EXPERIENCE.ride.length - 1, Math.max(0, Math.floor(v * EXPERIENCE.ride.length)))
    setIndex(next)
  })

  const scene = EXPERIENCE.ride[index]

  const stage = (i: number) => {
    const s = EXPERIENCE.ride[i]
    const c = CADENCES.find((x) => x.cmd === s.key) ?? CADENCES[0]
    return (
      <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div className="relative rounded-[var(--radius-card-sm)] bg-soft px-5 py-7 sm:px-8">
          <HelmetRender tone="light" className="mx-auto max-w-[460px]" />
          <div className="round absolute top-4 right-4 flex items-center gap-3 rounded-full border border-line-strong bg-white/90 px-4 py-2 backdrop-blur">
            <span className="font-mono text-[12px] text-muted">{`'${c.cmd}'`}</span>
            <span className="h-3 w-px bg-line" />
            <span className="text-[13px] font-medium">{c.label}</span>
            <span className="flex h-4 items-end gap-1" aria-hidden>
              {c.pulses.map((_, k) => (
                <motion.span
                  key={`${c.cmd}-${k}`}
                  className="w-1 rounded-full bg-violet"
                  animate={{ height: ['30%', '100%', '30%'] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: k * 0.16 }}
                />
              ))}
            </span>
          </div>
        </div>
        <div>
          <p className="caps text-muted">{s.moment}</p>
          <h3 className="mt-3 text-[clamp(1.8rem,1.3rem+1.9vw,2.8rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-ink">
            {s.title}
          </h3>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-muted">{s.body}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[12px] text-muted">
            <span>{c.freq}</span>
            <span>{c.pattern}</span>
          </div>
        </div>
      </div>
    )
  }

  if (reduce) {
    return (
      <div className="grid gap-10">
        {EXPERIENCE.ride.map((s, i) => (
          <div key={s.key} className="border-t border-line pt-8">
            <p className="caps text-muted">
              {String(i + 1).padStart(2, '0')} · {s.moment}
            </p>
            {stage(i)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative h-[280svh]">
      <div className="sticky top-0 flex h-[100svh] items-center bg-card">
        <div className="w-full">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="caps text-muted">Ride sequence</p>
            <div className="flex items-center gap-1.5" aria-hidden>
              {EXPERIENCE.ride.map((s, i) => (
                <span
                  key={s.key}
                  className={cx('h-1.5 rounded-full transition-all duration-300', i === index ? 'w-6 bg-violet' : 'w-1.5 bg-line-strong')}
                />
              ))}
            </div>
          </div>

          <div key={scene.key} className="relative min-h-[22rem]">
            {stage(index)}
          </div>

          <div className="mt-8 h-px w-full bg-line" aria-hidden>
            <motion.div className="h-px bg-violet" style={{ width }} />
          </div>
          <p className="mt-3 text-[12px] text-muted">Scroll to continue the ride</p>
          <p aria-live="polite" className="sr-only">
            {scene.moment}: {scene.title}
          </p>
        </div>
      </div>
    </div>
  )
}
