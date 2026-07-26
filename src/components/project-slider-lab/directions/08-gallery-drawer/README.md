# Gallery Drawer

Minimal left-media/right-copy project carousel with native horizontal snapping, square image tabs, sliding solid-material palette fields, and an in-context gallery drawer.

## Skill

- **Name:** `ui-animation`
- **URL:** https://www.skills.sh/mblode/agent-skills/ui-animation
- **Applied:** directional continuity for palette changes, a right-origin drawer using the recommended move curve, transform/opacity-only motion, fast dismiss, and a reduced-motion path.

## Interaction notes

- Tabs support Arrow Left/Right, Home, and End with roving focus.
- Touch and trackpad scrolling use native snap; the nearest slide synchronizes the selected tab and palette.
- Opening project media moves focus into a semantic modal dialog; Escape or Close dismisses it and restores focus to the media trigger.
- Gallery focus is trapped, and gallery images support Left/Right arrows when multiple images are available.
- Only project name, description, collaborators, gallery, and an optional project link are shown.
