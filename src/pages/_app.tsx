import { AppProps } from 'next/app'
import Head from 'next/head'
import config from '../config'

import 'normalize.css'

const description = 'Security CTF quiz focusing of web'
const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link
        rel="icon"
        type="image/png"
        href={config.ogIconUrl}
        sizes="192x192"
      />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/icon-1x.png" />
      <link rel="apple-touch-icon" href="/icon-2x.png" />

      <meta charSet="utf-8" />
      <meta name="theme-color" content="#000051" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta property="og:site_name" content="nozctf" />
      <meta property="og:title" content="nozctf" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={config.ogIconUrl} />
      <meta property="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:image" content={config.ogIconUrl} />
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.1.0/styles/default.min.css"
      />
      <title>nozctf</title>
    </Head>
    <Component {...pageProps} />
  </>
)

export default App
