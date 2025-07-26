import React from 'react'
import Paper, { PaperProps } from '../Paper/Paper'
import { cn } from '@valley/shared'

export type WrapperProps = PaperProps

const Wrapper: React.FC<WrapperProps> = ({
  children,
  className,
  variant = 'tertiary',
  ...props
}) => (
  <Paper
    {...props}
    variant={variant}
    className={cn(
      'Wrapper',
      'mx-auto flex w-full max-w-[calc(var(--pageWidth)+2*var(--pagePadding))] px-[var(--pagePadding)] [--pagePadding:calc(var(--spacing)*4)] md:[--pagePadding:calc(var(--spacing)*6)]',
      className
    )}
  >
    {children}
  </Paper>
)

export default Wrapper
