export type MakeRequestProps = {
  /** API method as an URL path */
  path: string

  /** Query parameters */
  params?: Record<string, string>

  /** Fetch request options */
  requestOptions?: RequestInit
}

export default async <T = object>({
  path,
  params,
  requestOptions,
}: MakeRequestProps): Promise<T> => {
  const searchParams = new URLSearchParams(params)
  let requestPath = '/api/' + path

  if (searchParams.size > 0) {
    requestPath += '?' + searchParams.toString()
  }

  const res = await fetch(requestPath, requestOptions)

  return (await res.json()) as T
}
