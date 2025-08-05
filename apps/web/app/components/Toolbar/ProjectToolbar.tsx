import React, { useMemo } from 'react'
import AnimatedTabs from '../AnimatedTabs/AnimatedTabs'
import { ToolbarItem } from './ToolbarItem'
import { useLocation, useParams } from 'react-router'
import { useProject } from 'app/utils/queries/project'
import LinkTabItem from './LinkTabItem'

const ProjectsToolbarTabItemUnmemoized = React.forwardRef<
  HTMLButtonElement,
  ToolbarItem
>(function ProjectsToolbarTabItem({ value, label, ...props }, ref) {
  const { projectId, folderId } = useParams()
  const projectBaseUrl = `/projects/${projectId}`
  const { data } = useProject()
  const project = data?.project

  if (value === projectBaseUrl) {
    const defaultFolder =
      project?.folders?.find((e) => e.isDefaultFolder)?.id || folderId
    return (
      <LinkTabItem
        {...props}
        ref={ref}
        value={value}
        label={label}
        to={projectBaseUrl + '/folder/' + defaultFolder}
      />
    )
  }

  return <LinkTabItem {...props} ref={ref} value={value} label={label} />
})
const ProjectsToolbarTabItem = React.memo(ProjectsToolbarTabItemUnmemoized)

const ProjectsToolbar = () => {
  const { projectId, folderId } = useParams()
  const location = useLocation()
  const projectBaseUrl = `/projects/${projectId}`
  const projectToolbarItems: ToolbarItem[] = useMemo(
    () => [
      {
        label: 'Overview',
        value: projectBaseUrl,
      },
      {
        label: 'Settings',
        value: projectBaseUrl + '/settings',
      },
      {
        label: 'Design',
        value: projectBaseUrl + '/design',
      },
    ],
    [projectBaseUrl]
  )
  const value = useMemo(() => {
    if (folderId && location.pathname.startsWith(projectBaseUrl + '/folder/')) {
      return projectBaseUrl
    }

    if (location.pathname.startsWith(projectBaseUrl + '/settings')) {
      return projectBaseUrl + '/settings'
    }

    return location.pathname
  }, [folderId, location.pathname, projectBaseUrl])

  return (
    <div className="bg-paper border-alpha-transparent-12 sticky -top-[0.01px] z-10 flex border-b-1">
      <AnimatedTabs value={value} className="px-2 sm:px-4">
        {projectToolbarItems.map((tab) => (
          <ProjectsToolbarTabItem
            key={tab.value}
            value={tab.value}
            label={tab.label}
          />
        ))}
      </AnimatedTabs>
    </div>
  )
}

export default React.memo(ProjectsToolbar)
