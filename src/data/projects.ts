import type { Project } from '@/types/content'

/**
 * Systems I work on, described by architecture rather than screenshots.
 * Names are descriptive working titles — replace them with real project names,
 * and fill `links` / `context` when you're ready to make them public.
 * No metrics, users or clients are listed on purpose.
 */
export const projects: Project[] = [
  {
    id: 'erp',
    name: 'ERP Platform',
    category: 'Business Systems',
    context: 'professional',
    summary: 'Backend for business software: modules, documents, permissions and reports.',
    description:
      'The backend side of ERP / business software — modules that business users rely on every day, where correctness of data, permissions and generated documents matters more than anything else.',
    architecture: [
      { id: 'client', label: 'Client', detail: 'Web clients consuming the API', kind: 'client' },
      { id: 'api', label: 'API', detail: 'ASP.NET Core Web API · JWT · versioned endpoints', kind: 'edge' },
      { id: 'app', label: 'Application', detail: 'Use cases, validation, authorization policies', kind: 'app' },
      { id: 'domain', label: 'Domain', detail: 'Business entities, rules and invariants', kind: 'domain' },
      { id: 'infra', label: 'Infrastructure', detail: 'Dapper / EF Core · Hangfire · FastReport / QuestPDF', kind: 'infra' },
      { id: 'db', label: 'SQL Server', detail: 'Relational store, tenant-scoped data', kind: 'data' },
    ],
    technologies: ['C#', 'ASP.NET Core', 'Web API', 'Dapper', 'EF Core', 'SQL Server', 'Hangfire', 'SignalR', 'FastReport', 'QuestPDF'],
    challenges: [
      'Claims-based permissions that reflect real organisational roles',
      'Report and document generation without blocking API requests',
      'Tenant isolation enforced in the data layer, not by convention',
      'Picking Dapper vs. EF Core per use case',
    ],
    links: { repo: null, demo: null },
  },
  {
    id: 'tasks',
    name: 'Task Management System',
    category: 'Workflow',
    context: null, // TODO(morteza): 'professional' | 'personal' | 'r&d'
    summary: 'Tasks, assignments and state transitions with live updates for teams.',
    description:
      'A system for tracking work across teams: tasks move through explicit states, assignments are permission-checked, and everyone looking at a board sees changes as they happen.',
    architecture: [
      { id: 'client', label: 'Client', detail: 'Boards, lists, task detail', kind: 'client' },
      { id: 'api', label: 'API', detail: 'ASP.NET Core · REST endpoints', kind: 'edge' },
      { id: 'app', label: 'Application', detail: 'Commands & queries, policies per project', kind: 'app' },
      { id: 'domain', label: 'Domain', detail: 'Task state machine, assignments', kind: 'domain' },
      { id: 'rt', label: 'Real-time', detail: 'SignalR hub · group per board', kind: 'infra' },
      { id: 'db', label: 'SQL Server', detail: 'Tasks, history, audit trail', kind: 'data' },
    ],
    technologies: ['C#', 'ASP.NET Core', 'EF Core', 'SignalR', 'Hangfire', 'SQL Server'],
    challenges: [
      'Modelling task lifecycle as explicit, testable state transitions',
      'Broadcasting changes only to users allowed to see them',
      'Scheduled reminders and due-date jobs',
      'Concurrent edits on the same task',
    ],
    links: { repo: null, demo: null },
  },
  {
    id: 'ai-worker',
    name: 'AI Worker Runtime',
    category: 'AI Systems',
    context: 'r&d',
    summary: 'Background workers that let LLMs act through well-defined tools.',
    description:
      'A runtime for AI workers / agents: jobs are triggered by APIs or schedules, a model plans steps, and every action goes through typed, permission-checked tools — so the non-deterministic part stays inside a deterministic shell.',
    architecture: [
      { id: 'trigger', label: 'Trigger', detail: 'API call · schedule · queue', kind: 'client' },
      { id: 'host', label: 'Worker host', detail: '.NET hosted service · job orchestration', kind: 'app' },
      { id: 'agent', label: 'Agent loop', detail: 'LLM calls, tool selection, validation', kind: 'ai' },
      { id: 'tools', label: 'Tools', detail: 'MCP servers · internal APIs', kind: 'external' },
      { id: 'store', label: 'Run store', detail: 'SQL Server · run logs & results', kind: 'data' },
    ],
    technologies: ['C#', '.NET', 'ASP.NET Core', 'AI integrations', 'MCP', 'Hangfire', 'SQL Server'],
    challenges: [
      'Validating model output before it touches real data',
      'Retries and idempotency for multi-step runs',
      'Observability: being able to replay why a run did what it did',
      'Least-privilege tool access',
    ],
    links: { repo: null, demo: null },
  },
  {
    id: 'clinic',
    name: 'Clinic Scheduling System',
    category: 'Healthcare',
    context: null, // TODO(morteza)
    summary: 'Appointments, practitioner availability and conflict-free booking.',
    description:
      'Scheduling for clinics: practitioner availability, slot generation and booking rules, with reminders handled in the background and access to sensitive information kept tight.',
    architecture: [
      { id: 'client', label: 'Client', detail: 'Reception & booking screens', kind: 'client' },
      { id: 'api', label: 'API', detail: 'ASP.NET Core Web API', kind: 'edge' },
      { id: 'engine', label: 'Scheduling', detail: 'Availability, slots, conflict rules', kind: 'app' },
      { id: 'domain', label: 'Domain', detail: 'Practitioners, appointments, visits', kind: 'domain' },
      { id: 'jobs', label: 'Jobs', detail: 'Hangfire reminders & cleanup', kind: 'infra' },
      { id: 'db', label: 'SQL Server', detail: 'Schedules & appointment history', kind: 'data' },
    ],
    technologies: ['C#', 'ASP.NET Core', 'EF Core', 'Dapper', 'Hangfire', 'SQL Server'],
    challenges: [
      'Preventing double-booking under concurrent requests',
      'Working hours, breaks and time-zone-correct slots',
      'Role-based access to patient-related data',
      'Reminder delivery as background jobs',
    ],
    links: { repo: null, demo: null },
  },
  {
    id: 'realtime-hub',
    name: 'Real-time Notification Hub',
    category: 'Real-time',
    context: null, // TODO(morteza)
    summary: 'Authenticated, tenant-aware push from backend events to connected clients.',
    description:
      'A real-time layer on top of business systems: domain events become messages, and SignalR delivers them to exactly the users and tenants who should receive them.',
    architecture: [
      { id: 'events', label: 'Domain events', detail: 'Raised by application services', kind: 'app' },
      { id: 'api', label: 'API', detail: 'ASP.NET Core · JWT', kind: 'edge' },
      { id: 'hub', label: 'SignalR hub', detail: 'Groups per tenant / user', kind: 'infra' },
      { id: 'conn', label: 'Connections', detail: 'Auth on connect, reconnect handling', kind: 'infra' },
      { id: 'clients', label: 'Clients', detail: 'Dashboards, notifications', kind: 'client' },
    ],
    technologies: ['C#', 'ASP.NET Core', 'SignalR', 'JWT', 'SQL Server'],
    challenges: [
      'Authenticating long-lived connections with JWT',
      'Tenant and user group membership',
      'What happens to messages while a client is reconnecting',
      'Keeping hub code thin and testable',
    ],
    links: { repo: null, demo: null },
  },
  {
    id: 'dev-tooling',
    name: 'MCP & Developer Tooling',
    category: 'Developer Tooling',
    context: 'r&d',
    summary: 'MCP servers and tools that expose backend capabilities to AI assistants.',
    description:
      'Tooling that connects AI assistants to real systems through the Model Context Protocol — databases, internal APIs and codebases exposed as typed tools with sensible defaults.',
    architecture: [
      { id: 'client', label: 'AI client', detail: 'IDE / assistant', kind: 'ai' },
      { id: 'protocol', label: 'MCP', detail: 'JSON-RPC over stdio / HTTP', kind: 'edge' },
      { id: 'server', label: 'MCP server', detail: '.NET host · tool & resource definitions', kind: 'app' },
      { id: 'adapters', label: 'Adapters', detail: 'Database, APIs, file system', kind: 'infra' },
      { id: 'targets', label: 'Systems', detail: 'SQL Server · internal services', kind: 'data' },
    ],
    technologies: ['C#', '.NET', 'MCP', 'AI integrations', 'SQL Server', 'Testing'],
    challenges: [
      'Tool schemas a model can use correctly on the first try',
      'Read-only by default, explicit opt-in for writes',
      'Testing tools without a model in the loop',
    ],
    links: { repo: null, demo: null },
  },
]
