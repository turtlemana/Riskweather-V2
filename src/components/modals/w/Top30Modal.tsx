import React, { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import Loading from "components/organisms/m/Loading";
import { NowTrendingData } from "interfaces/main";
import useHandleImageError from "utils/useHandleImageError";
import CardChart from "chart/CardChart";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import Lottie from "lottie-react";
import liveRisk from "../../../../public/lottie/liveRisk.json";

function Top30Modal({
  setIsRiskModalOpen,
}: {
  setIsRiskModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleImageError = useHandleImageError();

  const router = useRouter();
  const [type, setType] = useState("Korea (South)");
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    `/api/realTimeRisk`,
    fetcher
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];

  const parsedChartData = (asset: any) => {
    return (
      asset.CHART_5MIN &&
      JSON.parse(asset.CHART_5MIN).map((entry: any) => ({
        x: entry.TIME,
        cvar: entry.EXP_CVaRNTS,
      }))
    );
  };
  return (
    <main className="z-30 fixed pb-[150px] slim-scroll  bg-white top-20 w-full  max-w-[800px] h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-8">
        <div className="min-w-[360px] max-w-[800px] px-5 py-3 flex justify-between items-center">
          <Image
            className="cursor-pointer"
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => setIsRiskModalOpen(false)}
          />
          {/* <h1 className="text-md">실시간 리스크 TOP 30</h1> */}
          <div></div>
        </div>

        <div className="px-5 flex flex-col justify-center space-y-2">
          <p className="text-lg font-semibold">실시간 리스크 TOP 30</p>
          <p className="text-sm text-gray-500">
            순간적인 리스크 상승으로 가격 하락이 예상되는 자산
          </p>
          <p className="text-xs text-gray-400">5분마다 업데이트</p>
        </div>
        <div className="flex flex-col ">
          {/* <div className="flex space-x-3 px-12  font-semibold justify-between ">
            <div className="flex flex-col">
              <div
                className={`${
                  type === "Korea (South)" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => setType("Korea (South)")}
              >
                국내주식
              </div>
              {type === "Korea (South)" && (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-20px]"} />
              )}
            </div>

            <div className="flex flex-col ">
              <div
                className={`${
                  type === "United States" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => setType("United States")}
              >
                해외주식
              </div>
              {type === "United States" && (
                <hr
                  className={"border-b-2 border-b-black mt-1.5 mx-[-20px] "}
                />
              )}
            </div>
            <div className="flex flex-col ">
              <div
                className={`${
                  type === "Crypto" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => setType("Crypto")}
              >
                가상자산
              </div>
              {type === "Crypto" && (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-20px]"} />
              )}
            </div>
          </div> */}
          <div className="">
            <div className="text-sm  py-2 px-7 text-gray-500 bg-gray-100 flex justify-between items-center">
              <p>자산정보</p>
              <p>실시간 리스크 차트</p>
            </div>
            <ul className=" overflow-y-auto flex flex-col border border-b-gray-100">
              {data.length > 0 && !isValid ? (
                <div>
                  <div className="p-5 space-y-4">
                    {data.map((asset: any, i: number) => (
                      <li
                        onClick={() =>
                          router.push(`/detail/${asset.ITEM_CD_DL}`)
                        }
                        key={i}
                        className="flex justify-between cursor-pointer"
                      >
                        <div className="flex shrink-0 space-x-5 items-center">
                          {/* <Image
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
                          /> */}
                          <p>{i + 1}</p>

                          <div className="flex flex-col space-y-0.5">
                            <p className="text-sm text-gray-800 truncate w-[100px] font-semibold">
                              {router.locale === "ko"
                                ? asset.ITEM_KR_NM
                                : asset.ITEM_ENG_NM}
                            </p>
                            <h2
                              className={
                                asset.CUR_PRICE > 10000000
                                  ? "text-sm "
                                  : `text-md `
                              }
                            >
                              {asset.CAT && asset.CAT !== "Index"
                                ? router.locale === "ko"
                                  ? asset.CUR_PRICE &&
                                    asset.CUR_PRICE.toLocaleString("en-us", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }) + " 원"
                                  : asset.CUR_PRICE &&
                                    asset.CUR_PRICE.toLocaleString("en-us", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                    }) + " ＄"
                                : asset.CUR_PRICE &&
                                  asset.CUR_PRICE.toLocaleString("en-us", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  })}
                            </h2>
                            {asset.PRICE_CHG_PER && asset.PRICE_CHG_PER > 0 ? (
                              <div
                                className={`flex space-x-1 font-semibold items-center text-xs ${
                                  asset.CUR_PRICE > 10000000 ? "pt-1 " : ` `
                                } `}
                              >
                                <RiArrowUpSFill color={"red"} />
                                <p className={"text-red-500"}>
                                  {asset.PRICE_CHG_KRW &&
                                    asset.PRICE_CHG_KRW.toLocaleString(
                                      "en-us",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }
                                    )}
                                </p>
                                <p className={"text-red-500"}>
                                  {asset.PRICE_CHG_PER &&
                                    "(" +
                                      asset.PRICE_CHG_PER.toLocaleString(
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
                              <div className="flex space-x-1 font-semibold items-center text-xs">
                                <RiArrowDownSFill color={"blue"} />
                                <p className={"text-blue-500"}>
                                  {asset.PRICE_CHG_KRW &&
                                    asset.PRICE_CHG_KRW.toLocaleString(
                                      "en-us",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }
                                    )}
                                </p>
                                <p className={"text-blue-500"}>
                                  {asset.PRICE_CHG_PER &&
                                    "(" +
                                      asset.PRICE_CHG_PER.toLocaleString(
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
                            )}
                          </div>
                        </div>

                        <div className="text-xs flex flex-col  justify-center space-y-1">
                          <p className="text-gray-500 text-xs">리스크 차트</p>
                          <CardChart chartData={parsedChartData(asset)} />

                          <div className="flex items-center space-x-1">
                            <Lottie
                              animationData={liveRisk}
                              renderer="svg"
                              autoplay
                              loop
                              style={{ width: 7, height: 7 }}
                            />
                            <p>현재</p>
                            <p>
                              {asset.EXP_CVaRNTS_95 &&
                                asset.EXP_CVaRNTS_95.toLocaleString("en-us", {
                                  miminumFractionDigits: 2,
                                  maxinumFractionDigits: 5,
                                })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </div>
                  {/* <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                    <div
                      onClick={() => router.push("/search")}
                      className={"flex justify-center items-center py-3"}
                    >
                      더 보기
                    </div>
                  </div> */}
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
      </div>
    </main>
  );
}

export default Top30Modal;
