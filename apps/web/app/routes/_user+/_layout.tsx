import React, { useEffect } from 'react'
import {
  Await,
  Outlet,
  ShouldRevalidateFunction,
  useAsyncError,
  useLoaderData,
  useSubmit,
} from 'react-router'
import styles from './styles.module.css'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import { requireUserId } from '../../server/auth/auth.server'
import { UserFull } from '@valley/shared'
import { useUserStore } from 'app/utils/user'
import Spinner from '@valley/ui/Spinner'
import { db, users, eq } from '@valley/db'
import { Route } from './+types/_layout'
import { GeneralErrorBoundary } from 'app/components/ErrorBoundary'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const userId = await requireUserId(request)
  const user = new Promise<UserFull | undefined>((res) =>
    db.query.users
      .findFirst({
        where: eq(users.id, userId),
        with: {
          userSettings: true,
          avatar: true,
        },
      })
      .then(res)
  )

  return { user }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  if (formAction?.startsWith('/api/user')) {
    return true
  }

  return false
}

const UserCache: React.FC<{ user?: UserFull }> = ({ user }) => {
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    user && setUser(user)
  }, [setUser, user])

  return null
}

const UserGroupLayout: React.FC = () => {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className={styles.main}>
      <Header />
      <main className={styles.main__wrapper}>
        <Outlet />
      </main>
      <Footer />
      <Await resolve={user}>
        {(resolvedUser) => <UserCache user={resolvedUser} />}
      </Await>
    </div>
  )
}

/**
 * If an error happened at this stage, user's data load errored.
 * Log them out of their session.
 */
export const ErrorBoundary: React.FC<Route.ErrorBoundaryProps> = () => {
  const submit = useSubmit()
  const error = useAsyncError()

  useEffect(() => {
    if (error) {
      submit(
        {},
        {
          action: '/auth/logout',
          method: 'POST',
          viewTransition: true,
        }
      )
    }
  }, [error, submit])

  if (error) {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <h1 className="heading-24 font-medium">Logging out...</h1>
        <Spinner style={{ ['--spinner-size' as string]: '32px' }} />
      </div>
    )
  } else {
    return <GeneralErrorBoundary />
  }
}

export default UserGroupLayout
