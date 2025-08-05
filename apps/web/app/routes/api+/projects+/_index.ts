import { makeTimings, time } from 'app/server/timing.server'
import { Route } from './+types/_index'
import { ProjectService } from 'app/server/services/project.server'
import { data } from 'react-router'
import { requireUserId } from 'app/server/auth/auth.server'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const timings = makeTimings('projects loader')
  const userId = await requireUserId(request)
  const projects = await time(ProjectService.getUserProjects({ userId }), {
    timings,
    type: 'find projects',
  })

  return data(
    { projects },
    { headers: { 'Server-Timing': timings.toString() } }
  )
}
