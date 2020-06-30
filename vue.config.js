module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      // from: https://github.com/mrbbot/vue-cli-plugin-webpack-bundle-analyzer
      analyzerMode: 'disabled', // remove when necessary
      generateStatsFile: false,
      openAnalyzer: false // set true when necessary
    }
  },
  pwa: {
    name: 'recept0r',
    themeColor: '#F2F6FF',
    msTileColor: '#F2F6FF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestPath: 'manifest.json',
    manifestOptions: {
      name: 'recept0r',
      short_name: 'recept0r',
      start_url: 'https://recept0r.com',
      display: 'standalone',
      theme_color: '#F2F6FF',
      icons: [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
      ]
    },
    // https://dev.to/drbragg/manifest-vs-head-icons-in-the-vue-cli-pwa-plugin-12fg
    iconPaths: {
      favicon32: 'favicon-32x32.png',
      favicon16: 'favicon-16x16.png',
      appleTouchIcon: 'apple-touch-icon.png',
      maskIcon: 'safari-pinned-tab.svg',
      msTileImage: 'mstile-144x144.png'
    },

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			// swSrc is required in InjectManifest mode.
			swSrc: 'sw.js',
			// ...other Workbox options...
			exclude: [/\.map$/, /_redirects/],
		}
  },
  // IF ANYTHING, THIS MADE SITE PERF WORSE...
  // chainWebpack: config => {
  //   config.plugin('preload').tap(options => {
  //     options[0].as = (entry) => {
  //       if (/\.css$/.test(entry)) return 'style';
  //       // if (/\.woff$/.test(entry)) return 'font';
  //       if (/\.png$/.test(entry)) return 'image';
  //       return 'script';
  //     }
  //     options[0].include = 'initial'
  //     // options[0].fileWhitelist: [/\.files/, /\.to/, /\.include/]
  //     // options[0].fileBlacklist: [/\.files/, /\.to/, /\.exclude/]
  //     return options
  //   })
  // }
}