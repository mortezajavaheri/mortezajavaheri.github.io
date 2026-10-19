import type { SystemEdge, SystemNode } from '@/types/content'

/** Nodes orbiting the core in the hero visualization. */
export const systemNodes: SystemNode[] = [
  {
    id: 'csharp',
    label: 'C#',
    role: 'Primary language',
    description: 'Where everything starts. Modern C#: records, pattern matching, async all the way down.',
    level: 'strong',
    accent: 'blue',
  },
  {
    id: 'dotnet',
    label: '.NET',
    role: 'Runtime',
    description: 'Hosting, DI, configuration, logging — the platform under every service.',
    level: 'strong',
    accent: 'blue',
  },
  {
    id: 'aspnet',
    label: 'ASP.NET Core',
    role: 'Primary backend framework',
    description: 'Web APIs, MVC, middleware, auth pipelines and hosted services.',
    level: 'strong',
    accent: 'blue',
  },
  {
    id: 'sql',
    label: 'SQL Server',
    role: 'Primary data store',
    description: 'Relational modelling, query tuning, and transactions that business data depends on.',
    level: 'strong',
    accent: 'green',
  },
  {
    id: 'dapper',
    label: 'Dapper',
    role: 'Data access',
    description: 'Explicit SQL for performance-sensitive paths, alongside EF Core for richer domains.',
    level: 'strong',
    accent: 'green',
  },
  {
    id: 'signalr',
    label: 'SignalR',
    role: 'Real-time channel',
    description: 'Pushing live state to clients: notifications, dashboards, collaborative screens.',
    level: 'strong',
    accent: 'amber',
  },
  {
    id: 'ai',
    label: 'AI',
    role: 'Exploring',
    description: 'LLM integrations, AI workers and MCP tools wired into real backend systems.',
    level: 'exploring',
    accent: 'violet',
  },
  {
    id: 'architecture',
    label: 'Architecture',
    role: 'How it fits together',
    description: 'Clean boundaries, layered and modular designs, and trade-offs written down.',
    level: 'strong',
    accent: 'blue',
  },
]

/** Node-to-node links (every node is also linked to the core). */
export const systemEdges: SystemEdge[] = [
  ['csharp', 'dotnet'],
  ['dotnet', 'aspnet'],
  ['aspnet', 'dapper'],
  ['dapper', 'sql'],
  ['aspnet', 'signalr'],
  ['aspnet', 'architecture'],
  ['architecture', 'ai'],
  ['ai', 'aspnet'],
]
