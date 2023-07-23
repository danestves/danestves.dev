import 'dotenv/config'
import chalk from 'chalk'
import closeWithGrace from 'close-with-grace'

closeWithGrace(async ({ err }) => {
	if (err) {
		console.error(chalk.red(err))
		console.error(chalk.red(err.stack))
		process.exit(1)
	}
})

if (process.env.NODE_ENV === 'production') {
	// eslint-disable-next-line import/no-unresolved
	await import('./server-build/index.js')
} else {
	// eslint-disable-next-line import/no-unresolved
	await import('./server/index.ts')
}
