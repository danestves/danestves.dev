import 'dotenv/config'

if (process.env.NODE_ENV === 'production') {
	// eslint-disable-next-line import/no-unresolved
	await import('./server-build/index.js')
} else {
	// eslint-disable-next-line import/no-unresolved
	await import('./server/index.ts')
}
