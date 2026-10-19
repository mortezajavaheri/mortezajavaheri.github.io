import type { Profile } from '@/types/content'

/**
 * Single source of truth for personal information.
 * Edit freely — no component hard-codes any of this.
 */
export const profile: Profile = {
  name: 'Morteza Javaheri',
  firstName: 'Morteza',
  lastName: 'Javaheri',
  handle: 'morteza',
  roles: ['.NET Developer', 'Backend Engineer', 'System Builder'],
  title: '.NET Developer / ASP.NET Core Specialist / C# Developer',
  headline: 'I build backend systems, APIs and business software with C#, ASP.NET Core and SQL.',
  focus: 'Backend Engineering',
  focusAreas: [
    'Backend engineering',
    'APIs',
    'Business systems',
    'Databases',
    'Real-time systems',
    'Architecture',
    'AI-powered software',
  ],
  stack: ['C#', '.NET', 'SQL'],
  interests: ['Architecture', 'AI', 'Systems'],
  location: {
    country: 'Iran',
    timeZone: 'Asia/Tehran',
    utcOffset: 'UTC+03:30',
  },
  bio: [
    'I’m a backend developer working mostly in C# and ASP.NET Core. Professionally I build ERP and business software — systems where data correctness, permissions and reporting matter more than visual polish, and where a wrong number has real consequences.',
    'I care about the parts of software most people never see: API boundaries, data access, background jobs, real-time channels, and the architecture that keeps all of it understandable as it grows. Lately I’ve been spending time on AI integrations and MCP — connecting language models to real business tools in ways that stay testable and safe.',
  ],
  // TODO(morteza): add a public contact address to enable the contact form + email button.
  email: null,
  // TODO(morteza): e.g. 'Open to backend / .NET roles' — null hides it.
  availability: null,
}
