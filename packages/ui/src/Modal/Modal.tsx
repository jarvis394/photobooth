import React from 'react'
import styles from './Modal.module.css'
import useMediaQuery from '../useMediaQuery/useMediaQuery'
import { SMALL_VIEWPORT_WIDTH } from '../config/theme'
import { Drawer, type DialogProps } from 'vaul'
import { Dialog } from '@base-ui-components/react/dialog'
import { useRender } from '@base-ui-components/react/use-render'
import { mergeProps } from '@base-ui-components/react/merge-props'
import { cn } from '@valley/shared'

export const modalKey = 'modal'

const modalBackdropClasses = cn(
  'bg-modal-backdrop fixed inset-0 z-50 transition-all duration-300 [-webkit-tap-highlight-color:transparent] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0'
)

export type ModalRootProps = React.PropsWithChildren<{
  id?: string
  isOpen?: boolean
  onDismiss?: () => void
  /**
   * Use Drawer from "vaul" on mobile devices
   * @default true
   */
  useDrawer?: boolean
}> &
  Omit<DialogProps, 'open'>

export const ModalRoot: React.FC<ModalRootProps> = ({
  isOpen: propsIsOpen,
  children,
  id,
  onDismiss,
  onOpenChange,
  useDrawer = true,
  // TODO: fixme, bad types on vaul part
  fadeFromIndex: _fadeFromIndex,
  ...props
}) => {
  const shouldShowDrawer =
    useMediaQuery(`(max-width:${SMALL_VIEWPORT_WIDTH}px)`) && useDrawer
  const currentModal = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  )?.get(modalKey)
  const openState =
    propsIsOpen !== undefined ? propsIsOpen : currentModal === id

  const handleClose = () => {
    return onDismiss?.()
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange?.(isOpen)

    if (!isOpen) {
      return handleClose()
    }
  }

  if (shouldShowDrawer) {
    return (
      <Drawer.Root
        direction="bottom"
        repositionInputs
        disablePreventScroll
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        handleOnly
        {...props}
        open={openState}
        onOpenChange={handleOpenChange}
      >
        <Drawer.Portal>
          <Drawer.Content className={styles.modal__drawer}>
            <Drawer.Handle className={styles.modal__drawerHandle} />
            {children}
          </Drawer.Content>
          <Drawer.Overlay className={modalBackdropClasses} />
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return (
    <Dialog.Root {...props} open={openState} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={modalBackdropClasses} />
        <Dialog.Popup className="border-alpha-transparent-12 bg-default fixed top-1/2 left-1/2 z-100 flex max-h-[calc(100vh-var(--spacing)*8)] w-[calc(100%-var(--spacing)*8)] max-w-120 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:top-[calc(50%-var(--spacing)*1)] data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export type ModalContentProps = useRender.ComponentProps<'div'>
export const ModalContent: React.FC<ModalContentProps> = ({
  render = <div />,
  ...other
}) => {
  const props: useRender.ElementProps<'div'> = {
    className:
      'flex flex-col gap-4 overflow-auto p-6 pt-2 text-base [word-wrap:break-word]',
  }

  const element = useRender({ render, props: mergeProps(props, other) })

  return element
}

export type ModalTitleProps = Dialog.Title.Props
export const ModalTitle: React.FC<ModalTitleProps> = ({
  className,
  ...props
}) => {
  return (
    <Dialog.Title
      {...props}
      className={cn(
        'text-primary flex flex-col items-start justify-center gap-2 px-6 py-7 pb-4 text-2xl font-semibold',
        className
      )}
    />
  )
}

export type ModalFooterProps = {
  before?: React.ReactElement
  after?: React.ReactElement
} & React.JSX.IntrinsicElements['div']
export const ModalFooter: React.FC<ModalFooterProps> = ({
  className,
  before,
  after,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'bg-paper border-alpha-transparent-12 flex items-center justify-between gap-2 border-t-1 p-4',
        className
      )}
    >
      {before && <div className="flex items-center gap-2">{before}</div>}
      {children}
      {after && <div className="flex items-center gap-2">{after}</div>}
    </div>
  )
}

export const Modal = {
  Root: ModalRoot,
  Content: ModalContent,
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
  Title: ModalTitle,
  Description: Dialog.Description,
  Footer: ModalFooter,
}
