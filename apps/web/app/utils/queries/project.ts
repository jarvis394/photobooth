import type {
  ProjectFolderFilesLoaderData,
  ProjectLoaderData,
} from 'app/api/project'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import * as api from 'app/api'
import type { Folder, Project } from '@valley/db'
import { folderCacheKeys, projectCacheKeys } from './cache-keys'
import { useParams } from 'react-router'

type UseProjectProps = {
  projectId: Project['id']
} & Partial<UseQueryOptions<ProjectLoaderData>>

export const projectQuery = ({
  projectId,
}: Pick<UseProjectProps, 'projectId'>) =>
  ({
    queryKey: projectCacheKeys.project(projectId),
    queryFn: () => api.project.get({ projectId }),
  }) satisfies UseQueryOptions<ProjectLoaderData>

export const useProject = ({
  projectId,
  ...props
}: Partial<UseProjectProps> = {}) => {
  const { projectId: paramsProjectId } = useParams()

  if (!paramsProjectId && !projectId && props.enabled) {
    throw new Error(
      'No project ID found in params or props for useProject query'
    )
  }

  return useQuery<ProjectLoaderData>({
    ...props,
    ...projectQuery({ projectId: (projectId || paramsProjectId) as string }),
  })
}

type UseProjectFolderFilesProps = {
  projectId: Project['id']
  folderId: Folder['id']
} & Partial<UseQueryOptions<ProjectFolderFilesLoaderData>>

export const projectFolderFilesQuery = ({
  projectId,
  folderId,
}: Pick<UseProjectFolderFilesProps, 'projectId' | 'folderId'>) =>
  ({
    queryKey: folderCacheKeys.folderFiles(projectId, folderId),
    queryFn: () => api.project.getFolderFiles({ projectId, folderId }),
  }) satisfies UseQueryOptions<ProjectFolderFilesLoaderData>

export const useProjectFolderFiles = ({
  projectId,
  folderId,
  ...props
}: Partial<UseProjectFolderFilesProps> = {}) => {
  const { projectId: paramsProjectId, folderId: paramsFolderId } = useParams()

  if (!paramsProjectId && !projectId && props.enabled) {
    throw new Error(
      'No project ID found in params or props for useProject query'
    )
  }

  if (!paramsFolderId && !folderId && props.enabled) {
    throw new Error(
      'No folder ID found in params or props for useProject query'
    )
  }

  return useQuery<ProjectFolderFilesLoaderData>({
    ...props,
    ...projectFolderFilesQuery({
      projectId: (projectId || paramsProjectId) as string,
      folderId: (folderId || paramsFolderId) as string,
    }),
  })
}
