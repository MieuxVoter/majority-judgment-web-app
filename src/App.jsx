import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import AppContextProvider from "./AppContext";

function App() {
  return (
      <AppContextProvider>
        <Router>
          <div>
            <Header />
            <Routes />
            <Footer />
          </div>
        </Router>
      </AppContextProvider>
  );
}

export default App;
