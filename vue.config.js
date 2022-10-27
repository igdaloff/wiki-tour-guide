const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/global.scss";`,
      },
    },
  },
  //These manifest settings take precedence over anything in our own manifest.js file (not the one generate in /dist)
  pwa: {
    manifestOptions: {
      name: 'Wikipedia Walking Guide',
      short_name: 'WWG',
      display: 'standalone',
      start_url: '.',
      background_color: '#222222',
      theme_color: '#222222',
      workboxPluginMode: 'GenerateSW',
      icons: [
        {
          src: '/img/icons/512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/img/icons/192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/img/icons/180.png',
          sizes: '180x180',
          type: 'image/png',
        },
        {
          src: '/img/icons/144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/img/icons/120.png',
          sizes: '120x120',
          type: 'image/png',
        },
        {
          src: '/img/icons/96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/img/icons/72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/img/icons/48.png',
          sizes: '48x48',
          type: 'image/png',
        },
      ],
    },
  },
})
