import Button from '@valley/ui/Button'
import Hidden from '@valley/ui/Hidden'
import IconButton from '@valley/ui/IconButton'
import Menu from '@valley/ui/Menu'
import PageHeader from 'app/components/PageHeader/PageHeader'
import { useModal } from 'app/hooks/useModal'
import { useRootLoaderData } from 'app/utils/misc'
import { useUserStore } from 'app/utils/user'
import { MoreHorizontal, Share, PencilEdit } from 'geist-ui-icons'
import { useProject } from 'app/utils/queries/project'
import { useParams } from 'react-router'
import styles from './project.module.css'
import cx from 'classnames'
import React from 'react'
import { Route } from './+types'

const ProjectHeader = () => {
  const {
    ENV: { GALLERY_SERVICE_URL },
  } = useRootLoaderData()
  const { projectId = '', folderId = '' } =
    useParams<Route.ComponentProps['params']>()
  const { data: projectData } = useProject({ projectId })
  const project = projectData?.project
  const currentFolder = project?.folders?.find((e) => e.id === folderId)
  const user = useUserStore((state) => state.data)
  const { openModal } = useModal()
  const galleryUrl =
    user &&
    project &&
    [GALLERY_SERVICE_URL, user.domains[0], 'gallery', project.slug].join('/')

  const handleEditFolderDescription = () => {
    if (!currentFolder) return
    openModal('edit-folder-description', { folderId: currentFolder.id })
  }

  return (
    <PageHeader
      before={
        <Menu.Root>
          <Hidden md lg xl asChild>
            <Menu.Trigger asChild>
              <IconButton variant="secondary" size="lg">
                <MoreHorizontal />
              </IconButton>
            </Menu.Trigger>
          </Hidden>
          <Button size="lg" variant="secondary" before={<Share />}>
            Share{' '}
            <Hidden sm asChild>
              <span>project</span>
            </Hidden>
          </Button>
          <Hidden asChild sm>
            <Button
              onClick={handleEditFolderDescription}
              size="lg"
              variant="secondary"
              before={<PencilEdit />}
            >
              Edit description
            </Button>
          </Hidden>
          <Button
            className={cx(styles.project__headerVisitButton, {
              [styles['project__headerVisitButton--disabled']]: !galleryUrl,
            })}
            size="lg"
            variant="primary"
            asChild
          >
            <a
              href={galleryUrl || '#'}
              target="_blank"
              rel="noreferrer noopener"
            >
              Visit
            </a>
          </Button>
          <Menu.Content>
            <Menu.Item before={<Share />}>Share project</Menu.Item>
            <Menu.Item
              onClick={handleEditFolderDescription}
              before={<PencilEdit />}
            >
              Edit description
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      }
    >
      {project?.title}
    </PageHeader>
  )
}

export default React.memo(ProjectHeader)
