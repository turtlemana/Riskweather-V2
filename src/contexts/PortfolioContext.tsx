import { createContext, useReducer, useContext, ReactNode } from "react";

type PortfolioStateType = {
  isAddOpen: boolean;
  isDetailOpen: boolean;
  isEditOpen: boolean;
  isAssetAddOpen: boolean;
  isNextStep: boolean;
  portfolio: any;
};

type PortfolioActionType =
  | { type: "SET_ADD_OPEN"; payload: boolean }
  | { type: "SET_DETAIL_OPEN"; payload: boolean }
  | { type: "SET_EDIT_OPEN"; payload: boolean }
  | { type: "SET_ASSETADD_OPEN"; payload: boolean }
  | { type: "SET_NEXTSTEP"; payload: boolean }
  | { type: "SET_PORTFOLIO"; payload: any }
  | { type: "RESET" };

const initialPortfolioState: PortfolioStateType = {
  isAddOpen: false,
  isDetailOpen: false,
  isEditOpen: false,
  isAssetAddOpen: false,
  isNextStep: false,
  portfolio: [],
};

const PortfolioStateContext = createContext<PortfolioStateType | undefined>(
  undefined
);
const PortfolioDispatchContext = createContext<
  React.Dispatch<PortfolioActionType> | undefined
>(undefined);

type PortfolioProviderProps = {
  children?: ReactNode;
};

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [state, dispatch] = useReducer(
    (state: PortfolioStateType, action: PortfolioActionType) => {
      switch (action.type) {
        case "SET_ADD_OPEN":
          return {
            ...state,
            isAddOpen: action.payload,
          };
        case "SET_DETAIL_OPEN":
          return {
            ...state,
            isDetailOpen: action.payload,
          };
        case "SET_NEXTSTEP":
          return {
            ...state,
            isNextStep: action.payload,
          };
        case "SET_ASSETADD_OPEN":
          return {
            ...state,
            isAssetAddOpen: action.payload,
          };
        case "SET_EDIT_OPEN":
          return {
            ...state,
            isEditOpen: action.payload,
          };
        case "SET_PORTFOLIO":
          return {
            ...state,
            portfolio: action.payload,
          };

        case "RESET":
          return {
            ...initialPortfolioState,
          };
        default:
          return state;
      }
    },
    initialPortfolioState
  );

  return (
    <PortfolioStateContext.Provider value={state}>
      <PortfolioDispatchContext.Provider value={dispatch}>
        {children}
      </PortfolioDispatchContext.Provider>
    </PortfolioStateContext.Provider>
  );
}

export function usePortfolioState() {
  const state = useContext(PortfolioStateContext);
  if (!state) throw new Error("Cannot find PortfolioStateProvider");
  return state;
}

export function usePortfolioDispatch() {
  const dispatch = useContext(PortfolioDispatchContext);
  if (!dispatch) throw new Error("Cannot find PortfolioDispatchProvider");
  return dispatch;
}
