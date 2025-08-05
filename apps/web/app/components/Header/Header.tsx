import React, { Suspense, useEffect, useState } from 'react'
import Logo from '../Logo/Logo'
import Slash from '../Slash/Slash'
import Avatar from '@valley/ui/Avatar'
import IconButton from '@valley/ui/IconButton'
import Button from '@valley/ui/Button'
import { LogoGithub } from 'geist-ui-icons'
import { HEADER_HEIGHT } from '../../config/constants'
import { Await, Link, useParams, useRouteLoaderData } from 'react-router'
import { useProject } from 'app/utils/queries/project'
import MenuExpand from '../svg/MenuExpand'
import Skeleton from '@valley/ui/Skeleton'
import { useUserAwait } from 'app/utils/user'
import { cn, type UserFull } from '@valley/shared'
import { paperVariants } from '@valley/ui/Paper'

const headerPathPartClasses = cn(
  'flex min-w-10 shrink items-center gap-3 p-1.5',
  'active:scale-[0.98] rounded-xl cursor-pointer text-base font-semibold select-none [-webkit-tap-highlight-color:transparent]',
  "max-sm:has-[~_*[data-visible='true']]:shrink-0 max-sm:has-[~_*[data-visible='true']]:[&_p]:hidden sm:has-[~_*[data-visible='false']]:shrink-0"
)

const PathPartSkeleton: React.FC<{
  squareAvatar?: boolean
}> = ({ squareAvatar }) => (
  <div data-visible="true" className={headerPathPartClasses}>
    <Skeleton
      variant={squareAvatar ? 'rectangular' : 'circular'}
      className={cn('shrink-0', { 'rounded-md!': squareAvatar })}
      width={28}
      height={28}
    />
    <Skeleton asChild variant="text" width={96} height={20}>
      <p />
    </Skeleton>
  </div>
)

const CurrentUser: React.FC<{ user?: UserFull | null }> = ({ user }) => {
  return (
    <Link
      to={'/projects'}
      className={cn(
        paperVariants({ variant: 'tertiary', button: true }),
        headerPathPartClasses
      )}
    >
      <Avatar src={user?.image} file={user?.avatar}>
        {user?.name?.[0]?.toUpperCase()}
      </Avatar>
      <p className="overflow-hidden pr-0.5 text-nowrap text-ellipsis">
        {user?.name}
      </p>
    </Link>
  )
}

const CurrentProject: React.FC = () => {
  const projectLoaderData = useRouteLoaderData(
    'routes/_user+/projects_.$projectId+/_layout'
  )
  const { projectId: paramsProjectId = '' } = useParams()
  const [projectId, setProjectId] = useState(paramsProjectId)
  const shouldShow = !!paramsProjectId
  const { data, isSuccess, isPending } = useProject({
    projectId,
    enabled: shouldShow,
    initialData: () => projectLoaderData,
  })
  const project = data?.project
  const coverFile = project?.cover?.file
  const shouldShowCoverFile = coverFile?.canHaveThumbnails

  useEffect(() => {
    if (paramsProjectId && paramsProjectId !== projectId) {
      setProjectId(paramsProjectId)
    }
  }, [projectId, paramsProjectId])

  return (
    <div
      data-visible={shouldShow}
      className="pointer-events-none hidden items-center overflow-hidden opacity-0 transition-all data-[visible='true']:pointer-events-auto data-[visible='true']:flex data-[visible='true']:opacity-100 sm:flex"
    >
      <Slash className="mr-0.5" />
      {isPending && <PathPartSkeleton squareAvatar />}
      {isSuccess && (
        <Link
          to={'/projects/' + project?.id}
          className={cn(
            paperVariants({ variant: 'tertiary', button: true }),
            headerPathPartClasses,
            'pr-2'
          )}
        >
          {shouldShowCoverFile && (
            <Avatar
              key={'project-avatar-' + project?.id}
              id={'project-avatar-' + project?.id}
              square
              file={coverFile}
            />
          )}
          {!shouldShowCoverFile && (
            <Avatar square>{project?.title?.[0]?.toUpperCase()}</Avatar>
          )}
          <p className="overflow-hidden text-nowrap text-ellipsis">
            {project?.title}
          </p>
        </Link>
      )}
      <IconButton className="h-10! w-7! p-0!" size="sm" variant="tertiary">
        <MenuExpand />
      </IconButton>
    </div>
  )
}

const Header: React.FC = () => {
  const user = useUserAwait()

  return (
    <header
      className="bg-paper relative flex h-[var(--header-height)] min-h-[var(--header-height)] items-center px-6 py-4 pb-2 max-sm:px-4 max-sm:pl-2"
      style={{
        ['--header-height' as string]: HEADER_HEIGHT + 'px',
      }}
    >
      <Link to="/" className="max-sm:hidden">
        <Logo
          withScrollAnimation
          className="animate-in fade-in fixed top-4 left-6 z-20 inline-flex no-underline"
        />
      </Link>
      <nav className="relative flex w-full justify-between gap-2 sm:pl-10">
        <div className="flex min-w-0 shrink items-center">
          <Slash className="mr-0.5 max-sm:hidden" />
          <Suspense fallback={<PathPartSkeleton />}>
            <Await resolve={user} errorElement={<h5>Error fetching user</h5>}>
              {(resolvedUser) => <CurrentUser user={resolvedUser} />}
            </Await>
          </Suspense>
          <CurrentProject />
        </div>
        <div className="right-0 flex items-center gap-2">
          <Button size="sm" variant="secondary-dimmed" before={<LogoGithub />}>
            Leave a star
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default React.memo(Header)
