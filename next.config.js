const bundleAnalyzer = require('@next/bundle-analyzer')
const withOffline = require('next-offline')
const path = require("path")

const withChunkBatching = require('./chunk-batching');

const withBundleAnalyzer = bundleAnalyzer({ enabled: true })

const config = withChunkBatching(withOffline({
  target: 'serverless',
  experimental: {
    modern: true,
    granularChunks: true,
    reactMode: 'concurrent',
  },
  dontAutoRegisterSw: true,
  workboxOpts: {
    // TODO get default config from `next-offline`?
    swDest: 'static/service-worker.js',
    globPatterns: ['static/**/*'],
    globDirectory: '.',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200
          }
        }
      }
    ]
  },
  env: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_FE_APP_ID: process.env.FIREBASE_FE_APP_ID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY
  },
  webpack: (config, {isServer, dev}) => {
    config.resolveLoader.alias = config.resolveLoader.alias || {};
    config.resolveLoader.alias["progressive-hydration"] = isServer ? path.resolve(
      "./progressive-hydration-server-loader"
    ) : path.resolve(
      "./progressive-hydration-client-loader"
    );
    return config;
  }
}))

module.exports = process.env.ANALYZE === 'true' ? withBundleAnalyzer(config) : config
