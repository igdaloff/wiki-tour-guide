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
  pwa: {
    name: 'WWikipedia Walking Guide',
    display: 'standalone',
    start_url: '.',
    background_color: '#222222',
    theme_color: '#222222',
    short_name: 'WWG',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/img/icons/512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/img/icons/192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/img/icons/180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/img/icons/144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/img/icons/120.png',
        sizes: '120x120',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/img/icons/96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/img/icons/72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/img/icons/48.png',
        sizes: '48x48',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#222222',
    appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
    workboxPluginMode: 'GenerateSW',
  },
})
