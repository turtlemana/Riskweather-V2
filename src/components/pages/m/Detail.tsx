import React, { useState, useMemo } from "react";
import Header from "components/templates/m/detail/Header";
import RiskAnalysis from "components/templates/m/detail/RiskAnalysis";
import Chart from "components/templates/m/detail/DetailChart";
import dynamic from "next/dynamic";
import AssetInfo from "components/templates/m/detail/AssetInfo";
import { DetailInfo, DetailData } from "interfaces/detail";
import Loading from "components/organisms/m/Loading";
const DynamicChart: React.FC<any> = dynamic(
  () => import("components/templates/m/detail/DetailChart"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
) as any;

function Detail({
  detailInfo,
  detailData,
  candleChart,
  isItemCD_DLPresent,
  aiResult,
}: any) {
  const [type, setType] = useState("AI");
  function isEveryOtherPropertyNull(object: any) {
    const { ITEM_ENG_NM, ITEM_CD, ITEM_CD_DL, ...rest } = object;
    return Object.values(rest).every((value) => value === null);
  }
  const isNullDetailInfo = isEveryOtherPropertyNull(detailInfo);
  return (
    <main className="min-w-[360px] h-screen">
      <Header
        isNullDetailInfo={isNullDetailInfo}
        isItemCD_DLPresent={isItemCD_DLPresent}
        type={type}
        setType={setType}
        detailData={detailData}
        aiResult={aiResult}
      />
      {type === "AI" && (
        <RiskAnalysis detailData={detailData} aiResult={aiResult} />
      )}
      {(type === "AI" || type === "chart") && (
        <DynamicChart
          chartData={candleChart}
          cat={detailData.CAT && detailData.CAT}
        />
      )}{" "}
      {!isNullDetailInfo && (type === "AI" || type === "assetInfo") && (
        <AssetInfo
          type={type}
          setType={setType}
          cat={detailData.CAT && detailData.CAT}
          detailInfo={detailInfo}
        />
      )}
    </main>
  );
}

export default Detail;
