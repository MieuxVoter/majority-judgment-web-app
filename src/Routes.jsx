import React from 'react';
import {Switch, Route } from "react-router-dom";

import Home from "./components/views/Home";
import CreateElection from "./components/views/CreateElection";
import Vote from "./components/views/Vote";
import Result from "./components/views/Result";
import UnknownView from "./components/views/UnknownView";
import UnknownElection from "./components/views/UnknownElection";
import CreateSuccess from "./components/views/CreateSuccess";
import VoteSuccess from "./components/views/VoteSuccess";

function Routes() {
  return (<main className="d-flex flex-column justify-content-center" >
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/create-election" component={CreateElection} />
                <Route path="/vote/:handle" component={Vote} />
                <Route path="/result/:handle" component={Result} />
                <Route path="/create-success/:handle" component={CreateSuccess} />
                <Route path="/vote-success/:handle" component={VoteSuccess} />
                <Route path="/unknown-election/:handle" component={UnknownElection} />
                <Route component={UnknownView} />
              </Switch>
        </main>
  );
}

export default Routes;
