import {createContext, useContext} from 'react';

const AppContext = createContext();

export function AppProvider({children}) {
  let state = {}

  return (
    <AppContext.Provider value={state}>
      { children}
    </AppContext.Provider>
  );
}


export function useAppContext() {
  return useContext(AppContext);
}


