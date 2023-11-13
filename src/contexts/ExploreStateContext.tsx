import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode,
} from "react";

export type State = {
  page: number;
  limit: number;
  type: string;
  riskLv: string;
  loc: string;
  sect: string;
  exchg: string;
  weather: string;
  search: string;
  currency: string;
  priceOrder: string;
  lossOrder: string;
  priceChgOrder: string;
};

export type Action =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_RISK_LV"; payload: string }
  | { type: "SET_LOC"; payload: string }
  | { type: "SET_SECT"; payload: string }
  | { type: "SET_EXCHG"; payload: string }
  | { type: "SET_WEATHER"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CURRENCY"; payload: string }
  | { type: "SET_PRICE_ORDER"; payload: string }
  | { type: "SET_LOSS_ORDER"; payload: string }
  | { type: "SET_PRICE_CHG_ORDER"; payload: string }
  | { type: "RESET_VALUE" };

type ExploreStateType = {
  state: State;
  dispatch: Dispatch<Action>;
};

type ExploreStateProviderProps = {
  children: ReactNode;
};

export const initialState = {
  page: 1,
  limit: 20,
  type: "All",
  riskLv: "All",
  loc: "All",
  sect: "All",
  exchg: "All",
  weather: "All",
  search: "",
  currency: "KRW",
  priceOrder: "neutral",
  lossOrder: "neutral",
  priceChgOrder: "neutral",
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      return { ...state, limit: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_RISK_LV":
      return { ...state, riskLv: action.payload };
    case "SET_LOC":
      return { ...state, loc: action.payload };
    case "SET_SECT":
      return { ...state, sect: action.payload };
    case "SET_EXCHG":
      return { ...state, exchg: action.payload };
    case "SET_WEATHER":
      return { ...state, weather: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_CURRENCY":
      return { ...state, currency: action.payload };
    case "SET_PRICE_ORDER":
      return { ...state, priceOrder: action.payload };
    case "SET_LOSS_ORDER":
      return { ...state, lossOrder: action.payload };
    case "SET_PRICE_CHG_ORDER":
      return { ...state, priceChgOrder: action.payload };
    case "RESET_VALUE":
      return initialState;
    default:
      return state;
  }
};

const ExploreStateContext = createContext<ExploreStateType | undefined>(
  undefined
);

// Explore 상태 훅
export const useExploreState = (): ExploreStateType => {
  const context = useContext(ExploreStateContext);
  if (!context) {
    throw new Error(
      "useExploreState must be used within a ExploreStateProvider"
    );
  }
  return context;
};

// ExploreStateProvider 컴포넌트
export const ExploreStateProvider = ({
  children,
}: ExploreStateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ExploreStateContext.Provider value={{ state, dispatch }}>
      {children}
    </ExploreStateContext.Provider>
  );
};
