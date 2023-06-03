import { type LoaderFunction } from '@remix-run/node'
import keystaticConfig from 'keystatic.config'
import { handleLoader } from '~/lib/keystatic-remix-api.server.ts'

export const loader: LoaderFunction = args =>
	handleLoader({ config: keystaticConfig }, args)
