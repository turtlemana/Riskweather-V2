import React, { useState, Dispatch, SetStateAction } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import Loading from "components/organisms/m/Loading";
import { NowTrendingData } from "interfaces/main";
import useHandleImageError from "utils/useHandleImageError";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";

function RiskModal({
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
  const [type, setType] = useState("All");
  const router = useRouter();
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    `/api/indexRisk?type=${type}`,
    fetcher
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];
  return (
    <main className="z-30 fixed  pb-[150px] slim-scroll  bg-white top-16 w-full  max-w-[800px] h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-8">
        <div className="px-5 py-3 flex justify-between items-center">
          <Image
            className="cursor-pointer"
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => setIsRiskModalOpen(false)}
          />
          <h1 className="text-md">실시간 리스크</h1>
          <div></div>
        </div>

        <div className="px-5 flex flex-col justify-center space-y-2">
          <p className="text-lg font-semibold">국가별 리스크 트렌드</p>
          <p className="text-sm text-gray-500">
            리스크가 상승하면 안전 자산의 가격도 하락할 수 있어요
          </p>
        </div>

        <div className="flex flex-col ">
          <div className="">
            <div className="flex space-x-5 px-5  font-semibold">
              <div className="flex flex-col ">
                <div
                  className={`${
                    type === "All" ? "text-black " : "text-gray-400 "
                  }`}
                  onClick={() => setType("All")}
                >
                  세계지수
                </div>
                {type === "All" && (
                  <hr className={"border-b-2 border-b-black mt-1.5"} />
                )}
              </div>

              <div className="flex flex-col ">
                <div
                  className={`${
                    type === "Korea (South)" ? "text-black " : "text-gray-400 "
                  }`}
                  onClick={() => setType("Korea (South)")}
                >
                  {router.locale === "ko" ? "한국" : "KR"}
                </div>
                {type === "Korea (South)" && (
                  <hr className={"border-b-2 border-b-black mt-1.5"} />
                )}
              </div>
              <div className="flex flex-col ">
                <div
                  className={`${
                    type === "United States" ? "text-black " : "text-gray-400 "
                  }`}
                  onClick={() => setType("United States")}
                >
                  {router.locale === "ko" ? "미국" : "US"}
                </div>
                {type === "United States" && (
                  <hr className={"border-b-2 border-b-black mt-1.5 "} />
                )}
              </div>
              <div className="flex flex-col ">
                <div
                  className={`${
                    type === "Japan" ? "text-black " : "text-gray-400 "
                  }`}
                  onClick={() => setType("Japan")}
                >
                  {router.locale === "ko" ? "일본" : "JP"}
                </div>
                {type === "Japan" && (
                  <hr className={"border-b-2 border-b-black mt-1.5 "} />
                )}
              </div>
              {/* <div className="flex flex-col ">
                <div
                  className={`${
                    type === "China" ? "text-black " : "text-gray-400 "
                  }`}
                  onClick={() => setType("China")}
                >
                  {router.locale === "ko" ? "중국" : "CN"}
                </div>
                {type === "China" && (
                  <hr className={"border-b-2 border-b-black mt-1.5 "} />
                )}
              </div> */}
              <div className="flex flex-col ">
                <div
                  className={`${
                    type === "else" ? "text-black " : "text-gray-400 "
                  }`}
                  onClick={() => setType("else")}
                >
                  {router.locale === "ko" ? "기타" : "Else"}
                </div>
                {type === "else" && (
                  <hr className={"border-b-2 border-b-black mt-1.5 "} />
                )}
              </div>
            </div>

            <div className="text-sm  py-2 px-7 text-gray-500 bg-gray-100 flex justify-between items-center">
              <p>자산정보</p>
              <p>상승 정도</p>
            </div>
            <ul className=" overflow-y-auto flex flex-col border border-b-gray-100">
              {data.length > 0 && !isValid ? (
                <div>
                  <div className="p-5 space-y-4">
                    {data.map((asset: NowTrendingData, i: number) => (
                      <li
                        onClick={() =>
                          router.push(`/detail/${asset.ITEM_CD_DL}`)
                        }
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
                            <p className="font-semibold">
                              {router.locale === "ko"
                                ? asset.ITEM_KR_NM && asset.ITEM_KR_NM
                                : asset.ITEM_ENG_NM && asset.ITEM_ENG_NM}
                            </p>
                            <div className="flex items-center space-x-2">
                              <p className="text-gray-500 text-sm">
                                {asset.ADJ_CLOSE &&
                                  asset.ADJ_CLOSE.toLocaleString("en-us", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  })}

                                {/* {router.locale === "ko"
                                  ? asset.ADJ_CLOSE_KRW &&
                                    asset.ADJ_CLOSE_KRW.toLocaleString(
                                      "en-us",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }
                                    ) + "원"
                                  : asset.ADJ_CLOSE_USD &&
                                    asset.ADJ_CLOSE_USD.toLocaleString(
                                      "en-us",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                      }
                                    ) + "＄"} */}
                              </p>
                              {asset.ADJ_CLOSE_CHG &&
                              asset.ADJ_CLOSE_CHG > 0 ? (
                                <div
                                  className={`flex items-center text-xs font-semibold  ${
                                    asset.ADJ_CLOSE_KRW > 10000000
                                      ? "pt-1 "
                                      : ` `
                                  } `}
                                >
                                  <RiArrowUpSFill color={"red"} />
                                  <p className={"text-red-500 mr-1"}>
                                    {asset.ADJ_CLOSE_CHANGE &&
                                      asset.ADJ_CLOSE_CHANGE.toLocaleString(
                                        "en-us",
                                        {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                  </p>
                                  <p className={"text-red-500"}>
                                    {asset.ADJ_CLOSE_CHG &&
                                      "(" +
                                        asset.ADJ_CLOSE_CHG.toLocaleString(
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
                                <div
                                  onClick={() =>
                                    router.push(`/detail/${asset.ITEM_CD_DL}`)
                                  }
                                  className="flex items-center text-xs font-semibold"
                                >
                                  <RiArrowDownSFill color={"blue"} />
                                  <p className={"text-blue-500 mr-1"}>
                                    {asset.ADJ_CLOSE_CHANGE &&
                                      asset.ADJ_CLOSE_CHANGE.toLocaleString(
                                        "en-us",
                                        {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                  </p>
                                  <p className={"text-blue-500"}>
                                    {asset.ADJ_CLOSE_CHG &&
                                      "(" +
                                        asset.ADJ_CLOSE_CHG.toLocaleString(
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
                        </div>

                        <div className="w-[120px]  truncate flex  justify-center items-center space-x-1">
                          <Image
                            src={`/images/weather/${asset.WTHR_ENG_NM}.svg`}
                            width={28}
                            height={28}
                            alt={`weather`}
                          />
                          <p className="text-xs">
                            {router.locale === "ko"
                              ? asset.WTHR_KR_DL && asset.WTHR_KR_DL
                              : asset.WTHR_ENG_DL && asset.WTHR_ENG_DL}
                          </p>
                        </div>
                      </li>
                    ))}
                  </div>
                  {/* <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                    <div
                      onClick={() => router.push("/explore")}
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

export default RiskModal;
