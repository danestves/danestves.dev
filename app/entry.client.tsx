import { RemixBrowser } from '@remix-run/react'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

if (process.env.NODE_ENV === 'development') {
	import('remix-development-tools').then(({ initRouteBoundariesClient }) => {
		initRouteBoundariesClient()
		startTransition(() => {
			hydrateRoot(document, <RemixBrowser />)
		})
	})
} else {
	startTransition(() => {
		hydrateRoot(document, <RemixBrowser />)
	})
}
