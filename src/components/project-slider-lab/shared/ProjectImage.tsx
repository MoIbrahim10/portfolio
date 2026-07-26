import type { ImgHTMLAttributes } from 'react'

import type { SliderProject } from './types'

interface ProjectImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'height' | 'src' | 'width'> {
  eager?: boolean
  project: SliderProject
}

export function ProjectImage({ eager = false, project, ...props }: ProjectImageProps) {
  return (
    <img
      {...props}
      alt={project.alt}
      decoding="async"
      height={1498}
      loading={eager ? 'eager' : 'lazy'}
      src={project.image}
      width={3018}
    />
  )
}
