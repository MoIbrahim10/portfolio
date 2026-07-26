import { PracticalButtonSystem } from '#/components/button-lab/practical/PracticalButtonSystem'

const skill = {
  name: 'frontend-design-system',
  url: 'https://www.skills.sh/supercent-io/skills-template/frontend-design-system',
} as const

export const solarApertureMetadata = {
  id: '02-solar-aperture',
  name: 'Cut Corner',
  direction: 'Reference-matched stepped controls with icon-only channels, monospaced labels, and the logo palette.',
  skill: {
    name: 'none',
    considered: skill.name,
    url: skill.url,
    searchedCandidate: skill,
    reason: 'The installer writes outside this isolated concept folder, so no skill was installed.',
  },
} as const

export function SolarApertureSystem() {
  return (
    <PracticalButtonSystem
      description="A geometry-faithful translation of the supplied Cut Corner row using the logo's navy, ivory, gold, and red."
      name={solarApertureMetadata.name}
      number="02"
      theme="obsidian-cut"
    />
  )
}
