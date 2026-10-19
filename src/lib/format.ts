import type { Experience, Proficiency, ProjectContext } from '@/types/content'

export const proficiencyLabel: Record<Proficiency, string> = {
  strong: 'Strong / Professional',
  exploring: 'Exploring',
}

export const contextLabel: Record<ProjectContext, string> = {
  professional: 'Professional',
  personal: 'Personal',
  'r&d': 'R&D',
}

export function formatPeriod(period: Experience['period']): string {
  const { start, end } = period
  if (!start && !end) return 'ongoing'
  return `${start ?? '—'} → ${end ?? 'present'}`
}

/** Pad an index for section/system labels: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0')

/** "ASP.NET Core" → "aspnet-core" */
export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[#]/g, 'sharp')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
