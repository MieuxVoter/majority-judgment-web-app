import React from 'react';
import {Switch, Route } from "react-router-dom";

import Home from "./components/views/Home.js";
import CreateBallot from "./components/views/CreateBallot.js";
import Vote from "./components/views/Vote";
import Result from "./components/views/Result";
import UnknownView from "./components/views/UnknownView";

function Routes() {
  return (
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/create-ballot" component={CreateBallot} />
            <Route path="/vote" component={Vote} />
            <Route path="/result" component={Result} />
            <Route component={UnknownView} />
          </Switch>
  );
}

export default Routes;
