import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { NotFoundPage } from '#/components/not-found/NotFoundPage'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: ({ match }) => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content: match.globalNotFound
          ? 'The requested page could not be found. Return to the MO portfolio.'
          : 'Personal portfolio of MO.',
      },
      {
        title: match.globalNotFound
          ? 'Page Not Found — MO'
          : 'MO — Portfolio',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/brand/mo-mark-v3.svg', type: 'image/svg+xml' },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
