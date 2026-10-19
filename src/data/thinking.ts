import type { Principle, ThinkingStage } from '@/types/content'

export const thinkingStages: ThinkingStage[] = [
  {
    id: 'input',
    label: 'Input',
    question: 'What problem are we actually solving?',
    detail:
      'Start from the business process, not the framework. Understand who uses it, what “correct” means to them, and what breaks if it’s wrong.',
    practices: ['Talk to the people who use it', 'Write the problem down in one paragraph', 'Find the real source of truth'],
  },
  {
    id: 'constraints',
    label: 'Constraints',
    question: 'What can’t change?',
    detail:
      'Existing data, deadlines, team size, hosting, compliance. Constraints are design input — ignoring them just moves the cost to later.',
    practices: ['List hard vs. soft constraints', 'Identify what must stay backward-compatible', 'Know the data volume'],
  },
  {
    id: 'design',
    label: 'Design',
    question: 'Where are the boundaries?',
    detail:
      'Decide module and API boundaries, data ownership, and what runs synchronously vs. in the background. Choose the simplest structure that survives the next year.',
    practices: ['Contracts before implementation', 'Explicit dependencies', 'Write down the trade-off you chose'],
  },
  {
    id: 'implementation',
    label: 'Implementation',
    question: 'Will the next developer understand this?',
    detail:
      'Readable C# over clever C#. Small, well-named units. Security and tenancy handled by default in shared infrastructure, not remembered in every endpoint.',
    practices: ['Make the wrong thing hard', 'Fail loudly at boundaries', 'Keep side effects visible'],
  },
  {
    id: 'test',
    label: 'Test',
    question: 'How do we know it’s correct?',
    detail:
      'Test business rules directly, and test the edges where systems meet — database, auth, serialization. Tests are a description of behaviour, not a coverage number.',
    practices: ['Unit tests for rules', 'Integration tests for edges', 'Reproduce bugs as tests first'],
  },
  {
    id: 'measure',
    label: 'Measure',
    question: 'Is it fast enough — and how do we know?',
    detail:
      'Performance claims need numbers: query plans, timings, logs. Optimise what is measured to be slow, not what feels slow.',
    practices: ['Read the execution plan', 'Log with structure', 'Measure before and after'],
  },
  {
    id: 'ship',
    label: 'Ship',
    question: 'Can we release it safely and undo it if needed?',
    detail:
      'Small, reversible changes. Migrations that don’t lock the business out. Shipping is part of engineering, not an afterthought.',
    practices: ['Small increments', 'Safe migrations', 'Observe after release'],
  },
]

export const principles: Principle[] = [
  { key: 'correctness', statement: 'Business data must be right before it is fast or pretty.' },
  { key: 'maintainability', statement: 'Code is read far more than it is written.' },
  { key: 'architecture', statement: 'Boundaries are decisions — make them on purpose.' },
  { key: 'performance', statement: 'Measured, not assumed.' },
  { key: 'security', statement: 'Authorization is a default, not a feature.' },
  { key: 'boundaries', statement: 'Each module owns its data and its rules.' },
  { key: 'constraints', statement: 'Real-world limits shape good design.' },
]
