import Image from "next/image";
import { useEffect, useRef, useState, KeyboardEventHandler } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import PasswordModal from "components/templates/w/login/PasswordModal";

interface Provider {
  id: string;
  name: string;
}

interface Props {
  providers: Record<string, Provider>;
}

const Login = ({ providers }: Props) => {
  const router = useRouter();
  const userEmail = useRef<HTMLInputElement>(null);
  const userPassword = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

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

  const callbackHandler = (provider: Provider) => {
    if (localStorage.getItem("clickedPortfolio") === "portfolio") {
      localStorage.removeItem("clickedPortfolio");
      signIn(provider.id, { callbackUrl: `/${router.locale}/portfolio` });
    } else {
      signIn(provider.id, { callbackUrl: `/${router.locale}` });
    }
  };
  const { t } = useTranslation("login");
  const handleLogin = async () => {
    const email = userEmail.current?.value;
    const password = userPassword.current?.value;

    if (email && password) {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result?.error) {
        setMessage("");
        router.push("/");
      } else {
        toast.error(
          router.locale === "ko"
            ? "로그인 정보를 확인해주세요"
            : "Invalid email or password"
        );
        setMessage(
          router.locale === "ko"
            ? "로그인 정보를 확인해주세요"
            : "Invalid email or password"
        );
      }
    }
  };
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };
  return (
    <main className="min-w-[1024px] pt-[152px] pb-[144px] bg-white text-center shadow-[0_0_12px_0_rgba(121,120,132,0.15)]">
      <p className="text-4xl text-bold text-[#111111] font-medium mb-6">
        {t("loginWelcome")}
      </p>
      <p className="text-gray-400 mb-6">{t("loginExplain")}</p>
      <div className={"flex justify-center items-center mb-5"}>
        {/* <Image
          src={"/images/character/CoinCharacter2.png"}
          alt=""
          width={200}
          height={150}
          quality={100}
          className={""}
        /> */}
        <div className="w-96 ">
          <div className="mb-4">
            {/* <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              {t("email")}
            </label> */}
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              ref={userEmail}
              placeholder={router.locale === "ko" ? "이메일" : "email"}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="mb-4">
            {/* <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              {t("password")}
            </label> */}
            <input
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              ref={userPassword}
              placeholder={router.locale === "ko" ? "비밀번호" : "password"}
              onKeyDown={handleKeyDown}
            />
            <div
              onClick={() => setShowModal(true)}
              className="text-start text-sm cursor-pointer underline "
            >
              {t("findPassword")}
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="w-96 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline"
            type="button"
          >
            {t("loginButton")}
          </button>
          <p className="text-red-500 mt-2">{message}</p>
        </div>
      </div>
      <section className="mb-7 max-w-[327px] mx-auto">
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
      {showModal && (
        <PasswordModal
          isOpen={showModal}
          closeModal={() => setShowModal(false)}
        />
      )}
      <div className="flex justify-center items-center space-x-3">
        <p className=" text-sm text-gray-400">{t("signUpLink")}</p>
        <button
          onClick={() => router.push("/signup")}
          className="font-bold underline text-sm text-gray-400"
        >
          {t("signUpButton")}
        </button>
      </div>
      {/* <Link href="/login/business">
        <p className="text-gray-600 text-sm underline">
          Login with business account
        </p>
      </Link> */}
    </main>
  );
};

export default Login;
