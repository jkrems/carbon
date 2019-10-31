'use strict';

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const {dev, isServer} = options;

      // TODO: Handle DLL plugin when building either the chunk list or the deps
      // inside of the chunkset.
      config.plugins = config.plugins.filter(plugin => {
        const {name} = plugin.constructor;
        return name !== 'AutoDLLPlugin';
      });

      if (isServer) {
        // TODO: Figure out if we can add an API route dynamically without
        //       a dedicated file in the application itself.
        // const originalEntry = config.entry;
        // config.entry = async () => {
        //   const entry = typeof originalEntry === 'function' ?
        //     await originalEntry() : originalEntry;
        //   entry[`static/${options.buildId}/pages/api/dca.js`] =
        //     require.resolve('./chunk-batching-handler');
        //   return entry;
        // };
      } else {
        const BatchDynamicPlugin = require('../assembler/batch-dynamic-plugin');
        config.plugins.push(new BatchDynamicPlugin());

        if (dev) {
          config.output.chunkFilename = 'static/chunks/[id].js';
        } else {
          config.output.chunkFilename = 'static/chunks/[id].[contenthash].js';

          // Object.assign(config.optimization.splitChunks, {
          //   // Disable built-in next.js cache groups (e.g. commons)
          //   cacheGroups: {
          //     default: {
          //       chunks: 'all',
          //       minSize: 1,
          //       name: false,
          //       maxAsyncRequests: 100000,
          //       // TODO: Things start breaking once this goes over 5 which smells
          //       // like a fundamental issue is hiding behind this symptom.
          //       maxInitialRequests: 5,
          //       reuseExistingChunk: true,
          //       enforce: true,
          //     },
          //     vendors: false,
          //   },
          // });
        }
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config;
    },
  });
};
