import { PortfolioPrismConveyor } from './versions/01-prism-conveyor'
import { PortfolioMagneticEditorial } from './versions/02-magnetic-editorial'
import { PortfolioLivingBlueprint } from './versions/03-living-blueprint'
import { PortfolioChromaticDesktop } from './versions/04-chromatic-desktop'
import { PortfolioTypographicCinema } from './versions/05-typographic-cinema'
import { PortfolioFoldedIndex } from './versions/06-folded-index'
import { PortfolioOrbitalStudio } from './versions/07-orbital-studio'
import { PortfolioElasticGallery } from './versions/08-elastic-gallery'
import { PortfolioKineticMosaic } from './versions/09-kinetic-mosaic'
import { PortfolioQuietMonument } from './versions/10-quiet-monument'
import { PortfolioLabShell, type PortfolioLabVersion } from './PortfolioLabShell'

const VERSIONS: PortfolioLabVersion[] = [
  {
    Component: PortfolioPrismConveyor,
    id: '01',
    label: 'Prism Conveyor',
  },
  {
    Component: PortfolioMagneticEditorial,
    id: '02',
    label: 'Magnetic Editorial',
  },
  {
    Component: PortfolioLivingBlueprint,
    id: '03',
    label: 'Living Blueprint',
  },
  {
    Component: PortfolioChromaticDesktop,
    id: '04',
    label: 'Chromatic Desktop',
  },
  {
    Component: PortfolioTypographicCinema,
    id: '05',
    label: 'Typographic Cinema',
  },
  {
    Component: PortfolioFoldedIndex,
    id: '06',
    label: 'Folded Index',
  },
  {
    Component: PortfolioOrbitalStudio,
    id: '07',
    label: 'Orbital Studio',
  },
  {
    Component: PortfolioElasticGallery,
    id: '08',
    label: 'Elastic Gallery',
  },
  {
    Component: PortfolioKineticMosaic,
    id: '09',
    label: 'Kinetic Mosaic',
  },
  {
    Component: PortfolioQuietMonument,
    id: '10',
    label: 'Quiet Monument',
  },
]

export function PortfolioLab() {
  return <PortfolioLabShell versions={VERSIONS} />
}
