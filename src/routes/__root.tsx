import {
  HeadContent,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { NotFoundPage } from '#/components/not-found/NotFoundPage'

import appCss from '../styles.css?url'

const SITE_URL = 'https://m0code.com/'
const SITE_TITLE = 'Mo Ibrahim — Product Engineer'
const SITE_DESCRIPTION =
  'Product engineer crafting thoughtful digital products, polished interfaces, and design systems where every detail matters.'
const SOCIAL_IMAGE_URL =
  'https://m0code.com/social/mo-ibrahim-product-engineer.png'
const SOCIAL_IMAGE_ALT =
  'Mo Ibrahim product engineering portfolio featuring The Good Invoice project.'

export const Route = createRootRoute({
  head: ({ match }) => {
    const isNotFound = match.globalNotFound

    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: isNotFound
            ? 'The requested page could not be found. Return to the MO portfolio.'
            : SITE_DESCRIPTION,
        },
        {
          title: isNotFound ? 'Page Not Found — MO' : SITE_TITLE,
        },
        ...(!isNotFound
          ? [
              { name: 'author', content: 'Mo Ibrahim' },
              { property: 'og:type', content: 'website' },
              { property: 'og:locale', content: 'en_US' },
              { property: 'og:site_name', content: 'Mo Ibrahim' },
              { property: 'og:title', content: SITE_TITLE },
              { property: 'og:description', content: SITE_DESCRIPTION },
              { property: 'og:url', content: SITE_URL },
              { property: 'og:image', content: SOCIAL_IMAGE_URL },
              { property: 'og:image:secure_url', content: SOCIAL_IMAGE_URL },
              { property: 'og:image:type', content: 'image/png' },
              { property: 'og:image:width', content: '2994' },
              { property: 'og:image:height', content: '1498' },
              {
                property: 'og:image:alt',
                content: SOCIAL_IMAGE_ALT,
              },
              { name: 'twitter:card', content: 'summary_large_image' },
              { name: 'twitter:creator', content: '@m0code' },
              { name: 'twitter:title', content: SITE_TITLE },
              { name: 'twitter:description', content: SITE_DESCRIPTION },
              { name: 'twitter:image', content: SOCIAL_IMAGE_URL },
              {
                name: 'twitter:image:alt',
                content: SOCIAL_IMAGE_ALT,
              },
            ]
          : []),
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        {
          rel: 'icon',
          href: '/brand/mo-favicon.svg',
          type: 'image/svg+xml',
          sizes: 'any',
        },
        ...(!isNotFound ? [{ rel: 'canonical', href: SITE_URL }] : []),
      ],
    }
  },
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
