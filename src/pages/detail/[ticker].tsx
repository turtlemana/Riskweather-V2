import { NextPage } from "next";
import WebComponent from "components/pages/w/Detail";
import MobileComponent from "components/pages/m/Detail";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import {
  DetailData,
  DetailInfo,
  CandleChartInterface,
} from "interfaces/detail";

interface Props {
  isMobile: boolean;
  detailData: DetailData;
  candleChart: CandleChartInterface[];
  detailInfo?: DetailInfo;
  isItemCD_DLPresent: boolean;
  aiResult: any;
}

const Detail: NextPage<Props> = ({
  isMobile,
  detailInfo,
  detailData,
  candleChart,
  isItemCD_DLPresent,
  aiResult,
}) => {
  function isEveryOtherPropertyNull(object: any) {
    const { ITEM_ENG_NM, ITEM_CD, ITEM_CD_DL, ...rest } = object;
    return Object.values(rest).every((value) => value === null);
  }
  const result = isEveryOtherPropertyNull(detailInfo);
  console.log(result);

  return isMobile ? (
    <MobileComponent
      aiResult={aiResult}
      detailInfo={detailInfo}
      detailData={detailData}
      candleChart={candleChart}
      isItemCD_DLPresent={isItemCD_DLPresent}
    />
  ) : (
    <WebComponent
      aiResult={aiResult}
      detailInfo={detailInfo}
      detailData={detailData}
      candleChart={candleChart}
      isItemCD_DLPresent={isItemCD_DLPresent}
    />
  );
};

export default Detail;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let locale = context.locale || context.defaultLocale || "ko";

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/detail/${context.query.ticker}`
  );
  const detailDat = await res.json();

  const res3 = await fetch(
    `${process.env.NEXTAUTH_URL}/api/detailInfo?ticker=${context.query.ticker}`
  );
  const detailInf = await res3.json();

  const res6 = await fetch(
    `${process.env.NEXTAUTH_URL}/api/candleChart?ticker=${context.query.ticker}`,
    { headers: { Accept: "application/json" } }
  );
  const candleCharts = await res6.json();

  const res2 = await fetch(`${process.env.NEXTAUTH_URL}/api/realTimeRisk`);
  const realTimeRiskData = await res2.json();

  let isItemCD_DLPresent;
  if (
    realTimeRiskData &&
    detailDat &&
    realTimeRiskData.length > 0 &&
    detailDat.length > 0
  ) {
    isItemCD_DLPresent = detailDat.some((detailItem: any) =>
      realTimeRiskData.some(
        (realTimeItem: any) => realTimeItem.ITEM_CD_DL === detailItem.ITEM_CD_DL
      )
    );
  }

  const detailData = detailDat[0];
  const aiResult = detailDat[1] ? detailDat[1] : [];

  const detailInfo = detailInf[0];

  const candleChart = JSON.parse(candleCharts[0].CHART);
  return {
    props: {
      detailData,
      candleChart,
      detailInfo,
      isItemCD_DLPresent,
      aiResult,
      ...(await serverSideTranslations(locale, ["detail"])),
    },
  };
}
