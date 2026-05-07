/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        'ink-red': '#8B1A1A',
        'ink-red-bright': '#E85D5D',
        'ink-black': '#0A0A0A',
        'ink-yellow': '#E8C547',
        paper: '#F4EFE6',
      },
      fontFamily: {
        display: ['"Archivo Variable"', '"Archivo"', '"Tusker Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        'tc-serif': ['"Noto Serif TC"', 'serif'],
        'tc-sans': ['"Noto Sans TC"', 'sans-serif'],
      },
      transitionTimingFunction: {
        press: 'cubic-bezier(0.7, 0, 0.3, 1)',
      },
    },
  },
  corePlugins: {
    borderRadius: false, // no rounded corners except registration cursor
  },
};
