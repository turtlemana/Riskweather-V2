import { createContext, useReducer, useContext, ReactNode } from "react";

export type StateType = {
  korea: {
    extremeRiseData: number;
    riseData: number;
    sustainData: number;
    declineData: number;
    veryHighData: number;
    highData: number;
    moderateData: number;
    lowData: number;
    volumeData: number;
  };
  foreign: {
    extremeRiseData: number;
    riseData: number;
    sustainData: number;
    declineData: number;
    veryHighData: number;
    highData: number;
    moderateData: number;
    lowData: number;
    volumeData: number;
  };
  crypto: {
    extremeRiseData: number;
    riseData: number;
    sustainData: number;
    declineData: number;
    veryHighData: number;
    highData: number;
    moderateData: number;
    lowData: number;
    volumeData: number;
  };
  koreaSortType: string;
  foreignSortType: string;
  cryptoSortType: string;
  koreanWeatherTrait: string;
  koreanRiskTrait: string;
  foreignWeatherTrait: string;
  foreignRiskTrait: string;
  cryptoWeatherTrait: string;
  cryptoRiskTrait: string;
  sortWeatherOrder: string;
  sortRiskOrder: string;
  isSearchModalOpen: boolean;
  searchInput: string;
};

export type ActionType =
  | {
      type: "INCREASE_COUNT";
      dataType: "korea" | "foreign" | "crypto";
      dataset: keyof StateType["korea"];
    }
  | { type: "SET_SEARCH_MODAL_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_KOREA_SORT_TYPE"; payload: string }
  | { type: "SET_FOREIGN_SORT_TYPE"; payload: string }
  | { type: "SET_CRYPTO_SORT_TYPE"; payload: string }
  | { type: "SET_KOREAN_WEATHER_TRAIT"; payload: string }
  | { type: "SET_KOREAN_RISK_TRAIT"; payload: string }
  | { type: "SET_FOREIGN_WEATHER_TRAIT"; payload: string }
  | { type: "SET_FOREIGN_RISK_TRAIT"; payload: string }
  | { type: "SET_CRYPTO_WEATHER_TRAIT"; payload: string }
  | { type: "SET_CRYPTO_RISK_TRAIT"; payload: string }
  | { type: "SET_SORT_WEATHER_ORDER"; payload: string }
  | { type: "SET_SORT_RISK_ORDER"; payload: string }
  | { type: "RESET_VALUE" };

const initialState: StateType = {
  searchInput: "",
  isSearchModalOpen: false,
  koreaSortType: "weather",
  foreignSortType: "weather",
  cryptoSortType: "weather",
  koreanWeatherTrait: "extremeRiseData",
  koreanRiskTrait: "veryHighData",
  foreignWeatherTrait: "extremeRiseData",
  foreignRiskTrait: "veryHighData",
  cryptoWeatherTrait: "extremeRiseData",
  cryptoRiskTrait: "veryHighData",
  sortWeatherOrder: "explode",
  sortRiskOrder: "highRisk",
  korea: {
    extremeRiseData: 5,
    riseData: 5,
    sustainData: 5,
    declineData: 5,
    veryHighData: 5,
    highData: 5,
    moderateData: 5,
    lowData: 5,
    volumeData: 10,
  },
  foreign: {
    extremeRiseData: 5,
    riseData: 5,
    sustainData: 5,
    declineData: 5,
    veryHighData: 5,
    highData: 5,
    moderateData: 5,
    lowData: 5,
    volumeData: 10,
  },
  crypto: {
    extremeRiseData: 5,
    riseData: 5,
    sustainData: 5,
    declineData: 5,
    veryHighData: 5,
    highData: 5,
    moderateData: 5,
    lowData: 5,
    volumeData: 10,
  },
};

const GlobalStateContext = createContext<StateType | undefined>(undefined);
const GlobalDispatchContext = createContext<
  React.Dispatch<ActionType> | undefined
>(undefined);

type GlobalProviderProps = {
  children: ReactNode;
};

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [state, dispatch] = useReducer(
    (state: StateType, action: ActionType) => {
      switch (action.type) {
        case "RESET_VALUE":
          return initialState;

        case "SET_SEARCH_MODAL_OPEN":
          return {
            ...state,
            isSearchModalOpen: action.payload,
          };
        case "SET_SEARCH":
          return { ...state, searchInput: action.payload };
        case "INCREASE_COUNT":
          return {
            ...state,
            [action.dataType]: {
              ...state[action.dataType],
              [action.dataset]: state[action.dataType][action.dataset] + 5,
            },
          };
        case "SET_KOREA_SORT_TYPE":
          return {
            ...state,
            koreaSortType: action.payload,
            korea: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };
        case "SET_FOREIGN_SORT_TYPE":
          return {
            ...state,
            foreignSortType: action.payload,
            foreign: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };

        case "SET_CRYPTO_SORT_TYPE":
          return {
            ...state,
            cryptoSortType: action.payload,
            crypto: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };
        case "SET_KOREAN_WEATHER_TRAIT":
          return {
            ...state,
            koreanWeatherTrait: action.payload,
            korea: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };

        case "SET_KOREAN_RISK_TRAIT":
          return {
            ...state,
            koreanRiskTrait: action.payload,
            korea: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };

        case "SET_FOREIGN_WEATHER_TRAIT":
          return {
            ...state,
            foreignWeatherTrait: action.payload,
            foreign: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };

        case "SET_FOREIGN_RISK_TRAIT":
          return {
            ...state,
            foreignRiskTrait: action.payload,
            foreign: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };

        case "SET_CRYPTO_WEATHER_TRAIT":
          return {
            ...state,
            cryptoWeatherTrait: action.payload,
            crypto: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };

        case "SET_CRYPTO_RISK_TRAIT":
          return {
            ...state,
            cryptoRiskTrait: action.payload,
            crypto: {
              extremeRiseData: 5,
              riseData: 5,
              sustainData: 5,
              declineData: 5,
              veryHighData: 5,
              highData: 5,
              moderateData: 5,
              lowData: 5,
              volumeData: 10,
            },
          };
        case "SET_SORT_WEATHER_ORDER":
          return {
            ...state,
            sortWeatherOrder: action.payload,
          };
        case "SET_SORT_RISK_ORDER":
          return {
            ...state,
            sortRiskOrder: action.payload,
          };
        default:
          return state;
      }
    },
    initialState
  );

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const state = useContext(GlobalStateContext);
  if (!state) throw new Error("Cannot find GlobalStateProvider");
  return state;
}

export function useGlobalDispatch() {
  const dispatch = useContext(GlobalDispatchContext);
  if (!dispatch) throw new Error("Cannot find GlobalDispatchProvider");
  return dispatch;
}
