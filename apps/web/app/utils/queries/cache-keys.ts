import type { Project, Folder } from '@valley/db'

export const projectCacheKeys = {
  all: ['projects'] as const,
  project: (projectId: Project['id']) =>
    [...projectCacheKeys.all, projectId] as const,
}

export const folderCacheKeys = {
  all: ['folders'] as const,
  folder: (projectId: Project['id'], folderId: Folder['id']) =>
    [
      ...projectCacheKeys.project(projectId),
      ...folderCacheKeys.all,
      folderId,
    ] as const,
  folderFiles: (projectId: Project['id'], folderId: Folder['id']) =>
    [...folderCacheKeys.folder(projectId, folderId), 'files'] as const,
}
