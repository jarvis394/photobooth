import type { loader } from 'app/routes/api+/projects+/$projectId'
import makeRequest from '../makeRequest'
import { ClientData } from 'app/utils/misc'
import type { Project } from '@valley/db'

export type ProjectLoaderData = ClientData<typeof loader>
export type GetProjectProps = { projectId: Project['id'] }

export const get = async ({ projectId }: GetProjectProps) =>
  await makeRequest<ProjectLoaderData>({
    path: `projects/${projectId}`,
  })
