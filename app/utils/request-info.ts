import type { SerializeFrom } from '@remix-run/node'
import type { loader as rootLoader } from '~/root.tsx'

import { useRouteLoaderData } from '@remix-run/react'

/**
 * @returns the request info from the root loader
 */
export function useRequestInfo() {
	const data = useRouteLoaderData('root') as SerializeFrom<typeof rootLoader>
	return data.requestInfo
}
