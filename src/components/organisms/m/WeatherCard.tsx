import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";

function TodayCard({ asset }: any) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
      className="cursor-pointer flex-shrink-0 w-[146px] h-[144px] justify-center bg-gray-100 flex flex-col rounded-xl p-3 space-y-1"
    >
      {/* <div className="flex flex-shrink-0 space-x-2 justify-center items-center">
        <Image
          className={"w-[30px] h-[30px] object-fit"}
          src={`/images/logos/${asset.ITEM_CD_DL}.png`}
          alt="logo"
          width={30}
          height={30}
        />
        <p
          className={`text-sm font-semibold ${
            asset.CVaR_LV_KR &&
            (asset.CVaR_LV_KR === "위험" || asset.CVaR_LV_KR === "매우 위험"
              ? "text-red-500 "
              : asset.CVaR_LV_KR === "적정"
              ? "text-orange-300 "
              : asset.CVaR_LV_KR === "안전"
              ? "text-green-500 "
              : "text-gray-800 ")
          } truncate w-[100px]`}
        >
          {router.locale === "ko" ? asset.CVaR_LV_KR : asset.CVaR_LV}
        </p>
      </div> */}
      <p className="text-sm text-gray-800 truncate w-[100px] font-semibold">
        {router.locale === "ko" ? asset.ITEM_KR_NM : asset.ITEM_ENG_NM}
      </p>
      <h2 className={asset.ADJ_CLOSE_KRW > 10000000 ? "text-sm " : `text-md `}>
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
          className={`flex font-semibold items-center text-xs ${
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
          onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
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
      <div className="space-y-1">
        <hr className="mt-1" />

        <div className="text-xs flex  justify-center items-center space-y-1 space-x-1">
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
      </div>
    </div>
  );
}

export default TodayCard;
