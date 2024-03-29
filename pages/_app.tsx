import Head from 'next/head';
import {appWithTranslation} from 'next-i18next';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {AppProvider} from '@services/context';
import Header from '@components/layouts/Header';
import Footer from '@components/layouts/Footer';
import '@styles/globals.css';
import '@styles/scss/config.scss';

import LogRocket from 'logrocket';
LogRocket.init('mieux-voter/application-de-vote');

function Application({Component, pageProps}) {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'http://localhost';

  return (
    <>
      <Head>
        <link rel="icon" key="favicon" href="/favicon.ico" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:url" content={origin} key="og:url" />
        <meta
          property="og:image"
          content="https://app.mieuxvoter.fr/app-mieux-voter.png"
          key="og:image"
        />
      </Head>
      <div className="min-vh-100 d-flex flex-column justify-content-between">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}

const AppWithContext = ({Component, pageProps}) => (
  <AppProvider>
    <Application Component={Component} pageProps={pageProps} />
  </AppProvider>
);

export default appWithTranslation(AppWithContext);
