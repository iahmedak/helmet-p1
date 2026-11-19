import { Play, Volume2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'

import { CADENCES, type Cadence } from '../../data'
import { cx } from '../../lib/cx'

/** The silence between pulses, in ms, as documented for each pattern. */
const GAP: Record<string, number> = { L: 0, R: 80, U: 60, D: 0, C: 50 }

/*
  The cue lab. Every tone here is generated with the Web Audio API at the
  frequencies, pulse lengths and gaps from the project documentation, so this
  is a simulation of the firmware, not a recording and not an invention.
*/
export function CadenceLab() {
  const [selected, setSelected] = useState<Cadence>(CADENCES[0])
  const [playing, setPlaying] = useState<string | null>(null)
  const [pulse, setPulse] = useState<number | null>(null)
  const [error, setError] = useState('')
  const ctxRef = useRef<AudioContext | null>(null)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      void ctxRef.current?.close().catch(() => {})
    },
    [],
  )

  function audio(): AudioContext | null {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    const ctx = ctxRef.current ?? new Ctor()
    ctxRef.current = ctx
    void ctx.resume()
    return ctx
  }

  /** Schedules one pattern from `start`; returns its length in seconds. */
  function schedule(ctx: AudioContext, c: Cadence, start: number) {
    const gap = (GAP[c.cmd] ?? 0) / 1000
    let t = start
    c.pulses.forEach((p, i) => {
      const seconds = p.ms / 1000
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(p.freq, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.008)
      gain.gain.setValueAtTime(0.09, t + Math.max(0.012, seconds - 0.012))
      gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + seconds + 0.03)
      const at = Math.max(0, (t - ctx.currentTime) * 1000)
      timers.current.push(
        window.setTimeout(() => {
          setPlaying(c.cmd)
          setPulse(i)
        }, at),
      )
      t += seconds + gap
    })
    return t - start
  }

  function playCue(c: Cadence) {
    clearTimers()
    setPulse(null)
    const ctx = audio()
    if (!ctx) {
      setError('This browser cannot generate audio.')
      return
    }
    setError('')
    const duration = schedule(ctx, c, ctx.currentTime + 0.06)
    timers.current.push(
      window.setTimeout(() => {
        setPlaying(null)
        setPulse(null)
      }, duration * 1000 + 200),
    )
  }

  function playAll() {
    clearTimers()
    setPulse(null)
    const ctx = audio()
    if (!ctx) {
      setError('This browser cannot generate audio.')
      return
    }
    setError('')
    let at = ctx.currentTime + 0.06
    let total = 0
    for (const c of CADENCES) {
      const d = schedule(ctx, c, at)
      at += d + 0.6
      total += d + 0.6
    }
    timers.current.push(
      window.setTimeout(() => {
        setPlaying(null)
        setPulse(null)
      }, total * 1000 + 200),
    )
  }

  const gap = GAP[selected.cmd] ?? 0
  const totalMs = selected.pulses.reduce((s, p) => s + p.ms, 0) + gap * (selected.pulses.length - 1)

  return (
    <div className="grid gap-5">
      <div role="group" aria-label="Navigation commands" className="flex flex-wrap gap-2">
        {CADENCES.map((c) => (
          <button
            key={c.cmd}
            type="button"
            aria-pressed={selected.cmd === c.cmd}
            onClick={() => setSelected(c)}
            className={cx(
              'round inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[14px] font-medium transition-colors duration-[var(--duration-fast)]',
              selected.cmd === c.cmd
                ? 'border-violet bg-violet text-white'
                : 'border-white/25 text-white/85 hov:border-white/60',
            )}
          >
            <span className="font-mono text-[12px] opacity-70">{c.cmd}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--radius-card-sm)] border border-white/15 p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-[19px] font-medium text-white">{selected.label}</p>
            <p className="mt-0.5 text-[14px] text-night-muted">{selected.description}</p>
          </div>
          <p className="font-mono text-[12px] text-night-muted">
            {selected.freq} · {totalMs} ms
          </p>
        </div>

        <div className="mt-6" aria-hidden>
          <div className="flex h-24 items-end gap-1">
            {selected.pulses.map((p, i) => (
              <Fragment key={`${selected.cmd}-${i}`}>
                <motion.span
                  initial={false}
                  animate={{ height: pulse === i ? '100%' : '58%' }}
                  transition={{ duration: 0.12 }}
                  className={cx('rounded-[3px]', pulse === i ? 'bg-white' : 'bg-violet')}
                  style={{ flexGrow: p.ms, flexBasis: 0 }}
                />
                {gap > 0 && i < selected.pulses.length - 1 && (
                  <span className="rounded-sm bg-white/15" style={{ flexGrow: gap, flexBasis: 0, height: '8%' }} />
                )}
              </Fragment>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-night-muted">
            <span>0 ms</span>
            <span>{selected.pattern}</span>
            <span>{totalMs} ms</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => playCue(selected)}
            className="round inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-medium text-ink transition-colors hov:bg-violet hov:text-white"
          >
            <Play className="size-4" aria-hidden />
            Play {selected.cmd}
          </button>
          <button
            type="button"
            onClick={playAll}
            className="round inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-[14px] font-medium text-white transition-colors hov:border-white/60"
          >
            <Volume2 className="size-4" aria-hidden />
            Play all five
          </button>
          <p aria-live="polite" className="text-[12px] text-night-muted">
            {playing ? `Playing ${playing}` : 'Idle'}
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-[13px] text-[#ff9a9f]">
            {error}
          </p>
        )}
      </div>

      <p className="max-w-xl text-[12px] leading-relaxed text-night-muted">
        A simulation of the firmware, not a recording: tones are generated in the browser at the
        documented 1800–3000 Hz, with playback gain kept low. The physical buzzer’s loudness and
        damping are not simulated.
      </p>
    </div>
  )
}
