import React from "react";
import Image from "next/image";
import { NowTrendingData } from "interfaces/main";
import { useRouter } from "next/router";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import useHandleImageError from "utils/useHandleImageError";
import Loading from "./Loading";
import {
  useGlobalState,
  useGlobalDispatch,
  ActionType,
} from "contexts/SearchContext";

function SearchTable({
  data,
  sortType,
  dispatchSort,
  isValid,
  len,
  theme,
  count,
  handleLoadMore,
}: {
  data: NowTrendingData[];
  dispatchSort: string;
  sortType: string;
  isValid: boolean;
  len: number;
  theme: string;
  count: string;
  handleLoadMore: any;
}) {
  const handleImageError = useHandleImageError();
  const router = useRouter();
  const state = useGlobalState();

  const dispatch = useGlobalDispatch();

  return (
    <div className="space-y-4">
      <p className="p-5 text-xl font-semibold  pb-1">{theme}</p>{" "}
      <div className="flex pl-6 pr-10 font-semibold justify-start space-x-5">
        <div className="flex flex-col">
          <div
            className={`${
              sortType === "weather"
                ? "text-white bg-black rounded-3xl px-2 py-1"
                : "text-gray-400 px-2 py-1"
            }`}
            onClick={() =>
              dispatch({ type: dispatchSort as any, payload: "weather" })
            }
          >
            리스크
          </div>
        </div>
        <div className="flex flex-col">
          <div
            className={`${
              sortType === "risk"
                ? "text-white bg-black rounded-3xl px-2 py-1"
                : "text-gray-400 px-2 py-1"
            }`}
            onClick={() =>
              dispatch({ type: dispatchSort as any, payload: "risk" })
            }
          >
            위험도
          </div>
        </div>
        <div className="flex flex-col">
          <div
            className={`${
              sortType === "volume"
                ? "text-white bg-black rounded-3xl px-2 py-1"
                : "text-gray-400 px-2 py-1"
            }`}
            onClick={() =>
              dispatch({ type: dispatchSort as any, payload: "volume" })
            }
          >
            거래량
          </div>
        </div>
      </div>
      <div>
        {sortType === "weather" ? (
          <div className="flex px-10 font-semibold justify-between pt-2">
            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanWeatherTrait === "extremeRiseData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignWeatherTrait === "extremeRiseData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoWeatherTrait === "extremeRiseData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_WEATHER_TRAIT" as any)
                        : "",
                    payload: "extremeRiseData",
                  })
                }
              >
                폭등
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanWeatherTrait === "extremeRiseData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignWeatherTrait === "extremeRiseData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoWeatherTrait === "extremeRiseData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>

            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanWeatherTrait === "riseData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignWeatherTrait === "riseData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoWeatherTrait === "riseData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_WEATHER_TRAIT" as any)
                        : "",
                    payload: "riseData",
                  })
                }
              >
                상승
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanWeatherTrait === "riseData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignWeatherTrait === "riseData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoWeatherTrait === "riseData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>

            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanWeatherTrait === "sustainData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignWeatherTrait === "sustainData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoWeatherTrait === "sustainData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_WEATHER_TRAIT" as any)
                        : "",
                    payload: "sustainData",
                  })
                }
              >
                유지
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanWeatherTrait === "sustainData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignWeatherTrait === "sustainData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoWeatherTrait === "sustainData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>

            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanWeatherTrait === "declineData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignWeatherTrait === "declineData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoWeatherTrait === "declineData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_WEATHER_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_WEATHER_TRAIT" as any)
                        : "",
                    payload: "declineData",
                  })
                }
              >
                완화
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanWeatherTrait === "declineData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignWeatherTrait === "declineData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoWeatherTrait === "declineData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>
          </div>
        ) : sortType === "risk" ? (
          <div className="flex px-10 font-semibold justify-between pt-2">
            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanRiskTrait === "veryHighData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignRiskTrait === "veryHighData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoRiskTrait === "veryHighData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_RISK_TRAIT" as any)
                        : "",
                    payload: "veryHighData",
                  })
                }
              >
                매우위험
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanRiskTrait === "veryHighData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignRiskTrait === "veryHighData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoRiskTrait === "veryHighData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>

            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanRiskTrait === "highData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignRiskTrait === "highData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoRiskTrait === "highData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_RISK_TRAIT" as any)
                        : "",
                    payload: "highData",
                  })
                }
              >
                주의
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanRiskTrait === "highData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignRiskTrait === "highData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoRiskTrait === "highData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>

            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanRiskTrait === "moderateData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignRiskTrait === "moderateData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoRiskTrait === "moderateData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_RISK_TRAIT" as any)
                        : "",
                    payload: "moderateData",
                  })
                }
              >
                적정
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanRiskTrait === "moderateData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignRiskTrait === "moderateData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoRiskTrait === "moderateData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>

            <div className="flex flex-col">
              <div
                className={`${
                  dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                    ? state.koreanRiskTrait === "lowData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                    ? state.foreignRiskTrait === "lowData"
                      ? "text-black "
                      : "text-gray-400 "
                    : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                    ? state.cryptoRiskTrait === "lowData"
                      ? "text-black "
                      : "text-gray-400 "
                    : "text-gray-400"
                }`}
                onClick={() =>
                  dispatch({
                    type:
                      dispatchSort === ("SET_KOREA_SORT_TYPE" as any)
                        ? ("SET_KOREAN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_FOREIGN_SORT_TYPE" as any)
                        ? ("SET_FOREIGN_RISK_TRAIT" as any)
                        : dispatchSort === ("SET_CRYPTO_SORT_TYPE" as any)
                        ? ("SET_CRYPTO_RISK_TRAIT" as any)
                        : "",
                    payload: "lowData",
                  })
                }
              >
                낮음
              </div>
              {(dispatchSort === "SET_KOREA_SORT_TYPE" &&
                state.koreanRiskTrait === "lowData") ||
              (dispatchSort === "SET_FOREIGN_SORT_TYPE" &&
                state.foreignRiskTrait === "lowData") ||
              (dispatchSort === "SET_CRYPTO_SORT_TYPE" &&
                state.cryptoRiskTrait === "lowData") ? (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              ) : null}
            </div>
          </div>
        ) : (
          ""
        )}
        <hr />
        <div className="text-sm  py-2 px-7 text-gray-500 bg-gray-100 flex justify-between items-center">
          <p>자산명</p>
          <p>상승 정도</p>
        </div>
        <ul className=" overflow-y-auto flex flex-col  border-b-gray-100">
          {data.length > 0 && !isValid ? (
            <div>
              <div className="p-5 space-y-4">
                {data.slice(0, len).map((asset: NowTrendingData, i: number) => (
                  <li
                    onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
                    key={i}
                    className="flex justify-between"
                  >
                    <div className="flex shrink-0 space-x-5 items-center">
                      <Image
                        unoptimized
                        quality={100}
                        className="w-[36px] h-[36px]"
                        src={
                          `/images/logos/${asset.ITEM_CD_DL}.png` ||
                          "/images/logos/errorLogo.png"
                        }
                        width={36}
                        height={36}
                        alt="logo"
                        onError={(event) =>
                          handleImageError(event, asset.HR_ITEM_NM)
                        }
                      />

                      <div className="flex flex-col space-y-0.5">
                        <p className="font-semibold w-[100px] truncate">
                          {router.locale === "ko"
                            ? asset.ITEM_KR_NM && asset.ITEM_KR_NM
                            : asset.ITEM_ENG_NM && asset.ITEM_ENG_NM}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-500 text-xs">
                            {asset.ITEM_CD_DL && asset.ITEM_CD_DL}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <h2
                        className={
                          asset.ADJ_CLOSE_KRW > 100000
                            ? "text-sm truncate "
                            : asset.ADJ_CLOSE_KRW > 100000
                            ? "text-xs truncate "
                            : `text-md `
                        }
                      >
                        {asset.CAT && asset.CAT !== "Index"
                          ? router.locale === "ko"
                            ? asset.ADJ_CLOSE_KRW &&
                              asset.ADJ_CLOSE_KRW.toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }) + " 원"
                            : asset.ADJ_CLOSE_USD &&
                              asset.ADJ_CLOSE_USD.toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }) + " ＄"
                          : asset.ADJ_CLOSE &&
                            asset.ADJ_CLOSE.toLocaleString("en-us", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            })}
                      </h2>
                      {asset.ADJ_CLOSE_CHG && asset.ADJ_CLOSE_CHG > 0 ? (
                        <div
                          className={`flex items-center text-xs font-semibold  ${
                            asset.ADJ_CLOSE_KRW > 10000000 ? "pt-1 " : ` `
                          } `}
                        >
                          <RiArrowUpSFill color={"red"} />
                          <p className={"text-red-500 mr-1"}>
                            {asset.ADJ_CLOSE_CHANGE &&
                              asset.ADJ_CLOSE_CHANGE.toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              })}
                          </p>
                          <p className={"text-red-500"}>
                            {asset.ADJ_CLOSE_CHG &&
                              "(" +
                                asset.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }) +
                                " %" +
                                ")"}
                          </p>
                        </div>
                      ) : (
                        <div
                          onClick={() =>
                            router.push(`/detail/${asset.ITEM_CD_DL}`)
                          }
                          className="flex items-center text-xs font-semibold"
                        >
                          <RiArrowDownSFill color={"blue"} />
                          <p className={"text-blue-500 mr-1"}>
                            {asset.ADJ_CLOSE_CHANGE &&
                              asset.ADJ_CLOSE_CHANGE.toLocaleString("en-us", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              })}
                          </p>
                          <p className={"text-blue-500"}>
                            {asset.ADJ_CLOSE_CHG &&
                              "(" +
                                asset.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }) +
                                " %" +
                                ")"}
                          </p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </div>
              {data.length >= len && (
                <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                  <div
                    onClick={() => handleLoadMore(count, data)}
                    className={"flex justify-center items-center py-3"}
                  >
                    더 보기
                  </div>
                </div>
              )}
              <div className="text-sm h-[5px] py-1.5 px-7 text-gray-500 bg-gray-100 flex justify-between items-center"></div>
            </div>
          ) : !isValid && data.length === 0 ? (
            <div className="py-10 flex justify-center items-center">
              해당되는 자산이 존재하지 않습니다
            </div>
          ) : (
            <Loading />
          )}
        </ul>
      </div>
    </div>
  );
}

export default SearchTable;
