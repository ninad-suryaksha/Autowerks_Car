/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                success: '#34C759',
                warning: '#FF9500',
                error: '#FF3B30',
                surface: '#F5F5F5',
                'text-primary': '#1C1C1E',
                'text-secondary': '#8E8E93',
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ],
                serif: [
                    'Georgia',
                    'Cambria',
                    '"Times New Roman"',
                    'Times',
                    'serif',
                ],
            },
            borderRadius: {
                xl: '12px',
                '2xl': '16px',
            },
        },
    },
    plugins: [],
};
