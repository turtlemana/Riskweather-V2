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
import {
  useGlobalState,
  useGlobalDispatch,
  StateType,
  ActionType,
} from "contexts/SearchContext";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import { toast } from "react-toastify";
import useUdtDate from "utils/useFormattedDate";
import Lottie from "lottie-react";
import portfolioresult from "../../../../../public/lottie/portfolioresult.json.json";
import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";

interface props {
  setIsAssetAddOpen: Dispatch<SetStateAction<boolean>>;
  portfolio: any;
  setPortfolio: any;
  session: any;
  mutate: any;
  userProfile: any;
  portMutate: any;
  ptfPrice: any;
}

function AddAssets({
  userProfile,
  portMutate,
  session,
  ptfPrice,
  setPortfolio,
  mutate,
  setIsAssetAddOpen,
  portfolio,
}: props) {
  const portState = usePortfolioState();
  const portDispatch = usePortfolioDispatch();
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const currentDate = useUdtDate(new Date().toISOString(), false, true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectCoin, setSelectCoin]: any = useState(
    portState.portfolio.items || []
  );
  const [isNextStep, setIsNextStep] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
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
        cat: asset.CAT ? asset.CAT : "",
        exchange: asset.HR_ITEM_NM ? asset.HR_ITEM_NM : "",
        loc: asset.LOC ? asset.LOC : "",
      };
      setSelectCoin([...selectCoin, newAsset]);
    }
  };

  const handleImageError = useHandleImageError();
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();
  const router = useRouter();
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    state.searchInput
      ? `/api/search?search=${encodeURIComponent(state.searchInput)}`
      : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      if (query.length > 20) {
        return;
      }
      dispatch({ type: "SET_SEARCH", payload: query });
    },
    [dispatch]
  );

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      if (data.length >= 1) {
        const firstItem = data[0];
        router.push({ pathname: `/detail/${firstItem["ITEM_CD_DL"]}` });
      }
    }
  };

  const handleQuantityChange = (ticker: string, value: string) => {
    if (value === "") {
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
              portName: portState.portfolio.portName,
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
        setIsLoading(false);
        await mutate();
        await portMutate();
        const updatedData = await portMutate();
        const updatedPortfolio = updatedData.filter(
          (port: any) => port.portName === portState.portfolio.portName
        );
        portDispatch({ type: "SET_PORTFOLIO", payload: updatedPortfolio[0] });

        portDispatch({ type: "SET_ASSETADD_OPEN", payload: false });
        portDispatch({ type: "SET_NEXTSTEP", payload: false });
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
    <main className="z-40 fixed pb-[150px] slim-scroll  bg-white top-16 w-full  max-w-[800px] h-screen overflow-y-auto">
      {!isLoading && !portState.isNextStep ? (
        <div>
          <div className="flex flex-col  space-y-3">
            <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
              <Image
                className="cursor-pointer"
                src={"/images/icons/arrowLeft.svg"}
                alt="arrow"
                width={11}
                height={6}
                onClick={() =>
                  portDispatch({ type: "SET_ASSETADD_OPEN", payload: false })
                }
              />
              <p className="font-bold ">자산 추가</p>
              <div></div>
            </div>

            <div className="flex flex-col ">
              <div className="px-5 py-2">
                <section className="w-full  h-10   py-5 px-4 flex items-center border border-solid border-gray-100 bg-gray-50 rounded-xl ">
                  {/* <Image
                  src={"/images/icons/search.svg"}
                  alt="search"
                  className="mr-2 w-4 h-4"
                  width={4}
                  height={4}
                /> */}
                  <input
                    placeholder={router.locale == "ko" ? "자산 검색" : "Search"}
                    className="text-gray-400 outline-none  text-sm w-full bg-gray-50"
                    value={state.searchInput}
                    onChange={onSearch}
                  />
                </section>
              </div>
              <div className="">
                <ul className=" overflow-y-auto flex flex-col ">
                  {data.length > 0 && !isValid ? (
                    <div>
                      <div className="p-5 space-y-4">
                        {data
                          .filter(
                            (asset: NowTrendingData) => asset.CAT !== "Index"
                          )
                          .map((asset: NowTrendingData, i: number) => (
                            <li
                              onClick={() => handleSelect(asset)}
                              key={i}
                              className={`cursor-pointer flex justify-between items-center  ${
                                selectCoin.some(
                                  (selectedAsset: any) =>
                                    selectedAsset.ticker === asset.ITEM_CD_DL
                                )
                                  ? "bg-blue-100 rounded-md "
                                  : ""
                              }`}
                            >
                              <div className="flex shrink-0 space-x-5 items-center">
                                <Image
                                  unoptimized
                                  quality={100}
                                  className="w-[36px] h-[36px]"
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

                                <div className="flex flex-col space-y-0.5">
                                  <p className="font-semibold">
                                    {router.locale === "ko"
                                      ? asset.ITEM_KR_NM && asset.ITEM_KR_NM
                                      : asset.ITEM_ENG_NM && asset.ITEM_ENG_NM}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <p className="text-gray-500 text-sm">
                                      {asset.ITEM_CD_DL}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col justify-center items-center">
                                <h2
                                  className={
                                    asset.ADJ_CLOSE_KRW > 100000
                                      ? "text-sm truncate "
                                      : asset.ADJ_CLOSE_KRW > 100000
                                      ? "text-xs truncate "
                                      : `text-md `
                                  }
                                >
                                  {asset.CAT && asset.CAT !== "Index"
                                    ? router.locale === "ko"
                                      ? asset.ADJ_CLOSE_KRW &&
                                        asset.ADJ_CLOSE_KRW.toLocaleString(
                                          "en-us",
                                          {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                          }
                                        ) + " 원"
                                      : asset.ADJ_CLOSE_USD &&
                                        asset.ADJ_CLOSE_USD.toLocaleString(
                                          "en-us",
                                          {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                          }
                                        ) + " ＄"
                                    : asset.ADJ_CLOSE &&
                                      asset.ADJ_CLOSE.toLocaleString("en-us", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                      })}
                                </h2>
                                {asset.ADJ_CLOSE_CHG &&
                                asset.ADJ_CLOSE_CHG > 0 ? (
                                  <div
                                    className={`flex items-center text-xs ${
                                      asset.ADJ_CLOSE_KRW > 10000000
                                        ? "pt-1 "
                                        : ` `
                                    } `}
                                  >
                                    <RiArrowUpSFill color={"red"} />
                                    <p className={"text-red-500 font-semibold"}>
                                      {asset.ADJ_CLOSE_CHG &&
                                        "(" +
                                          asset.ADJ_CLOSE_CHG.toLocaleString(
                                            "en-us",
                                            {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 2,
                                            }
                                          ) +
                                          " %" +
                                          ")"}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-xs">
                                    <RiArrowDownSFill color={"blue"} />
                                    <p
                                      className={"text-blue-500 font-semibold"}
                                    >
                                      {asset.ADJ_CLOSE_CHG &&
                                        "(" +
                                          asset.ADJ_CLOSE_CHG.toLocaleString(
                                            "en-us",
                                            {
                                              minimumFractionDigits: 0,
                                              maximumFractionDigits: 2,
                                            }
                                          ) +
                                          " %" +
                                          ")"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </li>
                          ))}
                      </div>
                      {/* <div className="px-2 py-1 border border-t-gray-100 shadow-sm  w-full ">
                        <div
                          onClick={() => router.push("/explore")}
                          className={"flex justify-center items-center py-3"}
                        >
                          더 보기
                        </div>
                      </div> */}
                    </div>
                  ) : data.length === 0 && !isValid ? (
                    <div></div>
                  ) : (
                    <Loading />
                  )}
                </ul>
              </div>
            </div>
          </div>
          {selectCoin.length > 0 && (
            <div className="sticky pt-10  bottom-0 left-0 right-0 flex justify-center">
              <button
                onClick={() =>
                  selectCoin.length < 2
                    ? toast(
                        router.locale == "ko"
                          ? "2 개 이상의 자산을 선택하세요"
                          : "Need to select more than 2 assets",
                        {
                          hideProgressBar: true,
                          autoClose: 2000,
                          type: "error",
                        }
                      )
                    : portDispatch({ type: "SET_NEXTSTEP", payload: true })
                }
                disabled={selectCoin.length < 2 ? true : false}
                className={`w-1/2 mx-8 text-white ${
                  selectCoin.length < 2 ? "bg-gray-300 " : "bg-blue-500 "
                } bg-blue-500  rounded-lg py-3 px-4`}
              >
                {selectCoin.length} 개 선택완료
              </button>
            </div>
          )}
        </div>
      ) : !isLoading && portState.isNextStep ? (
        <div className="flex flex-col  space-y-3">
          <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
            <Image
              className="cursor-pointer"
              src={"/images/icons/arrowLeft.svg"}
              alt="arrow"
              width={11}
              height={6}
              onClick={() => {
                portDispatch({ type: "SET_NEXTSTEP", payload: false });
                // portState.isAssetAddOpen && !portState.isNextStep
                //   ? portDispatch({ type: "SET_NEXTSTEP", payload: false })
                //   : portDispatch({ type: "SET_ASSETADD_OPEN", payload: false });
                // portDispatch({ type: "SET_NEXTSTEP", payload: false });
              }}
            />
            <p className="font-bold ">
              자산 추가 {"("}
              {selectCoin.length}
              {"/"}
              {"10"}
              {")"}
            </p>
            <div></div>
          </div>

          {selectCoin.map((asset: any, idx: number) => (
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

          {portState.isNextStep && allInputsFilled && (
            <div className="sticky pt-10  bottom-0 left-0 right-0 flex justify-center">
              <button
                onClick={submitHandler}
                className="w-1/2 mx-8 text-white bg-blue-500  rounded-lg py-3 px-4"
              >
                저장하기
              </button>
            </div>
          )}
        </div>
      ) : isLoading ? (
        <div className={"flex justify-center items-center py-2 h-full"}>
          <Lottie
            animationData={portfolioresult}
            renderer="svg"
            autoplay
            loop
            style={{ width: 400, height: 200 }}
          />
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

export default AddAssets;
