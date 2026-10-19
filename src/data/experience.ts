import type { Experience } from '@/types/content'

/**
 * Work history rendered as deployed services.
 * Dates and organisation names are intentionally null until filled in —
 * the UI shows "ongoing" / omits the organisation rather than guessing.
 */
export const experience: Experience[] = [
  {
    id: 'erp-backend',
    serviceName: 'svc.backend-engineering',
    title: 'Backend Engineering',
    role: 'Backend Developer (.NET)',
    domain: 'ERP / Business Systems',
    organization: null, // TODO(morteza): company name, if you want it public
    period: { start: null, end: null }, // TODO(morteza): e.g. { start: '2023', end: null }
    status: 'running',
    kind: 'professional',
    summary:
      'Building and maintaining the backend of ERP / business software: APIs, data access, reporting, background processing and real-time features for business users.',
    responsibilities: [
      'Design and build REST APIs with ASP.NET Core Web API and MVC',
      'Write data access with Dapper and Entity Framework Core on SQL Server',
      'Implement authentication and claims-based authorization with JWT',
      'Build multi-tenant data access and tenant-aware services',
      'Move long-running work to background jobs with Hangfire',
      'Generate business reports and documents with FastReport, QuestPDF and IronPDF',
      'Push live updates to clients with SignalR',
    ],
    technologies: [
      'C#',
      '.NET',
      'ASP.NET Core',
      'Web API',
      'MVC',
      'SQL Server',
      'Dapper',
      'EF Core',
      'SignalR',
      'Hangfire',
      'JWT',
      'FastReport',
      'QuestPDF',
      'IronPDF',
    ],
    systems: ['ERP modules', 'Business workflows', 'Reporting & documents', 'Real-time notifications'],
    problems: [
      {
        title: 'Permissions that mirror a real organisation',
        detail:
          'Claims- and policy-based authorization that maps to how roles actually work inside a business, not just admin/user.',
      },
      {
        title: 'Keeping heavy work off the request path',
        detail:
          'Reports, PDFs and bulk operations run as background jobs so APIs stay responsive and failures are retryable.',
      },
      {
        title: 'Choosing the right data-access tool per query',
        detail: 'Dapper where SQL control and performance matter; EF Core where a rich domain model pays for itself.',
      },
      {
        title: 'Tenant isolation',
        detail: 'Making sure every query, job and real-time message is scoped to the correct tenant by default.',
      },
    ],
  },
  {
    id: 'independent-rnd',
    serviceName: 'svc.independent-rnd',
    title: 'Independent Engineering',
    role: 'Self-directed R&D',
    domain: 'AI Systems / Developer Tooling',
    organization: null,
    period: { start: null, end: null },
    status: 'running',
    kind: 'independent',
    summary:
      'Work outside the day job: AI workers and agents, MCP servers, and system-design experiments that feed back into how I build production software.',
    responsibilities: [
      'Prototype AI workers that call tools through well-defined APIs',
      'Build MCP servers that expose backend capabilities to AI assistants',
      'Experiment with gRPC, Docker and service boundaries',
      'Practice testing strategies for code that wraps non-deterministic models',
    ],
    technologies: ['C#', 'ASP.NET Core', 'MCP', 'AI integrations', 'gRPC', 'Docker', 'Testing'],
    systems: ['AI workers / agents', 'MCP tooling', 'Developer tooling'],
    problems: [
      {
        title: 'Deterministic edges around non-deterministic models',
        detail: 'Validating model output at the boundary so the rest of the system can trust what it receives.',
      },
      {
        title: 'Safe tool exposure',
        detail: 'Designing tool schemas that are useful to a model while staying read-only or permission-checked by default.',
      },
    ],
  },
]
