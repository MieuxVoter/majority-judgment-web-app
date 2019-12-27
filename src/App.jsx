import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
