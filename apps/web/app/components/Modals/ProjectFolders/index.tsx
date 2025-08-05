import {
  useSensors,
  useSensor,
  TouchSensor,
  KeyboardSensor,
  DragEndEvent,
  DndContext,
  closestCenter,
  MouseSensor,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { FetcherWithComponents, useFetcher, useNavigate } from 'react-router'
import type { Folder } from '@valley/db'
import { ProjectWithFolders, PROJECT_MAX_FOLDERS } from '@valley/shared'
import Button from '@valley/ui/Button'
import { Modal } from '@valley/ui/Modal'
import FolderListItem from 'app/components/FolderListItem/FolderListItem'
import { Plus, Pencil } from 'geist-ui-icons'
import React, {
  useState,
  useId,
  startTransition,
  useMemo,
  useCallback,
} from 'react'
import cx from 'classnames'
import { createPortal } from 'react-dom'
import { ClientOnly } from 'remix-utils/client-only'
import { useProject } from 'app/utils/queries/project'
import { useProjectsStore } from 'app/stores/projects'

const ModalContent: React.FC<{
  project?: ProjectWithFolders | null
  createFolderFetcher: FetcherWithComponents<unknown>
  onClose?: () => void
}> = ({ project: propsProject, createFolderFetcher }) => {
  const id = useId()
  const navigate = useNavigate()
  const storeProject = useProjectsStore(
    (state) => state.projects[propsProject?.id || '']
  )
  const setProjectFolders = useProjectsStore((state) => state.setProjectFolders)
  const parsedStoreProject = useMemo(() => {
    const res: ProjectWithFolders = { ...storeProject, folders: [] }
    if (!storeProject) return propsProject
    for (const id in storeProject.folders) {
      const folder = storeProject.folders[id]
      folder && res.folders.push(folder)
    }
    return res
  }, [propsProject, storeProject])
  const project = parsedStoreProject || propsProject
  const folders = useMemo(() => project?.folders || [], [project?.folders])
  const [activeFolderId, setActiveFolderId] = useState<Folder['id'] | null>(
    null
  )
  const activeFolder = folders.find((e) => e.id === activeFolderId)
  const [isEditing, setIsEditing] = useState(false)
  const isCreatingFolder = createFolderFetcher.state !== 'idle'
  const canCreateMoreFolders = (folders.length || 0) < PROJECT_MAX_FOLDERS
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleFolderClick = (folder: Folder) => {
    if (!project) return

    navigate('/projects/' + project.id + '/folder/' + folder.id, {
      replace: true,
    })
  }

  const handleEdit = () => {
    startTransition(() => {
      setIsEditing((prev) => !prev)
    })
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveFolderId(event.active.id.toString())
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!project) return

      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = folders.findIndex((e) => e.id === active.id)
        const newIndex = folders.findIndex((e) => e.id === over?.id)
        setProjectFolders(project?.id, arrayMove(folders, oldIndex, newIndex))
      }
    },
    [folders, project, setProjectFolders]
  )

  return (
    <>
      <Modal.Title className="flex w-full items-center justify-between pt-6 pb-3">
        Folders
        <div className="flex gap-2">
          <Button
            disabled={isCreatingFolder}
            loading={isCreatingFolder}
            variant="secondary"
            size="md"
            type="submit"
            form="create-project-folder"
            className="fade"
            data-fade-in={canCreateMoreFolders}
            before={<Plus />}
          >
            Create
          </Button>
          <Button
            onClick={handleEdit}
            variant={isEditing ? 'secondary' : 'primary'}
            before={isEditing ? null : <Pencil />}
            size="md"
          >
            {isEditing && 'Done'}
            {!isEditing && 'Edit'}
          </Button>
        </div>
      </Modal.Title>
      <ul className="flex w-full flex-col gap-1 overflow-x-hidden overflow-y-auto p-2 transition-all">
        <DndContext
          id={id}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <SortableContext
            disabled={!isEditing}
            items={folders}
            strategy={verticalListSortingStrategy}
          >
            {folders.map((folder) => (
              <FolderListItem
                mode={isEditing ? 'edit' : 'default'}
                key={folder.id}
                onClick={handleFolderClick}
                folder={folder}
              />
            ))}
            <ClientOnly>
              {() =>
                createPortal(
                  <DragOverlay zIndex={2000}>
                    {activeFolderId && activeFolder && (
                      <FolderListItem
                        mode="edit"
                        isOverlay
                        key={activeFolderId}
                        folder={activeFolder}
                      />
                    )}
                  </DragOverlay>,
                  document.body
                )
              }
            </ClientOnly>
          </SortableContext>
        </DndContext>
      </ul>
      <Modal.Footer className="grid [grid-template-areas:'before_stack_after']">
        <p
          className={cx(
            'text-secondary w-full text-center opacity-0 transition-opacity [grid-area:stack]',
            {
              'opacity-100': isEditing,
            }
          )}
        >
          Exit editing mode by clicking &quot;Done&quot;
        </p>
        <p
          className={cx(
            'text-secondary w-full text-center opacity-0 transition-opacity [grid-area:stack]',
            {
              'opacity-100': !isEditing,
            }
          )}
        >
          You can edit folders by clicking &quot;Edit&quot; button
        </p>
      </Modal.Footer>
    </>
  )
}

const ProjectFoldersModal: React.FC<{ onClose?: () => void }> = ({
  onClose,
}) => {
  const { data } = useProject()
  const project = data?.project
  const createFolderAction = '/api/projects/' + project?.id + '/folders/create'
  const createFolderFetcher = useFetcher({ key: createFolderAction })

  return (
    <ModalContent
      createFolderFetcher={createFolderFetcher}
      onClose={onClose}
      project={project}
    />
  )
}

export default React.memo(ProjectFoldersModal)
