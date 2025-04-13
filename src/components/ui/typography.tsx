import React from 'react'
type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'blockquote' | 'inlineCode' | 'lead' | 'large' | 'small' | 'muted'

const styles = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-xl font-medium tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
  inlineCode: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none'
}
const Typography = (props: { children: React.ReactNode; variant: Variant, className?: string }) => {
  const { children, variant, className } = props
  return <div className={styles[variant as keyof typeof styles] + (className || '')}>{children}</div>
}

export default Typography
