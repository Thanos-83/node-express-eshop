/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,js,ejs}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/forms')],
};
