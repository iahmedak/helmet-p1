import { EXPERIENCE } from '../../data'
import { cx } from '../../lib/cx'

const TONES = {
  good: { dot: 'bg-[#2d8a4e]', label: 'text-[#1d7d3f]', border: 'border-[#cfe6d8]', bg: 'bg-[#f3faf5]' },
  warn: { dot: 'bg-[#b25000]', label: 'text-[#b25000]', border: 'border-[#f0dcc8]', bg: 'bg-[#fdf7f1]' },
  plan: { dot: 'bg-[#8e8e93]', label: 'text-[#6e6e73]', border: 'border-line', bg: 'bg-soft' },
} as const

/*
  Status, stated plainly. The planned column is what a product page usually
  blurs: these are things the current helmet does not do, and the copy says so
  instead of implying otherwise.
*/
export function StatusBoard() {
  return (
    <div className="grid gap-2 lg:grid-cols-3">
      {EXPERIENCE.status.map((group) => {
        const tone = TONES[group.tone]
        return (
          <section
            key={group.label}
            aria-labelledby={`status-${group.label}`}
            className={cx('rounded-[var(--radius-card-sm)] border p-5 sm:p-6', tone.border, tone.bg)}
          >
            <div className="flex items-center gap-2">
              <span aria-hidden className={cx('size-2 rounded-full', tone.dot)} />
              <h3 id={`status-${group.label}`} className={cx('text-[13px] font-semibold tracking-[-0.01em]', tone.label)}>
                {group.label}
              </h3>
              <span className="ml-auto font-mono text-[11px] text-muted tabular-nums">{group.items.length}</span>
            </div>
            <p className="mt-1 text-[12px] text-muted">{group.summary}</p>
            <ul className="mt-4 divide-y divide-line/70">
              {group.items.map((item) => (
                <li key={item.title} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-[14px] font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
