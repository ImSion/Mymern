const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './src/**/*.js',
    flowbite.content(),
    
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('./assets/circle-scatter-haikei.png')"
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

