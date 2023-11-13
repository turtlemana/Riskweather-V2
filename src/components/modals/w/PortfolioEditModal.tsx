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
import AssetEditModal from "./AssetEditModal";
import DeleteModal from "./DeleteModal";
import useUdtDate from "utils/useFormattedDate";
import Lottie from "lottie-react";
import portfolioresult from "../../../../public/lottie/portfolioresult.json.json";
import { useGlobalDispatch } from "contexts/SearchContext";
import useModalClose from "utils/useModalClose";

import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";
interface props {
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsAssetAddOpen: Dispatch<SetStateAction<boolean>>;
  setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsDetailOpen: Dispatch<SetStateAction<boolean>>;

  portMutate: any;
  setPortfolio: any;
  portfolio: any;
  session: any;
  mutate: any;
  userProfile: any;
}

function PortfolioEditModal({
  portfolio,
  setPortfolio,
  userProfile,
  setIsAddModalOpen,
  setIsAssetAddOpen,
  setIsEditModalOpen,
  setIsDetailOpen,

  portMutate,
  session,
  mutate,
}: props) {
  const dispatch = useGlobalDispatch();
  const portState = usePortfolioState();
  const portDispatch = usePortfolioDispatch();
  const [userPtf, setUserPtf] = useState(
    userProfile.portfolios && userProfile.portfolios.length > 0
      ? portState.portfolio
      : []
  );
  useEffect(() => {
    portDispatch({
      type: "SET_PORTFOLIO",
      payload: userProfile.portfolios[0],
    });
  }, [userProfile]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenPortfolioDeleteModal, setIsOpenPortfolioDeleteModal] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPortfolioNameEditModalOpen, setIsPortfolioNameEditModalOpen] =
    useState(false);
  const nameEditModalRef = useModalClose(isPortfolioNameEditModalOpen, () =>
    setIsPortfolioNameEditModalOpen(false)
  );
  const [selectCoin, setSelectCoin]: any = useState(
    portState.portfolio?.items || []
  );
  useEffect(() => {
    setSelectCoin(portState.portfolio.items || []);
  }, [portState.portfolio]);
  const [isAssetEditModalOpen, setIsAssetEditModalOpen] = useState(false);

  const [portfolioName, setPortfolioName] = useState<string>("");
  const router = useRouter();

  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  const [isModified, setIsModified] = useState(false);

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

  const handleSelect = (asset: any) => {
    setSelectedAsset(asset);
  };
  const currentDate = useUdtDate(new Date().toISOString(), false, true);
  const submitHandler = async () => {
    try {
      const response = await axios.put(
        `/api/auth/user?session=${session.user.email}`,
        {
          enteredInput: {
            method: "portfolioNameEdit",
            portfolio: {
              portName: portState.portfolio.portName, // 현재 포트폴리오 이름
              newPortName: portfolioName, // 새 포트폴리오 이름
            },
          },
        }
      );

      if (response.status === 200) {
        toast(
          router.locale == "ko"
            ? "포트폴리오 이름이 성공적으로 수정되었습니다."
            : "Portfolio name successfully updated",
          { hideProgressBar: true, autoClose: 2000, type: "success" }
        );
        await mutate();
        portMutate();
        setIsPortfolioNameEditModalOpen(false);
      } else {
        toast(
          router.locale == "ko"
            ? "포트폴리오 이름 수정에 실패했습니다."
            : "Failed to update portfolio name",
          { hideProgressBar: true, autoClose: 2000, type: "error" }
        );
      }
    } catch (error) {
      console.error("Error while updating portfolio name:", error);
    }
  };
  const deleteHandler = async () => {
    setIsLoading(true);

    const updatedItems = portState.portfolio.items.filter(
      (item: any) => item.ticker !== selectedAsset.ticker
    );

    setSelectCoin(updatedItems);

    // API를 호출하여 서버에 변경사항을 저장
    try {
      let fetchAddress =
        "https://riskweather.io/rapi/portfolio/user-portfolio-risk?cl=0.99";

      for (let i = 0; i < updatedItems.length; i++) {
        const ticker = encodeURIComponent(updatedItems[i].ticker);
        const share = encodeURIComponent(updatedItems[i].quantity);

        fetchAddress += `&ticker=${ticker}&share=${share}`;
      }

      const data = await fetch(fetchAddress);
      const result = await data.json();

      const response = await axios.put(
        `/api/auth/user?session=${session.user.email}`,
        {
          enteredInput: {
            portfolio: {
              portName: portState.portfolio.portName,
              items: updatedItems,
            },
            method: "portfolioAssetAdd",
            portfolioResult: result.portfolio_risk * 100,
            portfolioLevel: result.portfolio_risk_ranked,
            portfolioTime: currentDate,
          },
        }
      );

      if (response.status === 200) {
        toast(
          router.locale == "ko"
            ? "자산이 성공적으로 삭제되었습니다."
            : "Asset successfully deleted",
          { hideProgressBar: true, autoClose: 2000, type: "success" }
        );
        await mutate();
        portMutate();
        setIsLoading(false);

        const updatedPortfolio = {
          ...portState.portfolio,
          items: updatedItems,
        };
        setUserPtf(updatedPortfolio);
        setPortfolio(updatedPortfolio);
        portDispatch({ type: "SET_PORTFOLIO", payload: updatedPortfolio });
        setSelectCoin(updatedItems);

        setIsOpenDeleteModal(false);
      } else {
        toast(
          router.locale == "ko"
            ? "자산 삭제에 실패했습니다."
            : "Failed to delete asset",
          { hideProgressBar: true, autoClose: 2000, type: "error" }
        );
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error while deleting asset:", error);
    }
  };

  const deletePortfolio = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `/api/auth/user?session=${session.user.email}`,
        {
          enteredInput: {
            method: "portfolioDelete",
            portfolio: {
              portName: portState.portfolio.portName,
            },
          },
        }
      );

      if (response.status === 200) {
        if (userProfile.portfolios.length > 1) {
          const updatedPortfolios = userProfile.portfolios.filter(
            (ptf: any) => ptf.portName !== portState.portfolio.portName
          );
          setUserPtf(updatedPortfolios[0] || {});
          setPortfolio(updatedPortfolios[0] || {});
          portDispatch({
            type: "SET_PORTFOLIO",
            payload: updatedPortfolios[0] || {},
          });
        } else {
          portDispatch({
            type: "SET_EDIT_OPEN",
            payload: false,
          });
        }
        toast(
          router.locale == "ko"
            ? "포트폴리오가 성공적으로 삭제되었습니다."
            : "Portfolio successfully deleted",
          { hideProgressBar: true, autoClose: 2000, type: "success" }
        );
        setIsLoading(false);

        await mutate();
        portMutate();
        setIsOpenPortfolioDeleteModal(false);
      } else {
        setIsLoading(false);

        toast(
          router.locale == "ko"
            ? "포트폴리오 삭제에 실패했습니다."
            : "Failed to delete portfolio",
          { hideProgressBar: true, autoClose: 2000, type: "error" }
        );
        setIsOpenPortfolioDeleteModal(false);
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error while deleting portfolio:", error);
    }
  };

  return (
    <main className="z-30 fixed pb-[150px] slim-scroll  bg-white top-16 w-full  max-w-[800px] h-screen overflow-y-auto">
      {!isLoading ? (
        <div className="flex flex-col  space-y-3">
          <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
            <Image
              className="cursor-pointer"
              src={"/images/icons/arrowLeft.svg"}
              alt="arrow"
              width={11}
              height={6}
              onClick={() => portDispatch({ type: "RESET" })}
            />
            <p className="text-lg font-bold">내 포트폴리오 편집</p>
            <div></div>
          </div>

          <div className="p-5 space-y-2 flex items-center justify-between">
            <div className="flex   pr-10 font-semibold items-center space-x-5">
              {userProfile.portfolios &&
                userProfile.portfolios.length > 0 &&
                userProfile.portfolios.map((ptf: any, i: number) => (
                  <div key={i} className="flex flex-col">
                    <div
                      className={`
                        cursor-pointer max-w-[120px] truncate
                        ${
                          portState.portfolio.portName == ptf.portName
                            ? "text-white bg-black rounded-3xl px-2 py-1"
                            : "text-gray-400 px-2 py-1"
                        }`}
                      onClick={() => {
                        setUserPtf(ptf);
                        portDispatch({ type: "SET_PORTFOLIO", payload: ptf });

                        setPortfolio(ptf);
                      }}
                    >
                      {ptf.portName}
                    </div>
                  </div>
                ))}
            </div>
            {userProfile &&
              userProfile.portfolios &&
              userProfile.portfolios.length < 3 && (
                <p
                  onClick={() => {
                    portDispatch({ type: "SET_ADD_OPEN", payload: true });
                  }}
                  className="text-blue-500 pb-2 cursor-pointer"
                >
                  추가
                </p>
              )}
          </div>

          <div className="px-5 flex items-center justify-between">
            <div className=" flex items-center space-x-4">
              <div className="space-x-1 flex items-center">
                <p className="font-bold max-w-[120px] truncate">
                  {portState.portfolio.portName}{" "}
                </p>
                <p className="text-gray-400">
                  {"(" +
                    (portState.portfolio.items &&
                    portState.portfolio.items?.length
                      ? portState.portfolio.items?.length
                      : 0) +
                    ")"}
                </p>
              </div>
              <div className="cursor-pointer flex items-center space-x-1.5 bg-gray-50 p-1 text-gray-500 rounded-xl">
                <Image
                  width={17}
                  height={14}
                  src="/images/icons/fileIcon.svg"
                  alt="file"
                />
                <p onClick={() => setIsPortfolioNameEditModalOpen(true)}>
                  그룹명 수정
                </p>
              </div>
            </div>
            <p
              className="cursor-pointer text-red-500 "
              onClick={() => setIsOpenPortfolioDeleteModal(true)}
            >
              그룹 삭제
            </p>
          </div>
          <div className="p-5">
            <ul className="space-y-5">
              {portState.portfolio.items &&
                portState.portfolio.items?.map((item: any, i: number) => (
                  <li key={i} className="py-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="font-bold text-lg">
                          {decodeURIComponent(item.krName)}
                        </p>
                        <div className="flex items-center space-x-1">
                          <p className="text-sm text-gray-400">
                            {item.quantity}
                            {"주 |"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {"평균"} {item.price.toLocaleString("en-us")} {"원"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 space-x-4">
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            handleSelect(item);
                            setIsAssetEditModalOpen(true);
                          }}
                        >
                          수정
                        </p>
                        <p
                          className="cursor-pointer"
                          onClick={() => {
                            handleSelect(item);
                            setIsOpenDeleteModal(true);
                          }}
                        >
                          삭제{" "}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {portState.portfolio &&
            portState.portfolio.items &&
            portState.portfolio.items.length < 10 && (
              <div className="sticky  bottom-0 left-0 right-0 flex justify-center">
                <button
                  onClick={() => {
                    setPortfolio(userPtf);
                    portDispatch({ type: "SET_ASSETADD_OPEN", payload: true });
                    dispatch({ type: "RESET_VALUE" });
                  }}
                  className="w-1/2 mx-8 text-blue-500 font-bold bg-blue-50 rounded-lg py-2 px-4"
                >
                  +자산 추가
                </button>
              </div>
            )}

          {isPortfolioNameEditModalOpen && (
            <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-30 overflow-y-auto">
              <div
                //@ts-ignore
                ref={nameEditModalRef}
                className="z-20 absolute flex items-center flex-col text-start text-[#111111] bg-white py-6 px-5 rounded-20 top-1/2 left-1/2 translate-x-half translate-y-half border  w-1/3 space-y-3"
              >
                <h1 className="text-xl mb-3">{"포트폴리오 이름 수정"}</h1>
                <input
                  required
                  className="bg-gray-100 w-full rounded-xl p-3"
                  placeholder="예: IT, 기술주"
                  value={portfolioName}
                  onChange={(e) => {
                    setPortfolioName(e.target.value);
                    checkDuplicate();
                  }}
                />
                <button
                  onClick={submitHandler}
                  disabled={
                    !portfolioName || isDuplicate || portfolioName.trim() === ""
                  }
                  className={`p-2  text-white rounded-xl text-center w-full  ${
                    !portfolioName || isDuplicate
                      ? "bg-gray-300"
                      : "bg-blue-500"
                  }`}
                >
                  완료
                </button>
                {isDuplicate && (
                  <p className="text-red-500 mt-2">
                    중복된 포트폴리오 이름입니다
                  </p>
                )}
              </div>
            </div>
          )}

          {isAssetEditModalOpen && (
            <AssetEditModal
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              selectedAsset={selectedAsset}
              isAssetEditModalOpen={isAssetEditModalOpen}
              setIsAssetEditModalOpen={setIsAssetEditModalOpen}
              selectCoin={selectCoin}
              setSelectCoin={setSelectCoin}
              session={session}
              mutate={mutate}
              portMutate={portMutate}
              portfolio={userPtf}
              setUserPtf={setUserPtf}
              currentDate={currentDate}
            />
          )}

          {isOpenDeleteModal && (
            <DeleteModal
              title={"자산을 삭제합니다"}
              subTitle={"선택한 자산을 삭제합니다"}
              isOpenDeleteModal={isOpenDeleteModal}
              setIsOpenDeleteModal={setIsOpenDeleteModal}
              deleteHandler={deleteHandler}
            />
          )}
          {isOpenPortfolioDeleteModal && (
            <DeleteModal
              title={"그룹을 삭제합니다"}
              subTitle={"선택한 포트폴리오 삭제합니다"}
              isOpenDeleteModal={isOpenPortfolioDeleteModal}
              setIsOpenDeleteModal={setIsOpenPortfolioDeleteModal}
              deleteHandler={deletePortfolio}
            />
          )}

          {/* <div className="px-5 ">
            <button
              onClick={submitHandler}
              disabled={
                !portfolioName || isDuplicate // 조건에 따라 버튼 비활성화
              }
              className={`p-3 text-white rounded-xl text-center w-full ${
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
          </div> */}
        </div>
      ) : (
        <div className={"flex justify-center items-center py-2 h-full"}>
          <Lottie
            animationData={portfolioresult}
            renderer="svg"
            autoplay
            loop
            style={{ width: 400, height: 200 }}
          />
        </div>
      )}
    </main>
  );
}

export default PortfolioEditModal;
