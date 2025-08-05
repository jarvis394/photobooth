import React, { useState } from 'react'
import Button from '@valley/ui/Button'
import { useRemixForm } from 'remix-hook-form'
import TextField from '@valley/ui/TextField'
import Note from '@valley/ui/Note'
import { Form, useParams } from 'react-router'
import { useIsPending } from 'app/utils/misc'
import { useProject } from 'app/utils/queries/project'
import { ProjectWithFolders } from '@valley/shared'
import { redirectToKey } from 'app/config/paramsKeys'
import ErrorModalContent from '../ErrorModalContent'
import { Modal } from '@valley/ui/Modal'
import escape from 'regexp.escape'

type ConfirmFolderDeletionProps = { onClose: () => void }

const ModalContents: React.FC<
  { project?: ProjectWithFolders | null } & ConfirmFolderDeletionProps
> = ({ project, onClose }) => {
  const searchParams = new URLSearchParams(window.location.search)
  const { folderId: paramsFolderId, projectId } = useParams()
  const [folderId] = useState(searchParams.get('modal-folderId'))
  const defaultFolder = project?.folders.find((e) => e.isDefaultFolder)
  const folder = project?.folders.find((e) => e.id === folderId)
  const redirectToFolderId =
    paramsFolderId === folderId ? defaultFolder?.id : paramsFolderId
  const redirectTo = `/projects/${projectId}${
    redirectToFolderId ? `/folder/${redirectToFolderId}` : ''
  }`
  const formAction = `/api/projects/${projectId}/folders/${folder?.id}/delete?${redirectToKey}=${redirectTo}`
  const { handleSubmit } = useRemixForm({
    submitConfig: { navigate: true, action: formAction, method: 'POST' },
  })
  const isFolderWithFiles = folder?.totalFiles !== 0
  const isPending = useIsPending({ formAction })
  const folderTitlePattern = `\\s*${escape(folder?.title || '')}\\s*`
  const deleteConfirmPattern = '\\s*delete my folder\\s*'

  if (!folder) {
    return (
      <ErrorModalContent onClose={onClose} title={'Delete Folder'}>
        Folder &quot;{folderId}&quot; was not found.
      </ErrorModalContent>
    )
  }

  if (folder.isDefaultFolder) {
    return (
      <ErrorModalContent onClose={onClose} title={'Delete Folder'}>
        Cannot delete folder &quot;{folderId}&quot; as it is a default folder.
      </ErrorModalContent>
    )
  }

  return (
    <>
      <Modal.Title>Delete Folder</Modal.Title>
      <Form
        onSubmit={handleSubmit}
        id="confirm-folder-deletion-form"
        method="POST"
        action={formAction}
      >
        <Modal.Content>
          <p>
            Folder <b>&quot;{folder?.title}&quot;</b>
            {isFolderWithFiles && (
              <>
                , alongside with <b>{folder?.totalFiles} files</b>,
              </>
            )}
            &nbsp;will be deleted.
          </p>
          <Note variant="alert" fill>
            This action is not reversible. Please be certain.
          </Note>
        </Modal.Content>
        {isFolderWithFiles && (
          <div className="border-alpha-transparent-07 bg-paper flex flex-col gap-6 border-t-1 p-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="folder-title-input"
                className="text-secondary text-sm"
              >
                Enter the folder title <b>{folder?.title}</b> to continue:
              </label>
              <TextField
                required
                pattern={folderTitlePattern}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                type="text"
                id="folder-title-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="delete-confirm-input"
                className="text-secondary text-sm"
              >
                To verify, type <b>delete my files</b> below:
              </label>
              <TextField
                required
                pattern={deleteConfirmPattern}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                type="text"
                id="delete-confirm-input"
              />
            </div>
          </div>
        )}
      </Form>
      <Modal.Footer
        className="bg-default"
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
            form="confirm-folder-deletion-form"
            variant="primary"
            size="md"
            type="submit"
            disabled={isPending}
            loading={isPending}
          >
            {isFolderWithFiles ? 'Continue' : 'Delete'}
          </Button>
        }
      />
    </>
  )
}

const ConfirmFolderDeletionModal: React.FC<ConfirmFolderDeletionProps> = ({
  onClose,
}) => {
  const { data } = useProject()
  const project = data?.project

  return <ModalContents onClose={onClose} project={project} />
}

export default ConfirmFolderDeletionModal
