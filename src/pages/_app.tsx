import { AppProps } from 'next/app'
import Head from 'next/head'

import 'normalize.css'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link rel="icon" type="image/png" href="/icon-4x.png" sizes="192x192" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/icon-1x.png" />
      <link rel="apple-touch-icon" href="/icon-2x.png" />

      <meta charSet="utf-8" />
      <meta name="theme-color" content="#001a3c" />
      <meta name="robots" content="noindex,nofollow,noarchive" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <title>nozctf</title>
    </Head>
    <Component {...pageProps} />
  </>
)

export default App
