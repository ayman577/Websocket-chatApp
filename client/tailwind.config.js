/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0084ff', // Messenger blue
        'gray': '#f5f5f5',
        background: '#f0f2f5', 
        text: '#1c1e21', 
        success: '#00c851', 
        'coolGrey': '#d0d0d0', 
        'blue': '#0084ff',
        'light-blue': '#44bec7',
        'background': '#f0f2f5',
        'text': '#1c1e21',
        'green': '#25D366',
      },
    },
  },
  plugins: [],
}

