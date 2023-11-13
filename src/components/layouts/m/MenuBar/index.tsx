import { useState, MouseEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useGlobalDispatch } from "contexts/SearchContext";

const MenuBar = () => {
  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const closeModal = () => {
    setIsOpenModal(false);
    setIsOpenSearchModal(false);
  };
  const dispatch = useGlobalDispatch();

  const handleMainPage = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch({ type: "RESET_VALUE" });
    window.location.href = `/${router.locale}`;
  };

  return (
    <header className="border border-t-gray-200 fixed  bottom-0 w-full z-30 bg-white h-16 py-[20px]  border-b border-gray-100  px-5 ">
      <Head>
        <link rel="Icon" href="/images/favicon.png" type="image/x-icon" />
        <title>Riskweather</title>
        <meta
          property="og:image"
          content="https://riskweather.io/images/favicon.png"
        />
        <meta
          property="og:description"
          content={
            router.locale === "ko"
              ? "투자 리스크의 기준 - 리스크웨더"
              : "Invest with Confidence, We've Got the Risks Covered"
          }
        />
        <meta property="og:title" content="Riskweather" />
      </Head>
      <div className="px-2 pb-5 pt-2 h-full mx-auto flex items-center justify-between w-full">
        <div
          className={
            "text-gray-500 flex flex-col justify-center items-center text-xs"
          }
        >
          <div className={"w-[30px] h-[30px] flex justify-center items-center"}>
            <Link className={""} href="/" onClick={handleMainPage}>
              {router.asPath == "/" ? (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/homeBlack.svg`}
                  alt="logo"
                  className="w-full h-full cursor-pointer"
                />
              ) : (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/home.svg`}
                  alt="logo"
                  className="w-full h-full cursor-pointer"
                />
              )}
            </Link>
          </div>
          <p className={`${router.asPath === "/" ? "text-black " : " "}`}>홈</p>
        </div>
        <div
          className={
            "text-gray-500 flex flex-col justify-center items-center text-sm"
          }
        >
          <div className={"w-[30px] h-[30px] flex justify-center items-center"}>
            <Link
              className={""}
              href="/interest"
              onClick={() => dispatch({ type: "RESET_VALUE" })}
            >
              {router.asPath == "/interest" ? (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/starBlack.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              ) : (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/star.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              )}
            </Link>
          </div>
          <p
            className={`${router.asPath === "/interest" ? "text-black " : " "}`}
          >
            관심
          </p>
        </div>
        <div
          className={
            "text-gray-500 flex flex-col justify-center items-center text-sm"
          }
        >
          <div className={"w-[30px] h-[30px] flex justify-center items-center"}>
            <Link
              className={""}
              href="/portfolio"
              onClick={() => dispatch({ type: "RESET_VALUE" })}
            >
              {router.asPath == "/portfolio" ? (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/pieChartBlack.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              ) : (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/pieChart.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              )}
            </Link>
          </div>
          <p
            className={`${
              router.asPath === "/portfolio" ? "text-black " : " "
            }`}
          >
            포트폴리오
          </p>
        </div>
        <div
          className={
            "text-gray-500 flex flex-col justify-center items-center text-sm"
          }
        >
          <div className={"w-[30px] h-[30px] flex justify-center items-center"}>
            <Link
              className={""}
              href="/search"
              onClick={() => dispatch({ type: "RESET_VALUE" })}
            >
              {router.asPath == "/search" ? (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/searchBlack.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              ) : (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/search.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              )}
            </Link>
          </div>
          <p className={`${router.asPath === "/search" ? "text-black " : " "}`}>
            탐색
          </p>
        </div>
        <div
          className={
            "text-gray-500 flex flex-col justify-center items-center text-sm"
          }
        >
          <Link
            onClick={() => dispatch({ type: "RESET_VALUE" })}
            href="/profile"
            className={"w-[30px] h-[30px] flex justify-center items-center"}
          >
            <div className={""}>
              {router.asPath == "/profile" ? (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/menuBlack.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              ) : (
                <Image
                  width={19}
                  height={20}
                  unoptimized
                  src={`/images/menuBar/menu.svg`}
                  alt="logo"
                  className="h-full w-full cursor-pointer"
                />
              )}
            </div>
          </Link>
          <p
            className={`${router.asPath === "/profile" ? "text-black " : " "}`}
          >
            MY
          </p>
        </div>
        {isOpenModal || isOpenSearchModal ? (
          <Image
            width={30}
            height={30}
            src={"/images/header/menu.svg"}
            alt=""
            className="cursor-pointer"
            onClick={closeModal}
          />
        ) : (
          ""
        )}
      </div>
      {/* {isOpenModal && (
        <Modal
          topRiskRow={504}
          onClose={() => setIsOpenModal(false)}
          setIsOpenContactModal={setIsOpenContactModal}
          setIsOpenAlarmModal={setIsOpenAlarmModal}
        />
      )}
      {isOpenContactModal && (
        <Contact onClose={() => setIsOpenContactModal(false)} />
      )}

      {isOpenSearchModal && (
        <SearchModal setIsOpenSearchModal={setIsOpenSearchModal} />
      )} */}
    </header>
  );
};

export default MenuBar;
