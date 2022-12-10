/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
       
        't-lg': '5px 10px 20px -3px rgba(0, 0, 0, 0.1), 4px 4px 4px -2px rgba(0, 0, 0, 0.05)',
        'main-s': '10px 10px 20px -5px rgba(0, 0, 0, 0.1), -10px -2px 20px -5px rgba(0, 0, 0, 0.05)',
        'content-s': '12px 10px 20px -5px rgba(0, 0, 0, 0.1), -10px -2px 20px -5px rgba(0, 0, 0, 0.05)'
      },
    },
  },
  plugins: [],
}
