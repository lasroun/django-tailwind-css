/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // On doit indiquer où se trouvent nos templates HTML/Django
    "./templates/**/*.html",
    "./app/templates/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
