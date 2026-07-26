import { PracticalButtonSystem } from '#/components/button-lab/practical/PracticalButtonSystem'

export const pressedSealMetadata = {
  id: '05-pressed-seal',
  name: 'Pressed Seal',
  direction:
    'Red Seal translated into tactile pressed controls with stacked navy, gold, and red planes.',
  skill: {
    name: 'none',
    searchedCandidate: {
      name: 'ui-design',
      url: 'https://www.skills.sh/pproenca/dot-skills/ui-design',
    },
    reason: 'No additional skill was needed for this focused evolution of an existing system.',
  },
} as const

export function PressedSealSystem() {
  return (
    <PracticalButtonSystem
      description="Red Seal becomes a tactile control family with crisp face planes, gold keylines, and deeper navy or red pressed edges."
      name={pressedSealMetadata.name}
      number="05"
      theme="pressed-seal"
    />
  )
}
