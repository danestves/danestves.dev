import { type requiredServerEnvs } from '~/utils/env.server.ts'

export {}

declare global {
	namespace NodeJS {
		type ProcessEnv = Record<(typeof requiredServerEnvs)[number], string>
	}
}
