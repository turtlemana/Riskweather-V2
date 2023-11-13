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

function HighCVarModal({
  setIsModalOpen,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
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
  const [slice, setSlice] = useState(20);

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    `/api/cvarRankModal?type=${type}`,
    fetcher
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];
  return (
    <main className="z-50 fixed   bg-white left-0 top-0 w-full h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-8">
        <div className="px-5 py-3 flex justify-between items-center">
          <Image
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => setIsModalOpen(false)}
          />
          <h1 className="text-md"></h1>
          <div></div>
        </div>

        <div className="ml-3 px-5 flex flex-col justify-center space-y-2">
          <Image
            src="/images/icons/priceDown.svg"
            width={25}
            height={20}
            alt="priceDown"
          />
          <p className="text-lg font-semibold">오늘 크게 떨어질 수 있는 자산</p>
          <p className="text-sm text-gray-500">
            AI가 분석한 오늘 발생 가능한 최대 손실률
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
          <div className="text-sm w-screen py-2 px-7 text-gray-500 bg-gray-100 flex justify-between items-center">
            <p>종목명</p>
            <div className="flex items-center space-x-9">
              <p>현재가</p>
              <p>최대 하락 시</p>
            </div>
          </div>
          <ul className=" flex flex-col border border-b-gray-100">
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
                        <div className="flex space-x-3">
                          {/* {isAssetInterested(asset.ITEM_CD_DL) ? (
                        <Image
                          src={"/images/icons/starGold.svg"}
                          width={30}
                          height={30}
                          alt="star"
                        />
                      ) : (
                        <Image
                          src={"/images/icons/starGray.svg"}
                          width={30}
                          height={30}
                          alt="star"
                          onClick={() => {
                            handleStarClick(
                              asset.ITEM_CD_DL,
                              asset.ITEM_ENG_NM,
                              asset.ITEM_KR_NM
                            );
                          }}
                        />
                      )} */}
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
                            <p className="font-semibold truncate w-[100px]">
                              {router.locale === "ko"
                                ? asset.ITEM_KR_NM && asset.ITEM_KR_NM
                                : asset.ITEM_ENG_NM && asset.ITEM_ENG_NM}
                            </p>
                            {/* <div className="flex items-center space-x-2">
                          <p className="text-gray-500 ">
                            {router.locale === "ko"
                              ? asset.ADJ_CLOSE_KRW &&
                                asset.ADJ_CLOSE_KRW.toLocaleString("en-us", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }) + "원"
                              : asset.ADJ_CLOSE_USD &&
                                asset.ADJ_CLOSE_USD.toLocaleString("en-us", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }) + "＄"}
                          </p>
                          {asset.ADJ_CLOSE_CHG && asset.ADJ_CLOSE_CHG > 0 ? (
                            <p className="text-red-500 text-xs font-semibold ">
                              {"(" +
                                "+" +
                                asset.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) +
                                "%" +
                                ")"}
                            </p>
                          ) : (
                            <p className="text-blue-500 text-xs font-semibold">
                              {"(" +
                                asset.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) +
                                "%" +
                                ")"}
                            </p>
                          )}
                        </div> */}
                            <p className="text-gray-400 text-sm">
                              {asset.ITEM_CD_DL && asset.ITEM_CD_DL}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-5 items-center">
                          <div className="flex flex-col justify-center items-center truncate">
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
                                    asset.ADJ_CLOSE_KRW.toLocaleString(
                                      "en-us",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      }
                                    ) + " 원"
                                  : asset.ADJ_CLOSE_USD &&
                                    asset.ADJ_CLOSE_USD.toLocaleString(
                                      "en-us",
                                      {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                      }
                                    ) + " ＄"
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
                          <div
                            onClick={() =>
                              router.push(`/detail/${asset.ITEM_CD_DL}`)
                            }
                            className="w-[80] p-2 space-x-1 text-blue-500 bg-blue-100 rounded-lg font-semibold  truncate flex  justify-center items-center "
                          >
                            <Image
                              src={`/images/icons/priceDown.svg`}
                              width={16}
                              height={16}
                              alt={`CVaR`}
                            />
                            <p className="text-xs">
                              {asset.CVaRNTS &&
                                asset.CVaRNTS.toLocaleString("en-us", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }) + "%"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </div>
                {slice < 100 && (
                  <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                    <div
                      onClick={() => {
                        // 현재 스크롤 위치 저장
                        const currentScrollPosition = window.scrollY;

                        if (slice < 100) {
                          setSlice((prev) => prev + 20);
                        }

                        // 다음 렌더 사이클에서 스크롤 위치 복원
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
    </main>
  );
}

export default HighCVarModal;
