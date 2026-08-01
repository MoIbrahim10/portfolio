import { CutCornerButton } from '#/components/v14-exploration-lab/CutCornerButton'

import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <a aria-label="MO portfolio home" className={styles.logoLink} href="/">
        <img
          alt=""
          className={styles.logo}
          height="480"
          src="/brand/mo-mark-v3.svg"
          width="790"
        />
      </a>

      <section aria-labelledby="not-found-title" className={styles.message}>
        <p className={styles.code}>404 / Lost signal</p>
        <h1 id="not-found-title">Page not found</h1>
        <p className={styles.description}>
          This address doesn&apos;t lead to a portfolio page. Return home to
          keep exploring.
        </p>
        <CutCornerButton className={styles.homeAction} href="/" variant="navy">
          Return home
        </CutCornerButton>
      </section>

      <p aria-hidden="true" className={styles.footerMark}>
        MO / Portfolio / Error 404
      </p>
    </main>
  )
}
