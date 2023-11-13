import { GetServerSidePropsContext, NextPage } from "next";
import WebComponent from "components/pages/w/Portfolio";
import MobileComponent from "components/pages/m/Portfolio";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Session } from "interfaces/login";

interface Props {
  isMobile: boolean;
  session: Session;
}

const Portfolio: NextPage<Props> = ({ isMobile, session }) => {
  return isMobile ? (
    <MobileComponent session={session} />
  ) : (
    <WebComponent session={session} />
  );
};

export default Portfolio;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let locale = ctx.locale || ctx.defaultLocale;
  const session: Session | null = await getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  //   if (session && session.user.accessLevel == 1) {
  //     return {
  //       redirect: {
  //         destination: `${process.env.NEXTAUTH_URL}/${locale}/login/assets`,
  //         permanent: false,
  //       },
  //     };
  //   }

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: `${process.env.NEXTAUTH_URL}/${locale}/login`,
  //       permanent: false,
  //     },
  //   };
  // }
  return {
    props: {
      session,
      ...(await serverSideTranslations(locale as string, ["portfolio"])),
    },
  };
}
