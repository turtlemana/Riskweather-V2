import { NextPage } from "next";
import WebComponent from "components/pages/w/login/Main";
import MobileComponent from "components/pages/m/login/Main";
import { getProviders } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import { Providers } from "interfaces/login";

interface Props {
  isMobile: boolean;
  providers: Providers;
}

const Main: NextPage<Props> = ({ isMobile, providers }) => {
  return isMobile ? (
    <MobileComponent providers={providers} />
  ) : (
    <WebComponent providers={providers} />
  );
};

export default Main;

export async function getServerSideProps({
  locale = "ko",
}: GetServerSidePropsContext) {
  const providers = await getProviders();
  return {
    props: {
      providers,
      ...(await serverSideTranslations(locale as string, ["login"])),
    },
  };
}
