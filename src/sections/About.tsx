import type { ReactNode } from 'react'
import { profile } from '@/data/profile'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { CodePanel } from '@/components/CodePanel'
import { StatusDot } from '@/components/StatusDot'
import { Reveal, Stagger, StaggerItem } from '@/animations/Reveal'
import { useClock } from '@/hooks/useClock'

const list = (items: string[]) => `[${items.map((s) => `"${s}"`).join(', ')}]`

/** The profile, expressed the way I'd model it. Generated from profile data. */
const engineerSource = `namespace Javaheri.Profile;

public sealed record Engineer
{
    public string Name { get; } = "${profile.name}";
    public string Role { get; } = "${profile.roles[0]}";
    public string Focus { get; } = "${profile.focus}";
    public string[] Stack { get; } = ${list(profile.stack)};
    public string[] Interests { get; } = ${list(profile.interests)};

    // Correct first. Then fast. Then shipped.
    public Task<Release> HandleAsync(Problem problem, CancellationToken ct) =>
        problem
            .Understand()
            .RespectConstraints()
            .DesignBoundaries()
            .Implement(ct)
            .VerifyAsync(ct);
}`

export function About() {
  const time = useClock(profile.location.timeZone, 30_000)

  const rows: Array<{ key: string; value: ReactNode }> = [
    { key: 'Name', value: profile.name },
    { key: 'Role', value: profile.roles[0] },
    { key: 'Focus', value: profile.focus },
    { key: 'Stack', value: profile.stack.join(' / ') },
    { key: 'Interests', value: profile.interests.join(' / ') },
    {
      key: 'Location',
      value: (
        <>
          {profile.location.country} <span className="text-fg-dim">· {time.slice(0, 5)} local</span>
        </>
      ),
    },
    ...(profile.availability
      ? [
          {
            key: 'Status',
            value: (
              <span className="flex items-center gap-2">
                <StatusDot /> {profile.availability}
              </span>
            ),
          },
        ]
      : []),
  ]

  return (
    <Section id="about" component="About" labelledBy="about-title">
      <SectionHeader
        id="about-title"
        index="01"
        eyebrow="About the engineer"
        title={
          <>
            Backend first. <span className="text-fg-dim">Systems over screens.</span>
          </>
        }
      />

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-14 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <Reveal>
            <div className="label-mono mb-3 flex items-center justify-between border-b border-line pb-3">
              <span>Engineer profile</span>
              <span className="text-fg-dim">inspect --verbose</span>
            </div>
          </Reveal>
          <Stagger className="divide-y divide-line" gap={0.05}>
            {rows.map((row) => (
              <StaggerItem key={row.key}>
                <dl className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 py-3">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-dim">{row.key}</dt>
                  <dd className="text-[15px] text-fg">{row.value}</dd>
                </dl>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-10 space-y-5">
            {profile.bio.map((paragraph, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-[15px] leading-[1.75] text-fg-muted sm:text-base">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11.5px] text-fg-dim">
              {profile.focusAreas.map((area) => (
                <li key={area} className="flex items-center gap-2">
                  <span className="size-1 bg-fg-dim" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal y={28} className="lg:pt-8">
          <CodePanel filename="Engineer.cs" code={engineerSource} />
          <p className="mt-3 font-mono text-[11px] text-fg-dim">
            <span className="text-ok">✓</span> Build succeeded · illustrative, not production code
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
