import { GlobalProvider } from "contexts/SearchContext";
import { SignUpProvider } from "contexts/SignUpContext";
import { PortfolioProvider } from "contexts/PortfolioContext";
import "styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import type { AppContext, AppProps } from "next/app";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPropsContext } from "next";
import "react-tooltip/dist/react-tooltip.css";
import UAParser from "ua-parser-js";
import { Tooltip } from "react-tooltip";
import Layout from "components/layouts/Layout";
import { NextPage } from "next";

function App({ Component, pageProps }: AppProps & { Component: NextPage }) {
  const router = useRouter();

  return (
    <GlobalProvider>
      <PortfolioProvider>
        <SignUpProvider>
          <Layout {...pageProps}>
            <Component {...pageProps} />
            <ToastContainer />
            <Tooltip
              id="riskLevel"
              style={{ zIndex: 289, fontSize: "small", fontWeight: "bold" }}
            />
            <Tooltip
              id="riskIndexExplain"
              style={{
                zIndex: 289,
                fontSize: "small",
                fontWeight: "bold",
                backgroundColor: "transparent",
              }}
            >
              <Image
                src={
                  router.locale == "ko"
                    ? "/images/explain/RiskIndexExplain.svg"
                    : "/images/explain/RiskIndexExplainEng.svg"
                }
                alt=""
                width={350}
                height={150}
              />
            </Tooltip>
            <Tooltip
              id="traitExplain"
              style={{
                zIndex: 289,
                fontSize: "small",
                fontWeight: "bold",
                backgroundColor: "transparent",
              }}
            >
              <Image
                src={
                  router.locale == "ko"
                    ? "/images/traits/explanationKr.svg"
                    : "/images/traits/explanation.svg"
                }
                alt=""
                width={350}
                height={150}
              />
            </Tooltip>
          </Layout>
        </SignUpProvider>
      </PortfolioProvider>
    </GlobalProvider>
  );
}

const AppWithI18n = appWithTranslation(App);

const AppWithAuth = (props: AppProps) => (
  <>
    <SessionProvider session={props.pageProps.session}>
      <AppWithI18n {...props} />
    </SessionProvider>
  </>
);

AppWithAuth.getInitialProps = async ({ ctx }: AppContext) => {
  const userAgent: string | undefined = ctx.req
    ? ctx.req.headers["user-agent"]
    : navigator.userAgent;

  const parser = new UAParser();
  let isMobile = false;

  if (userAgent) {
    const result = parser.setUA(userAgent).getResult();
    isMobile = result.device && result.device.type === "mobile";
  }
  // const result = parser.setUA(userAgent).getResult();
  // const isMobile = result.device && result.device.type === 'mobile';
  // const isMobi = userAgent?.indexOf("Mobi") !== -1;
  // const isMobi = Boolean(userAgent?.match(
  //   /Android|BlackBerry|iPhone|Galaxy|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
  // ) );
  // const width = typeof window !== 'undefined' ? window.innerWidth : screen.width;
  // const isMobileWidth = width !== null && width < 1180;
  // const isMobile = isMobi ;

  return { pageProps: { isMobile } };
};

export default AppWithAuth;

export async function getStaticProps(
  ctx: GetStaticPropsContext,
  { locale = "ko" }: GetStaticPropsContext
) {
  return {
    props: { ...(await serverSideTranslations(locale as string, ["common"])) },
  };
}
