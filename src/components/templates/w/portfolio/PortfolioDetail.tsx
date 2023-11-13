import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import axios from "axios";
import Image from "next/image";
import { PORTCOLORS } from "data/default";
import { useRouter } from "next/router";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import PortfolioBarChart from "chart/WebPortfolioBarChart";
import { COLORS } from "data/default";
import PortfolioAssetTable from "components/organisms/w/PortfolioAssetTable";
import { useGlobalDispatch } from "contexts/SearchContext";
import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";

interface props {
  setPortfolio: any;
  setIsAssetAddOpen: Dispatch<SetStateAction<boolean>>;
  setIsDetailOpen: Dispatch<SetStateAction<boolean>>;
  portfolio: any;
}

function PortfolioDetail({
  setPortfolio,
  setIsAssetAddOpen,
  setIsDetailOpen,
}: props) {
  const router = useRouter();
  const [isOpenDetail, setIsOpenDetail] = useState("");
  const dispatch = useGlobalDispatch();
  const state = usePortfolioState();
  const portDispatch = usePortfolioDispatch();

  const getSegmentColor = (index: number) => {
    const gradient = [
      "black",
      "dimgray",
      "gray",
      "darkgray",
      "silver",
      "lightgray",
      "gainsboro",
      "whitesmoke",
      "ivory",
      "white",
    ];
    return gradient[index];
  };

  const sortedItems = useMemo(
    () =>
      state.portfolio.items &&
      state.portfolio.items.length > 0 &&
      state.portfolio.items.sort(
        (a: any, b: any) =>
          b.totalMarketKrPrice / state.portfolio.totalPortfolioPriceKr -
          a.totalMarketKrPrice / state.portfolio.totalPortfolioPriceKr
      ),
    [state.portfolio]
  );
  console.log(state.portfolio);
  return (
    <main className="z-30 fixed pb-[150px] slim-scroll  bg-white top-20 w-full  max-w-[800px] h-screen overflow-y-auto">
      <div className="flex bg-white mb-3 flex-col  space-y-3">
        <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
          <Image
            className="cursor-pointer"
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => portDispatch({ type: "RESET" })}
          />
          <div className="space-y-2 flex flex-col">
            {state.portfolio?.portfolioLevel ? (
              <div
                className={`py-1 px-2 rounded-lg ${
                  PORTCOLORS[state.portfolio?.portfolioLevel]
                } max-w-fit mx-auto`}
              >
                <h6 className="text-xs">
                  {router.locale === "ko"
                    ? state.portfolio?.portfolioLevel === "Low volatility"
                      ? "안전"
                      : state.portfolio?.portfolioLevel ===
                        "Moderate volatility"
                      ? "적정"
                      : state.portfolio?.portfolioLevel === "High volatility"
                      ? "주의"
                      : state.portfolio?.portfolioLevel ===
                        "Very High volatility"
                      ? "위험"
                      : ""
                    : state.portfolio?.portfolioLevel}
                </h6>
              </div>
            ) : (
              <h1 className={"text-black"}>{""}</h1>
            )}
            <p className="text-sm font-bold">{state.portfolio.portName}</p>
          </div>
          <div>
            <p
              onClick={() => {
                setPortfolio(state.portfolio);
                portDispatch({ type: "SET_NEXTSTEP", payload: true });
                portDispatch({ type: "SET_ASSETADD_OPEN", payload: true });
              }}
              className="cursor-pointer text-[14px] text-gray-400"
            >
              편집
            </p>
          </div>
        </div>

        <div className="p-5 space-y-2">
          <p className="text-gray-500">포트폴리오</p>
          <p className="text-lg font-bold">{state.portfolio.portName}</p>
          {!state.portfolio.items || state.portfolio.items.length === 0 ? (
            <div className="flex items-center justify-center w-full py-4">
              <Image
                src="/images/icons/portfolio/emptyChart.svg"
                width={180}
                height={180}
                alt="empty"
              />
            </div>
          ) : (
            <div className="pt-5">
              <div className="flex flex-col space-y-2">
                <p className="font-bold text-md">총 자산</p>
                <p className="font-bold text-2xl">
                  {state.portfolio.totalPortfolioPriceKr
                    ? state.portfolio.totalPortfolioPriceKr.toLocaleString(
                        "en-us",
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      ) + "원"
                    : ""}
                </p>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex flex-col">
                    <p className="text-gray-500">총 수익</p>
                    {state.portfolio.totalPortfolioPriceKr &&
                    state.portfolio.totalUserPrice &&
                    state.portfolio.totalPortfolioPriceKr -
                      state.portfolio.totalUserPrice >
                      0 ? (
                      <div
                        className={`flex items-center text-md ${
                          state.portfolio.totalPortfolioPriceKr -
                            state.portfolio.totalUserPrice >
                          10000000
                            ? "pt-1 "
                            : ` `
                        } `}
                      >
                        <RiArrowUpSFill color={"red"} />
                        <p className={"text-red-500 font-bold"}>
                          {state.portfolio.totalPortfolioPriceKr &&
                            state.portfolio.totalUserPrice &&
                            (
                              state.portfolio.totalPortfolioPriceKr -
                              state.portfolio.totalUserPrice
                            ).toLocaleString("en-us", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }) + " 원"}
                        </p>
                      </div>
                    ) : state.portfolio.totalPortfolioPriceKr &&
                      state.portfolio.totalUserPrice &&
                      state.portfolio.totalPortfolioPriceKr -
                        state.portfolio.totalUserPrice <=
                        0 ? (
                      <div className="flex items-center text-xs">
                        <RiArrowDownSFill color={"blue"} />
                        <p className={"text-blue-500 font-bold"}>
                          {state.portfolio.totalPortfolioPriceKr -
                            state.portfolio.totalUserPrice &&
                            (
                              state.portfolio.totalPortfolioPriceKr -
                              state.portfolio.totalUserPrice
                            ).toLocaleString("en-us", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }) + " 원"}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    {state.portfolio.totalChange &&
                    state.portfolio.totalChange > 0 ? (
                      <div
                        className={`flex items-center text-sm ${
                          state.portfolio.totalChange > 10000000 ? "pt-1 " : ` `
                        } `}
                      >
                        <p className={"text-red-500 font-bold"}>
                          {state.portfolio.totalChange &&
                            "(" +
                              "+" +
                              state.portfolio.totalChange.toLocaleString(
                                "en-us",
                                {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }
                              ) +
                              " %" +
                              ")"}
                        </p>
                      </div>
                    ) : state.portfolio.totalChange &&
                      state.portfolio.totalChange < 0 ? (
                      <div className="flex items-center text-sm">
                        <p className={"text-blue-500 font-bold"}>
                          {state.portfolio.totalChange &&
                            "(" +
                              state.portfolio.totalChange.toLocaleString(
                                "en-us",
                                {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }
                              ) +
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
                    {state.portfolio.totalTodayProfit &&
                    state.portfolio.totalTodayProfit > 0 ? (
                      <div
                        className={`flex items-center text-md ${
                          state.portfolio.totalTodayProfit > 10000000
                            ? "pt-1 "
                            : ` `
                        } `}
                      >
                        <RiArrowUpSFill color={"red"} />
                        <p className={"text-red-500 font-bold"}>
                          {state.portfolio.totalTodayProfit.toLocaleString(
                            "en-us",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          ) + " 원"}
                        </p>
                      </div>
                    ) : state.portfolio.totalTodayProfit &&
                      state.portfolio.totalTodayProfit ? (
                      <div className="flex items-center text-md">
                        <RiArrowDownSFill color={"blue"} />
                        <p className={"text-blue-500 font-bold"}>
                          {state.portfolio.totalTodayProfit &&
                            state.portfolio.totalTodayProfit.toLocaleString(
                              "en-us",
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }
                            ) + " 원"}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    {state.portfolio.totalTodayChangePer &&
                    state.portfolio.totalTodayChangePer > 0 ? (
                      <div
                        className={`flex items-center text-sm ${
                          state.portfolio.totalTodayChangePer > 10000000
                            ? "pt-1 "
                            : ` `
                        } `}
                      >
                        <p className={"text-red-500 font-bold"}>
                          {state.portfolio.totalTodayChangePer &&
                            "(" +
                              "+" +
                              (
                                state.portfolio.totalTodayChangePer * 100
                              ).toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }) +
                              " %" +
                              ")"}
                        </p>
                      </div>
                    ) : state.portfolio.totalTodayChangePer &&
                      state.portfolio.totalTodayChangePer < 0 ? (
                      <div className="flex items-center text-sm">
                        <p className={"text-blue-500 font-bold"}>
                          {state.portfolio.totalTodayChangePer &&
                            "(" +
                              (
                                state.portfolio.totalTodayChangePer * 100
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
              <div className="pt-5 ">
                {state.portfolio.portfolioLevel &&
                state.portfolio.portfolioLevel === "Very High volatility" ? (
                  <div className="truncate px-5 py-3 border rounded-xl flex items-center space-x-3">
                    {state.portfolio?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[state.portfolio?.portfolioLevel]
                        } max-w-fit`}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? state.portfolio?.portfolioLevel ===
                              "Low volatility"
                              ? "안전"
                              : state.portfolio?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : state.portfolio?.portfolioLevel ===
                                "High volatility"
                              ? "주의"
                              : state.portfolio?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : state.portfolio?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}
                    <p className="text-[15px] pr-8 ">
                      {"매우 큰 폭의 손실이 발생할 수 있습니다."}
                    </p>
                    {/* <Image
                        src="/images/icons/riskHigh.svg"
                        width={54}
                        height={54}
                        alt="highRisk"
                      /> */}
                  </div>
                ) : state.portfolio.portfolioLevel === "High volatility" ? (
                  <div className="truncate px-5 py-3 border rounded-xl flex items-center space-x-3">
                    {state.portfolio?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[state.portfolio?.portfolioLevel]
                        } max-w-fit `}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? state.portfolio?.portfolioLevel ===
                              "Low volatility"
                              ? "안전"
                              : state.portfolio?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : state.portfolio?.portfolioLevel ===
                                "High volatility"
                              ? "주의"
                              : state.portfolio?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : state.portfolio?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}

                    <p className="text-[15px] pr-8 ">
                      {"큰 폭의 손실이 발생할 수 있습니다."}
                    </p>
                    {/* <Image
                        src="/images/icons/riskHigh.svg"
                        width={54}
                        height={54}
                        alt="highRisk"
                      /> */}
                  </div>
                ) : state.portfolio.portfolioLevel === "Moderate volatility" ? (
                  <div className="truncate px-5 py-3 border rounded-xl flex items-center space-x-3">
                    {state.portfolio?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[state.portfolio?.portfolioLevel]
                        } max-w-fit `}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? state.portfolio?.portfolioLevel ===
                              "Low volatility"
                              ? "안전"
                              : state.portfolio?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : state.portfolio?.portfolioLevel ===
                                "High volatility"
                              ? "주의"
                              : state.portfolio?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : state.portfolio?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}

                    <p className="text-[15px] pr-8  ">
                      {"작은 폭의 손실이 발생할 수 있습니다."}
                    </p>
                    {/* <Image
                        src="/images/icons/riskHigh.svg"
                        width={54}
                        height={54}
                        alt="highRisk"
                      /> */}
                  </div>
                ) : state.portfolio.portfolioLevel === "Low volatility" ? (
                  <div className="truncate px-5 py-3 border rounded-xl flex items-center space-x-3">
                    {state.portfolio?.portfolioLevel ? (
                      <div
                        className={`py-1 px-2 rounded-20 ${
                          PORTCOLORS[state.portfolio?.portfolioLevel]
                        } max-w-fit `}
                      >
                        <h6 className="text-[15px]">
                          {router.locale === "ko"
                            ? state.portfolio?.portfolioLevel ===
                              "Low volatility"
                              ? "안전"
                              : state.portfolio?.portfolioLevel ===
                                "Moderate volatility"
                              ? "적정"
                              : state.portfolio?.portfolioLevel ===
                                "High volatility"
                              ? "주의"
                              : state.portfolio?.portfolioLevel ===
                                "Very High volatility"
                              ? "위험"
                              : ""
                            : state.portfolio?.portfolioLevel}
                        </h6>
                      </div>
                    ) : (
                      <h1 className={"text-black"}>{""}</h1>
                    )}

                    <p className="text-[15px] pr-8  ">
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
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-100 w-full py-1.5"></div>

      <div className="bg-white p-5 flex flex-col mb-3">
        <p className="text-xl font-bold mb-3">자산 구성</p>
        {state.portfolio.items && state.portfolio.items.length > 0 && (
          <div className="w-full">
            <PortfolioBarChart data={state.portfolio} />
          </div>
        )}
        <div>
          <p className="font-bold pt-1 text-sm">
            {state.portfolio.items && state.portfolio.items.length > 0
              ? state.portfolio.items.length
              : 0}
            {"개 자산"}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {sortedItems &&
            sortedItems.length > 0 &&
            sortedItems.map((item: any, index: number) => {
              const percentage =
                (item.totalMarketKrPrice /
                  state.portfolio.totalPortfolioPriceKr) *
                100;
              const color = getSegmentColor(index);

              return (
                <div key={index} className="flex space-x-0.5 items-center">
                  <div
                    style={{
                      backgroundColor: color,
                      width: "10px",
                      height: "10px",
                      marginRight: "5px",
                    }}
                  ></div>
                  <div className="flex items-center text-xs space-x-2">
                    <span className="font-bold text-gray-500  truncate">
                      {decodeURIComponent(item.krName)}
                    </span>
                    <span className="text-gray-400">
                      {percentage && percentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="bg-gray-100 w-full py-1.5"></div>

      <div className="bg-white  flex flex-col min-h-screen space-y-0.5">
        <p className="text-lg font-bold px-5 pb-3 pt-5">보유 자산</p>
        {/* 국내 자산 */}
        {sortedItems &&
          sortedItems.length > 0 &&
          sortedItems.filter((item: any) => item.loc === "Korea (South)")
            .length > 0 && (
            <p className="text-sm text-gray-500 px-5 pb-1 pt-5">국내</p>
          )}
        {sortedItems &&
          sortedItems.length > 0 &&
          sortedItems
            .filter((item: any) => item.loc === "Korea (South)")
            .map((data: any, i: number) => (
              <PortfolioAssetTable
                key={i}
                data={data}
                ticker={data.ticker}
                index={i}
                isOpenDetail={isOpenDetail}
                setIsOpenDetail={setIsOpenDetail}
              />
            ))}

        {sortedItems &&
          sortedItems.length > 0 &&
          sortedItems.filter(
            (item: any) => item.loc !== "Korea (South)" && item.cat === "Stock"
          ).length > 0 && (
            <p className="text-sm text-gray-500 px-5 pb-1 pt-5">해외</p>
          )}
        {sortedItems &&
          sortedItems.length > 0 &&
          sortedItems
            .filter(
              (item: any) =>
                item.loc !== "Korea (South)" && item.cat === "Stock"
            )
            .map((data: any, i: number) => (
              <PortfolioAssetTable
                key={i}
                data={data}
                ticker={data.ticker}
                index={i}
                isOpenDetail={isOpenDetail}
                setIsOpenDetail={setIsOpenDetail}
              />
            ))}

        {sortedItems &&
          sortedItems.length > 0 &&
          sortedItems.filter((item: any) => item.cat === "Crypto").length >
            0 && (
            <p className="text-sm text-gray-500 px-5 pb-1 pt-5">가상자산</p>
          )}
        {sortedItems &&
          sortedItems.length > 0 &&
          sortedItems
            .filter((item: any) => item.cat === "Crypto")
            .map((data: any, i: number) => (
              <PortfolioAssetTable
                key={i}
                data={data}
                ticker={data.ticker}
                index={i}
                isOpenDetail={isOpenDetail}
                setIsOpenDetail={setIsOpenDetail}
              />
            ))}
      </div>

      <div className="sticky  bottom-10 left-0 right-0 flex justify-center">
        <button
          onClick={() => {
            setPortfolio(state.portfolio);

            portDispatch({ type: "SET_ASSETADD_OPEN", payload: true });
            portDispatch({ type: "SET_NEXTSTEP", payload: false });
            dispatch({ type: "RESET_VALUE" });
          }}
          className="w-1/2 mx-8 text-blue-500 font-bold bg-blue-50 rounded-lg py-2 px-4"
        >
          +자산 추가
        </button>
      </div>
    </main>
  );
}

export default PortfolioDetail;
