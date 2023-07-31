import type { LoaderFunction } from '@remix-run/node'

import { handleLoader } from '~/lib/keystatic-remix-api.server.ts'

import keystaticConfig from '../../keystatic.config.js'

export const loader: LoaderFunction = args => handleLoader({ config: keystaticConfig }, args)
