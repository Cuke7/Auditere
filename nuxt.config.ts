// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    ssr: false,
    app: {
        pageTransition: { name: 'page', mode: 'out-in' }
    },
})
