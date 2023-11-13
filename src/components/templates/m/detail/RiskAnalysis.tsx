import React from "react";
import { DetailData } from "interfaces/detail";
import Image from "next/image";
import { useRouter } from "next/router";
import CVaRBarChart from "chart/MobileRiskBarChart";

function RiskAnalysis({
  detailData,
  aiResult,
}: {
  detailData: DetailData;
  aiResult: any;
}) {
  const router = useRouter();
  return (
    <main id="AI" className="mb-3 w-full bg-white">
      <div className="flex flex-col p-5 space-y-2">
        <div>
          <p className="font-semibold text-lg">{"리스크 비교"}</p>
        </div>
        <div>
          {detailData.CVaR_CHART && (
            <CVaRBarChart data={JSON.parse(detailData.CVaR_CHART)} />
          )}
        </div>
        <div className="rounded-xl space-y-3 flex flex-col bg-gray-100 w-auto h-auto p-3">
          <div className="  truncate flex space-x-1   items-center space-y-1">
            <Image
              src={`/images/weather/${detailData.WTHR_ENG_NM}.svg`}
              width={28}
              height={28}
              alt={`weather`}
            />
            <p className="text-sm font-semibold text-gray-500">
              {router.locale === "ko"
                ? detailData.WTHR_KR_DL && detailData.WTHR_KR_DL
                : detailData.WTHR_ENG_DL && detailData.WTHR_ENG_DL}
            </p>
          </div>{" "}
          <div className="flex flex-col space-y-3">
            <p className="whitespace text-xs font-sm w-[260px]">
              {aiResult && aiResult.WTHR_DSCP_KR.split("\\n")[0]}
            </p>
            <p className="whitespace text-xs font-sm w-[260px]">
              {aiResult && aiResult.WTHR_DSCP_KR.split("\\n")[1]}
            </p>
            {/* <p className="text-sm w-[260px]">
              {"지난 한 달의 추이에 비해 오늘의 리스크는 높은 편이지만"}
            </p> */}
            <div className="flex w-[260px] items-center ">
              <p className="text-xs  text-gray-400 ">{"Riskweather AI"}</p>
              <Image
                src="/images/icons/smallLightning.svg"
                width={6}
                height={7}
                alt="lightning"
                className="mb-1"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="px-2 py-1 text-sm  text-gray-500 border border-t-gray-100  w-full ">
        <div
          onClick={() => {}}
          className={"flex justify-center items-center py-3"}
        >
          {"AI 예측 자세히 보기"}
        </div>
      </div> */}
    </main>
  );
}

export default RiskAnalysis;
