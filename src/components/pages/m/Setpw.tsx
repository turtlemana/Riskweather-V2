import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import Modal from "components/templates/m/login/SignUpModal";
import { useSignUpState, State, Action } from "contexts/SignUpContext";

const Login = () => {
  const {
    state,
    dispatch,
  }: { state: State; dispatch: React.Dispatch<Action> } = useSignUpState();
  const { t } = useTranslation("login");
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const passwordConfirmRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  let authResponse;

  useEffect(() => {
    dispatch({ type: "RESET_VALUE", payload: true });
  }, []);

  // 비밀번호 검증 함수
  const validatePassword = () => {
    if (passwordInputRef.current) {
      const password = passwordInputRef.current.value;
      if (password.length < 8 || password.length > 20) {
        dispatch({
          type: "SET_PASSWORD_WARNING",
          payload: t("passwordWarning"),
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
          payload: t("passwordWarning"),
        });
      } else {
        dispatch({ type: "SET_PASSWORD_CONFIRM_WARNING", payload: "" }); // 경고 제거
      }
    }
  };

  const validateInput = () => {
    if (passwordInputRef.current && passwordConfirmRef.current) {
      const passwordValid = passwordInputRef.current.value.length >= 8;

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
      return true;
    }
    dispatch({
      type: "SET_VALIDATION_MESSAGE",
      payload: t("fieldsMissingError"), // "모든 필드를 채워주세요."
    });
    dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
    return false;
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
      passwordInputRef.current &&
      passwordConfirmRef.current
    ) {
      const changeInfo = {
        email: router.query.USER_ID,
        newPassword: passwordInputRef.current.value,
      };

      const data = await fetch(`/api/auth/password`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ changeInfo }),
      }).then((res) => {
        if (res.ok) {
          dispatch({ type: "TOGGLE_MODAL", payload: "showSuccessModal" });
        } else {
          dispatch({ type: "TOGGLE_MODAL", payload: "submitErrorModal" });
        }
      });
    }
  };

  return (
    <main className="px-6 min-h-screen min-w-[360px] pt-[78px] pb-[144px] bg-white text-center shadow-[0_0_12px_0_rgba(121,120,132,0.15)]">
      <div className={"flex justify-center items-center mb-5"}>
        <div className="flex flex-col gap-5">
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

          <button
            onClick={submitHandler}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md w-full"
          >
            {t("passwordChange")}
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
        message={t("passwordChangeSuccess")}
      />

      {/* <Link href="/login/business">
        <p className="text-gray-600 text-sm underline">
          Login with business account
        </p>
      </Link> */}
    </main>
  );
};

export default Login;
