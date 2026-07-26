import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import styles from './CutCornerButton.module.css'

type Variant = 'gold' | 'navy' | 'paper' | 'quiet'

interface CommonProps {
  children: ReactNode
  className?: string
  loading?: boolean
  variant?: Variant
}

type CutCornerLinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type CutCornerNativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }

export type CutCornerButtonProps = CutCornerLinkProps | CutCornerNativeButtonProps

export function CutCornerButton(props: CutCornerButtonProps) {
  const { children, className = '', loading = false, variant = 'navy' } = props
  const classes = `${styles.control} ${styles[variant]} ${className}`
  const content = (
    <>
      <span className={loading ? styles.hidden : undefined}>{children}</span>
      {loading ? <span aria-hidden="true" className={styles.loading}><span />Loading</span> : null}
    </>
  )

  if ('href' in props && props.href !== undefined) {
    const {
      href,
      children: _children,
      className: _className,
      loading: _loading,
      variant: _variant,
      ...anchorProps
    } = props
    return <a {...anchorProps} aria-busy={loading || undefined} className={classes} href={href}>{content}</a>
  }

  const {
    type = 'button',
    children: _children,
    className: _className,
    loading: _loading,
    variant: _variant,
    ...buttonProps
  } = props as CutCornerNativeButtonProps
  return <button {...buttonProps} aria-busy={loading || undefined} className={classes} disabled={loading || buttonProps.disabled} type={type}>{content}</button>
}
