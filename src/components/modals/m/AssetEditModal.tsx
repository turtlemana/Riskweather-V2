import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useHandleImageError from "utils/useHandleImageError";
import axios from "axios";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import portfolioresult from "../../../../public/lottie/portfolioresult.json.json";

function AssetEditModal({
  isAssetEditModalOpen,
  setIsAssetEditModalOpen,
  selectCoin,
  setSelectCoin,
  selectedAsset,
  session,
  mutate,
  portMutate,
  portfolio,
  isLoading,
  setIsLoading,
  currentDate,
  setUserPtf,
}: any) {
  const router = useRouter();
  const handleImageError = useHandleImageError();

  const handleQuantityChange = (ticker: string, value: string) => {
    if (value === "") {
      // Allow empty input to let the user delete
      setSelectCoin((prev: any) =>
        prev.map((coin: any) =>
          coin.ticker === ticker ? { ...coin, quantity: value } : coin
        )
      );
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setSelectCoin((prev: any) =>
          prev.map((coin: any) =>
            coin.ticker === ticker ? { ...coin, quantity: numValue } : coin
          )
        );
      }
    }
  };

  const handlePriceChange = (ticker: string, value: string) => {
    if (value === "") {
      // Allow empty input to let the user delete
      setSelectCoin((prev: any) =>
        prev.map((coin: any) =>
          coin.ticker === ticker ? { ...coin, price: value } : coin
        )
      );
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setSelectCoin((prev: any) =>
          prev.map((coin: any) =>
            coin.ticker === ticker ? { ...coin, price: numValue } : coin
          )
        );
      }
    }
  };

  const submitHandler = async () => {
    let fetchAddress =
      "https://riskweather.io/rapi/portfolio/user-portfolio-risk?cl=0.99";

    for (let i = 0; i < selectCoin.length; i++) {
      const ticker = encodeURIComponent(selectCoin[i].ticker);
      const share = encodeURIComponent(selectCoin[i].quantity);

      fetchAddress += `&ticker=${ticker}&share=${share}`;
    }

    setIsLoading(true);

    try {
      const data = await fetch(fetchAddress);
      const result = await data.json();

      const response = await axios.put(
        `/api/auth/user?session=${session.user.email}`,
        {
          enteredInput: {
            portfolio: {
              portName: portfolio.portName,
              items: [...selectCoin],
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
            ? "포트폴리오에 자산이 등록됐습니다"
            : "Successfully added",
          { hideProgressBar: true, autoClose: 2000, type: "success" }
        );
        await mutate();
        portMutate();
        setIsLoading(false);

        const updatedPortfolio = { ...portfolio, items: [...selectCoin] };
        setUserPtf(updatedPortfolio);

        setIsAssetEditModalOpen(false);
      } else {
        setIsLoading(false);

        toast(
          router.locale == "ko" ? "자산 등록에 실패했습니다" : "Fetch Error",
          { hideProgressBar: true, autoClose: 2000, type: "error" }
        );
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Error while adding assets:", error);
    }
  };

  const isInputFilled = (asset: any) => {
    return asset.quantity && asset.price;
  };

  const allInputsFilled = selectCoin.every(isInputFilled);

  return (
    <main className="z-50 fixed   bg-white left-0 top-0 w-full h-screen overflow-y-auto">
      {!isLoading ? (
        <div className="flex flex-col  space-y-3">
          <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
            <Image
              src={"/images/icons/arrowLeft.svg"}
              alt="arrow"
              width={11}
              height={6}
              onClick={() => setIsAssetEditModalOpen(false)}
            />
            <p className="font-bold ">자산 수정</p>
            <div></div>
          </div>

          {selectCoin
            .filter((asset: any) => asset.ticker === selectedAsset.ticker)
            .map((asset: any, idx: number) => (
              <div key={idx} className="p-5 flex flex-col">
                <div className="flex shrink-0 space-x-5 items-center">
                  <Image
                    unoptimized
                    quality={100}
                    className="w-[36px] h-[36px]"
                    src={
                      `/images/logos/${asset.ticker}.png` ||
                      "/images/logos/errorLogo.png"
                    }
                    width={36}
                    height={36}
                    alt="logo"
                    onError={(event) => handleImageError(event, asset.exchange)}
                  />

                  <div className="flex flex-col space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-500 text-sm">{asset.ticker}</p>
                      <p className="text-gray-500 text-sm">{asset.exchange}</p>
                    </div>
                    <p className="font-semibold">
                      {router.locale === "ko"
                        ? asset.krName && decodeURIComponent(asset.krName)
                        : asset.name && decodeURIComponent(asset.name)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-gray-500 text-sm">수량</p>
                  <input
                    required
                    type="number"
                    min="0.0001" // 0보다 큰 최소 값 설정
                    step="0.0001" // 소수점 4자리까지 허용
                    className="bg-gray-100 w-full rounded-xl p-3"
                    placeholder="20 (주)"
                    value={asset.quantity || ""}
                    onChange={(e) =>
                      handleQuantityChange(asset.ticker, e.target.value)
                    }
                  />
                </div>
                <div className="mt-5 space-y-2">
                  <p className="text-gray-500 text-sm">평균단가</p>
                  <input
                    required
                    type="number"
                    min="0.0001" // 0보다 큰 최소 값 설정
                    step="0.0001" // 소수점 4자리까지 허용
                    className="bg-gray-100 w-full rounded-xl p-3"
                    placeholder="50000 (원)"
                    value={asset.price || ""}
                    onChange={(e) =>
                      handlePriceChange(asset.ticker, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

          {isAssetEditModalOpen && allInputsFilled && (
            <div className="sticky pt-10  bottom-0 left-0 right-0 flex justify-center">
              <button
                onClick={submitHandler}
                className="w-full mx-8 text-white bg-blue-500  rounded-lg py-3 px-4"
              >
                저장하기
              </button>
            </div>
          )}
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

export default AssetEditModal;
