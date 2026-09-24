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

// next loads `.env` before this file. `env` only accepts strings, so unset keys are left out
const env = Object.fromEntries(
  FIREBASE_ENV_KEYS.filter((key) => process.env[key] !== undefined).map(
    (key) => [key, process.env[key]]
  )
)

module.exports = {
  output: 'export',
  env,
}
