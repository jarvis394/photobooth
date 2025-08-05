import { zodResolver } from '@hookform/resolvers/zod'
import { data, redirect } from 'react-router'
import { requireUser } from 'app/server/auth/auth.server'
import { getValidatedFormData } from 'remix-hook-form'
import { z } from 'zod'
import { FoldersEditSchema } from './$folderId.edit'
import { PROJECT_MAX_FOLDERS } from '@valley/shared'
import { db, folders, projects, and, eq } from '@valley/db'
import { Route } from './+types/create'

export const FoldersCreateSchema = z
  .object({
    projectId: z.string(),
  })
  .and(FoldersEditSchema)

const resolver = zodResolver(FoldersCreateSchema)

export const loader = () => redirect('/projects')

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await requireUser(request)

  const {
    errors,
    data: submissionData,
    receivedValues: defaultValues,
  } = await getValidatedFormData(request, resolver)
  if (errors) {
    return data(
      { ok: false, errors, defaultValues },
      {
        status: 400,
      }
    )
  }

  const userProject = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, submissionData.projectId),
      eq(projects.userId, user.id)
    ),
    with: { folders: true },
  })

  if (!userProject) {
    return data(
      {
        ok: false,
        errors: {
          title: {
            message: `Project ${submissionData.projectId} not found`,
          },
        },
        defaultValues,
      },
      {
        status: 404,
      }
    )
  }

  if (userProject.folders.length >= PROJECT_MAX_FOLDERS) {
    return data(
      {
        ok: false,
        errors: {
          title: {
            message: `You can have only ${PROJECT_MAX_FOLDERS} folders in a project`,
          },
        },
        defaultValues,
      },
      {
        status: 403,
      }
    )
  }

  const [folder] = await db
    .insert(folders)
    .values({
      title: submissionData.title || 'Folder',
      description: submissionData.description || null,
      isDefaultFolder: false,
      projectId: submissionData.projectId,
    })
    .returning()

  return redirect(
    '/projects/' + submissionData.projectId + '/folder/' + folder.id
  )
}
