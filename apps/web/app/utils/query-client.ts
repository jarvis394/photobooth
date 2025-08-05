import { isServer, QueryClient } from '@tanstack/react-query'

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 6 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined
export const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client to avoid caching
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
