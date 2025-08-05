import React from 'react'
import Wrapper, { WrapperProps } from '@valley/ui/Wrapper'
import { cn } from '@valley/shared'

type PageHeaderProps = WrapperProps & {
  before?: React.ReactElement
  after?: React.ReactElement
  headerProps?: React.ComponentPropsWithoutRef<'h1'>
} & React.ComponentPropsWithoutRef<'div'>

const PageHeader: React.FC<PageHeaderProps> = ({
  children,
  before,
  after,
  className,
  headerProps,
  ...props
}) => {
  const { className: headerClassName, ...restHeaderProps } = headerProps || {}

  return (
    <Wrapper
      {...props}
      className={cn(
        'flex min-h-30 shrink-0 flex-col gap-4 py-10 lg:flex-row',
        className
      )}
    >
      <h1
        {...restHeaderProps}
        className={cn(
          'heading-32 flex grow items-center font-medium',
          headerClassName
        )}
      >
        {children}
      </h1>
      {before && (
        <div className="flex flex-0 flex-row-reverse items-center justify-end gap-3 lg:flex-row lg:justify-start">
          {before}
        </div>
      )}
      {after}
    </Wrapper>
  )
}

export default PageHeader
