import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Heritage-focused warm color palette
                heritage: {
                    50: '#fdf8f3',
                    100: '#f9ede0',
                    200: '#f3d9bf',
                    300: '#e9bd94',
                    400: '#dd9a67',
                    500: '#d47d47',
                    600: '#c6653c',
                    700: '#a54f33',
                    800: '#854130',
                    900: '#6c3729',
                    950: '#3a1b14',
                },
                terracotta: {
                    50: '#fef6ee',
                    100: '#fdebd7',
                    200: '#fad3ae',
                    300: '#f6b47a',
                    400: '#f18b44',
                    500: '#ed6c20',
                    600: '#de5216',
                    700: '#b83d14',
                    800: '#933218',
                    900: '#762b17',
                    950: '#40130a',
                },
                saffron: {
                    50: '#fff9ed',
                    100: '#fef0d4',
                    200: '#fcdda8',
                    300: '#fac571',
                    400: '#f8a238',
                    500: '#f68514',
                    600: '#e7690a',
                    700: '#bf4e0b',
                    800: '#983d10',
                    900: '#7b3410',
                    950: '#421806',
                },
                gold: {
                    50: '#fbf9f1',
                    100: '#f5f0dc',
                    200: '#ebe0b8',
                    300: '#dfca8a',
                    400: '#d4af37',
                    500: '#b08d2b',
                    600: '#8c6b1d',
                    700: '#70531b',
                    800: '#5e451d',
                    900: '#4e3a1d',
                    950: '#2b1e0d',
                },
                indigo: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                    950: '#1e1b4b',
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
