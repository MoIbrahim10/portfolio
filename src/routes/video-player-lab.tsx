import { createFileRoute } from '@tanstack/react-router'

import { VideoPlayerLab } from '#/components/video-player-lab/VideoPlayerLab'

export const Route = createFileRoute('/video-player-lab')({
  component: VideoPlayerLab,
})
