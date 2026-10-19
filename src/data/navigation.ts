export interface NavItem {
  id: string
  label: string
}

/** Section ids double as anchor targets. Order = page order. */
export const navItems: NavItem[] = [
  { id: 'system', label: 'System' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'contact', label: 'Contact' },
]

/** All observed sections, including ones not shown in the nav. */
export const sectionIds = ['system', 'about', 'stack', 'experience', 'projects', 'thinking', 'terminal', 'contact'] as const
