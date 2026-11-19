import { ChevronDown, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'

import { Accordion } from '../components/Content'
import { Nav } from '../components/Nav'
import { CadenceLab } from '../components/product/CadenceLab'
import { ExplodedView } from '../components/product/ExplodedView'
import { HelmetRender } from '../components/product/HelmetRender'
import { RideSequence } from '../components/product/RideSequence'
import { SignalFlow } from '../components/product/SignalFlow'
import { StatusBoard } from '../components/product/StatusBoard'
import { EXPERIENCE, FAQ, HOME } from '../data'
import { useDocumentTitle } from '../lib/storage'

const EASE = [0.22, 1, 0.36, 1] as const
const PILL =
  'round inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-colors duration-[var(--duration-fast)]'

/** A big sentence-case section heading, one line per entry. */
function Heading({ id, lines, className, size = 'md' }: { id?: string; lines: string[]; className?: string; size?: 'md' | 'lg' }) {
  return (
    <h2
      id={id}
      className={
        (size === 'lg'
          ? 'text-[clamp(2.2rem,1.3rem+3.4vw,3.9rem)] leading-[0.98] '
          : 'text-[clamp(1.9rem,1.2rem+2.5vw,3.2rem)] leading-[1] ') +
        'font-semibold tracking-[-0.04em] ' +
        (className ?? '')
      }
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  )
}

function Reveal() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -70])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  return (
    <section
      id="overview"
      ref={ref}
      aria-labelledby="reveal-title"
      className="relative scroll-mt-2 overflow-hidden rounded-[var(--radius-card)] bg-night text-white"
    >
      <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-60" />
      <div aria-hidden className="key-light pointer-events-none absolute inset-0" />

      <div className="relative px-5 pt-3 pb-8 sm:px-8 sm:pb-10">
        <Nav tone="night" />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[1.02fr_1fr] lg:items-center">
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="caps text-violet-light"
            >
              {HOME.eyebrow}
            </motion.p>
            <h1
              id="reveal-title"
              className="mt-4 text-[clamp(3rem,1.3rem+6.6vw,6.6rem)] leading-[0.92] font-semibold tracking-[-0.05em]"
            >
              {['Hear the', 'road.'].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.05em]">
                  <motion.span
                    className="block"
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.1, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="mt-6 max-w-md text-[clamp(1rem,0.94rem+0.3vw,1.2rem)] leading-relaxed text-white/65"
            >
              {HOME.standfirst}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.62, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <a href="#hardware" className={`${PILL} bg-white text-ink hov:bg-violet hov:text-white`}>
                Explore the hardware
                <ChevronDown className="size-4" aria-hidden />
              </a>
              <Link to="/services" className="group inline-flex items-center gap-1 text-[15px] text-violet hov:underline">
                Tech specs
                <ChevronRight className="size-4 transition-transform group-hov:translate-x-0.5" aria-hidden />
              </Link>
            </motion.div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-white/50">
              {['Working prototype', 'BLE 5.0', '24 h+ runtime', 'under 50 ms'].map((chip) => (
                <li key={chip} className="inline-flex items-center gap-2">
                  <span aria-hidden className="size-1.5 rounded-full bg-violet" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <motion.div style={reduce ? undefined : { y, scale }} className="relative">
            <div
              aria-hidden
              className="absolute inset-x-[8%] top-[14%] bottom-[12%] rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgb(0_113_227/0.32),transparent_72%)] blur-2xl"
            />
            <HelmetRender tone="dark" className="relative" />
            <div className="pointer-events-none absolute top-[32%] right-[6%] hidden items-center gap-2 lg:flex">
              <span aria-hidden className="h-px w-10 bg-violet/60" />
              <span className="round rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] text-white/75 backdrop-blur">
                ESP32-C3 · BLE
              </span>
            </div>
            <div className="pointer-events-none absolute top-[72%] right-[4%] hidden items-center gap-2 lg:flex">
              <span aria-hidden className="h-px w-7 bg-violet/60" />
              <span className="round rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] text-white/75 backdrop-blur">
                Piezo · 2400 Hz
              </span>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5">
          <p className="text-[12px] text-white/45">{HOME.heroCaption}</p>
          <a href="#problem" className="inline-flex items-center gap-1.5 text-[12px] text-white/70 hov:text-white">
            Scroll to explore
            <ChevronDown className="size-4 animate-bounce" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  const p = EXPERIENCE.problem
  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="scroll-mt-2 rounded-[var(--radius-card)] bg-card p-6 sm:p-10"
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-14">
        <div>
          <p className="caps text-violet">{p.kicker}</p>
          <Heading id="problem-title" lines={p.title} size="lg" className="mt-3" />
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted text-pretty">{p.body}</p>
        </div>

        <div className="rounded-[var(--radius-card-sm)] bg-soft p-6">
          <p className="text-[clamp(2.6rem,1.6rem+3vw,4rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums">
            {p.calc.metres} m
          </p>
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted">{p.calc.line}</p>
          <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] text-muted">{p.calc.working}</p>

          <div className="mt-6 grid gap-2">
            {p.rows.map((row) => (
              <div key={row.label} className="flex items-baseline gap-4 rounded-[var(--radius-xs)] bg-card px-4 py-3">
                <span className="w-9 shrink-0 font-mono text-[15px] text-muted tabular-nums">{row.cost}</span>
                <div>
                  <p className="text-[14px] font-medium text-ink">{row.headline}</p>
                  <p className="mt-0.5 text-[12px] text-muted">
                    {row.label} — {row.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Overview() {
  return (
    <section
      id="hardware"
      aria-labelledby="overview-title"
      className="scroll-mt-2 rounded-[var(--radius-card)] bg-card p-6 sm:p-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="caps text-violet">Product overview</p>
          <Heading id="overview-title" lines={['Four parts.', 'In the foam.']} size="lg" className="mt-3" />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted">
          Select a marker to see the part, where it sits and what it does. Nothing here is decorative:
          every item is in the bill of materials.
        </p>
      </div>
      <div className="mt-9">
        <ExplodedView />
      </div>
    </section>
  )
}

function CueLab() {
  return (
    <section aria-labelledby="cue-title" className="rounded-[var(--radius-card)] bg-night p-6 text-white sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="caps text-violet-light">Feature 01 · the interface</p>
          <Heading id="cue-title" lines={['One buzzer.', 'Five cues.']} size="lg" className="mt-3" />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-white/55">
          Pattern does the work: a chirp count for direction, pitch for urgency, one long tone for
          arrival. Press them and listen.
        </p>
      </div>
      <div className="mt-10">
        <CadenceLab />
      </div>
    </section>
  )
}

function Ride() {
  return (
    <section aria-labelledby="ride-title" className="rounded-[var(--radius-card)] bg-card p-6 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="caps text-violet">Feature 02 · in use</p>
          <Heading id="ride-title" lines={['A ride,', 'in three cues.']} size="lg" className="mt-3" />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted">
          The same hardware, the same five patterns, from the rider’s side. Scroll to move through the
          route.
        </p>
      </div>
      <div className="mt-10">
        <RideSequence />
      </div>
    </section>
  )
}

function Signal() {
  return (
    <section aria-labelledby="signal-title" className="rounded-[var(--radius-card)] bg-night-2 p-6 text-white sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="caps text-violet-light">Feature 03 · the system</p>
          <Heading id="signal-title" lines={['From phone', 'to ear.']} size="lg" className="mt-3" />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-white/55">
          Follow one command through the hardware. Every step is a real stage of Prototype 04, from the
          GATT write to the pulse in the ear pocket.
        </p>
      </div>
      <div className="mt-10">
        <SignalFlow />
      </div>
    </section>
  )
}

function Status() {
  return (
    <section aria-labelledby="status-title" className="rounded-[var(--radius-card)] bg-card p-6 sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="caps text-violet">Status</p>
          <Heading id="status-title" lines={['What works,', 'and what does not.']} size="lg" className="mt-3" />
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted">
          Prototype 04 is working bench hardware, not a product. The columns below separate measured
          behaviour from tuning work and from features that exist only on paper.
        </p>
      </div>
      <div className="mt-9">
        <StatusBoard />
      </div>
      <p className="mt-5 max-w-2xl text-[12px] leading-relaxed text-muted">
        Planned items are not fitted to the helmet. There is no microphone, no speaker beyond the single
        piezo, and no on-device voice model.
      </p>
    </section>
  )
}

function Reference() {
  return (
    <div className="grid gap-2 lg:grid-cols-[1fr_1.15fr]">
      <section aria-labelledby="specs-title" className="rounded-[var(--radius-card)] bg-card p-6 sm:p-8">
        <p className="caps text-violet">Reference</p>
        <Heading id="specs-title" lines={['Tech', 'specs']} className="mt-3" />
        <dl className="mt-7 divide-y divide-line border-y border-line">
          {HOME.specs.map((s) => (
            <div key={s.label} className="grid gap-1 py-3.5">
              <dt className="text-[12px] text-muted">{s.label}</dt>
              <dd className="text-[14px] font-medium text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
        <Link to="/services" className="mt-6 inline-flex items-center gap-1 text-[14px] text-violet hov:underline">
          Full specification
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </section>

      <section aria-labelledby="faq-title" className="rounded-[var(--radius-card)] bg-card p-6 sm:p-8">
        <p className="caps text-violet">Questions</p>
        <Heading id="faq-title" lines={['Asked at', 'the demo.']} className="mt-3" />
        <div className="mt-7">
          <Accordion items={FAQ} />
        </div>
      </section>
    </div>
  )
}

function Closing() {
  return (
    <section
      aria-labelledby="closing-title"
      className="relative overflow-hidden rounded-[var(--radius-card)] bg-night px-6 py-14 text-white sm:px-10 sm:py-20"
    >
      <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-40" />
      <div aria-hidden className="key-light pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="caps text-violet-light">Prototype 04 · 2026</p>
        <Heading id="closing-title" lines={['Hear the road.', 'Then forget the helmet.']} size="lg" className="mt-4" />
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-white/60">
          One board, one buzzer, one cell and a byte over Bluetooth. The next version gets the same
          treatment: measure it on the bench before it goes anywhere near a head.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link to="/contact" className={`${PILL} bg-white text-ink hov:bg-violet hov:text-white`}>
            Book a bench demo
          </Link>
          <Link to="/work" className="group inline-flex items-center gap-1 text-[15px] text-violet-light hov:underline">
            Read the build log
            <ChevronRight className="size-4 transition-transform group-hov:translate-x-0.5" aria-hidden />
          </Link>
        </div>
        <HelmetRender tone="dark" className="mx-auto mt-4 max-w-xl" />
        <p className="mt-2 text-[12px] text-white/35">
          First-year engineering project. No microphone, no camera, no AI in the current build.
        </p>
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle()
  return (
    <div className="grid gap-2 p-2">
      <Reveal />
      <Problem />
      <Overview />
      <CueLab />
      <Ride />
      <Signal />
      <Status />
      <Reference />
      <Closing />
    </div>
  )
}
