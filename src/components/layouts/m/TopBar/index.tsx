import { useState, MouseEvent, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import {
  useGlobalState,
  useGlobalDispatch,
  StateType,
  ActionType,
} from "contexts/SearchContext";
import RiskModal from "../../../modals/m/RiskModal";

const TopBar = () => {
  const [isRead, setIsRead] = useState(false);

  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);

  const router = useRouter();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenAlarmModal, setIsOpenAlarmModal] = useState(false);
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [isOpenContactModal, setIsOpenContactModal] = useState(false);
  const dispatch = useGlobalDispatch();

  const closeModal = () => {
    setIsOpenModal(false);
    setIsOpenSearchModal(false);
  };

  const alarmRouteClose = () => {
    setIsOpenAlarmModal(false);
    setIsOpenModal(false);
  };

  const handleMainPage = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = `/${router.locale}`;
  };

  const alertModalClick = () => {
    setIsRead(true);
    setIsOpenAlarmModal((prev) => !prev);
  };

  useEffect(() => {
    setIsRiskModalOpen(false);
  }, [router.asPath]);

  return (
    <header className="fixed top-0 w-full z-30 bg-white h-16 border-b border-gray-100 py-[14px] px-5 ">
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

      <div className="h-full mx-auto flex items-center justify-between w-full">
        <Link href="/" onClick={handleMainPage}>
          <Image
            width={30}
            height={30}
            unoptimized
            src={`/images/header/headerLogo.svg`}
            alt="logo"
            className="cursor-pointer w-auto h-auto"
          />
        </Link>
        {isOpenModal ? (
          <Image
            width={30}
            height={30}
            src={"/images/header/close.svg"}
            alt=""
            className="cursor-pointer"
            onClick={closeModal}
          />
        ) : (
          <section className="flex justify-center items-center gap-4">
            <Image
              src={"/images/header/search.svg"}
              alt=""
              className="w-auto h-auto cursor-pointer"
              width={30}
              height={30}
              onClick={() => {
                router.push("/search");
                dispatch({ type: "SET_SEARCH_MODAL_OPEN", payload: true });
              }}
            />
            <Image
              src={"/images/header/noti.svg"}
              alt=""
              className="w-auto h-auto cursor-pointer"
              width={30}
              height={30}
              onClick={() => setIsRiskModalOpen(true)}
            />
            {/* <AlarmModal
              isOpenAlarmModal={isOpenAlarmModal}
              alertModalClick={alertModalClick}
              isRead={isRead}
              onClose={alarmRouteClose}
            />

            <SessionComponent />
            <Image
              src={option}
              alt=""
              className="w-6 h-6 cursor-pointer"
              onClick={() => setIsOpenModal((prev) => !prev)}
            /> */}
          </section>
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
      {isRiskModalOpen && <RiskModal setIsRiskModalOpen={setIsRiskModalOpen} />}
    </header>
  );
};

export default TopBar;
