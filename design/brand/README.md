# MO brand mark

## Direction

The mark combines a full Egyptian column and a shortened matching capital to
form a stepped `M`, paired with a tall open `O` and nine fine golden rays. Every
shape is native SVG rather than a traced bitmap.

## Construction

- Canvas: `790 × 480` viewBox with a transparent background.
- Geometry: integer coordinates and square corners throughout.
- M construction: one continuous heavy stepped ribbon and one fine stepped
  diagonal meet at a shared vertex.
- O construction: `323 × 392` outer contour (`0.824` width-to-height ratio).
- Primary colors: Nile Navy `#122B3D`, Solar Gold `#D79D40`, and Heritage Red
  `#9C1E1B`. The left capital uses flat tonal highlights and shadows—never
  gradients—to create its stepped depth.
- Clear space: keep at least the width of one shaft around the full mark.

## Source of truth

The current review master is [`../../public/brand/mo-mark-v3.svg`](../../public/brand/mo-mark-v3.svg).
Its independently reviewable sources live in [`../../public/brand/components`](../../public/brand/components):
`left-column.svg`, `m-inscription.svg`, `m-diagonals.svg`, `right-capital.svg`,
`o-ring.svg`, and `rays.svg`. Keep the final master self-contained when
composing changes. The
page background, texture, shadows, and animation belong in the portfolio UI—not
in the logo asset.

## Review before variants

Approve the primary mark's proportions and symbolism before deriving compact,
monochrome, social-avatar, and favicon versions. This avoids propagating visual
changes across multiple files.
