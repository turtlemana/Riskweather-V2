import React, { useContext, createContext, useReducer, ReactNode } from "react";

export interface State {
  isAuthStarted: boolean;
  countdown: number;
  showModal: boolean;
  errorModal: boolean;
  submitErrorModal: boolean;
  showSuccessModal: boolean;
  verificationCode: null | string;
  isVerified: boolean;
  showVerificationModal: boolean;
  isPolicyChecked: boolean;
  isAlarmChecked: boolean;
  errorMessage: string;
  validationMessage: string;
  emailWarning: string | null;
  passwordWarning: string | null;
  passwordConfirmWarning: string | null;
  nameWarning: string | null;
}
const initialState: State = {
  isAuthStarted: false,
  countdown: 180,
  showModal: false,
  errorModal: false,
  submitErrorModal: false,
  showSuccessModal: false,
  verificationCode: null,
  isVerified: false,
  showVerificationModal: false,
  isPolicyChecked: false,
  isAlarmChecked: false,
  errorMessage: "",
  validationMessage: "",
  emailWarning: null,
  passwordWarning: null,
  passwordConfirmWarning: null,
  nameWarning: null,
};

export type Action =
  | { type: "START_AUTH"; payload: boolean }
  | { type: "SET_VERIFICATION_CODE"; payload: string }
  | { type: "SET_VALIDATION_MESSAGE"; payload: string }
  | { type: "SET_AUTH_ERROR"; payload: boolean }
  | { type: "SET_COUNTDOWN"; payload: number }
  | { type: "TOGGLE_MODAL"; payload: string }
  | { type: "SET_IS_VERIFIED"; payload: boolean }
  | { type: "TOGGLE_POLICY_CHECK"; payload: boolean }
  | { type: "TOGGLE_ALARM_CHECK"; payload: boolean }
  | { type: "SET_ERROR_MESSAGE"; payload: string }
  | { type: "SET_EMAIL_WARNING"; payload: string }
  | { type: "SET_PASSWORD_WARNING"; payload: string }
  | { type: "SET_PASSWORD_CONFIRM_WARNING"; payload: string }
  | { type: "SET_NAME_WARNING"; payload: string }
  | { type: "RESET_VALUE"; payload: boolean };

const ActionTypes = {
  START_AUTH: "START_AUTH",
  SET_VERIFICATION_CODE: "SET_VERIFICATION_CODE",
  SET_VALIDATION_MESSAGE: "SET_VALIDATION_MESSAGE",
  SET_AUTH_ERROR: "SET_AUTH_ERROR",
  SET_COUNTDOWN: "SET_COUNTDOWN",
  TOGGLE_MODAL: "TOGGLE_MODAL",
  SET_IS_VERIFIED: "SET_IS_VERIFIED",
  TOGGLE_POLICY_CHECK: "TOGGLE_POLICY_CHECK",
  TOGGLE_ALARM_CHECK: "TOGGLE_ALARM_CHECK",
  SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE",
  SET_EMAIL_WARNING: "SET_EMAIL_WARNING",
  SET_PASSWORD_WARNING: "SET_PASSWORD_WARNING",
  SET_PASSWORD_CONFIRM_WARNING: "SET_PASSWORD_CONFIRM_WARNING",
  SET_NAME_WARNING: "SET_NAME_WARNING",
  RESET_VALUE: "RESET_VALUE",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.START_AUTH:
      return { ...state, isAuthStarted: action.payload as boolean };
    case ActionTypes.SET_VERIFICATION_CODE:
      return { ...state, verificationCode: action.payload as string };
    case ActionTypes.SET_AUTH_ERROR:
      return { ...state, errorModal: action.payload as boolean };
    case ActionTypes.SET_COUNTDOWN:
      return { ...state, countdown: action.payload as number };
    case ActionTypes.TOGGLE_MODAL:
      const modalName = action.payload as keyof State;
      if (typeof state[modalName] === "boolean") {
        return { ...state, [modalName]: !state[modalName] };
      }
      return state;
    case ActionTypes.SET_EMAIL_WARNING:
      return { ...state, emailWarning: action.payload as any };
    case ActionTypes.SET_PASSWORD_WARNING:
      return { ...state, passwordWarning: action.payload as any };
    case ActionTypes.SET_PASSWORD_CONFIRM_WARNING:
      return { ...state, passwordConfirmWarning: action.payload as any };
    case ActionTypes.SET_NAME_WARNING:
      return { ...state, nameWarning: action.payload as any };
    case ActionTypes.SET_IS_VERIFIED:
      return { ...state, isVerified: action.payload as boolean };
    case ActionTypes.SET_VALIDATION_MESSAGE:
      return { ...state, validationMessage: action.payload as string };
    case ActionTypes.TOGGLE_POLICY_CHECK:
      return { ...state, isPolicyChecked: action.payload as boolean };
    case ActionTypes.TOGGLE_ALARM_CHECK:
      return { ...state, isAlarmChecked: action.payload as boolean };
    case ActionTypes.SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload as string };
    case ActionTypes.RESET_VALUE:
      return { ...initialState };
    default:
      return state;
  }
};
interface SignUpProviderProps {
  children: ReactNode;
}

const SignUpContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const useSignUpState = () => {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUpState must be used within a SignUpProvider");
  }
  return context;
};

const SignUpProvider: React.FC<SignUpProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SignUpContext.Provider value={{ state, dispatch }}>
      {children}
    </SignUpContext.Provider>
  );
};

export { SignUpProvider, SignUpContext };
