import { NextPage } from "next";
import WebComponent from "components/pages/w/Setpw";
import MobileComponent from "components/pages/m/Setpw";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";

interface Props {
  isMobile: boolean;
}

const Main: NextPage<Props> = ({ isMobile }) => {
  return isMobile ? <MobileComponent /> : <WebComponent />;
};

export default Main;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let locale = context.locale || context.defaultLocale || "ko";

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/password?&USER_ID=${context.query.USER_ID}&AUTH_KEY=${context.query.AUTH_KEY}`
  );
  const checkValid = await res.json();
  if (checkValid.message) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale as string, ["login"])),
    },
  };
}
