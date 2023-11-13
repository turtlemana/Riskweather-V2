import React, { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { NowTrendingData } from "interfaces/main";
import Loading from "./Loading";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";

interface Props {
  data: NowTrendingData[];
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  isValid: boolean;
}

function AssetTable({ data, type, setType, isValid }: Props) {
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
          <p>자산명</p>
          <p>평가금액</p>
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
                        src={`/images/icons/logos/${asset.ITEM_CD_DL}.png`}
                        width={36}
                        height={36}
                        alt="star"
                      />
                      <div className="flex flex-col space-y-0.5">
                        <p className="font-semibold">
                          {router.locale === "ko"
                            ? asset.ITEM_KR_NM && asset.ITEM_KR_NM
                            : asset.ITEM_ENG_NM && asset.ITEM_ENG_NM}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-500 ">100주</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <h2
                        className={
                          asset.ADJ_CLOSE_KRW > 10000000
                            ? "text-sm "
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
                        <div className="flex items-center text-xs">
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
          ) : (
            <Loading />
          )}
        </ul>
      </div>
    </div>
  );
}

export default AssetTable;
