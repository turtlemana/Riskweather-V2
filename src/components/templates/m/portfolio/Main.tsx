import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PORTCOLORS } from "data/default";
import { useRouter } from "next/router";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import Lottie from "lottie-react";
import portfolioresult from "../../../../../public/lottie/portfolioresult.json.json";
import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";

function Main({
  setPortfolio,
  userProfile,
  setIsAddModalOpen,
  setIsEditModalOpen,
  setIsDetailOpen,
  portfolios,
  portMutate,
}: any) {
  const [sortOrder, setSortOrder] = useState("riskHigh");
  const [currency, setCurrency] = useState("KRW");
  const router = useRouter();
  const dispatch = usePortfolioDispatch();
  const state = usePortfolioState();

  if (!portfolios) {
    return (
      <div className={"flex justify-center items-center py-2 h-full"}>
        <Lottie
          animationData={portfolioresult}
          renderer="svg"
          autoplay
          loop
          style={{ width: 400, height: 200 }}
        />
      </div>
    );
  }

  if (!Array.isArray(portfolios)) {
    console.error("Unexpected data format for portfolios:", portfolios);
    return <div>Error occurred</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-between p-5">
        <h1 className="text-2xl">내 포트폴리오</h1>
        <p
          onClick={() => dispatch({ type: "SET_EDIT_OPEN", payload: true })}
          className="text-gray-400 "
        >
          편집
        </p>
      </div>

      <div className="flex justify-between items-center px-5">
        <div>
          {/* <select
            className="text-center mt-5 mb-2  text-gray-400 text-sm"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option className="text-gray-500" value="riskHigh">
              리스크 높은 순
            </option>
            <option className="text-gray-500" value="riskLow">
              리스크 낮은 순
            </option>
            <option className="text-gray-500" value="returnHigh">
              일간 수익 높은 순
            </option>
            <option className="text-gray-500" value="returnLow">
              일간 수익 낮은 순
            </option>
          </select> */}
        </div>
        <div className="relative mt-5 mb-2 rounded-2xl">
          <div
            className="border absolute w-1/2 h-full bg-white rounded-2xl transform transition-transform duration-300"
            style={{
              transform:
                currency === "KRW" ? "translateX(0%)" : "translateX(100%)",
            }}
          ></div>
          <div className="flex border rounded-2xl overflow-hidden h-[25px] justify-center items-center">
            <button
              onClick={() => setCurrency("KRW")}
              className={`text-xs font-bold flex-1 py-2 px-3 ${
                currency === "KRW"
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-400"
              } leading-none`}
              style={{
                transform:
                  currency === "KRW" ? "translateY(-1px)" : "translateY(0px)",
              }}
            >
              원화
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`text-xs font-bold flex-1 py-2 px-3 ${
                currency === "USD"
                  ? "bg-white text-black"
                  : "bg-gray-200 text-gray-400"
              } leading-none`}
              style={{
                transform:
                  currency === "USD" ? "translateY(-1px)" : "translateY(0px)",
              }}
            >
              달러
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-5 px-2 min-w-[360px]">
        {portfolios &&
          portfolios?.map((portfolio: any, idx: number) => (
            <div
              onClick={() => {
                dispatch({ type: "SET_DETAIL_OPEN", payload: true });
                dispatch({ type: "SET_PORTFOLIO", payload: portfolio });
              }}
              key={idx}
              className="flex items-center border-b justify-between"
            >
              <div className="flex flex-col mb-4 p-3  rounded-md">
                <div className="flex items-center space-x-2">
                  <h2
                    className="font-bold text-lg truncate w-[200px]"
                    title={portfolio.portName}
                  >
                    {portfolio.portName}
                  </h2>
                  <p className="text-gray-300 text-sm truncate">
                    {portfolio.items &&
                      portfolio.items.length > 0 &&
                      portfolio.items.length}{" "}
                    개 자산{" "}
                  </p>
                </div>
                {/* 다음은 예시로 추가한 가격 정보입니다. 원하는 형태로 수정할 수 있습니다. */}
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold">
                    {currency === "KRW"
                      ? portfolio.totalPortfolioPriceKr
                        ? portfolio.totalPortfolioPriceKr.toLocaleString(
                            "en-us",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          ) + " 원"
                        : "-"
                      : currency === "USD"
                      ? portfolio.totalPortfolioPriceUs
                        ? portfolio.totalPortfolioPriceUs.toLocaleString(
                            "en-us",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }
                          ) + "＄"
                        : "-"
                      : "-"}
                  </p>{" "}
                </div>
                {portfolio.totalChange && portfolio.totalChange > 0 ? (
                  <div
                    className={`flex items-center text-xs ${
                      portfolio.totalChange > 10000000 ? "pt-1 " : ` `
                    } `}
                  >
                    <RiArrowUpSFill color={"red"} />
                    <p className={"text-red-500 font-bold"}>
                      {portfolio.totalChange &&
                        "(" +
                          portfolio.totalChange.toLocaleString("en-us", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }) +
                          " %" +
                          ")"}
                    </p>
                  </div>
                ) : portfolio.totalChange && portfolio.totalChange < 0 ? (
                  <div className="flex items-center text-xs">
                    <RiArrowDownSFill color={"blue"} />
                    <p className={"text-blue-500 font-bold"}>
                      {portfolio.totalChange &&
                        "(" +
                          portfolio.totalChange.toLocaleString("en-us", {
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
              <div className="flex items-center space-x-5 ">
                {portfolio?.portfolioLevel ? (
                  <div
                    className={`py-1 px-3 rounded-20 ${
                      PORTCOLORS[portfolio?.portfolioLevel]
                    } max-w-fit mx-auto`}
                  >
                    <h6 className="text-xs">
                      {router.locale === "ko"
                        ? portfolio?.portfolioLevel === "Low volatility"
                          ? "안전"
                          : portfolio?.portfolioLevel === "Moderate volatility"
                          ? "적정"
                          : portfolio?.portfolioLevel === "High volatility"
                          ? "주의"
                          : portfolio?.portfolioLevel === "Very High volatility"
                          ? "위험"
                          : ""
                        : portfolio?.portfolioLevel}
                    </h6>
                  </div>
                ) : (
                  <h1 className={"text-black"}>{""}</h1>
                )}
                <Image
                  src="/images/icons/arrowRight.svg"
                  width={10}
                  height={10}
                  alt=""
                />
              </div>
            </div>
          ))}
      </div>
      {userProfile &&
        userProfile.portfolios &&
        userProfile.portfolios.length < 3 && (
          <div className="fixed  bottom-20 left-0 right-0 flex justify-center">
            <button
              onClick={() => {
                dispatch({ type: "SET_ADD_OPEN", payload: true });
              }}
              className="w-full mx-8 text-blue-500 font-bold bg-blue-50 rounded-lg py-2 px-4"
            >
              +포트폴리오 추가
            </button>
          </div>
        )}
    </div>
  );
}

export default Main;
