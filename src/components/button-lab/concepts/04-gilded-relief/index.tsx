import { PracticalButtonSystem } from '#/components/button-lab/practical/PracticalButtonSystem'

export const gildedReliefMetadata = {
  id: '04-gilded-relief',
  name: 'Gilded Relief',
  direction:
    'Cut Corner rebuilt as a shallow carved object with gold rims, navy faces, and a restrained red depth layer.',
  skill: {
    name: 'none',
    searchedCandidate: {
      name: 'frontend-design-system',
      url: 'https://www.skills.sh/supercent-io/skills-template/frontend-design-system',
    },
    reason: 'No additional skill was needed for this focused evolution of an existing system.',
  },
} as const

export function GildedReliefSystem() {
  return (
    <PracticalButtonSystem
      description="Cut Corner gains physical depth through a gold rim, a calm face plane, and a compact red shadow edge."
      name={gildedReliefMetadata.name}
      number="04"
      theme="gilded-relief"
    />
  )
}
