/**
 * Content model for the whole site.
 * Everything visitors read is described by these types and lives in `src/data/*`.
 * `null` means "not provided yet" — the UI hides or softens those fields instead of inventing values.
 */

/** Honest proficiency scale: what I use professionally vs. what I'm actively exploring. */
export type Proficiency = 'strong' | 'exploring'

export type Accent = 'blue' | 'green' | 'violet' | 'amber'

export interface Profile {
  name: string
  firstName: string
  lastName: string
  handle: string
  /** Short roles shown in the hero, in order. */
  roles: string[]
  /** Full professional title. */
  title: string
  headline: string
  focus: string
  focusAreas: string[]
  stack: string[]
  interests: string[]
  location: {
    country: string
    timeZone: string
    utcOffset: string
  }
  /** Human description, one paragraph per entry. */
  bio: string[]
  email: string | null
  /** e.g. "Open to backend roles" — null hides the line. */
  availability: string | null
}

export type SocialId = 'github' | 'linkedin' | 'email'

export interface SocialLink {
  id: SocialId
  label: string
  /** Full URL (or mailto:). null = not configured yet; the button renders disabled. */
  href: string | null
  /** Display handle such as "@username". */
  handle: string | null
}

export type SkillGroupId = 'core' | 'backend' | 'systems' | 'exploring'

export interface SkillGroup {
  id: SkillGroupId
  label: string
  description: string
}

export interface Skill {
  id: string
  label: string
  group: SkillGroupId
  level: Proficiency
  note: string
}

export interface SkillChain {
  id: string
  label: string
  description: string
  /** Directed edges between skill ids. */
  edges: ReadonlyArray<readonly [string, string]>
}

/** Node in the hero 3D system. */
export interface SystemNode {
  id: string
  label: string
  role: string
  description: string
  level: Proficiency
  accent: Accent
}

export type SystemEdge = readonly [string, string]

export interface EngineeringProblem {
  title: string
  detail: string
}

export interface Experience {
  id: string
  /** Rendered like a service name, e.g. "svc.backend-engineering". */
  serviceName: string
  title: string
  role: string
  domain: string
  organization: string | null
  period: { start: string | null; end: string | null }
  status: 'running' | 'archived'
  kind: 'professional' | 'independent'
  summary: string
  responsibilities: string[]
  technologies: string[]
  systems: string[]
  problems: EngineeringProblem[]
}

export type LayerKind = 'client' | 'edge' | 'app' | 'domain' | 'infra' | 'data' | 'external' | 'ai'

export interface ArchitectureLayer {
  id: string
  label: string
  detail: string
  kind: LayerKind
}

/** Where the work happened. null = not specified; the UI omits it. */
export type ProjectContext = 'professional' | 'personal' | 'r&d'

export interface Project {
  id: string
  name: string
  category: string
  context: ProjectContext | null
  summary: string
  description: string
  architecture: ArchitectureLayer[]
  technologies: string[]
  challenges: string[]
  links: { repo: string | null; demo: string | null }
}

export interface ThinkingStage {
  id: string
  label: string
  question: string
  detail: string
  practices: string[]
}

export interface Principle {
  key: string
  statement: string
}
