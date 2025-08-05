import type { loader } from 'app/routes/api+/projects+/_index'
import makeRequest from '../makeRequest'
import { ClientData } from 'app/utils/misc'

export type ProjectsLoaderData = ClientData<typeof loader>

export const get = async () =>
  await makeRequest<ProjectsLoaderData>({
    path: 'projects',
  })
