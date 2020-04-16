import React, { createContext } from "react";

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
    <AppContext.Provider value={defaultState}>{children}</AppContext.Provider>
  );
};
export default AppContextProvider;
