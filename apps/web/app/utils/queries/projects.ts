import type { ProjectsLoaderData } from 'app/api/projects'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import * as api from 'app/api'
import { projectCacheKeys } from './cache-keys'

type UseProjectsProps = Partial<UseQueryOptions<ProjectsLoaderData>>

export const projectsQuery = {
  queryKey: projectCacheKeys.all,
  queryFn: () => api.projects.get(),
} satisfies UseQueryOptions<ProjectsLoaderData>

export const useProjects = (props: UseProjectsProps) => {
  return useQuery<ProjectsLoaderData>({
    ...props,
    ...projectsQuery,
  })
}
