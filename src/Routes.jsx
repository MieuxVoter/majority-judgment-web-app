import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./components/views/Home";
import CreateElection from "./components/views/CreateElection";
import Vote from "./components/views/Vote";
import Result from "./components/views/Result";
import UnknownView from "./components/views/UnknownView";
import UnknownElection from "./components/views/UnknownElection";
import CreateSuccess from "./components/views/CreateSuccess";
import VoteSuccess from "./components/views/VoteSuccess";

function Routes() {
  const params = new URLSearchParams(window.location.search);
  const urlServer = process.env.REACT_APP_SERVER_URL;
  const routesServer = {
    setElection: "election/",
    getElection: "election/get/:slug",
    getResultsElection: "election/results/:slug",
    voteElection: "election/vote/:slug"
  };

  return (
    <main className="d-flex flex-column justify-content-center">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          path="/create-election"
          render={props => (
            <CreateElection
              {...props}
              title={params.get("title") ? params.get("title") : ""}
              urlServer={urlServer}
              routesServer={routesServer}
            />
          )}
        />
        <Route
          path="/vote/:slug"
          render={props => (
            <Vote
              {...props}
              slug={props.match.params.slug}
              urlServer={urlServer}
              routesServer={routesServer}
            />
          )}
        />
        <Route
          path="/result/:handle"
          render={props => (
            <Result
              {...props}
              slug={props.match.params.slug}
              urlServer={urlServer}
              routesServer={routesServer}
            />
          )}
        />
        <Route
          path="/create-success/:handle"
          render={props => (
            <CreateSuccess
              {...props}
              slug={props.match.params.slug}
              urlServer={urlServer}
              routesServer={routesServer}
            />
          )}
        />
        <Route
          path="/vote-success/:handle"
          render={props => (
            <VoteSuccess
              {...props}
              slug={props.match.params.slug}
              urlServer={urlServer}
              routesServer={routesServer}
            />
          )}
        />
        <Route
          path="/unknown-election/:handle"
          render={props => (
            <UnknownElection
              {...props}
              slug={props.match.params.slug}
              urlServer={urlServer}
              routesServer={routesServer}
            />
          )}
        />
        />
        <Route
          render={props => (
            <UnknownView
              {...props}
              urlServer={urlServer}
              routesServer={routesServer}
            />
          )}
        />
      </Switch>
    </main>
  );
}

export default Routes;
