import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import Modal from "components/templates/m/login/SignUpModal";
import { useSignUpState, State, Action } from "contexts/SignUpContext";

interface Provider {
  id: string;
  name: string;
}

interface Props {
  providers: Record<string, Provider>;
}

const Login = ({ providers }: Props) => {
  const {
    state,
    dispatch,
  }: { state: State; dispatch: React.Dispatch<Action> } = useSignUpState();
  const { t } = useTranslation("login");

  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(180);

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const emailConfirmRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  let authResponse;

  useEffect(() => {
    dispatch({ type: "RESET_VALUE", payload: true });
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      dispatch({ type: "START_AUTH", payload: false });
      dispatch({ type: "SET_VERIFICATION_CODE", payload: "" });
    }
  }, [countdown, dispatch]);

  const resetAuth = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setCountdown(180);
    dispatch({ type: "START_AUTH", payload: false });
  };

  const startAuth = async () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setCountdown(180);
    if (emailInputRef.current) {
      const email = emailInputRef.current?.value as string;
      if (!email.includes("@") || email.length > 30 || email.length < 5) {
        dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        dispatch({
          type: "SET_VALIDATION_MESSAGE",
          payload: t("emailWarning"),
        });
        return;
      }
      const response = await fetch("/api/auth/emailAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      authResponse = await response.json();
      if (authResponse.message === "user already exists") {
        dispatch({ type: "START_AUTH", payload: false });
        dispatch({ type: "TOGGLE_MODAL", payload: "errorModal" });
        return;
        // dispatch({ type: "SET_VALIDATION_MESSAGE", payload: "Hello" });
      } else {
        dispatch({ type: "START_AUTH", payload: true });
        let interval: number = window.setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prevCountdown - 1;
          });
        }, 1000);
        setIntervalId(interval);

        dispatch({ type: "TOGGLE_MODAL", payload: "showModal" });
        dispatch({
          type: "SET_VERIFICATION_CODE",
          payload: authResponse.verificationCode,
        });
      }
    }
  };
  // 이메일 검증 함수
  const validateEmail = () => {
    if (emailInputRef.current) {
      const email = emailInputRef.current.value;
      if (!email.includes("@") || email.length > 30) {
        dispatch({
          type: "SET_EMAIL_WARNING",
          payload:
            router.locale === "ko"
              ? "이메일 형식을 확인해주세요."
              : "Please check your email format",
        });
      } else {
        dispatch({ type: "SET_EMAIL_WARNING", payload: "" }); // 경고 제거
      }
    }
  };

  // 이름 검증 함수
  const validateName = () => {
    if (nameInputRef.current) {
      const name = nameInputRef.current.value;
      if (name.length < 2 || name.length > 20) {
        dispatch({
          type: "SET_NAME_WARNING",
          payload:
            router.locale === "ko"
              ? "2자 이상 20자 이하로 입력해주세요."
              : "Your name must be longer than 2 characters",
        });
      } else {
        dispatch({ type: "SET_NAME_WARNING", payload: "" }); // 경고 제거
      }
    }
  };

  // 비밀번호 검증 함수
  const validatePassword = () => {
    if (passwordInputRef.current) {
      const password = passwordInputRef.current.value;
      if (password.length < 8 || password.length > 20) {
        dispatch({
          type: "SET_PASSWORD_WARNING",
          payload:
            router.locale === "ko"
              ? "8자 이상 20자 이하로 입력해주세요."
              : "Your password must be longer than 8 characters",
        });
      } else {
        dispatch({ type: "SET_PASSWORD_WARNING", payload: "" }); // 경고 제거
      }
    }
  };

  // 비밀번호 검증 함수
  const validateConfirmPassword = () => {
    if (passwordConfirmRef.current) {
      const password = passwordConfirmRef.current.value;
      if (password.length < 8 || password.length > 20) {
        dispatch({
          type: "SET_PASSWORD_CONFIRM_WARNING",
          payload:
            router.locale === "ko"
              ? "8자 이상 20자 이하로 입력해주세요."
              : "Your password must be longer than 8 characters",
        });
      } else {
        dispatch({ type: "SET_PASSWORD_CONFIRM_WARNING", payload: "" }); // 경고 제거
      }
    }
  };

  const validateInput = () => {
    if (
      emailInputRef.current &&
      passwordInputRef.current &&
      passwordConfirmRef.current
    ) {
      const emailValid =
        emailInputRef.current.value.length >= 5 &&
        emailInputRef.current.value.includes("@");
      const passwordValid = passwordInputRef.current.value.length >= 8;

      if (!emailValid) {
        dispatch({
          type: "SET_VALIDATION_MESSAGE",
          payload: t("emailInvalid"), // "이메일 형식을 확인해주세요."
        });
        dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        return false;
      }
      if (!passwordValid) {
        dispatch({
          type: "SET_VALIDATION_MESSAGE",
          payload: t("passwordLengthError"), // "비밀번호는 8자리 이상이어야 합니다."
        });
        dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        return false;
      }
      if (passwordConfirmRef.current.value !== passwordInputRef.current.value) {
        dispatch({
          type: "SET_VALIDATION_MESSAGE",
          payload: t("passwordMismatchError"), // "비밀번호가 일치하지 않습니다."
        });
        dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        return false;
      }
      if (!state.isPolicyChecked) {
        dispatch({
          type: "SET_VALIDATION_MESSAGE",
          payload: t("policyNotCheckedError"), // "정책에 동의해주세요."
        });
        dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        return false;
      }
      return true;
    }
    dispatch({
      type: "SET_VALIDATION_MESSAGE",
      payload: t("fieldsMissingError"), // "모든 필드를 채워주세요."
    });
    dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
    return false;
  };

  const checkVerification = () => {
    if (
      emailConfirmRef.current &&
      emailConfirmRef.current.value === state.verificationCode
    ) {
      dispatch({ type: "SET_IS_VERIFIED", payload: true });
      dispatch({ type: "TOGGLE_MODAL", payload: "showVerificationModal" });
      dispatch({ type: "START_AUTH", payload: false });
    } else {
      dispatch({ type: "SET_IS_VERIFIED", payload: false });
      dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });

      dispatch({
        type: "SET_VALIDATION_MESSAGE",
        payload: t("checkVerification"),
      });
    }
  };

  useEffect(() => {
    if (router.query.error?.includes("exists")) {
      toast(
        router.locale == "ko"
          ? `이미 ${
              (router.query.error as string)?.split(" ")[8]
            }로 가입된 계정입니다`
          : `Account has already signed up by ${
              (router.query.error as string)?.split(" ")[8]
            }`,
        {
          hideProgressBar: true,
          autoClose: 10000,
          type: "error",
          position: "top-center",
        }
      );
    }
  }, [router]);

  const submitHandler = async () => {
    if (
      validateInput() &&
      emailInputRef.current &&
      passwordInputRef.current &&
      nameInputRef.current &&
      passwordConfirmRef.current
    ) {
      const id = uuid();
      if (!state.isVerified) {
        dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        dispatch({ type: "SET_VALIDATION_MESSAGE", payload: t("sendVerify") });
        return;
      }

      const newUser = {
        id,
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value,
        platform_type: "credentials",
        name: nameInputRef.current.value,
        profileImage: "/images/users/default4.svg",
        created_at: Date.now(),
        accessLevel: 1,
        membership: 0,
      };

      const data = await fetch(`/api/auth/user`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ newUser }),
      }).then((res) => {
        if (res.ok) {
          dispatch({ type: "TOGGLE_MODAL", payload: "showSuccessModal" });
        } else {
          dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        }
      });
    }
  };

  const callbackHandler = (provider: Provider) => {
    if (localStorage.getItem("clickedPortfolio") === "portfolio") {
      localStorage.removeItem("clickedPortfolio");
      signIn(provider.id, { callbackUrl: `/${router.locale}/portfolio` });
    } else {
      signIn(provider.id, { callbackUrl: `/${router.locale}` });
    }
  };
  return (
    <main className="px-6 min-h-screen min-w-[360px] pt-[78px] pb-[144px] bg-white text-center shadow-[0_0_12px_0_rgba(121,120,132,0.15)]">
      <p className="text-4xl text-[#111111] font-medium mb-7">
        {t("signUpWelcome")}
      </p>
      <p className="text-gray-400 mb-10">{t("signUpExplain")}</p>
      <div className={"flex justify-center items-center mb-5"}>
        <div className="w-5/6 flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <label className="font-bold text-left" htmlFor="email">
              {t("email")}
            </label>
            <div className="flex  items-center gap-3 ">
              <input
                ref={emailInputRef}
                onBlur={validateEmail}
                id="email"
                type="email"
                placeholder="example@example.com"
                className="w-3/4 p-2 border rounded-md flex-grow disabled:bg-gray-300"
                required
                disabled={state.isAuthStarted || state.isVerified}
              />
              {!state.isVerified && (
                <button
                  type="button"
                  onClick={startAuth}
                  disabled={state.isAuthStarted}
                  className="text-sm text-center   disabled:bg-gray-500 bg-blue-500 text-white px-3 py-1.5 rounded-md"
                >
                  {state.isAuthStarted
                    ? `${Math.floor(countdown / 60)}:${
                        countdown % 60 < 10
                          ? "0" + (countdown % 60)
                          : countdown % 60
                      }`
                    : t("authenticate")}
                </button>
              )}
            </div>
            {state.emailWarning && (
              <span className="mt-1 text-sm text-red-500">
                {state.emailWarning}
              </span>
            )}
            {state.isAuthStarted && (
              <div>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    ref={emailConfirmRef}
                    type="text"
                    placeholder={t("emailVerifyPlaceHolder")}
                    className="p-2 border rounded-md flex-grow w-2/3"
                  />
                  <button
                    onClick={checkVerification}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-md"
                  >
                    {t("authenticateConfirm")}
                  </button>
                </div>
                <div className={"flex justify-start my-3 text-gray-400 "}>
                  <button
                    className="text-start underline text-sm"
                    onClick={startAuth}
                  >
                    {t("resendEmail")}
                  </button>
                </div>
                <div className={"flex justify-start my-3 text-gray-400 "}>
                  <button
                    className="text-start underline text-sm"
                    onClick={resetAuth}
                  >
                    {t("reEnterEmail")}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-left" htmlFor="name">
              {t("name")}
            </label>
            <input
              ref={nameInputRef}
              onBlur={validateName}
              id="name"
              type="text"
              placeholder={t("namePlaceHolder")}
              className="p-2 border rounded-md"
              required
            />
            {state.nameWarning && (
              <span className="mt-2 text-sm text-red-500">
                {state.nameWarning}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-left" htmlFor="password">
              {t("password")}
            </label>
            <input
              onBlur={validatePassword}
              ref={passwordInputRef}
              id="password"
              type="password"
              placeholder="••••••••"
              className="p-2 border rounded-md"
              required
            />
            {state.passwordWarning && (
              <span className="mt-2 text-sm text-red-500">
                {state.passwordWarning}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-left" htmlFor="passwordConfirm">
              {t("passwordConfirm")}
            </label>
            <input
              onBlur={validateConfirmPassword}
              ref={passwordConfirmRef}
              id="passwordConfirm"
              type="password"
              placeholder="••••••••"
              className="p-2 border rounded-md"
              required
            />
            {state.passwordConfirmWarning && (
              <span className="mt-2 text-sm text-red-500">
                {state.passwordConfirmWarning}
              </span>
            )}
          </div>

          <label className="flex items-center justify-center gap-2  mt-4 ">
            <input
              type="checkbox"
              onChange={(event) =>
                dispatch({
                  type: "TOGGLE_POLICY_CHECK",
                  payload: event.target.checked,
                })
              }
              required
            />
            {/* <span className="w-[50px]  text-xs font-bold align-middle">
              {router.locale === "ko" ? "(필수)" : "(required)"}
            </span> */}
            <span className="text-xs text-start ml-0.5">
              {router.locale === "ko"
                ? "(필수) 서비스 이용약관 및 개인정보처리방침을 확인하였고, 이에 동의합니다"
                : "(required) I accept the Terms of Service and have read the Privacy Notice"}
            </span>
          </label>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              onChange={(event) =>
                dispatch({
                  type: "TOGGLE_ALARM_CHECK",
                  payload: event.target.checked,
                })
              }
            />
            <span className="text-xs">{t("alarm")}</span>
          </label>

          <button
            onClick={submitHandler}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md w-full"
          >
            {t("signUpComplete")}
          </button>
        </div>
      </div>
      <Modal
        isOpen={state.showModal}
        closeModal={() =>
          dispatch({ type: "TOGGLE_MODAL", payload: "showModal" })
        }
        message={t("emailConfirmSent")}
      />
      <Modal
        isOpen={state.errorModal}
        closeModal={() =>
          dispatch({ type: "TOGGLE_MODAL", payload: "errorModal" })
        }
        message={t("existError")}
      />
      <Modal
        isOpen={state.showVerificationModal}
        closeModal={() =>
          dispatch({ type: "TOGGLE_MODAL", payload: "showVerificationModal" })
        }
        message={t("emailVerified")}
      />
      <Modal
        isOpen={state.submitErrorModal}
        closeModal={() => {
          dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
          if (state.showSuccessModal) {
            router.push("/login");
          }
        }}
        message={state.validationMessage}
      />
      <Modal
        isOpen={state.showSuccessModal}
        closeModal={() => {
          dispatch({ type: "TOGGLE_MODAL", payload: "showSuccessModal" });
          router.push("/login");
        }}
        message={t("signUpSuccess")}
      />
      <section className="w-5/6 mb-7 max-w-[327px] mx-auto">
        <div className="flex items-center my-10">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500">{t("or")}</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        {Object?.values(providers).map(
          (provider: Provider, i: number) =>
            provider.name !== "Credentials" && (
              <div
                key={i}
                onClick={() => {
                  callbackHandler(provider);
                }}
                className={`my-3 h-12 cursor-pointer  ${
                  provider.name == "Google"
                    ? `bg-[#FFFFFF] border border-gray-300`
                    : provider.name == "Naver"
                    ? `bg-[#5AC451]`
                    : provider.name == "Kakao"
                    ? `bg-[#FFCA42]`
                    : provider.name == "Facebook"
                    ? `bg-[#3975EA]`
                    : ""
                } flex items-center gap-3 justify-center text-sm font-semibold rounded-[60px]`}
              >
                <Image
                  src={`/images/icons/login/${provider.name.toLowerCase()}.svg`}
                  width={20}
                  height={20}
                  alt=""
                />
                {t("loginContinue1")} {provider.name} {t("loginContinue2")}
              </div>
            )
        )}
      </section>
      {/* <Link href="/login/business">
        <p className="text-gray-600 text-sm underline">
          Login with business account
        </p>
      </Link> */}
    </main>
  );
};

export default Login;
