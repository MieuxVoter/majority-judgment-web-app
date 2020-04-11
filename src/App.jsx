import React, {Suspense} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import Routes from './Routes';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import AppContextProvider from './AppContext';
import {i18n} from './i18n';

const Spinner = (
  <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={1000} />
);

function App() {
  return (
    <Suspense fallback={Spinner}>
      <AppContextProvider>
        <Router>
          <div>
            <Header />
            <Routes />
            <Footer />
          </div>
        </Router>
      </AppContextProvider>
    </Suspense>
  );
}

export default App;
