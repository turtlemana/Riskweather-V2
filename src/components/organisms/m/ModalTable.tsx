import React from "react";
import Image from "next/image";
import { NowTrendingData } from "interfaces/main";
import { useRouter } from "next/router";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import useHandleImageError from "utils/useHandleImageError";
import Loading from "./Loading";

function ModalTable({
  data,
  isValid,
  state,
  theme,
  count,
  handleLoadMore,
}: {
  data: NowTrendingData[];
  isValid: boolean;
  state: number;
  theme: string;
  count: string;
  handleLoadMore: any;
}) {
  const handleImageError = useHandleImageError();
  const router = useRouter();
  return (
    <ul className=" overflow-y-auto flex flex-col  border-b-gray-100">
      {data.length > 0 && !isValid ? (
        <div>
          <div className="p-5 space-y-4">
            <p className="text-xl font-semibold  pb-4">{theme}</p>
            {data.slice(0, state).map((asset: NowTrendingData, i: number) => (
              <li
                onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
                key={i}
                className="flex justify-between cursor-pointer"
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
                      className={`flex items-center text-xs ${
                        asset.ADJ_CLOSE_KRW > 10000000 ? "pt-1 " : ` `
                      } `}
                    >
                      <RiArrowUpSFill color={"red"} />
                      <p className={"text-red-500 font-semibold"}>
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
                      <p className={"text-blue-500 font-semibold"}>
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
          <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full cursor-pointer">
            <div
              onClick={() => handleLoadMore(count, data)}
              className={"flex justify-center items-center py-3"}
            >
              더 보기
            </div>
          </div>
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
  );
}

export default ModalTable;
