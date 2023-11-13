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
  const [slice, setSlice] = useState(20);

  const router = useRouter();
  const [type, setType] = useState("Korea (South)");
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    `/api/ExplodeAssets?type=${type}`,
    fetcher
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];
  return (
    <main className="z-10000 fixed   bg-white left-0 top-0 w-full h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-8">
        <div className="px-5 py-3 flex justify-between items-center">
          <Image
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => setIsRiskModalOpen(false)}
          />
          <h1 className="text-md"></h1>
          <div></div>
        </div>

        <div className="px-5  flex flex-col justify-center space-y-2">
          <p className="text-xl font-bold">일간 리스크 특보</p>
          <p className="text-sm text-gray-500">
            리스크의 큰 상승으로 향후 가격 하락이 예상되는
          </p>
          <p className="text-xs text-gray-400">
            {"오늘"}{" "}
            {data &&
              data.length > 0 &&
              (data[0] as any).BASE_DT.split("T")[1].split(".")[0]}
            기준
          </p>
        </div>
        <div className="flex flex-col ">
          <div className="flex space-x-3 px-12  font-semibold justify-between ">
            <div className="flex flex-col">
              <div
                className={`${
                  type === "Korea (South)" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => {
                  setType("Korea (South)");
                  setSlice(20);
                }}
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
                onClick={() => {
                  setType("United States");
                  setSlice(20);
                }}
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
                onClick={() => {
                  setType("Crypto");
                  setSlice(20);
                }}
              >
                가상자산
              </div>
              {type === "Crypto" && (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-20px]"} />
              )}
            </div>
          </div>
          <div className="">
            <div className="text-sm  py-2 px-7 text-gray-500 bg-gray-100 flex justify-between items-center">
              <p>자산정보</p>
              <p>상승 정도</p>
            </div>
            <ul className="pb-[171px] overflow-y-auto flex flex-col border border-b-gray-100">
              {data.length > 0 && !isValid ? (
                <div>
                  <div className="p-5 space-y-4">
                    {data
                      .slice(0, slice)
                      .map((asset: NowTrendingData, i: number) => (
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
                                  {router.locale === "ko"
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
                                      ) + "＄"}
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
                  {slice < 100 && slice % 10 === 0 && (
                    <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                      <div
                        onClick={() => {
                          const currentScrollPosition = window.scrollY;

                          if (slice < 100) {
                            setSlice((prev) => prev + 20);
                          }

                          requestAnimationFrame(() => {
                            window.scrollTo(0, currentScrollPosition);
                          });
                        }}
                        className={"flex justify-center items-center py-3"}
                      >
                        더 보기
                      </div>
                    </div>
                  )}
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
