import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '475px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
			'3xl': '1920px',
			'4xl': '2560px',
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Brand Colors
				navy: {
					DEFAULT: 'hsl(var(--navy))',
					light: 'hsl(var(--navy-light))',
					dark: 'hsl(var(--navy-dark))'
				},
				mint: {
					DEFAULT: 'hsl(var(--mint))',
					light: 'hsl(var(--mint-light))',
					dark: 'hsl(var(--mint-dark))'
				},
				coral: {
					DEFAULT: 'hsl(var(--coral))',
					light: 'hsl(var(--coral-light))',
					dark: 'hsl(var(--coral-dark))'
				},
				grey: {
					50: 'hsl(var(--grey-50))',
					100: 'hsl(var(--grey-100))',
					200: 'hsl(var(--grey-200))',
					300: 'hsl(var(--grey-300))',
					400: 'hsl(var(--grey-400))',
					500: 'hsl(var(--grey-500))',
					600: 'hsl(var(--grey-600))',
					700: 'hsl(var(--grey-700))',
					800: 'hsl(var(--grey-800))',
					900: 'hsl(var(--grey-900))'
				},
				
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					light: 'hsl(var(--secondary-light))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					light: 'hsl(var(--accent-light))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				mono: 'var(--font-mono)',
				sans: 'var(--font-sans)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'fluid': 'var(--container-padding)',
				'fluid-sm': 'clamp(0.5rem, 2vw, 1rem)',
				'fluid-md': 'clamp(1rem, 4vw, 2rem)',
				'fluid-lg': 'clamp(2rem, 6vw, 4rem)',
				'fluid-xl': 'clamp(4rem, 8vw, 6rem)',
				'fluid-2xl': 'clamp(6rem, 10vw, 8rem)',
			},
			fontSize: {
				'fluid-xs': 'clamp(0.75rem, 1.5vw, 0.875rem)',
				'fluid-sm': 'clamp(0.875rem, 2vw, 1rem)',
				'fluid-base': 'clamp(1rem, 2.5vw, 1.125rem)',
				'fluid-lg': 'clamp(1.125rem, 3vw, 1.25rem)',
				'fluid-xl': 'clamp(1.25rem, 4vw, 1.5rem)',
				'fluid-2xl': 'clamp(1.5rem, 5vw, 2rem)',
				'fluid-3xl': 'clamp(2rem, 6vw, 2.5rem)',
				'fluid-4xl': 'clamp(2.5rem, 8vw, 3.5rem)',
				'fluid-5xl': 'clamp(3rem, 10vw, 4.5rem)',
				'fluid-6xl': 'clamp(4rem, 12vw, 6rem)',
				'fluid-7xl': 'clamp(5rem, 15vw, 7.5rem)',
				'fluid-8xl': 'clamp(6rem, 18vw, 9rem)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
