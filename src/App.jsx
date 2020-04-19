import React, {Suspense} from 'react';

import Routes from './Routes';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import AppContextProvider from './AppContext';

function App() {
  return (
      <AppContextProvider>
          <div>
            <Header />
            <Routes />
            <Footer />
          </div>
      </AppContextProvider>
  );
}

export default App;
