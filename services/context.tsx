import {createContext, useState, useContext, Dispatch, SetStateAction} from 'react';

interface Application {
  footer: boolean;
}
interface AppContextInterface {
  app: Application;
  setApp: Dispatch<SetStateAction<Application>>;
}

const AppContext = createContext<AppContextInterface | null>(null);

export function AppProvider({children}) {
  const [app, setApp] = useState<Application>({footer: true});

  return (
    <AppContext.Provider value={{app, setApp}}>
      {children}
    </AppContext.Provider>
  );
}


export function useAppContext() {
  return useContext(AppContext);
}


