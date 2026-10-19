import type { Skill, SkillChain, SkillGroup } from '@/types/content'

export const skillGroups: SkillGroup[] = [
  { id: 'core', label: 'Core', description: 'Language, runtime and data — daily tools.' },
  { id: 'backend', label: 'Backend', description: 'Libraries and patterns used in production code.' },
  { id: 'systems', label: 'Systems', description: 'Cross-cutting concerns in business software.' },
  { id: 'exploring', label: 'Exploring', description: 'Experienced with, actively going deeper.' },
]

export const skills: Skill[] = [
  // CORE
  { id: 'csharp', label: 'C#', group: 'core', level: 'strong', note: 'Primary language' },
  { id: 'dotnet', label: '.NET', group: 'core', level: 'strong', note: 'Runtime & base libraries' },
  { id: 'aspnet', label: 'ASP.NET Core', group: 'core', level: 'strong', note: 'Primary backend framework' },
  { id: 'webapi', label: 'Web API', group: 'core', level: 'strong', note: 'HTTP APIs, MVC, filters, middleware' },
  { id: 'sqlserver', label: 'SQL Server', group: 'core', level: 'strong', note: 'Schema design, queries, indexing' },

  // BACKEND
  { id: 'dapper', label: 'Dapper', group: 'backend', level: 'strong', note: 'Hand-written SQL where it matters' },
  { id: 'efcore', label: 'EF Core', group: 'backend', level: 'strong', note: 'ORM for domain-heavy modules' },
  { id: 'signalr', label: 'SignalR', group: 'backend', level: 'strong', note: 'Real-time push to clients' },
  { id: 'hangfire', label: 'Hangfire', group: 'backend', level: 'strong', note: 'Scheduled & background jobs' },
  { id: 'rest', label: 'REST APIs', group: 'backend', level: 'strong', note: 'Resource design, versioning, contracts' },

  // SYSTEMS
  { id: 'authn', label: 'Authentication', group: 'systems', level: 'strong', note: 'JWT, token lifecycles' },
  { id: 'authz', label: 'Authorization', group: 'systems', level: 'strong', note: 'Claims & policy-based access' },
  { id: 'tenancy', label: 'Multi-tenancy', group: 'systems', level: 'strong', note: 'Tenant isolation & resolution' },
  { id: 'jobs', label: 'Background processing', group: 'systems', level: 'strong', note: 'Work off the request path' },
  { id: 'realtime', label: 'Real-time systems', group: 'systems', level: 'strong', note: 'Live updates, presence, events' },

  // EXPLORING
  { id: 'docker', label: 'Docker', group: 'exploring', level: 'exploring', note: 'Containerised local & deploy setups' },
  { id: 'grpc', label: 'gRPC', group: 'exploring', level: 'exploring', note: 'Contract-first service calls' },
  { id: 'microservices', label: 'Microservices', group: 'exploring', level: 'exploring', note: 'Boundaries, trade-offs, when not to' },
  { id: 'ai', label: 'AI integrations', group: 'exploring', level: 'exploring', note: 'LLMs inside real business flows' },
  { id: 'mcp', label: 'MCP', group: 'exploring', level: 'exploring', note: 'Model Context Protocol servers & tools' },
  { id: 'testing', label: 'Testing', group: 'exploring', level: 'exploring', note: 'Unit & integration test strategy' },
]

/** Also used, but not drawn on the map. */
export const supportingTools: string[] = ['MVC', 'JWT', 'Claims', 'FastReport', 'QuestPDF', 'IronPDF', 'System design']

/** Relationships between technologies — how they combine into working systems. */
export const skillChains: SkillChain[] = [
  {
    id: 'request',
    label: 'Request path',
    description: 'From language to response: the backbone of everything I build.',
    edges: [
      ['csharp', 'dotnet'],
      ['dotnet', 'aspnet'],
      ['aspnet', 'webapi'],
      ['webapi', 'sqlserver'],
    ],
  },
  {
    id: 'data',
    label: 'Data access',
    description: 'Dapper for control over SQL, EF Core where the domain model earns it.',
    edges: [
      ['webapi', 'dapper'],
      ['webapi', 'efcore'],
      ['dapper', 'sqlserver'],
      ['efcore', 'sqlserver'],
    ],
  },
  {
    id: 'realtime',
    label: 'Real-time',
    description: 'Server push for state that changes while users are looking at it.',
    edges: [
      ['aspnet', 'signalr'],
      ['signalr', 'realtime'],
    ],
  },
  {
    id: 'jobs',
    label: 'Background work',
    description: 'Reports, imports and notifications run outside the request.',
    edges: [
      ['aspnet', 'hangfire'],
      ['hangfire', 'jobs'],
    ],
  },
  {
    id: 'identity',
    label: 'Identity & tenancy',
    description: 'Who is calling, what they may do, and whose data they can see.',
    edges: [
      ['aspnet', 'authn'],
      ['authn', 'authz'],
      ['authz', 'tenancy'],
    ],
  },
  {
    id: 'api',
    label: 'API design',
    description: 'Contracts first: resources, status codes, versioning.',
    edges: [
      ['webapi', 'rest'],
      ['rest', 'grpc'],
    ],
  },
  {
    id: 'ai',
    label: 'AI systems',
    description: 'Models as components — behind APIs, with tools exposed over MCP.',
    edges: [
      ['aspnet', 'ai'],
      ['ai', 'mcp'],
    ],
  },
  {
    id: 'distributed',
    label: 'Distributed',
    description: 'Splitting systems only when the boundaries are real.',
    edges: [
      ['grpc', 'microservices'],
      ['docker', 'microservices'],
      ['testing', 'microservices'],
    ],
  },
]
