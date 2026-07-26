import type { ImgHTMLAttributes } from 'react'

import type { PortfolioProject } from './projects'

interface ProjectMediaProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'height' | 'src' | 'width'> {
  eager?: boolean
  project: PortfolioProject
}

export function ProjectMedia({ className, eager = false, project, ...props }: ProjectMediaProps) {
  return (
    <img
      {...props}
      alt={project.alt}
      className={className}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      height={1000}
      loading={eager ? 'eager' : 'lazy'}
      src={project.image}
      width={1600}
    />
  )
}

