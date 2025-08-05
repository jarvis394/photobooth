import Button from '@valley/ui/Button'
import { Modal } from '@valley/ui/Modal'
import Note from '@valley/ui/Note'
import React from 'react'

type ErrorModalContentProps = React.PropsWithChildren<{
  onClose: () => void
  title?: React.ReactNode
}>

const ErrorModalContent: React.FC<ErrorModalContentProps> = ({
  children,
  title = 'Error',
  onClose,
}) => {
  return (
    <>
      <Modal.Title>{title}</Modal.Title>
      <Modal.Content>
        <Note variant="alert" fill>
          {children}
        </Note>
      </Modal.Content>
      <Modal.Footer
        before={<></>}
        after={
          <Button onClick={onClose} variant="primary" size="md">
            Continue
          </Button>
        }
      />
    </>
  )
}

export default ErrorModalContent
