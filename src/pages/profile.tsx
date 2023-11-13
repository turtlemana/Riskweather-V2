import { GetServerSidePropsContext, NextPage } from "next";
import WebComponent from "components/pages/w/Profile";
import MobileComponent from "components/pages/m/Profile";
import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Session } from "interfaces/login";

interface Props {
  isMobile: boolean;
  session: Session;
  showToleranceModal: boolean;
}

const Profile: NextPage<Props> = ({
  isMobile,
  session,
  showToleranceModal,
}) => {
  return isMobile ? (
    <MobileComponent showToleranceModal={showToleranceModal} />
  ) : (
    <WebComponent showToleranceModal={showToleranceModal} />
  );
};

export default Profile;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  let locale = ctx.locale || ctx.defaultLocale;
  const session: any = await getServerSession(ctx.req, ctx.res, authOptions);
  const showToleranceModal = session && !session.user.toleranceResult;

  // if (session && !session.user.toleranceResult) {
  //   return {
  //     redirect: {
  //       destination: `${process.env.NEXTAUTH_URL}/${locale}/login/assets`,
  //       permanent: false,
  //     },
  //   };
  // }

  if (!session) {
    return {
      redirect: {
        destination: `${process.env.NEXTAUTH_URL}/${locale}/login`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
      showToleranceModal,
      ...(await serverSideTranslations(locale as string, ["portfolio"])),
    },
  };
}
