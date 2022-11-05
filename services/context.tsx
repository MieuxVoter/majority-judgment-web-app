import {createContext, useContext} from 'react';

interface AppContextInterface {

}

const AppContext = createContext<AppContextInterface | null>(null);

export function AppProvider({children}) {
  let state = {}

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}


export function useAppContext() {
  return useContext(AppContext);
}


