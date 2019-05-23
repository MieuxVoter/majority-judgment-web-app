import React from 'react';
import {Switch, Route } from "react-router-dom";

import Home from "./components/views/Home.js";
import CreateBallot from "./components/views/CreateBallot.js";
import UnknownView from "./components/views/UnknownView";

function Routes() {
  return (
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/create-ballot" component={CreateBallot} />
            <Route component={UnknownView} />
          </Switch>
  );
}

export default Routes;
