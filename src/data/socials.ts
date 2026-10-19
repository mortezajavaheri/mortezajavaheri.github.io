import type { SocialLink } from '@/types/content'
import { profile } from './profile'

/**
 * Public links. Leave `href` as null until you have the real URL —
 * the UI shows the button as "not linked yet" instead of a broken link.
 */
export const socials: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: null, // TODO(morteza): 'https://github.com/<username>'
    handle: null,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: null, // TODO(morteza): 'https://www.linkedin.com/in/<username>'
    handle: null,
  },
  {
    id: 'email',
    label: 'Email',
    href: profile.email ? `mailto:${profile.email}` : null,
    handle: profile.email,
  },
]
