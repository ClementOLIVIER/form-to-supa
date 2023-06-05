export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/supabase'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
