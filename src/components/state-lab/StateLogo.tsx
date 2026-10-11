import { useId } from 'react'

import logoSource from '/brand/mo-mark-v3.svg?raw'

export function StateLogo({ tone }: { tone: 'navy' | 'red' }) {
  const prefix = `state-logo-${useId().replaceAll(/[^a-zA-Z0-9_-]/g, '')}`
  const markup = logoSource
    .replaceAll(/id="([^"]+)"/g, `id="${prefix}-$1"`)
    .replaceAll(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replaceAll('#122b3d', '#f3e8d3')
    .replaceAll('#17364a', '#fffaf0')
    .replaceAll('#0f2636', '#d8c9ac')
    .replaceAll('#9c1e1b', tone === 'red' ? '#f3e8d3' : '#c56b59')
    .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')

  return <span dangerouslySetInnerHTML={{ __html: markup }} />
}
