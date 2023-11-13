import { ReactNode } from "react";
import TopBar from "components/layouts/w/TopBar";
import MenuBar from "components/layouts/w/MenuBar";
import Footer from "components/layouts/w/Footer";
import MobileTopBar from "components/layouts/m/TopBar";
import MobileFooter from "components/layouts/m/MenuBar";
import { useRouter } from "next/router";

interface Props {
  isMobile: boolean;
  children?: ReactNode;
}

const Layout = ({ isMobile, children }: Props) => {
  const router = useRouter();

  const isDetailPage = router.pathname.startsWith("/detail/");
  const isSearchPage = router.pathname.startsWith("/search");
  const isPortfolioPage = router.pathname.startsWith("/portfolio");

  return (
    <>
      {isMobile ? (
        <>
          {!isDetailPage && <MobileTopBar />}
          <div className={`${!isDetailPage ? "my-16" : "mb-16"}`}>
            {children}
          </div>
          {!isDetailPage && <MobileFooter />}
        </>
      ) : (
        <>
          <div className={` flex flex-col w-800:items-center`}>
            <TopBar />
            <div className={`${!isDetailPage ? "mt-20 mb-10" : "mb-16"}`}>
              {children}
            </div>
            {!isDetailPage && !isSearchPage && !isPortfolioPage && (
              <div className="pr-20 mr-20">
                <Footer />
              </div>
            )}
            {!isDetailPage && <MenuBar />}
          </div>
        </>
      )}
    </>
  );
};

export default Layout;
