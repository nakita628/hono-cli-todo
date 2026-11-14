import type { ButtonHTMLAttributes } from 'react'
import { cva, cx } from 'styled-system/css'
import type { RecipeVariantProps } from 'styled-system/types'

const button = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    rounded: 'lg',
    fontWeight: 'semibold',
    cursor: 'pointer',
    transition: 'colors',
    _disabled: { cursor: 'not-allowed', opacity: 0.5 },
  },
  variants: {
    variant: {
      primary: { bg: 'indigo.600', color: 'white', _hover: { bg: 'indigo.500' } },
      ghost: { color: 'slate.500', _hover: { bg: 'slate.100' } },
      danger: { color: 'rose.500', _hover: { bg: 'rose.50' } },
    },
    size: {
      sm: { px: '3', py: '1.5', fontSize: 'sm' },
      md: { px: '4', py: '2' },
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & RecipeVariantProps<typeof button>) {
  return <button type="button" className={cx(button({ variant, size }), className)} {...props} />
}
