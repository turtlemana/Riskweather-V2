import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import { NextPage } from "next";
import WebComponent from "components/pages/w/Main";
import MobileComponent from "components/pages/m/Main";
import { NowTrendingData } from "interfaces/main";

interface Props {
  isMobile: boolean;
  trendingData: NowTrendingData[];
  countryRiskData: NowTrendingData[];
}

const Main: NextPage<Props> = ({ isMobile, countryRiskData, trendingData }) => {
  return isMobile ? (
    <MobileComponent
      trendingData={trendingData}
      countryRiskData={countryRiskData}
    />
  ) : (
    <WebComponent
      trendingData={trendingData}
      countryRiskData={countryRiskData}
    />
  );
};
export default Main;

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/realTimeRisk`);
  const trendingData = await res.json();
  const res2 = await fetch(`${process.env.NEXTAUTH_URL}/api/countryRisk`);
  const countryRiskData = await res2.json();

  return {
    props: {
      trendingData,
      countryRiskData,
      ...(await serverSideTranslations(locale as string, ["index"])),
    },
  };
}
