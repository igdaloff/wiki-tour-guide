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
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#222222',
    favicon32: 'img/icons/72.png',
    favicon16: 'img/icons/48.png',
    appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
    assetVersion: 2,
    manifestOptions: {
      start_url: '/',
      background_color: '#222222',
      theme_color: '#ffffff',
      short_name: 'WWG',
      orientation: 'portrait-primary',
    },
    workboxOptions: {
      skipWaiting: true,
    },
    workboxPluginMode: 'GenerateSW',
  },
})
