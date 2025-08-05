import IconButton from '@valley/ui/IconButton'
import Wrapper from '@valley/ui/Wrapper'
import { useModal } from 'app/hooks/useModal'
import { formatNewLine } from 'app/utils/format-new-line'
import { PencilEdit } from 'geist-ui-icons'
import React from 'react'
import styles from './project.module.css'
import { useParams } from 'react-router'
import { Route } from './+types'
import { useProject } from 'app/utils/queries/project'

const FolderInfo: React.FC = () => {
  const { openModal } = useModal()
  const { projectId = '', folderId = '' } =
    useParams<Route.ComponentProps['params']>()
  const { data: projectData } = useProject({ projectId })
  const currentFolder = projectData?.project?.folders?.find(
    (e) => e.id === folderId
  )

  const handleEditFolderTitle = () => {
    if (!currentFolder) return
    openModal('edit-folder-title', { folderId: currentFolder.id })
  }

  const handleEditFolderDescription = () => {
    if (!currentFolder) return
    openModal('edit-folder-description', { folderId: currentFolder.id })
  }

  return (
    <Wrapper className={styles.project__folderInfo}>
      <div className={styles.project__folderTitleContainer}>
        {currentFolder?.title}
        <IconButton
          className="mt-0.5"
          onClick={handleEditFolderTitle}
          variant="tertiary-dimmed"
        >
          <PencilEdit />
        </IconButton>
      </div>
      {currentFolder?.description && (
        <div className={styles.project__folderDescriptionContainer}>
          <p>{formatNewLine(currentFolder?.description)}</p>
          <IconButton
            onClick={handleEditFolderDescription}
            variant="tertiary-dimmed"
          >
            <PencilEdit />
          </IconButton>
        </div>
      )}
    </Wrapper>
  )
}

export default React.memo(FolderInfo)
