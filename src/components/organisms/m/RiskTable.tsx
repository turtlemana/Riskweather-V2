import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { NowTrendingData } from "interfaces/main";
import Loading from "./Loading";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";

import useHandleImageError from "utils/useHandleImageError";
import HighCVarModal from "components/modals/m/HighCVaRModal";

interface Props {
  data: NowTrendingData[];
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  isValid: boolean;
}

function RiskTable({ data, type, setType, isValid }: Props) {
  const router = useRouter();
  const handleImageError = useHandleImageError();
  const [isModalOpen, setIsModalOpen] = useState(false);

  //   const { data: session, status, update }: any = useSession();

  //   const handleStarClick = async (
  //     ITEM_CD_DL: string,
  //     ITEM_ENG_NM: string,
  //     ITEM_KR_NM: string
  //   ) => {
  //     if (!session || !session.user) {
  //       router.push("/login");
  //       return;
  //     } else {
  //       const enteredInput = {
  //         interest: {
  //           name: encodeURIComponent(ITEM_ENG_NM),
  //           krName: encodeURIComponent(ITEM_KR_NM),
  //           ticker: ITEM_CD_DL,
  //         },
  //       };

  //       const data = await fetch(`/api/auth/user?session=${session.user.email}`, {
  //         method: "PUT",
  //         headers: { "content-type": "application/json" },
  //         body: JSON.stringify({ enteredInput }),
  //       }).then((res) => {
  //         if (res.ok) {
  //           toast(
  //             router.locale == "ko"
  //               ? "관심 자산에 등록됐습니다"
  //               : "Successfully added",
  //             { hideProgressBar: true, autoClose: 2000, type: "success" }
  //           );
  //           update();
  //         } else {
  //           toast(
  //             router.locale == "ko"
  //               ? "관심 자산 등록에 실패했습니다"
  //               : "Fetch Error",
  //             { hideProgressBar: true, autoClose: 2000, type: "error" }
  //           );
  //         }
  //       });
  //     }
  //   };

  //   const isAssetInterested = (ITEM_CD_DL: string) => {
  //     if (session && session.user && session.user.interest) {
  //       return session.user.interest.includes(ITEM_CD_DL);
  //     }
  //     return false;
  //   };
  return (
    <div className="flex flex-col ">
      <div className="flex space-x-3 px-5  font-semibold">
        <div className="flex flex-col ">
          <div
            className={`${
              type === "Korea (South)" ? "text-black " : "text-gray-400 "
            }`}
            onClick={() => setType("Korea (South)")}
          >
            국내주식
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
            해외주식
          </div>
          {type === "United States" && (
            <hr className={"border-b-2 border-b-black mt-1.5"} />
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
            <hr className={"border-b-2 border-b-black mt-1.5 "} />
          )}
        </div>
      </div>
      <div>
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
                {data.slice(0, 10).map((asset: NowTrendingData, i: number) => (
                  <li
                    onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
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
                    <div className="flex space-x-5 items-center font-semibold">
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
                            className={`flex items-center text-xs ${
                              asset.ADJ_CLOSE_KRW > 10000000 ? "pt-1 " : ` `
                            } `}
                          >
                            <RiArrowUpSFill color={"red"} />
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
                            className="flex items-center text-xs"
                          >
                            <RiArrowDownSFill color={"blue"} />
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
              <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                <div
                  onClick={() => setIsModalOpen(true)}
                  className={"flex justify-center items-center py-3"}
                >
                  더 보기
                </div>
              </div>
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
      {isModalOpen && <HighCVarModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

export default RiskTable;
