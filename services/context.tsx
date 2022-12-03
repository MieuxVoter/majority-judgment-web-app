import {createContext, useEffect, useReducer, useContext, Dispatch} from 'react';


interface ToastMessage {
  title?: string;
  message: string;
  display: boolean;
  status: "success" | "error";
}

interface Application {
  fullPage: boolean;
  toasts: Array<ToastMessage>;
}

export enum AppTypes {
  FULLPAGE = 'full-page',
  TOAST_ADD = 'toast-add',
  TOAST_RM = 'toast-rm',
  TOAST_SHOW = 'toast-show',
}

export type FullPageAction = {
  type: AppTypes.FULLPAGE;
  value: boolean;
}
export type ToastAddAction = {
  type: AppTypes.TOAST_ADD;
  title?: string;
  message: string;
  status: "success" | "error";
}
export type ToastRmAction = {
  type: AppTypes.TOAST_RM | AppTypes.TOAST_SHOW;
  position: number;
}

export type AppActionTypes = FullPageAction | ToastRmAction | ToastAddAction;

const defaultApp = {fullPage: false, toasts: []}

type DispatchType = Dispatch<AppActionTypes>;
const AppContext = createContext<[Application, DispatchType]>([defaultApp, () => {}]);

const reducer = (app: Application, action: AppActionTypes) => {
  /**
   * Manage all types of action doable on an election
   */
  switch (action.type) {
    case AppTypes.FULLPAGE: {
      return {...app, fullPage: action.value};
    }
    case AppTypes.TOAST_ADD: {
      return {
        ...app,
        toasts: [
          ...app.toasts, {
            title: action.title,
            message: action.message,
            display: false,
            status: action.status
          }
        ]
      };
    }
    case AppTypes.TOAST_RM: {
      const toasts = [...app.toasts]
      toasts.splice(action.position, 1)
      return {...app, toasts};
    }
    case AppTypes.TOAST_SHOW: {
      app.toasts[action.position].display = true
      return {...app}
    }
    default: {
      return app
    }
  }
}

export function AppProvider({children}) {
  const [app, dispatch] = useReducer(reducer, defaultApp);

  const removeToast = (i: number) => {
    dispatch({
      type: AppTypes.TOAST_RM,
      position: i
    })
  }

  useEffect(() => {
    app.toasts.forEach((toast, i) => {
      if (!toast.display) {
        dispatch({
          type: AppTypes.TOAST_SHOW,
          position: i
        })
        setTimeout(() => removeToast(i), 3000);
      }

    })

  }, [app.toasts]);

  return (
    <AppContext.Provider value={[app, dispatch]}>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {app.toasts.filter(t => t.display).map((toast, i) => (
          <div
            key={i}
            className={`toast text-bg-${toast.status === "error" ? "danger" : "success"} fade show align-items-center text-light`}
            role={toast.status === "error" ? "alert" : "status"}
            aria-live={toast.status === "error" ? "assertive" : "polite"}
            aria-atomic="true">
            {
              toast.title ?
                <><div className="toast-header">
                  <strong className="me-auto">{toast.title}</strong>
                  <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>

                  <div className="toast-body" >
                    {toast.message}
                  </div>
                </>
                :
                <div className="d-flex">
                  <div className="toast-body" >
                    {toast.message}
                  </div>
                  <button type="button" onClick={() => removeToast(i)} className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" />
                </div>
            }
          </div>
        ))}
      </div >

      {children}
    </AppContext.Provider >
  );
}


export function useAppContext() {
  return useContext(AppContext);
}


