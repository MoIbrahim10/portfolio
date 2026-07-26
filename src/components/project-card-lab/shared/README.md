# Horizontal image-card contract

Every direction uses the same six projects and supplied placeholder image. The page background remains fixed and neutral.

Required in every direction:

- one horizontal rail with multiple cards visible together on desktop
- closed cards contain only the project image; accessible names remain available to assistive technology
- native touch/trackpad horizontal scrolling with snap behavior
- click or keyboard activation opens an accessible drawer, sheet, or dialog
- the open surface contains project name, short description, collaborators, gallery media, and optional project link
- Escape close, focus containment/restoration, 44px targets, responsive behavior, and reduced motion
- ready, loading, and empty states with fixed media dimensions and no layout shift
- no project-reactive background, no large decorative scene, and no new dependency
- use the existing `motion/react` package or browser-native animation APIs
