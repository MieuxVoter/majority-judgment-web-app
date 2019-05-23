import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Routes from "./Routes.js";
import './App.css';

import Home from "./components/views/Home.js";
import CreateBallot from "./components/views/CreateBallot.js";
import UnknownView from "./components/views/UnknownView";

function App() {
  return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create-ballot">Créer un vote</Link>
            </li>
          </ul>
          <hr />
	  <Routes />
        </div>
      </Router>
  );
}

export default App;
