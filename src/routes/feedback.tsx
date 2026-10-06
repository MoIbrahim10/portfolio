import { createFileRoute } from '@tanstack/react-router'

import { FeedbackPage } from '#/components/feedback/FeedbackPage'

export const Route = createFileRoute('/feedback')({
  component: FeedbackPage,
  head: () => ({
    meta: [
      { title: 'Send a postcard — Mo Ibrahim' },
      { name: 'description', content: 'Send Mo a postcard. Share what caught your eye, an idea, or something that could work better.' },
      { property: 'og:title', content: 'Send a postcard — Mo Ibrahim' },
      { property: 'og:url', content: 'https://m0code.com/feedback' },
    ],
    links: [{ rel: 'canonical', href: 'https://m0code.com/feedback' }],
  }),
})
