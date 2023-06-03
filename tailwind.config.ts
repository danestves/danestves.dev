import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme.js'
import tailwindcssRadix from 'tailwindcss-radix'

export default {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['SF Pro Display', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [tailwindcssRadix],
} satisfies Config
