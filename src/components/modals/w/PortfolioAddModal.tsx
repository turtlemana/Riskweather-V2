import React, {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";
interface props {
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsDetailOpen: Dispatch<SetStateAction<boolean>>;
  session: any;
  mutate: any;
  userProfile: any;
  portMutate: any;
}

function PortfolioAddModal({
  userProfile,
  setIsAddModalOpen,
  setIsDetailOpen,
  portMutate,
  session,
  mutate,
}: props) {
  const dispatch = usePortfolioDispatch();

  const [portfolioName, setPortfolioName] = useState<string>(""); // useState 추가
  const router = useRouter();
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const checkDuplicate = () => {
    if (
      portfolioName &&
      userProfile.portfolios &&
      userProfile.portfolios.length > 0 &&
      userProfile.portfolios.some(
        (portfolio: any) => portfolio.portName === portfolioName
      )
    ) {
      setIsDuplicate(true);
    } else {
      setIsDuplicate(false);
    }
  };

  useEffect(() => {
    checkDuplicate();
  }, [portfolioName]);

  const submitHandler = async () => {
    if (!portfolioName.trim()) {
      toast(
        router.locale == "ko"
          ? "포트폴리오 이름을 입력하세요"
          : "Enter portfolio name",
        { hideProgressBar: true, autoClose: 2000, type: "warning" }
      );
      return;
    }

    const isDuplicate =
      portfolioName &&
      userProfile.portfolios &&
      userProfile.portfolios.length > 0 &&
      userProfile.portfolios.some(
        (portfolio: any) => portfolio.portName === portfolioName
      );

    if (isDuplicate) {
      toast(
        router.locale == "ko"
          ? "중복된 포트폴리오 이름입니다"
          : "Duplicate portfolio name",
        { hideProgressBar: true, autoClose: 2000, type: "warning" }
      );
      return;
    }
    try {
      const response = await axios.put(
        `/api/auth/user?session=${session.user.email}`,
        {
          enteredInput: {
            portfolio: {
              portName: portfolioName,
            },
            method: "portfolioGenerate",
          },
        }
      );

      if (response.status === 200) {
        toast(
          router.locale == "ko"
            ? "포트폴리오가 생성됐습니다"
            : "Successfully added",
          { hideProgressBar: true, autoClose: 2000, type: "success" }
        );
        await mutate();
        const updatedData = await portMutate();
        const updatedPortfolio = updatedData.filter(
          (port: any) => port.portName === portfolioName
        );
        dispatch({ type: "SET_PORTFOLIO", payload: updatedPortfolio[0] });

        dispatch({ type: "SET_ADD_OPEN", payload: false });
        dispatch({ type: "SET_ASSETADD_OPEN", payload: true });
      } else {
        toast(
          router.locale == "ko"
            ? "포트폴리오 생성에 실패했습니다"
            : "Fetch Error",
          { hideProgressBar: true, autoClose: 2000, type: "error" }
        );
      }
    } catch (error) {
      console.error("Error while adding interests:", error);
    }
  };

  return (
    <main className="z-30 fixed pb-[150px] slim-scroll  bg-white top-16 w-full  max-w-[800px] h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-3">
        <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
          <Image
            className="cursor-pointer"
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => dispatch({ type: "SET_ADD_OPEN", payload: false })}
          />
          <p className="text-lg font-bold">새 포트폴리오</p>
          <div></div>
        </div>

        <div className="p-5 space-y-2">
          <p>포트폴리오 이름</p>
          <input
            required
            className="bg-gray-100 w-full rounded-xl p-3"
            placeholder="예: IT, 기술주"
            value={portfolioName}
            onChange={(e) => {
              setPortfolioName(e.target.value);
              checkDuplicate(); // 중복 체크
            }} // 중복 체크
          />
        </div>

        <div className="px-5 flex items-center justify-center">
          <button
            onClick={submitHandler}
            disabled={
              !portfolioName || isDuplicate // 조건에 따라 버튼 비활성화
            }
            className={`p-3 text-white rounded-xl text-center w-1/2 ${
              !portfolioName || isDuplicate
                ? "bg-gray-300" // 비활성화된 버튼의 색
                : "bg-blue-500"
            }`}
          >
            완료
          </button>
          {isDuplicate && (
            <p className="text-red-500 mt-2">중복된 포트폴리오 이름입니다</p> // 중복 경고 문구
          )}
        </div>
      </div>
    </main>
  );
}

export default PortfolioAddModal;
