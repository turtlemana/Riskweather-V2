import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import { NextPage } from "next";
import WebComponent from "components/pages/w/Search";
import MobileComponent from "components/pages/m/Search";
import { NowTrendingData } from "interfaces/main";

interface Props {
  isMobile: boolean;
}

const Main: NextPage<Props> = ({ isMobile }) => {
  return isMobile ? <MobileComponent /> : <WebComponent />;
};
export default Main;

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["index"])),
    },
  };
}
