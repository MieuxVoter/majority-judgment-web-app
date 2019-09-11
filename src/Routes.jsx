import React from 'react';
import {Switch, Route } from "react-router-dom";

import Home from "./components/views/Home.js";
import CreateElection from "./components/views/CreateElection";
import Vote from "./components/views/Vote";
import Result from "./components/views/Result";
import UnknownView from "./components/views/UnknownView";

function Routes() {
  return (<main className="d-flex flex-column justify-content-center" >
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/create-election" component={CreateElection} />
                <Route path="/vote" component={Vote} />
                <Route path="/result" component={Result} />
                <Route component={UnknownView} />
              </Switch>
        </main>
  );
}

export default Routes;
