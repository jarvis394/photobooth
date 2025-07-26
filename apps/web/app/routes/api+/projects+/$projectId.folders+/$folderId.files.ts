import { makeTimings, time } from 'app/server/timing.server'
import { Route } from './+types/$folderId.files'
import { data } from 'react-router'
import { requireUserId } from 'app/server/auth/auth.server'
import { FolderService } from 'app/server/services/folder.server'

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { projectId, folderId } = params
  const timings = makeTimings('project folder loader')
  const userId = await requireUserId(request)
  const files = await time(
    FolderService.getProjectFolderFiles({ userId, projectId, folderId }),
    {
      timings,
      type: 'find folder files',
    }
  )

  return data({ files }, { headers: { 'Server-Timing': timings.toString() } })
}
