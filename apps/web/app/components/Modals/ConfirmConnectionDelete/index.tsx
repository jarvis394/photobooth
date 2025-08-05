import React, { useState } from 'react'
import Button from '@valley/ui/Button'
import { Modal } from '@valley/ui/Modal'
import { PROVIDER_LABELS } from 'app/config/connections'
import type { AccountData } from 'app/routes/_user+/_home+/settings+/security'
import { authClient } from '@valley/auth/client'
import { showToast } from '@valley/ui/Toast'
import { useRevalidator } from 'react-router'

type ConfirmConnectionDeleteProps = {
  onClose: () => void
  data: AccountData
}

const passwordModalContent = (
  <p>
    You are about to remove your password.
    <br />
    <br />
    After removing it, you will still be able to log into your account with{' '}
    <span className="text-primary font-medium">magic links</span>
    .
    <br />
    <br />
    Do you want to continue?
  </p>
)

const socialProviderModalContent = (label: string) => (
  <p>
    You are about to remove the login connection for{' '}
    <span className="text-primary font-medium">{label}</span>
    .
    <br />
    <br />
    After removing it, you won&apos;t be able to use{' '}
    <span className="text-primary font-medium">{label}</span> to log into your
    account anymore.
    <br />
    <br />
    Do you want to continue?
  </p>
)

const ConfirmConnectionDeleteModal: React.FC<ConfirmConnectionDeleteProps> = ({
  onClose,
  data,
}) => {
  const label = PROVIDER_LABELS[data.provider]
  const [isPending, setPending] = useState(false)
  const revalidator = useRevalidator()

  const handleClick = async () => {
    setPending(true)
    await authClient.unlinkAccount({
      accountId: data.accountId,
      providerId: data.provider,
      fetchOptions: {
        onSuccess() {
          showToast({
            type: 'info',
            title: label,
            description:
              data.provider === 'credential'
                ? 'Your password has been removed.'
                : 'Your connection has been deleted.',
            id: 'connection-unlink',
          })
          onClose()
          revalidator.revalidate()
        },
        onError(e) {
          setPending(false)
          showToast({
            type: 'error',
            title: 'Error',
            description: e.error.message,
            id: 'connection-unlink-error',
          })
        },
      },
    })
  }

  return (
    <>
      <Modal.Title>Disconnect {label}</Modal.Title>
      <Modal.Content className="text-secondary pt-1">
        {data.provider === 'credential' && passwordModalContent}
        {data.provider !== 'credential' && socialProviderModalContent(label)}
      </Modal.Content>
      <Modal.Footer
        before={
          <Button
            tabIndex={0}
            onClick={onClose}
            variant="secondary-dimmed"
            size="md"
            disabled={isPending}
          >
            Cancel
          </Button>
        }
        after={
          <Button
            variant="danger"
            size="md"
            type="submit"
            onClick={handleClick}
            disabled={isPending}
            loading={isPending}
          >
            {data.provider === 'credential' ? 'Remove' : 'Delete'}
          </Button>
        }
      />
    </>
  )
}

export default ConfirmConnectionDeleteModal
