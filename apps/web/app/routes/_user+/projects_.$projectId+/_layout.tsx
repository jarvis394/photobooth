import React from 'react'
import { Outlet } from 'react-router'
import ProjectToolbar from 'app/components/Toolbar/ProjectToolbar'
import { GeneralErrorBoundary } from 'app/components/ErrorBoundary'
import { combineServerTimings } from 'app/server/timing.server'
import type { Project } from '@valley/db'
import { Route } from './+types/_layout'
import { projectQuery, useProject } from 'app/utils/queries/project'
import { loader as projectLoader } from 'app/routes/api+/projects+/$projectId'
import { ProjectLoaderData } from 'app/api/project'
import { getQueryClient } from 'app/utils/query-client'

export const getProjectCacheKey = (id?: Project['id']) => `project:${id}`

export const loader = projectLoader

export const clientLoader = async ({
  params,
  serverLoader,
}: Route.ClientLoaderArgs) => {
  const cachedData = getQueryClient().getQueryData<ProjectLoaderData>(
    projectQuery(params).queryKey
  )
  return cachedData ?? (await serverLoader())
}

export const shouldRevalidate = () => false

export const headers = ({
  loaderHeaders,
  parentHeaders,
}: Route.HeadersArgs) => {
  return {
    'Server-Timing': combineServerTimings(parentHeaders, loaderHeaders),
  }
}

const ProjectLayout: React.FC<Route.ComponentProps> = ({
  loaderData,
  params,
}) => {
  useProject({
    projectId: params.projectId,
    initialData: () => loaderData,
  })

  return (
    <>
      <ProjectToolbar />
      <Outlet />
    </>
  )
}

export const ErrorBoundary = GeneralErrorBoundary

export default React.memo(ProjectLayout)
