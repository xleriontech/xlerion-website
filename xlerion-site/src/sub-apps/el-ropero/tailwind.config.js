/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00e9fa',
                secondary: '#333436',
                dark: '#000000',
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            animation: {
                'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'countdown': 'countdown 1s steps(1) infinite',
            },
            keyframes: {
                countdown: {
                    '0%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};