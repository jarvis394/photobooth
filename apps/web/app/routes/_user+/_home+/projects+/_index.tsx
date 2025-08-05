import { Link } from 'react-router'
import Button from '@valley/ui/Button'
import Wrapper from '@valley/ui/Wrapper'
import React from 'react'
import styles from './projects.module.css'
import ProjectCard from 'app/components/ProjectCard/ProjectCard'
import { GeneralErrorBoundary } from 'app/components/ErrorBoundary'
import { combineServerTimings } from 'app/server/timing.server'
import Input from '@valley/ui/Input'
import {
  ChevronDown,
  MagnifyingGlass,
  Plus,
  SortAscending,
  SortDescending,
} from 'geist-ui-icons'
import CreateProjectButton from 'app/components/BannerBlocks/CreateProjectButton'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { cn, ProjectWithFolders } from '@valley/shared'
import Menu from '@valley/ui/Menu'
import { useHydrated } from 'remix-utils/use-hydrated'
import { Route } from './+types/_index'
import { useProjects, projectsQuery } from 'app/utils/queries/projects'
import { loader as projectsLoader } from 'app/routes/api+/projects+/_index'
import { getQueryClient } from 'app/utils/query-client'
import { ProjectsLoaderData } from 'app/api/projects'

export const loader = projectsLoader

export const clientLoader = () =>
  getQueryClient().getQueryData<ProjectsLoaderData>(projectsQuery.queryKey)

export const headers = ({
  loaderHeaders,
  parentHeaders,
}: Route.HeadersArgs) => {
  return {
    'Server-Timing': combineServerTimings(parentHeaders, loaderHeaders),
  }
}

const projectsListClasses = cn(
  'grid! lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 py-4 w-full'
)

const ProjectsSkeleton: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, ...props }) => (
  <div
    {...props}
    className={cn(
      'pointer-events-none relative z-0 size-full overflow-hidden select-none',
      className
    )}
  >
    <div className="absolute size-full">
      <Wrapper
        className={cn(
          projectsListClasses,
          'absolute inset-0 h-fit mask-b-from-0% mask-b-to-100%'
        )}
      >
        {new Array(6).fill(null).map((_, i) => (
          <ProjectCard loading key={i} />
        ))}
      </Wrapper>
    </div>
  </div>
)

const ProjectsList: React.FC<{ projects?: ProjectWithFolders[] }> = ({
  projects,
}) => {
  const isHydrated = useHydrated()

  if (projects?.length === 0) {
    return (
      <div className="relative isolate flex size-full flex-col items-center justify-center p-8">
        {isHydrated && (
          <div className="fade-in z-10 flex flex-col items-center justify-center">
            <h1 className="heading-24 mb-4 text-center">
              This page seems empty
            </h1>
            <p className="mb-6 text-center text-base">
              Upload some photos to make it happier
            </p>
            <Button asChild variant="primary" size="lg" before={<Plus />}>
              <Link preventScrollReset to={{ search: 'modal=create-project' }}>
                Create project
              </Link>
            </Button>
          </div>
        )}
        <ProjectsSkeleton className="absolute" />
      </div>
    )
  }

  return (
    <Wrapper className={projectsListClasses}>
      {projects?.map((project, i) => (
        <ProjectCard project={project} key={i} />
      ))}
    </Wrapper>
  )
}

const ProjectsRoute: React.FC<Route.ComponentProps> = ({ loaderData }) => {
  const { data, isPending, isSuccess } = useProjects({
    initialData: () => loaderData,
  })

  return (
    <div className="flex size-full flex-col">
      <Wrapper asChild className={styles.projects__bannerBlocks}>
        <OverlayScrollbarsComponent
          defer
          options={{
            scrollbars: { theme: 'os-theme-light' },
            overflow: { x: 'scroll' },
          }}
          style={{ gap: 12 }}
        >
          <CreateProjectButton />
        </OverlayScrollbarsComponent>
      </Wrapper>
      <Wrapper className="flex gap-3 pt-4">
        <Input
          placeholder="Search projects..."
          paperProps={{ className: styles.projects__searchInput }}
          before={<MagnifyingGlass color="var(--text-hint)" />}
        />
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              size="md"
              variant="secondary-dimmed"
              before={<SortAscending />}
              after={<ChevronDown />}
            >
              Sort by name
            </Button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item after={<SortAscending color="var(--text-secondary)" />}>
              Sort by name
            </Menu.Item>
            <Menu.Item after={<SortDescending color="var(--text-secondary)" />}>
              Sort by name
            </Menu.Item>
            <Menu.Item after={<SortAscending color="var(--text-secondary)" />}>
              Sort by date updated
            </Menu.Item>
            <Menu.Item after={<SortDescending color="var(--text-secondary)" />}>
              Sort by date updated
            </Menu.Item>
            <Menu.Item after={<SortAscending color="var(--text-secondary)" />}>
              Sort by date shot
            </Menu.Item>
            <Menu.Item after={<SortDescending color="var(--text-secondary)" />}>
              Sort by date shot
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Wrapper>
      {isPending && <ProjectsSkeleton />}
      {isSuccess && <ProjectsList projects={data.projects} />}
    </div>
  )
}

export const ErrorBoundary = GeneralErrorBoundary

export default ProjectsRoute
