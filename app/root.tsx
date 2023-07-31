import type { DataFunctionArgs, HeadersFunction, LinksFunction } from '@remix-run/node'

import { cssBundleHref } from '@remix-run/css-bundle'
import { json } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import rdtStylesheetUrl from 'remix-development-tools/stylesheet.css'

import { GeneralErrorBoundary } from '~/components/error-boundary.tsx'

import fontStylesheetUrl from './styles/font.css'
import tailwindStylesheetUrl from './styles/tailwind.css'
import { ClientHintCheck, getHints } from './utils/client-hints.tsx'
import { getEnv } from './utils/env.server.ts'
import { combineHeaders, getDomainUrl } from './utils/misc.ts'
import { useNonce } from './utils/nonce-provider.ts'
import { makeTimings } from './utils/timing.server.ts'

const RemixDevTools =
	process.env.NODE_ENV === 'development' ? React.lazy(() => import('remix-development-tools')) : undefined

export const links: LinksFunction = () => {
	return [
		// Preload CSS as a resource to avoid render blocking
		{ rel: 'preload', href: fontStylesheetUrl, as: 'style' },
		{ rel: 'preload', href: tailwindStylesheetUrl, as: 'style' },
		cssBundleHref ? { rel: 'preload', href: cssBundleHref, as: 'style' } : null,
		rdtStylesheetUrl && process.env.NODE_ENV === 'development'
			? { rel: 'preload', href: rdtStylesheetUrl, as: 'style' }
			: null,
		{ rel: 'stylesheet', href: fontStylesheetUrl },
		{ rel: 'stylesheet', href: tailwindStylesheetUrl },
		cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
		rdtStylesheetUrl && process.env.NODE_ENV === 'development' ? { rel: 'stylesheet', href: rdtStylesheetUrl } : null,
	].filter(Boolean)
}

export async function loader({ request }: DataFunctionArgs) {
	const timings = makeTimings('root loader')

	return json(
		{
			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
			},
			ENV: getEnv(),
		},
		{
			headers: combineHeaders({ 'Server-Timing': timings.toString() }),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
	}
	return headers
}

function Document({
	children,
	nonce,
	env,
}: {
	children: React.ReactNode
	nonce: string
	env?: Record<string, string>
}) {
	return (
		<html lang="es" className="h-full">
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body className="relative z-[1] h-full bg-background text-primary-text before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-r before:from-background before:to-background-accent before:opacity-0 before:transition-opacity lg:before:opacity-100">
				{children}

				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<LiveReload nonce={nonce} />
				{RemixDevTools && (
					<React.Suspense>
						<RemixDevTools />
					</React.Suspense>
				)}
			</body>
		</html>
	)
}

export default function App() {
	const data = useLoaderData<typeof loader>()
	const nonce = useNonce()

	return (
		<Document nonce={nonce} env={data.ENV}>
			<Outlet />
		</Document>
	)
}

export function ErrorBoundary() {
	// the nonce doesn't rely on the loader, so we can access that
	const nonce = useNonce()

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run, so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out, and you'll always be able
	// to give the user a better UX.

	return (
		<Document nonce={nonce}>
			<GeneralErrorBoundary />
		</Document>
	)
}
