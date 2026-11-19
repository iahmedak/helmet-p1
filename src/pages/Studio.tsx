import { ArrowRight } from 'lucide-react'

import { ArrowLink, Avatar, CountUp, Photo, Reveal, Title } from '../components/Bits'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Marquee } from '../components/Content'
import { Holo } from '../components/Holo'
import { PageHero } from '../components/Nav'
import { CLIENTS, STUDIO } from '../data'
import { useDocumentTitle } from '../lib/storage'

export function Studio() {
  useDocumentTitle('About')
  return (
    <div className="grid gap-2 p-2">
      <PageHero title={STUDIO.title} eyebrow="About the build" intro={STUDIO.intro} art={<Holo kind="scissors" motion />} />

      <Card as="section" aria-label="The build in numbers" tone="night" className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
        {STUDIO.stats.map((s) => (
          <div key={s.label}>
            <p className="text-[clamp(3.2rem,2.4rem+2.6vw,5.5rem)] leading-none font-normal tracking-[-0.06em]">
              <CountUp value={s.value} />
            </p>
            <p className="caps mt-3 text-night-muted">{s.label}</p>
          </div>
        ))}
      </Card>

      <div className="grid gap-2 lg:grid-cols-[1.1fr_1fr]">
        <Photo image="portrait" className="min-h-[420px] rounded-[var(--radius-card)]" />
        <Card as="section" aria-labelledby="values-title" className="flex flex-col p-6 sm:p-8">
          <Title id="values-title" lines={['Design', 'principles']} />
          <ul className="mt-10 grid gap-6">
            {STUDIO.values.map((v, i) => (
              <li key={v.title} className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-line pt-5">
                <span className="caps text-violet tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.03em] uppercase">{v.title}</h3>
                  <p className="mt-1.5 text-muted">{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section aria-labelledby="team-title" className="grid gap-2">
        <Card className="flex flex-wrap items-end justify-between gap-6 p-6 sm:p-8">
          <Title id="team-title" lines={['Who built', 'it']} align="left" />
          <ArrowLink to="/careers">Join a test run</ArrowLink>
        </Card>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {STUDIO.team.map((m, i) => (
            <li key={m.name}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Card className="flex h-full flex-col gap-10 p-5 sm:p-7">
                  <Avatar name={m.name} />
                  <div>
                    <p className="text-lg leading-tight font-medium tracking-[-0.03em] sm:text-xl">{m.name}</p>
                    <p className="mt-1 text-sm text-muted">{m.role}</p>
                  </div>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <Card as="section" aria-labelledby="awards-title" className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1.6fr]">
        <Title id="awards-title" lines={['Milestones']} align="left" />
        <table className="w-full text-left text-[15px]">
          <caption className="sr-only">Milestones</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Year</th>
              <th scope="col">Stage</th>
              <th scope="col">For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line border-y border-line">
            {STUDIO.awards.map((a) => (
              <tr key={a.note} className="align-baseline">
                <td className="py-4 pr-4 text-muted tabular-nums">{a.year}</td>
                <th scope="row" className="py-4 pr-4 font-medium">
                  {a.name}
                </th>
                <td className="py-4 text-muted">{a.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card as="section" aria-label="Parts and tools" className="px-6 py-8 sm:px-8">
        <p className="caps mb-5 text-muted">Parts and tools</p>
        <Marquee items={CLIENTS} />
      </Card>

      <Card tone="violet" className="flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-end sm:p-8">
        <Title lines={['Want to', 'try it?']} align="left" size="lg" as="p" />
        <ButtonLink to="/contact" variant="light" size="lg" iconRight={<ArrowRight className="size-5" />}>
          Request a demo
        </ButtonLink>
      </Card>
    </div>
  )
}
