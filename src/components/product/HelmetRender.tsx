import { useId } from 'react'

import { cx } from '../../lib/cx'

/*
  The product visual. There is no photograph or 3D render of the helmet in this
  project, so the product is drawn: a side profile with the shell, vent slots,
  a brim at the front, the ear recess with the piezo set into it, the chin strap
  and the Bluetooth link above the crown. Vector, so it stays sharp at any size
  and weighs nothing.

  To use a real render instead, swap the <g> for an <image> and keep the viewBox.
*/
export function HelmetRender({
  tone = 'dark',
  className,
  label = 'Side profile drawing of the SONA helmet, with the piezo in the ear recess and the Bluetooth link above the crown',
}: {
  tone?: 'dark' | 'light'
  className?: string
  label?: string
}) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (s: string) => `${raw}-${s}`
  const url = (s: string) => `url(#${id(s)})`
  const dark = tone === 'dark'
  const ink = '#1d1d1f'

  return (
    <svg viewBox="0 0 800 520" role="img" aria-label={label} className={cx('block h-auto w-full', className)}>
      <defs>
        <linearGradient id={id('shell')} x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor={dark ? '#f2f5f9' : '#fdfdfe'} />
          <stop offset="0.78" stopColor={dark ? '#d3d9e2' : '#e8ebf0'} />
          <stop offset="1" stopColor={dark ? '#a6aebb' : '#cfd4dc'} />
        </linearGradient>
        <linearGradient id={id('brim')} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor={dark ? '#eef2f7' : '#ffffff'} />
          <stop offset="1" stopColor={dark ? '#98a1b0' : '#b8bfc9'} />
        </linearGradient>
        <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a9d4ff" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#0071e3" stopOpacity="0.4" />
          <stop offset="1" stopColor="#0071e3" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('glow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0071e3" stopOpacity="0.45" />
          <stop offset="1" stopColor="#0071e3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id('recess')} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor={dark ? '#2a3038' : '#f3f6f9'} />
          <stop offset="1" stopColor={dark ? '#14181e' : '#dfe5ec'} />
        </radialGradient>
        <filter id={id('blur')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Floor shadow */}
      <ellipse
        cx="420"
        cy="452"
        rx="200"
        ry="11"
        fill="#000000"
        opacity={dark ? 0.55 : 0.07}
        filter={url('blur')}
      />

      {/* Bluetooth link above the crown */}
      <g fill="none" stroke="#0071e3" strokeLinecap="round">
        <path d="M354 76a26 26 0 0 1 52 0" strokeWidth="4" opacity="0.9" />
        <path d="M338 76a42 42 0 0 1 84 0" strokeWidth="3.5" opacity="0.5" />
        <path d="M322 76a58 58 0 0 1 116 0" strokeWidth="3" opacity="0.24" />
      </g>

      {/* Shell */}
      <path
        d="M172 402C136 366 118 296 138 234 160 150 262 94 382 92 502 90 608 132 656 210c30 46 44 100 40 146-2 14-12 22-28 22H206c-20 0-30 12-34 24Z"
        fill={url('shell')}
        stroke={ink}
        strokeOpacity={dark ? 0.32 : 0.55}
        strokeWidth="2.5"
      />

      {/* Foam line along the inside of the rim */}
      <path d="M212 374h452" fill="none" stroke={ink} strokeOpacity={dark ? 0.3 : 0.18} strokeWidth="6" strokeLinecap="round" />

      {/* Brim, overlapping the shell so it reads as one part */}
      <path
        d="M688 314c48 6 78 22 88 36 4 8-6 15-14 11l-76-23Z"
        fill={url('brim')}
        stroke={ink}
        strokeOpacity={dark ? 0.4 : 0.6}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Rim light down the back edge */}
      <path d="M152 258c24-84 108-144 220-156" fill="none" stroke={url('rim')} strokeWidth="5" strokeLinecap="round" />

      {/* Vent slots: lens shapes, not strokes */}
      <g fill={dark ? '#94a0b0' : '#c2cad5'} opacity={dark ? 0.6 : 1}>
        <path d="M254 206c48-32 118-38 166-20-48 20-118 28-166 38Z" />
        <path d="M240 272c60-32 146-38 202-18-56 20-142 28-202 38Z" />
        <path d="M276 338c54-26 126-30 176-14-50 14-122 18-176 26Z" />
      </g>
      <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeOpacity={dark ? 0.6 : 0.95}>
        <path d="M258 213c46-28 112-34 158-19" strokeWidth="2.5" />
        <path d="M245 279c58-28 138-33 192-16" strokeWidth="2.5" />
      </g>

      {/* Ear recess, with the piezo set into it */}
      <ellipse cx="524" cy="336" rx="62" ry="47" fill={url('recess')} stroke={ink} strokeOpacity="0.4" strokeWidth="2.5" />
      <circle cx="524" cy="336" r="64" fill={url('glow')} />
      <circle cx="524" cy="336" r="29" fill={dark ? '#f7f8fa' : '#ffffff'} stroke={ink} strokeOpacity="0.6" strokeWidth="3" />
      <circle cx="524" cy="336" r="15" fill="#e6ebf2" stroke={ink} strokeOpacity="0.25" strokeWidth="2" />
      <circle cx="524" cy="336" r="7" fill="#0071e3" />

      {/* Sound leaving the ear recess */}
      <g fill="none" stroke="#0071e3" strokeLinecap="round">
        <path d="M570 308a42 42 0 0 1 0 56" strokeWidth="3.5" opacity="0.6" />
        <path d="M592 286a66 66 0 0 1 0 100" strokeWidth="3" opacity="0.32" />
        <path d="M612 264a90 90 0 0 1 0 144" strokeWidth="2.5" opacity="0.16" />
      </g>

      {/* Chin strap and buckle */}
      <path d="M512 378c8 36 2 60-12 78" fill="none" stroke={ink} strokeOpacity="0.6" strokeWidth="9" strokeLinecap="round" />
      <path d="M300 378c-2 26 6 42 18 54" fill="none" stroke={ink} strokeOpacity="0.3" strokeWidth="8" strokeLinecap="round" />
      <rect x="470" y="456" width="32" height="14" rx="5" fill="none" stroke={ink} strokeOpacity="0.55" strokeWidth="6" />
    </svg>
  )
}
