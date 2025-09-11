/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 1.8s cubic-bezier(0,0,0.2,1) infinite",
        "ping-slower": "ping 2.6s cubic-bezier(0,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};
