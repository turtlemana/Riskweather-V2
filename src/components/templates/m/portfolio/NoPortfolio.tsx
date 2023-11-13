import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import portfolioresult from "../../../../../public/lottie/portfolioresult.json.json";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";
interface props {
  session: any;
  userProfile: any;
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
}

function NoPortfolio({ userProfile, session, setIsAddModalOpen }: props) {
  const router = useRouter();
  const dispatch = usePortfolioDispatch();

  return (
    <main className="mb-3 w-full bg-white h-screen">
      <div className="flex flex-col p-5 space-y-0">
        <div className="flex justify-between items-center">
          <h1 className="text-lg pt-5">내 포트폴리오</h1>
          {/* <Image
            src={"/images/icons/expandLess.svg"}
            alt="arrow"
            width={11}
            height={6}
          /> */}
        </div>

        {/* <div className="flex justify-between items-center">
          <button className="py-1 px-2 bg-black text-white rounded-2xl">
            기본
          </button>
          <p className="text-gray-300 text-sm">| 편집</p>
        </div> */}
        {!userProfile ||
        !userProfile.portfolios ||
        userProfile.portfolios.length === 0 ? (
          <div>
            <div className={"flex justify-center items-center "}>
              <Lottie
                animationData={portfolioresult}
                renderer="svg"
                autoplay
                loop
                style={{ width: 400, height: 300 }}
              />
            </div>

            <div className={"flex flex-col justify-center items-center"}>
              <div className={"flex space-x-1"}>
                <h3>보유 자산 등록하고,</h3>
                <h3> </h3>
                <Image
                  src="/images/icons/Ai.svg"
                  className={"w-auto h-auto"}
                  alt="AI"
                  width={6}
                  height={6}
                />{" "}
                <h3> 진단받기</h3>
              </div>
              <p className={"text-gray-500 text-sm"}>
                리스크웨더 AI가 실시간으로 분석해요
              </p>
              <button
                onClick={() => {
                  if (!session || !userProfile) {
                    router.push("/login");
                  } else {
                    dispatch({ type: "SET_ADD_OPEN", payload: true });
                  }
                }}
                className={
                  "mt-3 rounded-xl bg-[#2178FB] text-white w-full py-3"
                }
              >
                포트폴리오 만들기
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex justify-start items-center space-x-2 overflow-x-auto"></div>
      </div>
    </main>
  );
}

export default NoPortfolio;
