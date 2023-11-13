import React, { useState, useMemo } from "react";
import Header from "components/templates/w/detail/Header";
import RiskAnalysis from "components/templates/w/detail/RiskAnalysis";
import dynamic from "next/dynamic";
import AssetInfo from "components/templates/w/detail/AssetInfo";
import { DetailInfo, DetailData } from "interfaces/detail";
import Loading from "components/organisms/w/Loading";
const DynamicChart: React.FC<any> = dynamic(
  () => import("components/templates/w/detail/DetailChart"),
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
    <main className=" max-w-[800px] min-w-[360px] h-auto">
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
