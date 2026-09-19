const webpack = require('webpack')

require('dotenv').config()

const FIREBASE_ENV_KEYS = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
  'FIREBASE_USE_EMULATOR',
]

module.exports = {
  output: 'export',
  // lint runs with oxlint (`yarn lint`), not with next's eslint integration
  eslint: { ignoreDuringBuilds: true },

  webpack: (config) => {
    const env = FIREBASE_ENV_KEYS.reduce((acc, key) => {
      acc[`process.env.${key}`] = JSON.stringify(process.env[key])
      return acc
    }, {})

    config.plugins.push(new webpack.DefinePlugin(env))

    return config
  },
}
