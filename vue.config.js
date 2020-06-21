module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: 'recept0r',
    themeColor: '#F2F6FF',
    msTileColor: '#F2F6FF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestPath: './site.webmanifest',
    iconPaths: {
      favicon32: './favicon-32x32.png',
      favicon16: './favicon-16x16.png',
      appleTouchIcon: './apple-touch-icon.png',
      maskIcon: './safari-pinned-tab.svg',
      msTileImage: './mstile-144x144.png'
    },

    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // swSrc: 'dev/sw.js',
      // ...other Workbox options...
    }
  }
}