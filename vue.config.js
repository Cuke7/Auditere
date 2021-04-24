module.exports = {
    transpileDependencies: ["vuetify"],
    pwa: {
        manifestOptions: {
            name: "Auditere",
            short_name: "Auditere",
            start_url: "./",
            display: "standalone",
            theme_color: "#000080",
            orientation: "portrait",
            background_color: "#000080",
            icons: [
                {
                    src: "images/app_icon.png",
                    sizes: "846x846",
                    type: "image/png",
                    purpose: "any maskable",
                },
            ],
        },
        iconPaths: {
            favicon32: null,
            favicon16: null,
            appleTouchIcon: null,
            maskIcon: null,
            msTileImage: null,
        },
    },
};
