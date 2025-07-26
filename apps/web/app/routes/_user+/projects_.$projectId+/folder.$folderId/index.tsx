import { Project, Folder } from '@valley/db'
import { Route } from './+types'
import { combineServerTimings } from 'app/server/timing.server'
import { ShouldRevalidateFunction } from 'react-router'
import { GeneralErrorBoundary } from 'app/components/ErrorBoundary'
import React from 'react'
import ProjectBlock from './ProjectBlock'
import FolderFiles from './FolderFiles'
import {
  projectFolderFilesQuery,
  useProjectFolderFiles,
} from 'app/utils/queries/project'
import { loader as projectFolderFilesLoader } from 'app/routes/api+/projects+/$projectId.folders+/$folderId.files'
import { getQueryClient } from 'app/utils/query-client'
import { ProjectFolderFilesLoaderData } from 'app/api/project'

export const getFilesCacheKey = (
  projectId?: Project['id'],
  folderId?: Folder['id']
) => `files:${projectId}:${folderId}`

export const loader = projectFolderFilesLoader

export const clientLoader = async ({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const cachedData =
    getQueryClient().getQueryData<ProjectFolderFilesLoaderData>(
      projectFolderFilesQuery(params).queryKey
    )
  return cachedData ?? (await serverLoader())
}

export const headers = ({
  loaderHeaders,
  parentHeaders,
}: Route.HeadersArgs) => {
  return {
    'Server-Timing': combineServerTimings(parentHeaders, loaderHeaders),
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  if (
    currentParams.folderId &&
    currentParams.folderId !== nextParams.folderId
  ) {
    return true
  }

  return false
}

const ProjectRoute: React.FC<Route.ComponentProps> = ({
  loaderData,
  params,
}) => {
  useProjectFolderFiles({
    projectId: params.projectId,
    folderId: params.folderId,
    initialData: loaderData,
  })

  return (
    <div className="flex h-full flex-col">
      <ProjectBlock />
      <FolderFiles />
    </div>
  )
}

export const ErrorBoundary = GeneralErrorBoundary

export default React.memo(ProjectRoute)
