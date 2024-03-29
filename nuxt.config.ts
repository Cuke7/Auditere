// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', '@kevinmarrec/nuxt-pwa'],
    build: {
        transpile: ['@heroicons/vue']
    },
    pwa: {
        workbox: {
            enabled: true
        },
        manifest: {
            name: 'Auditere',
            short_name: 'Auditere',
            background_color: "#000000",
            theme_color: "#000000",
            display: "standalone",
            icons: [
                {
                    src: 'bird.png',
                    sizes: '1200x1200',
                    type: 'image/png',
                    purpose: "maskable"
                },
                {
                    src: 'bird.png',
                    sizes: '1200x1200',
                    type: 'image/png',
                    purpose: "any"
                }
            ],
            share_target: {
                action: "index.html",
                method: "GET",
                params: {
                    title: "title",
                    text: "text",
                    url: "url"
                }
            },
        }


    },
    ssr: false,
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            title: "Auditere"
        }
    },
})
