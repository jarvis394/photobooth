import React, { CSSProperties } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { AsChildProps } from '../types/AsChildProps'
import { type VariantProps, tv } from 'tailwind-variants'

export const paperVariants = tv({
  base: 'relative flex transform-gpu border-0 align-middle text-base no-underline outline-none [-webkit-tap-highlight-color:transparent]',
  variants: {
    variant: {
      primary: 'bg-button-primary text-button-primary-text',
      secondary:
        'bg-button-secondary text-primary ring-button-secondary-border ring ring-inset',
      'secondary-dimmed':
        'bg-button-secondary-dimmed text-primary ring-button-secondary-dimmed-border ring ring-inset',
      tertiary: 'text-button-tertiary-text bg-button-tertiary',
      'tertiary-dimmed':
        'text-button-tertiary-dimmed-text bg-button-tertiary-dimmed',
      warning: 'bg-button-warning text-button-warning-text',
      danger: 'bg-button-danger text-button-danger-text',
      'danger-dimmed': 'bg-button-danger-dimmed text-button-danger-dimmed-text',
    },
    rounded: {
      true: 'rounded-2xl',
    },
    button: {
      true: 'w-fit cursor-pointer duration-150 ease-in-out select-none',
    },
    outlined: {
      true: 'ring-alpha-transparent-12 ring ring-inset',
    },
    disabled: {
      true: 'bg-button-disabled text-button-disabled-text ring-button-disabled-border ring ring-inset',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      button: true,
      class:
        'hover:bg-button-primary-hovered hover:text-button-primary-hovered-text',
    },
    {
      variant: 'secondary',
      button: true,
      class:
        'hover:bg-button-secondary-hovered hover:text-button-secondary-hovered-text',
    },
    {
      variant: 'secondary-dimmed',
      button: true,
      class:
        'hover:bg-button-secondary-dimmed-hovered hover:text-button-secondary-dimmed-hovered-text',
    },
    {
      variant: 'tertiary',
      button: true,
      class:
        'hover:bg-button-tertiary-hovered hover:text-button-tertiary-hovered-text',
    },
    {
      variant: 'tertiary-dimmed',
      button: true,
      class:
        'hover:bg-button-tertiary-dimmed-hovered hover:text-button-tertiary-dimmed-hovered-text',
    },
    {
      variant: 'warning',
      button: true,
      class:
        'hover:bg-button-warning-hovered hover:text-button-warning-hovered-text',
    },
    {
      variant: 'danger',
      button: true,
      class:
        'hover:bg-button-danger-hovered hover:text-button-danger-hovered-text',
    },
    {
      variant: 'danger',
      button: true,
      class:
        'hover:bg-button-danger-dimmed-hovered hover:text-button-danger-dimmed-hovered-text',
    },
  ],
  defaultVariants: {
    variant: 'tertiary',
  },
})

export type PaperVariantsProps = VariantProps<typeof paperVariants>

export type PaperOwnProps = PaperVariantsProps &
  React.PropsWithChildren<
    Partial<{
      className: string
      style: CSSProperties
    }>
  >
export type PaperProps = AsChildProps<React.ComponentPropsWithRef<'div'>> &
  PaperOwnProps

const Paper = React.forwardRef<HTMLDivElement, PaperProps>(function Paper(
  { button, variant, rounded, outlined, className, asChild, ...other },
  ref
) {
  const Root = asChild ? Slot : 'div'

  return (
    <Root
      {...other}
      ref={ref}
      className={paperVariants({
        variant,
        rounded,
        button,
        outlined,
        className,
      })}
    />
  )
})

export default Paper
