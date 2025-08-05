import Button from '@valley/ui/Button'
import IconButton from '@valley/ui/IconButton'
import Wrapper from '@valley/ui/Wrapper'
import FileCard from 'app/components/FileCard/FileCard'
import UploadButton from 'app/components/UploadButton/UploadButton'
import { useProjectsStore } from 'app/stores/projects'
import { SortAscending, Trash } from 'geist-ui-icons'
import React, { useMemo } from 'react'
import { useParams } from 'react-router'
import styles from './project.module.css'
import { File } from '@valley/db'
import { useSortable } from 'app/hooks/useSortable'
import { AnimatePresence, motion } from 'framer-motion'
import { useProject, useProjectFolderFiles } from 'app/utils/queries/project'
import { sortFiles } from '@valley/gallery-module/utils/sort-files'
import { cn } from '@valley/shared'
import Spinner from '@valley/ui/Spinner'
import { Route } from './+types'

const FolderFiles = () => {
  const { projectId = '', folderId = '' } =
    useParams<Route.ComponentProps['params']>()
  const { data: projectData } = useProject()
  const { data: filesData, isSuccess, isPending } = useProjectFolderFiles()
  const sortedFiles = useMemo(
    () =>
      sortFiles({
        files: filesData?.files || [],
        orderBy: 'dateShot',
        direction: 'asc',
      }),
    [filesData?.files]
  )
  const setFiles = useProjectsStore((state) => state.setFiles)
  const cover = filesData?.files.find(
    (e) => e.id === projectData?.project?.cover?.fileId
  )

  const onListUpdate: React.Dispatch<React.SetStateAction<File[]>> = (prop) => {
    setFiles({
      projectId,
      folderId,
      files: typeof prop === 'function' ? prop(filesData?.files || []) : prop,
    })
  }

  const {
    getItemProps,
    getRootProps,
    preventSelection,
    restoreSelection,
    selectItem,
    selectedIds: selectedFileIds,
  } = useSortable({
    setItems: onListUpdate,
    disableSelectionByDefault: true,
    options: {
      ghostClass: styles['project__files--ghost'],
      selectedClass: styles['project__files--selected'],
      dragClass: styles['project__files--drag'],
    },
  })

  if (isPending) {
    return (
      <div className="animate-in fade-in text-primary/32 flex items-center justify-center [animation-delay:1500ms]">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {selectedFileIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, bottom: -56 }}
            animate={{ opacity: 1, bottom: 0 }}
            exit={{ opacity: 0, bottom: -56 }}
            transition={{ duration: 0.2, ease: 'circInOut' }}
            className="bg-paper border-alpha-solid-07 fixed bottom-0 z-50 w-full border-t-1"
          >
            <Wrapper
              onMouseEnter={preventSelection}
              onTouchStart={preventSelection}
              onMouseLeave={restoreSelection}
              onTouchEnd={restoreSelection}
              className="flex items-center justify-center gap-8 p-2"
            >
              <span>Selected {selectedFileIds.length} files</span>
              <IconButton size="md" variant="danger-dimmed">
                <Trash />
              </IconButton>
            </Wrapper>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex grow flex-col max-md:gap-3 md:gap-4">
        <Wrapper className="flex items-center justify-center gap-3 sm:hidden">
          <UploadButton
            projectId={projectId}
            folderId={folderId}
            variant="compact"
          />
          <IconButton variant="secondary-dimmed" size="xl">
            <SortAscending />
          </IconButton>
        </Wrapper>

        <Wrapper className="flex items-center justify-between gap-4 max-sm:hidden">
          <div className="flex items-center gap-4">
            <UploadButton
              projectId={projectId}
              folderId={folderId}
              variant="button"
              size="md"
            />
            <p className={styles.project__uploadHint}>
              You can also drop files anywhere on the page
            </p>
          </div>
          <Button
            variant="secondary-dimmed"
            size="md"
            before={<SortAscending />}
          >
            Sort by date shot
          </Button>
        </Wrapper>

        {isSuccess && sortedFiles.length === 0 && (
          <Wrapper className="flex size-full items-center justify-center p-24">
            <div className="fade-in z-10 flex flex-col items-center justify-center">
              <h1 className="heading-24 mb-4 text-center">
                This folder does not contain any files
              </h1>
              <p className="mb-6 text-center text-base">
                Upload some photos to make it happier
              </p>
              <UploadButton
                projectId={projectId}
                folderId={folderId}
                variant="button"
              />
            </div>
          </Wrapper>
        )}

        {isSuccess && sortedFiles.length > 0 && (
          <Wrapper
            {...getRootProps()}
            key={'folder-files-' + folderId}
            className={cn(styles.project__files, 'animate-in fade-in')}
          >
            {sortedFiles.map((file) => (
              <FileCard
                {...getItemProps(file)}
                isCover={cover?.id === file.id}
                key={file.path}
                file={file}
                selectItem={selectItem}
              />
            ))}
          </Wrapper>
        )}
      </div>
    </>
  )
}

export default React.memo(FolderFiles)
