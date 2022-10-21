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
    short_name: 'WWG',
    display: 'standalone',
    start_url: '.',
    background_color: '#222222',
    theme_color: '#222222',
    workboxPluginMode: 'GenerateSW',
  },
})
