import React, {Suspense} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import Loader from './components/loader';

import Routes from './Routes';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import AppContextProvider from './AppContext';

function App() {
  return (
    <Suspense fallback={<Loader/>} >
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
