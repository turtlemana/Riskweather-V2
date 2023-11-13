import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import portfolioresult from "../../../../../public/lottie/portfolioresult.json.json";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { PORTCOLORS } from "data/default";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";

function Portfolio() {
  const router = useRouter();
  const dispatch = usePortfolioDispatch();
  const state = usePortfolioState();

  const postFetcher = (url: string, data: any) =>
    axios.post(url, data).then((res) => res.data);

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: session, status, update }: any = useSession();
  const {
    data: userInfo,
    isValidating,
    mutate,
  } = useSWR(
    session ? `/api/auth/user?session=${session.user.email}` : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  const userProfile: any = userInfo ? [].concat(userInfo.user)[0] : {};
  const [userPtf, setUserPtf]: any = useState();

  // useEffect to update userPtf when userProfile.portfolios changes
  useEffect(() => {
    if (userProfile.portfolios && userProfile.portfolios.length > 0) {
      const newPortfolio = userProfile.portfolios[0];
      if (JSON.stringify(userPtf) !== JSON.stringify(newPortfolio)) {
        setUserPtf(newPortfolio);
      }
    }
  }, [userProfile.portfolios]);

  const { data: portfolioPrices, mutate: portMutate } = useSWR(
    userProfile.portfolios && userProfile.portfolios.length
      ? `/api/portfolioPrice`
      : null,
    () =>
      postFetcher("/api/portfolioPrice", {
        portfolios: userProfile.portfolios,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
    }
  );

  useEffect(() => {
    if (portfolioPrices && userPtf) {
      const currentPortfolioPrice = portfolioPrices.find(
        (p: any) => p.portName === userPtf.portName
      );

      if (currentPortfolioPrice) {
        const updatedPtf = {
          ...userPtf,
          ...currentPortfolioPrice,
        };
        if (JSON.stringify(userPtf) !== JSON.stringify(updatedPtf)) {
          setUserPtf(updatedPtf);
        }
      }
    }
  }, [portfolioPrices, userPtf]);

  return (
    <main className="mb-3 w-full bg-white ">
      {session && userProfile && (
        <div className="bg-gray-100 pb-5 px-5 pt-2">
          <div className="space-x-2 flex items-center">
            <Image
              width={30}
              height={30}
              alt="trait"
              src={
                userProfile?.toleranceResult
                  ? `/images/icons/portfolio/${userProfile?.toleranceResult}.svg`
                  : "/images/logos/errorLogo.png"
              }
            />
            <p className="font-bold">
              {userProfile?.name}
              {"님"}
            </p>

            <p
              className={`text-md ${
                userProfile?.toleranceResult &&
                userProfile?.toleranceResult == "aggressive"
                  ? "text-red-400 font-bold "
                  : userProfile?.toleranceResult == "moderate"
                  ? "text-orange-400 font-bold "
                  : userProfile?.toleranceResult == "moderately conservative"
                  ? "text-yellow-400 font-bold "
                  : userProfile?.toleranceResult == "conservative"
                  ? "text-green-400 font-bold "
                  : "text-gray-400 "
              } `}
            >
              {" "}
              {userProfile?.toleranceResult
                ? router.locale == "ko"
                  ? userProfile?.toleranceResult == "aggressive"
                    ? "공격적인 투자자"
                    : userProfile?.toleranceResult == "moderate"
                    ? "중립적인 투자자"
                    : userProfile?.toleranceResult == "moderately conservative"
                    ? "약간 보수적인 투자자"
                    : userProfile?.toleranceResult == "conservative"
                    ? "보수적인 투자자"
                    : "위험 성향을 측정하세요"
                  : userProfile?.toleranceResult
                : router.locale == "ko"
                ? "위험 성향을 측정하세요"
                : "Undefined Result"}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-0">
        <div className="flex justify-between items-center px-5 pt-5 pb-5">
          <h1 className="text-lg">내 포트폴리오</h1>
          {/* <Image
            src={"/images/icons/expandLess.svg"}
            alt="arrow"
            width={11}
            height={6}
          /> */}
        </div>
        <div>
          <div className="flex justify-between items-center px-5">
            <div className="flex space-x-4 overflow-x-auto">
              {userProfile.portfolios &&
                userProfile.portfolios.map((ptf: any, i: number) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-[20px] max-w-[120px] truncate ${
                      userPtf && userPtf.portName === ptf.portName
                        ? "bg-black text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setUserPtf(ptf)}
                  >
                    {ptf.portName}
                  </button>
                ))}
            </div>
            {userProfile.portfolios && userProfile.portfolios.length > 0 && (
              <p
                className="text-gray-300 mt-1 cursor-pointer"
                onClick={() => {
                  router.push("/portfolio");
                  dispatch({ type: "SET_EDIT_OPEN", payload: true });
                }}
              >
                | 편집
              </p>
            )}
          </div>
          {userPtf && userPtf.totalPortfolioPriceKr && (
            <div className="pt-5 ">
              <div className="flex flex-col space-y-2 px-5">
                <p className="font-bold text-lg">총 자산</p>
                <p className="font-bold text-3xl">
                  {userPtf.totalPortfolioPriceKr
                    ? userPtf.totalPortfolioPriceKr.toLocaleString("en-us", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }) + "원"
                    : ""}
                </p>

                <div className="flex  justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <p className="text-gray-500">총 수익</p>
                    {userPtf.totalPortfolioPriceKr &&
                    userPtf.totalUserPrice &&
                    userPtf.totalPortfolioPriceKr - userPtf.totalUserPrice >
                      0 ? (
                      <div
                        className={`flex items-center text-md ${
                          userPtf.totalPortfolioPriceKr -
                            userPtf.totalUserPrice >
                          10000000
                            ? "pt-1 "
                            : ` `
                        } `}
                      >
                        <RiArrowUpSFill color={"red"} />
                        <p className={"text-red-500 font-bold"}>
                          {userPtf.totalPortfolioPriceKr &&
                            userPtf.totalUserPrice &&
                            (
                              userPtf.totalPortfolioPriceKr -
                              userPtf.totalUserPrice
                            ).toLocaleString("en-us", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }) + " 원"}
                        </p>
                      </div>
                    ) : userPtf.totalPortfolioPriceKr &&
                      userPtf.totalUserPrice &&
                      userPtf.totalPortfolioPriceKr - userPtf.totalUserPrice <=
                        0 ? (
                      <div className="flex items-center text-md">
                        <RiArrowDownSFill color={"blue"} />
                        <p className={"text-blue-500 font-bold"}>
                          {userPtf.totalPortfolioPriceKr -
                            userPtf.totalUserPrice &&
                            (
                              userPtf.totalPortfolioPriceKr -
                              userPtf.totalUserPrice
                            ).toLocaleString("en-us", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }) + " 원"}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    {userPtf.totalChange && userPtf.totalChange > 0 ? (
                      <div
                        className={`flex  items-center text-sm ${
                          userPtf.totalChange > 10000000 ? "pt-1 " : ` `
                        } `}
                      >
                        <p className={"text-red-500 font-bold"}>
                          {userPtf.totalChange &&
                            "(" +
                              "+" +
                              userPtf.totalChange.toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }) +
                              " %" +
                              ")"}
                        </p>
                      </div>
                    ) : userPtf.totalChange && userPtf.totalChange < 0 ? (
                      <div className="flex  items-center text-sm">
                        <p className={"text-blue-500 font-bold"}>
                          {userPtf.totalChange &&
                            "(" +
                              userPtf.totalChange.toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }) +
                              " %" +
                              ")"}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-500">일간 수익</p>
                    {userPtf.totalTodayProfit &&
                    userPtf.totalTodayProfit > 0 ? (
                      <div
                        className={`flex items-center text-md ${
                          userPtf.totalTodayProfit > 10000000 ? "pt-1 " : ` `
                        } `}
                      >
                        <RiArrowUpSFill color={"red"} />
                        <p className={"text-red-500 font-bold"}>
                          {userPtf.totalTodayProfit.toLocaleString("en-us", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }) + " 원"}
                        </p>
                      </div>
                    ) : userPtf.totalTodayProfit && userPtf.totalTodayProfit ? (
                      <div className="flex items-center text-md">
                        <RiArrowDownSFill color={"blue"} />
                        <p className={"text-blue-500 font-bold"}>
                          {userPtf.totalTodayProfit &&
                            userPtf.totalTodayProfit.toLocaleString("en-us", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }) + " 원"}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    {userPtf.totalTodayChangePer &&
                    userPtf.totalTodayChangePer > 0 ? (
                      <div
                        className={`flex items-center text-sm ${
                          userPtf.totalTodayChangePer > 10000000 ? "pt-1 " : ` `
                        } `}
                      >
                        <p className={"text-red-500 font-bold"}>
                          {userPtf.totalTodayChangePer &&
                            "(" +
                              "+" +
                              (
                                userPtf.totalTodayChangePer * 100
                              ).toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }) +
                              " %" +
                              ")"}
                        </p>
                      </div>
                    ) : userPtf.totalTodayChangePer &&
                      userPtf.totalTodayChangePer < 0 ? (
                      <div className="flex items-center text-sm">
                        <p className={"text-blue-500 font-bold"}>
                          {userPtf.totalTodayChangePer &&
                            "(" +
                              (
                                userPtf.totalTodayChangePer * 100
                              ).toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }) +
                              " %" +
                              ")"}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="pt-5 px-5">
                {userPtf.portfolioLevel &&
                userPtf.portfolioLevel === "Very High volatility" ? (
                  <div className="truncate px-2 py-3 border rounded-xl flex items-center space-x-2">
                    {userPtf?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[userPtf?.portfolioLevel]
                        } max-w-fit`}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? userPtf?.portfolioLevel === "Low volatility"
                              ? "안전"
                              : userPtf?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : userPtf?.portfolioLevel === "High volatility"
                              ? "주의"
                              : userPtf?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : userPtf?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}
                    <p className="text-[15px]">
                      {"매우 큰 폭의 손실이 발생할 수 있습니다."}
                    </p>

                    {/* <Image
                      src="/images/icons/riskHigh.svg"
                      width={54}
                      height={54}
                      alt="highRisk"
                    /> */}
                  </div>
                ) : userPtf.portfolioLevel === "High volatility" ? (
                  <div className="truncate px-2 py-3 border rounded-xl flex items-center space-x-2">
                    {userPtf?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[userPtf?.portfolioLevel]
                        } max-w-fit `}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? userPtf?.portfolioLevel === "Low volatility"
                              ? "안전"
                              : userPtf?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : userPtf?.portfolioLevel === "High volatility"
                              ? "주의"
                              : userPtf?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : userPtf?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}

                    <p className="text-[15px]  ">
                      {"큰 폭의 손실이 발생할 수 있습니다."}
                    </p>
                    {/* <Image
                      src="/images/icons/riskHigh.svg"
                      width={54}
                      height={54}
                      alt="highRisk"
                    /> */}
                  </div>
                ) : userPtf.portfolioLevel === "Moderate volatility" ? (
                  <div className="truncate px-2 py-3 border rounded-xl flex items-center space-x-2">
                    {userPtf?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[userPtf?.portfolioLevel]
                        } max-w-fit `}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? userPtf?.portfolioLevel === "Low volatility"
                              ? "안전"
                              : userPtf?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : userPtf?.portfolioLevel === "High volatility"
                              ? "주의"
                              : userPtf?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : userPtf?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}

                    <p className="text-[15px]   ">
                      {"작은 폭의 손실이 발생할 수 있습니다."}
                    </p>
                    <Image
                      src="/images/icons/riskHigh.svg"
                      width={54}
                      height={54}
                      alt="highRisk"
                    />
                  </div>
                ) : userPtf.portfolioLevel === "Low volatility" ? (
                  <div className="truncate px-2 py-3 border rounded-xl flex items-center space-x-2">
                    {userPtf?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[userPtf?.portfolioLevel]
                        } max-w-fit `}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? userPtf?.portfolioLevel === "Low volatility"
                              ? "안전"
                              : userPtf?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : userPtf?.portfolioLevel === "High volatility"
                              ? "주의"
                              : userPtf?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : userPtf?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}

                    <p className="text-[15px]   ">
                      {"발생 가능한 손실이 매우 작거나 없습니다."}
                    </p>
                    {/* <Image
                      src="/images/icons/riskHigh.svg"
                      width={54}
                      height={54}
                      alt="highRisk"
                    /> */}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div
                onClick={() => {
                  router.push("/portfolio");
                  dispatch({ type: "SET_PORTFOLIO", payload: userPtf });
                  dispatch({ type: "SET_DETAIL_OPEN", payload: true });
                }}
                className="mt-8 cursor-pointer px-2 py-1.5  border border-t-gray-100 shadow-sm  w-full "
              >
                <div
                  className={
                    "flex space-x-1 text-blue-400 font-semibold justify-center items-center py-3"
                  }
                >
                  <div className="flex justify-center items-center">
                    <p>AI</p>
                    <Image
                      src="/images/icons/blueLightning.svg"
                      width={8.1}
                      height={9}
                      alt="light"
                      className="mb-3"
                    />
                  </div>
                  <p> 분석 보기</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="flex justify-between items-center">
          <button className="py-1 px-2 bg-black text-white rounded-2xl">
            기본
          </button>
          <p className="text-gray-300 text-sm">| 편집</p>
        </div> */}
        {!userProfile ||
        !userProfile.portfolios ||
        userProfile.portfolios.length === 0 ? (
          <div>
            <div className={"flex justify-center items-center py-2"}>
              <Lottie
                animationData={portfolioresult}
                renderer="svg"
                autoplay
                loop
                style={{ width: 400, height: 200 }}
              />
            </div>

            <div className={"flex flex-col justify-center items-center pb-5"}>
              <div className={"flex space-x-1"}>
                <h3>보유 자산 등록하고,</h3>
                <h3> </h3>
                <Image
                  src="/images/icons/Ai.svg"
                  className={"w-auto h-auto"}
                  alt="AI"
                  width={6}
                  height={6}
                />{" "}
                <h3> 진단받기</h3>
              </div>
              <p className={"text-gray-500 text-sm"}>
                리스크웨더 AI가 실시간으로 분석해요
              </p>
              <button
                onClick={() => {
                  if (!session) {
                    router.push("/login");
                  } else {
                    router.push("/portfolio");
                    dispatch({ type: "SET_ADD_OPEN", payload: true });
                  }
                }}
                className={
                  "mt-3 rounded-xl bg-[#2178FB] w-[327px] text-white  py-3"
                }
              >
                포트폴리오 만들기
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex justify-start items-center space-x-2 overflow-x-auto"></div>
      </div>
    </main>
  );
}

export default Portfolio;
