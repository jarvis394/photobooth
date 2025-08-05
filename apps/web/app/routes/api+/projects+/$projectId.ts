import { makeTimings, time } from 'app/server/timing.server'
import { Route } from './+types/$projectId'
import { ProjectService } from 'app/server/services/project.server'
import { data } from 'react-router'
import { requireUserId } from 'app/server/auth/auth.server'

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { projectId } = params
  const timings = makeTimings('project loader')
  const userId = await requireUserId(request)
  const project = await time(
    ProjectService.getUserProject({ userId, projectId }),
    {
      timings,
      type: 'find project',
    }
  )

  return data({ project }, { headers: { 'Server-Timing': timings.toString() } })
}
