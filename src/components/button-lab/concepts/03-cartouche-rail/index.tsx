import { PracticalButtonSystem } from '#/components/button-lab/practical/PracticalButtonSystem'

const skill = {
  name: 'ui-design',
  url: 'https://www.skills.sh/pproenca/dot-skills/ui-design',
} as const

export const cartoucheRailMetadata = {
  id: '03-cartouche-rail',
  name: 'Red Seal',
  direction: 'Reference 03 keeps the navy contact row and uses muted temple red only for decisive actions.',
  skill: {
    name: 'none',
    considered: skill.name,
    url: skill.url,
    searchedCandidate: skill,
    reason: 'The installer writes outside this isolated concept folder, so no skill was installed.',
  },
} as const

export function CartoucheRailSystem() {
  return (
    <PracticalButtonSystem
      description="Built from reference 03: a calm navy contact row with red reserved for the primary action and state edge."
      name={cartoucheRailMetadata.name}
      number="03"
      theme="red-seal"
    />
  )
}
