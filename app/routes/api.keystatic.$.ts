import { type ActionFunction, type LoaderFunction } from '@remix-run/node'
import config from 'keystatic.config'
import { handleLoader } from 'lib/keystatic-remix-api.server.ts'

export const action: ActionFunction = args => handleLoader({ config }, args)

export const loader: LoaderFunction = args => handleLoader({ config }, args)
