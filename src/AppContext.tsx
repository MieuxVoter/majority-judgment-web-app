import React, { createContext, Suspense } from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import Loader from './components/loader';


export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const defaultState = {
    urlServer: process.env.REACT_APP_SERVER_URL,
    routesServer: {
      setElection: "election/",
      getElection: "election/get/:slug/",
      getResultsElection: "election/results/:slug",
      voteElection: "election/vote/"
    }
  };
  return (
    <Suspense fallback={<Loader/>} >
        <Router>
          <AppContext.Provider value={defaultState}>
            {children}
          </AppContext.Provider>
        </Router>
    </Suspense>
  );
};
export default AppContextProvider;
