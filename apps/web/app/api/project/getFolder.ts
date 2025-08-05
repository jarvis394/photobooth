import type { loader } from 'app/routes/api+/projects+/$projectId.folders+/$folderId.files'
import makeRequest from '../makeRequest'
import { ClientData } from 'app/utils/misc'
import type { Folder, Project } from '@valley/db'

export type ProjectFolderFilesLoaderData = ClientData<typeof loader>
export type GetProjectFolderFilesProps = {
  projectId: Project['id']
  folderId: Folder['id']
}

export const getFolderFiles = async ({
  projectId,
  folderId,
}: GetProjectFolderFilesProps) =>
  await makeRequest<ProjectFolderFilesLoaderData>({
    path: `projects/${projectId}/folders/${folderId}/files`,
  })
