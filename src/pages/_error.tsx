import React from "react";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

interface ErrorProps {
  statusCode?: number | null;
}

const ErrorPage = ({
  statusCode,
  isMobile,
}: {
  statusCode: NextPage<ErrorProps>;
  isMobile: boolean;
}) => {
  const router = useRouter();

  const getErrorMessage = (): string => {
    if (statusCode) {
      return router.locale === "ko"
        ? `서버 에러가 발생했습니다. 에러 코드: ${statusCode}`
        : `Server-side Error has occured. Error Code: ${statusCode}`;
    }
    return router.locale === "ko"
      ? "클라이언트 측에서 오류가 발생했습니다."
      : "Client-side Error has occured.";
  };
  if (isMobile) {
    return (
      <main className="min-w-[360px] pt-[78px] pb-[196px] bg-gradient-to-r from-[#ECF0F1] to-[#FFFFFF] text-center text-sm">
        <p className="text-[28px] text-[#111111] font-semibold mb-5 tracking-wide">
          Error
        </p>
        <p className="text-gray-500 mb-[60px] font-light">
          {getErrorMessage()}
        </p>
        <div className={"flex justify-center items-center"}>
          <Image
            src={"/images/character/CoinCharacter.png"}
            alt=""
            width={150}
            height={100}
            quality={100}
            className={"shadow-lg"}
          />
        </div>
        <p className="text-gray-400 text-sm mt-10 italic">
          {router.locale === "ko"
            ? "다시 시도해 보시거나 고객센터에 문의해주시길 바랍니다"
            : "Please try again later or contact the support team"}
        </p>
      </main>
    );
  }

  return (
    <main className="min-w-[1024px] pt-[152px] pb-[144px] bg-gradient-to-r from-[#ECF0F1] to-[#FFFFFF] text-center shadow-[0_0_12px_0_rgba(121,120,132,0.15)]">
      <h1 className="text-4xl text-[#111111] font-semibold mb-7 tracking-wide">
        Error
      </h1>
      <p className="text-gray-600 text-lg mb-10 font-light">
        {getErrorMessage()}
      </p>
      <div className={"flex justify-center items-center mb-5"}>
        <Image
          src={"/images/character/CoinCharacter.png"}
          alt=""
          width={200}
          height={150}
          quality={100}
          className={""}
        />
      </div>
      <p className="text-gray-400 text-sm mt-5 italic">
        {router.locale === "ko"
          ? "다시 시도해 보시거나 고객센터에 문의해주시길 바랍니다"
          : "Please try again later or contact the support team"}
      </p>
    </main>
  );
};

ErrorPage.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return { statusCode };
};

export default ErrorPage;
