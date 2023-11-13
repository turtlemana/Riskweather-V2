import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { NowTrendingData } from "interfaces/main";
import Loading from "./Loading";

interface Props {
  data: NowTrendingData[];
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  isValid: boolean;
}

function MiniTable({ data, type, setType, isValid }: Props) {
  const router = useRouter();
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
          <p>리스크 수준</p>
        </div>
        <ul className=" flex flex-col border border-b-gray-100">
          {data.length > 0 && !isValid ? (
            <div>
              <div className="p-5 space-y-4">
                {data.slice(0, 5).map((asset: NowTrendingData, i: number) => (
                  <li
                    onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
                    key={i}
                    className="flex justify-between"
                  >
                    <div className="flex space-x-3">
                      <Image
                        src="/images/icons/starGray.svg"
                        width={30}
                        height={30}
                        alt="star"
                      />
                      <div className="flex flex-col space-y-0.5">
                        <p className="font-semibold">
                          {router.locale === "ko"
                            ? asset.ITEM_KR_NM && asset.ITEM_KR_NM
                            : asset.ITEM_ENG_NM && asset.ITEM_ENG_NM}
                        </p>
                        <div className="flex items-center space-x-2">
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
                        </div>
                      </div>
                    </div>

                    <div className="w-[90px]  truncate flex flex-col justify-center items-center space-y-1">
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
              <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                <div
                  onClick={() => router.push("/search")}
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
    </div>
  );
}

export default MiniTable;
