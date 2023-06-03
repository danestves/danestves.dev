import type { Config } from 'tailwindcss'

import defaultTheme from 'tailwindcss/defaultTheme.js'
import tailwindcssRadix from 'tailwindcss-radix'

export default {
	content: ['./app/**/*.{ts,tsx,jsx,js}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#0096FF',
					accent: '#5800FF',
					text: '#F5F5F5',
				},
				secondary: {
					DEFAULT: '#211D1D',
					accent: '#00D7FF',
				},
				terciary: {
					DEFAULT: '#F5F5F5',
					accent: '#72FFFF',
				},
				subtle: '#C0C0C0',
				box: '#414141',
				background: {
					DEFAULT: '#040404',
					accent: '#161616',
				},
			},
			fontFamily: {
				sans: ['SF Pro Display', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [tailwindcssRadix],
} satisfies Config
