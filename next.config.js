/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const withImages = require('next-images');
const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: 'public',
    runtimeCaching: require('next-pwa/cache'),
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: 'aris-develop',
  project: 'weabur',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  silent: true,
};

module.exports = withSentryConfig(withImages(withPWA(nextConfig)), sentryWebpackPluginOptions);
