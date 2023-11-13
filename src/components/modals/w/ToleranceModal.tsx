import React, {
  KeyboardEventHandler,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import Loading from "components/organisms/m/Loading";
import { NowTrendingData } from "interfaces/main";
import { COLORS } from "data/default";
import useHandleImageError from "utils/useHandleImageError";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import risktest from "../../../../public/lottie/risktest.json";

interface props {
  setIsToleranceModalOpen: Dispatch<SetStateAction<boolean>>;
  userProfile: any;
  mutate: any;
}
function ToleranceModal({
  setIsToleranceModalOpen,
  userProfile,
  mutate,
}: props) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleImageError = useHandleImageError();
  const [selectCoin, setSelectCoin]: any = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const router = useRouter();
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    "/api/toleranceAssets",
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];

  const handleSelect = (asset: any) => {
    if (
      selectCoin.some(
        (selectedAsset: any) => selectedAsset.ticker === asset.ITEM_CD_DL
      )
    ) {
      const filtered = selectCoin.filter(
        (selectedAsset: any) => selectedAsset.ticker !== asset.ITEM_CD_DL
      );
      setSelectCoin(filtered);
    } else {
      if (selectCoin.length >= 10) {
        return;
      }
      const newAsset = {
        ticker: asset.ITEM_CD_DL,
        name: asset.ITEM_ENG_NM,
        krName: encodeURIComponent(asset.ITEM_KR_NM),
      };
      setSelectCoin([...selectCoin, newAsset]);
    }
  };

  const handleAddInterests = async () => {
    try {
      const response = await axios.put(
        `/api/auth/user?session=${userProfile.email}`,
        {
          enteredInput: {
            action: "add",
            interest: selectCoin,
          },
        }
      );

      if (response.status === 200) {
        toast(
          router.locale == "ko"
            ? "관심 자산에 등록됐습니다"
            : "Successfully added",
          { hideProgressBar: true, autoClose: 2000, type: "success" }
        );
        mutate();
        setIsToleranceModalOpen(false);
      } else {
        toast(
          router.locale == "ko"
            ? "관심 자산 등록에 실패했습니다"
            : "Fetch Error",
          { hideProgressBar: true, autoClose: 2000, type: "error" }
        );
      }
    } catch (error) {
      console.error("Error while adding interests:", error);
    }
  };
  const submitHandler = async () => {
    setIsLoading(true);
    try {
      let fetchAddress =
        "https://riskweather.io/rapi/portfolio/interest-portfolio-risk?cl=0.99";

      for (let i = 0; i < selectCoin.length; i++) {
        const ticker = encodeURIComponent(selectCoin[i].ticker);
        fetchAddress += `&ticker=${ticker}`;
      }

      const response = await fetch(fetchAddress);
      const result = await response.json();
      const enteredInput = {
        accessLevel: 2,
        toleranceAssets: selectCoin,
        toleranceResult: result.portfolio_risk_ranked,
      };
      toast(
        router.locale == "ko"
          ? "위험 성향 측정이 완료됐습니다"
          : "Calculation completed!",
        { hideProgressBar: true, autoClose: 2000, type: "success" }
      );
      const data = await fetch(`/api/auth/user?session=${userProfile.email}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enteredInput }),
      }).then((res) => {
        if (res.ok) {
          mutate();
          setIsResult(true);
          setIsLoading(false);
        } else {
          toast(
            router.locale == "ko"
              ? "네트워크 에러가 발생했습니다"
              : "Fetch Error",
            { hideProgressBar: true, autoClose: 2000, type: "error" }
          );
        }
      });
    } catch (err) {
      setIsLoading(false);
      toast(
        router.locale == "ko" ? "네트워크 에러가 발생했습니다" : "Fetch Error",
        { hideProgressBar: true, autoClose: 2000, type: "error" }
      );
    }
  };

  return (
    <main className="z-30 fixed pb-[150px] slim-scroll  bg-white top-20 w-full  max-w-[800px] h-screen overflow-y-auto">
      {isLoading && !isResult ? (
        <div className="flex flex-col">
          <div className="mt-5 px-5 space-x-4 py-3 space-y-10 ">
            <Image
              className="cursor-pointer"
              src={"/images/icons/arrowLeft.svg"}
              alt="arrow"
              width={11}
              height={6}
              onClick={() => setIsToleranceModalOpen(false)}
            />

            <p className="text-2xl font-bold">투자 성향을 측정하고 있습니다</p>
            <Lottie
              animationData={risktest}
              renderer="svg"
              autoplay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      ) : !isLoading && !isResult ? (
        <div className="flex flex-col  space-y-3">
          <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
            <Image
              className="cursor-pointer"
              src={"/images/icons/arrowLeft.svg"}
              alt="arrow"
              width={11}
              height={6}
              onClick={() => setIsToleranceModalOpen(false)}
            />
            <p className="text-lg font-bold">투자 성향 검사</p>
            <div></div>
          </div>

          <div className="flex flex-col ">
            <div className="">
              <ul className="grid grid-cols-3 gap-4 p-5">
                {data.length > 0 && !isValid ? (
                  data.map((asset: NowTrendingData, i: number) => (
                    <li
                      key={i}
                      className={`flex flex-col items-center justify-center p-2 rounded-md
            cursor-pointer relative
            ${
              selectCoin.some(
                (selectedAsset: any) =>
                  selectedAsset.ticker === asset.ITEM_CD_DL
              )
                ? "bg-gray-300 rounded-md"
                : ""
            }`}
                      onClick={() => handleSelect(asset)}
                    >
                      <Image
                        unoptimized
                        quality={100}
                        className="w-[36px] h-[36px] "
                        src={
                          `/images/logos/${asset.ITEM_CD_DL}.png` ||
                          "/images/logos/errorLogo.png"
                        }
                        width={36}
                        height={36}
                        alt="logo"
                        onError={(event) =>
                          handleImageError(event, asset.HR_ITEM_NM)
                        }
                      />
                      <p className="mt-2 text-sm text-center">
                        {router.locale === "ko"
                          ? asset.ITEM_KR_NM
                          : asset.ITEM_ENG_NM}
                      </p>
                      {selectCoin.some(
                        (selectedAsset: any) =>
                          selectedAsset.ticker === asset.ITEM_CD_DL
                      ) && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <Image
                            src="/images/icons/check.svg"
                            width={24}
                            height={24}
                            alt="Selected"
                          />
                        </div>
                      )}
                    </li>
                  ))
                ) : data.length === 0 && !isValid ? (
                  <div></div>
                ) : (
                  <div className="flex w-screen h-screen justify-center items-center">
                    <Loading />
                  </div>
                )}
              </ul>
            </div>
          </div>
          {selectCoin.length > 0 && (
            <div className="sticky  bottom-10 left-0 right-0 flex justify-center">
              <button
                disabled={selectCoin.length < 2 ? true : false}
                onClick={submitHandler}
                className={`w-full mx-8 text-white ${
                  selectCoin.length < 2 ? "bg-gray-300 " : "bg-blue-500 "
                } bg-blue-500  rounded-lg py-3 px-4`}
              >
                {selectCoin.length} 개 선택완료
              </button>
            </div>
          )}
        </div>
      ) : !isLoading && isResult ? (
        <div className="flex flex-col">
          <div className="mt-5 px-5 space-x-4 py-3 space-y-10 ">
            <Image
              src={"/images/icons/arrowLeft.svg"}
              alt="arrow"
              width={11}
              height={6}
              onClick={() => {
                setIsResult(false);
                setIsToleranceModalOpen(false);
              }}
            />
            <div className="flex flex-col">
              <p className="text-2xl font-bold">
                {userProfile?.name}
                {"님은"}
              </p>
              <p className="text-2xl font-bold">
                {" "}
                {userProfile?.toleranceResult
                  ? router.locale == "ko"
                    ? userProfile?.toleranceResult == "aggressive"
                      ? "공격적인 투자자"
                      : userProfile?.toleranceResult == "moderate"
                      ? "중립적인 투자자"
                      : userProfile?.toleranceResult ==
                        "moderately conservative"
                      ? "약간 보수적인 투자자"
                      : userProfile?.toleranceResult == "conservative"
                      ? "보수적인 투자자"
                      : "위험 성향을 측정하세요"
                    : userProfile?.toleranceResult
                  : router.locale == "ko"
                  ? "위험 성향을 측정하세요"
                  : "Undefined Result"}
                {"입니다"}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-5">
              <Image
                src={`/images/icons/portfolio/${userProfile?.toleranceResult}.svg`}
                width={185}
                height={185}
                alt="result"
              />
              <p className="font-bold text-lg">
                {userProfile?.toleranceResult
                  ? router.locale == "ko"
                    ? userProfile?.toleranceResult == "aggressive"
                      ? "공격적인 투자자"
                      : userProfile?.toleranceResult == "moderate"
                      ? "중립적인 투자자"
                      : userProfile?.toleranceResult ==
                        "moderately conservative"
                      ? "약간 보수적인 투자자"
                      : userProfile?.toleranceResult == "conservative"
                      ? "보수적인 투자자"
                      : "위험 성향을 측정하세요"
                    : userProfile?.toleranceResult
                  : router.locale == "ko"
                  ? "위험 성향을 측정하세요"
                  : "Undefined Result"}
              </p>
            </div>
            <div className="sticky  bottom-0 left-0 right-0 flex justify-center">
              <button
                onClick={() => {
                  setIsResult(false);
                  setIsToleranceModalOpen(false);
                }}
                className={`w-full mx-8 text-white bg-blue-500  rounded-lg py-3 px-4`}
              >
                완료
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

export default ToleranceModal;
