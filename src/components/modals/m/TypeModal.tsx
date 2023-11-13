import React, {
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
  useReducer,
} from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import { NowTrendingData } from "interfaces/main";
import useHandleImageError from "utils/useHandleImageError";

import ModalTable from "components/organisms/m/ModalTable";

function TypeModal({
  setIsTypeModalOpen,
  type,
}: {
  setIsTypeModalOpen: Dispatch<SetStateAction<boolean>>;
  type: string;
}) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleImageError = useHandleImageError();

  const router = useRouter();

  const [sortType, setSortType] = useState("weather");

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    `/api/typeRisk?&type=${type}&sortType=${sortType}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];

  const [sortWeatherOrder, setSortWeatherOrder] = useState("explode");
  const [sortRiskOrder, setSortRiskOrder] = useState("highRisk");

  const extremeRiseData = useMemo(() => {
    return data.filter(
      (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Volcano"
    );
  }, [data]);
  const riseData = useMemo(() => {
    return data.filter(
      (asset: NowTrendingData) =>
        asset.WTHR_ENG_NM === "Thunderstorm" ||
        asset.WTHR_ENG_NM === "Hurricane"
    );
  }, [data]);
  const sustainData = useMemo(() => {
    return data.filter(
      (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Mostly_cloudy"
    );
  }, [data]);
  const declineData = useMemo(() => {
    return data.filter(
      (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Sunny"
    );
  }, [data]);

  const veryHighData = useMemo(() => {
    return data.filter(
      (asset: NowTrendingData) => asset.CVaR_LV === "Very high"
    );
  }, [data]);
  const highData = useMemo(() => {
    return data.filter((asset: NowTrendingData) => asset.CVaR_LV === "High");
  }, [data]);
  const moderateData = useMemo(() => {
    return data.filter(
      (asset: NowTrendingData) => asset.CVaR_LV === "Moderate"
    );
  }, [data]);
  const lowData = useMemo(() => {
    return data.filter((asset: NowTrendingData) => asset.CVaR_LV === "Low");
  }, [data]);

  const volumeData = useMemo(() => {
    return explodeDt ? [].concat(...explodeDt) : [];
  }, [data]);

  const initialState = {
    extremeRiseData: 5,
    riseData: 5,
    sustainData: 5,
    declineData: 5,
    veryHighData: 5,
    highData: 5,
    moderateData: 5,
    lowData: 5,
    volumeData: 10,
  };

  function reducer(state: any, action: any) {
    switch (action.type) {
      case "INCREASE_COUNT":
        return {
          ...state,
          [action.dataset]: state[action.dataset] + 5,
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleLoadMore = (datasetName: string, dataset: NowTrendingData[]) => {
    if (state[datasetName] >= dataset.length) {
      router.push("/search");
    } else {
      dispatch({ type: "INCREASE_COUNT", dataset: datasetName });
    }
  };

  return (
    <main className="z-50 fixed   bg-white left-0 top-0 w-full h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-8">
        <div className="px-5 py-3 flex justify-between items-center">
          <Image
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => setIsTypeModalOpen(false)}
          />
          <h1 className="text-md">
            {type === "Korea (South)"
              ? "국내 주요 자산"
              : type === "United States"
              ? "해외 주요 자산"
              : "가상자산"}
          </h1>
          <div></div>
        </div>

        <div className="px-5 flex  items-center space-x-3 ">
          <p className="text-xl font-semibold">
            {" "}
            {type === "Korea (South)"
              ? "국내 주요 자산"
              : type === "United States"
              ? "해외 주요 자산"
              : "가상자산"}
          </p>
          <p className="text-sm text-gray-500">
            {type === "Korea (South)"
              ? "1904개 자산"
              : type === "United States"
              ? "1883개 자산"
              : "105개 자산"}
          </p>
        </div>
        <div className="flex flex-col ">
          <div className="flex  pl-6 pr-10  font-semibold justify-center space-x-12 ">
            <div className="flex flex-col ">
              <div
                className={`${
                  sortType === "weather" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => setSortType("weather")}
              >
                실시간 리스크
              </div>
              {sortType === "weather" && (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-8px]"} />
              )}
            </div>

            <div className="flex flex-col ">
              <div
                className={`${
                  sortType === "risk" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => setSortType("risk")}
              >
                위험도
              </div>
              {sortType === "risk" && (
                <hr
                  className={"border-b-2 border-b-black mt-1.5 mx-[-20px] "}
                />
              )}
            </div>
            <div className="flex flex-col ">
              <div
                className={`${
                  sortType === "volume" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => setSortType("volume")}
              >
                거래량
              </div>
              {sortType === "volume" && (
                <hr className={"border-b-2 border-b-black mt-1.5 mx-[-20px]"} />
              )}
            </div>
          </div>
          <hr />
          <div className="">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col     py-6 px-7  justify-between ">
                <p className="text-lg font-semibold">
                  {sortType === "weather"
                    ? "리스크, AI가 보내는 하락 신호"
                    : sortType === "risk"
                    ? "최대 손실률에 따른 위험도"
                    : sortType === "volume"
                    ? "거래대금이 가장 높은 순서대로"
                    : ""}
                </p>
                <p className="text-gray-500 text-xs">
                  {sortType === "weather"
                    ? "리스크가 상승하면 가격이 하락할 가능성이 커져요"
                    : sortType === "risk"
                    ? "최대 하락 시 손실률 규모따라 등급을 나눴어요"
                    : sortType === "volume"
                    ? "최근 거래가 많은 자산 순서대로 나열했어요 "
                    : ""}
                </p>
              </div>
              <Image
                className={`${
                  sortType === "weather"
                    ? " w-[40px] h-[40px]"
                    : "w-[32px] h-[32px] "
                }`}
                src={
                  sortType === "weather"
                    ? "/images/weather/explosion.svg"
                    : sortType === "risk"
                    ? "/images/icons/priceDown.svg"
                    : sortType === "volume"
                    ? "/images/icons/priceUp.svg"
                    : "/images/icons/weather/priceUp.svg"
                }
                alt="img"
                width={sortType === "weather" ? 40 : 32}
                height={sortType === "weather" ? 40 : 32}
              />
            </div>
            <div className="text-sm h-[5px] py-1.5 px-7 text-gray-500 bg-gray-100 flex justify-between items-center"></div>
            {sortType === "weather" && (
              <div className="">
                <select
                  className="text-center mt-6 ml-3 text-gray-400 text-sm"
                  onChange={(e) => setSortWeatherOrder(e.target.value)}
                >
                  <option className="text-gray-500" value="explode">
                    상승률 높은 순
                  </option>
                  <option className="text-gray-500" value="decline">
                    상승률 낮은 순
                  </option>
                </select>
                {sortWeatherOrder === "explode" ? (
                  <div>
                    <ModalTable
                      data={extremeRiseData}
                      isValid={isValid}
                      theme={"리스크 폭등"}
                      state={state.extremeRiseData}
                      handleLoadMore={handleLoadMore}
                      count={"extremeRiseData"}
                    />
                    <ModalTable
                      data={riseData}
                      isValid={isValid}
                      theme={"리스크 상승"}
                      state={state.riseData}
                      handleLoadMore={handleLoadMore}
                      count={"riseData"}
                    />
                    <ModalTable
                      data={sustainData}
                      isValid={isValid}
                      theme={"리스크 유지"}
                      state={state.sustainData}
                      handleLoadMore={handleLoadMore}
                      count={"sustainData"}
                    />
                    <ModalTable
                      data={declineData}
                      isValid={isValid}
                      theme={"리스크 완화"}
                      state={state.declineData}
                      handleLoadMore={handleLoadMore}
                      count={"declineData"}
                    />
                  </div>
                ) : (
                  <div>
                    <ModalTable
                      data={declineData}
                      isValid={isValid}
                      theme={"리스크 완화"}
                      state={state.declineData}
                      handleLoadMore={handleLoadMore}
                      count={"declineData"}
                    />
                    <ModalTable
                      data={sustainData}
                      isValid={isValid}
                      theme={"리스크 유지"}
                      state={state.sustainData}
                      handleLoadMore={handleLoadMore}
                      count={"sustainData"}
                    />
                    <ModalTable
                      data={riseData}
                      isValid={isValid}
                      theme={"리스크 상승"}
                      state={state.riseData}
                      handleLoadMore={handleLoadMore}
                      count={"riseData"}
                    />
                    <ModalTable
                      data={extremeRiseData}
                      isValid={isValid}
                      theme={"리스크 폭등"}
                      state={state.extremeRiseData}
                      handleLoadMore={handleLoadMore}
                      count={"extremeRiseData"}
                    />
                  </div>
                )}
              </div>
            )}

            {sortType === "risk" && (
              <div>
                <select
                  className="text-center mt-6 ml-3 text-gray-400 text-sm"
                  onChange={(e) => setSortRiskOrder(e.target.value)}
                >
                  <option className="text-gray-500" value="highRisk">
                    위험도 높은 순
                  </option>
                  <option className="text-gray-500" value="lowRisk">
                    위험도 낮은 순
                  </option>
                </select>
                {sortRiskOrder === "highRisk" ? (
                  <div>
                    <ModalTable
                      data={veryHighData}
                      isValid={isValid}
                      theme={"위험"}
                      state={state.veryHighData}
                      handleLoadMore={handleLoadMore}
                      count={"veryHighData"}
                    />
                    <ModalTable
                      data={highData}
                      isValid={isValid}
                      theme={"주의"}
                      state={state.highData}
                      handleLoadMore={handleLoadMore}
                      count={"highData"}
                    />
                    <ModalTable
                      data={moderateData}
                      isValid={isValid}
                      theme={"적정"}
                      state={state.moderateData}
                      handleLoadMore={handleLoadMore}
                      count={"moderateData"}
                    />
                    <ModalTable
                      data={lowData}
                      isValid={isValid}
                      theme={"안전"}
                      state={state.lowData}
                      handleLoadMore={handleLoadMore}
                      count={"lowData"}
                    />
                  </div>
                ) : (
                  <div>
                    <ModalTable
                      data={lowData}
                      isValid={isValid}
                      theme={"안전"}
                      state={state.lowData}
                      handleLoadMore={handleLoadMore}
                      count={"lowData"}
                    />
                    <ModalTable
                      data={moderateData}
                      isValid={isValid}
                      theme={"적정"}
                      state={state.moderateData}
                      handleLoadMore={handleLoadMore}
                      count={"moderateData"}
                    />
                    <ModalTable
                      data={highData}
                      isValid={isValid}
                      theme={"주의"}
                      state={state.highData}
                      handleLoadMore={handleLoadMore}
                      count={"highData"}
                    />
                    <ModalTable
                      data={veryHighData}
                      isValid={isValid}
                      theme={"위험"}
                      state={state.veryHighData}
                      handleLoadMore={handleLoadMore}
                      count={"veryHighData"}
                    />
                  </div>
                )}
              </div>
            )}

            {sortType === "volume" && (
              <ModalTable
                data={volumeData}
                isValid={isValid}
                theme={"거래대금 상위"}
                state={state.volumeData}
                handleLoadMore={handleLoadMore}
                count={"volumeData"}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default TypeModal;
