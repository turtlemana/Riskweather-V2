import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import CardChart from "chart/CardChart";
import Lottie from "lottie-react";
import liveRisk from "../../../../public/lottie/liveRisk.json";

function MainCard({ asset }: any) {
  const router = useRouter();

  const parsedChartData =
    asset.CHART_5MIN &&
    JSON.parse(asset.CHART_5MIN).map((entry: any) => ({
      x: entry.TIME,
      cvar: entry.EXP_CVaRNTS,
    }));
  return (
    <div
      onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
      className="cursor-pointer flex-shrink-0 w-[160px] h-[188px] justify-center bg-gray-100 flex flex-col rounded-xl p-3 space-y-1"
    >
      <p className="text-sm text-gray-800 truncate w-[100px] font-semibold">
        {router.locale === "ko" ? asset.ITEM_KR_NM : asset.ITEM_ENG_NM}
      </p>
      <h2 className={asset.CUR_PRICE > 10000000 ? "text-sm " : `text-md `}>
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
              asset.PRICE_CHG_KRW.toLocaleString("en-us", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
          </p>
          <p className={"text-red-500"}>
            {asset.PRICE_CHG_PER &&
              "(" +
                asset.PRICE_CHG_PER.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }) +
                " %" +
                ")"}
          </p>
        </div>
      ) : (
        <div className="flex space-x-1 font-semibold items-center text-xs">
          <RiArrowDownSFill color={"blue"} />
          <p className={"text-blue-500"}>
            {asset.PRICE_CHG_KRW &&
              asset.PRICE_CHG_KRW.toLocaleString("en-us", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
          </p>
          <p className={"text-blue-500"}>
            {asset.PRICE_CHG_PER &&
              "(" +
                asset.PRICE_CHG_PER.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }) +
                " %" +
                ")"}
          </p>
        </div>
      )}
      <div className="space-y-1 pt-2">
        <div className="text-xs flex flex-col  justify-center space-y-0.5">
          <p className="text-gray-500 text-xs">리스크 차트</p>
          <CardChart chartData={parsedChartData} />

          <div className="flex items-center space-x-1 pt-1">
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
      </div>
    </div>
  );
}

export default MainCard;
