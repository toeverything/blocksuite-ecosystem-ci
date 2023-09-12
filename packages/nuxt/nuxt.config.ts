// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'bundler',
      },
    },
  },
})
