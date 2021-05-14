import Head from 'next/head'
import '@styles/globals.css'
import '@styles/footer.css'
import '@styles/loader.css'
import "@styles/scss/config.scss";
import '@fortawesome/fontawesome-svg-core/styles.css'
import {appWithTranslation} from 'next-i18next'
import {AppProvider} from '@services/context.js'
import Header from '@components/layouts/Header'
import Footer from '@components/layouts/Footer'


function Application({Component, pageProps}) {
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost';
  return (<AppProvider>
    <Head>
    <link rel="icon" key="favicon" href="/favicon.ico" />
    <meta property="og:url" content={origin} key="og:url" />
    <meta property="og:type" content="website" key="og:type" />
    <meta
      property="og:image"
      content="https://app.mieuxvoter.fr/app-mieux-voter.png"
      key="og:image"
    />
    </Head>
    <Header />
    <main className="d-flex flex-column justify-content-center">
      <Component {...pageProps} />
    </main>
    <Footer />
  </AppProvider>);
}

export default appWithTranslation(Application)
