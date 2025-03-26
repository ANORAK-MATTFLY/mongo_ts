import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './layouts/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)"],
                mono: ["var(--font-mono)"],
                mono: ['FiraCode', 'monospace'], // Custom font-family for mono
            },
            typography: {
                DEFAULT: {
                    css: {
                        h1: {
                            color: '#1E40AF',
                            fontWeight: 'bold',
                            borderBottom: '2px solid #1E40AF',
                            paddingBottom: '0.3em',
                        },
                        code: {
                            backgroundColor: '#F9FAFB',
                            color: '#D97706',
                            padding: '0.2em 0.4em',
                            borderRadius: '0.25rem',
                            fontSize: '90%',
                        },
                    },
                },
            },
        },
    },
    darkMode: "class",
    plugins: [nextui(), require("@tailwindcss/typography")],
}
