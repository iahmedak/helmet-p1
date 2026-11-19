import { Bluetooth, ChevronLeft, ChevronRight, Cpu, Ear, Smartphone, Volume2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import { EXPERIENCE } from '../../data'
import { cx } from '../../lib/cx'

const NODES = [
  { icon: Smartphone, label: 'Phone', sub: 'terminal' },
  { icon: Bluetooth, label: 'BLE', sub: 'GATT write' },
  { icon: Cpu, label: 'ESP32-C3', sub: 'firmware' },
  { icon: Volume2, label: 'PWM', sub: 'GPIO 3' },
  { icon: Ear, label: 'Ear', sub: 'cue' },
]

/*
  The signal path, one step at a time. Click a node or use the arrows; the
  connector fills as the command moves from the phone to the ear.
*/
export function SignalFlow() {
  const steps = EXPERIENCE.flow
  const [step, setStep] = useState(0)
  const current = steps[step]
  const progress = step / (steps.length - 1)

  return (
    <div className="grid gap-8">
      <div className="relative">
        <div aria-hidden className="absolute top-7 right-[8%] left-[8%] h-px bg-white/15" />
        <div
          aria-hidden
          className="absolute top-7 left-[8%] h-px bg-violet transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out-soft)]"
          style={{ width: `calc(${progress} * 84%)` }}
        />
        <ol className="relative grid grid-cols-5 gap-1">
          {NODES.map((node, i) => {
            const Icon = node.icon
            const isActive = i === step
            const isDone = i < step
            return (
              <li key={node.label} className="flex flex-col items-center gap-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-pressed={isActive}
                  aria-label={`Step ${i + 1}: ${steps[i].title}`}
                  className={cx(
                    'round grid size-14 place-items-center rounded-full border transition-[background-color,color,border-color,transform] duration-[var(--duration-base)]',
                    isActive
                      ? 'scale-105 border-violet bg-violet text-white'
                      : isDone
                        ? 'border-violet/60 bg-violet/15 text-violet-light'
                        : 'border-white/25 text-white/55 hov:border-white/60',
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.6} aria-hidden />
                </button>
                <span
                  className={cx(
                    'text-[12px] leading-tight font-medium',
                    isActive ? 'text-white' : 'text-night-muted',
                  )}
                >
                  {node.label}
                  <span className="mt-0.5 block text-[10px] font-normal opacity-70">{node.sub}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="min-h-[8.5rem]">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
        >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="caps text-violet-light">
                Step {step + 1} / {steps.length}
              </p>
              <p className="font-mono text-[12px] text-night-muted">{current.meta}</p>
            </div>
            <p className="mt-2 text-[clamp(1.25rem,1.05rem+0.7vw,1.6rem)] font-medium tracking-[-0.02em] text-white">
              {current.title}
            </p>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-night-muted">{current.detail}</p>
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/12 pt-5">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="round inline-flex h-10 items-center gap-1.5 rounded-full border border-white/25 px-4 text-[13px] font-medium text-white transition-colors hov:border-white/60 disabled:opacity-35"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back
        </button>
        <p aria-live="polite" className="sr-only">
          {current.title}. {current.detail}
        </p>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          className="round inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-medium text-ink transition-colors hov:bg-violet hov:text-white disabled:opacity-35"
        >
          Next
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
}
