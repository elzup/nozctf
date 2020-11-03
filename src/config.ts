const baseUrl = 'https://nozctf.web.app'
const config = {
  flagPrefix: 'FLAG_',
  env: process.env.NODE_ENV,

  baseUrl,
  ogIconUrl: `${baseUrl}/icon-4x.png`,
} as const

export default config
