module.exports = {
  lintOnSave: false,
  productionSourceMap: false,

  css: {
    loaderOptions: {
      scss: {
        implementation: require("sass"),
        prependData: `@import "@/shared/assets/scss/_colors.scss"; @import "@/shared/assets/scss/_breakpoints.scss"; @import "@/shared/assets/scss/_mixins.scss"; @import "@/shared/assets/scss/_typography.scss";`,
      },
    },
  },

  chainWebpack: (config) => {
    config.module
      .rule("pdf")
      .test(/\.(pdf)(\?.*)?$/)
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "./src/assets/files/[name].[hash:8].[ext]",
      });
  },

  configureWebpack: {
    performance: {
      hints: false,
      maxAssetSize: 1048576, // int (in bytes),
      maxEntrypointSize: 1048576, // int (in bytes)
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  },

  // pwa: {
  //   workboxOptions: {
  //     skipWaiting: true,
  //   },
  // },
};
