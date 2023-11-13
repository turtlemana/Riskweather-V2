import React, { useMemo } from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import { NowTrendingData } from "interfaces/main";
import useHandleImageError from "utils/useHandleImageError";
import {
  useGlobalState,
  useGlobalDispatch,
  StateType,
  ActionType,
} from "contexts/SearchContext";

import SearchModal from "components/modals/m/SearchModal";
import SearchTable from "components/organisms/m/SearchTable";

function Search({}: {}) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleImageError = useHandleImageError();
  const router = useRouter();
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: koreaDt, isValidating: isKoreaValid } = useSWR(
    `/api/typeRisk?&type=Korea (South)&sortType=${state.koreaSortType}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const koreaData = koreaDt ? [].concat(...koreaDt) : [];

  const { data: foreignDt, isValidating: isForeignValid } = useSWR(
    `/api/typeRisk?&type=United States&sortType=${state.foreignSortType}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const foreignData = foreignDt ? [].concat(...foreignDt) : [];

  const { data: cryptoDt, isValidating: isCryptoValid } = useSWR(
    `/api/typeRisk?&type=Crypto&sortType=${state.cryptoSortType}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const cryptoData = cryptoDt ? [].concat(...cryptoDt) : [];

  const filteredKoreanData = useMemo(() => {
    if (!koreaData) return [];

    switch (state.koreaSortType) {
      case "weather":
        switch (state.koreanWeatherTrait) {
          case "extremeRiseData":
            return koreaData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Volcano"
            );
          case "riseData":
            return koreaData.filter(
              (asset: NowTrendingData) =>
                asset.WTHR_ENG_NM === "Thunderstorm" ||
                asset.WTHR_ENG_NM === "Hurricane"
            );
          case "sustainData":
            return koreaData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Mostly_cloudy"
            );
          case "declineData":
            return koreaData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Sunny"
            );
          default:
            return [];
        }
      case "risk":
        switch (state.koreanRiskTrait) {
          case "veryHighData":
            return koreaData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Very high"
            );
          case "highData":
            return koreaData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "High"
            );
          case "moderateData":
            return koreaData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Moderate"
            );
          case "lowData":
            return koreaData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Low"
            );
          default:
            return [];
        }
      case "volume":
        return koreaDt ? [].concat(...koreaDt) : [];
      default:
        return [];
    }
  }, [
    koreaData,
    state.koreaSortType,
    state.koreanWeatherTrait,
    state.koreanRiskTrait,
  ]);

  const filteredCryptoData = useMemo(() => {
    if (!cryptoData) return [];

    switch (state.cryptoSortType) {
      case "weather":
        switch (state.cryptoWeatherTrait) {
          case "extremeRiseData":
            return cryptoData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Volcano"
            );
          case "riseData":
            return cryptoData.filter(
              (asset: NowTrendingData) =>
                asset.WTHR_ENG_NM === "Thunderstorm" ||
                asset.WTHR_ENG_NM === "Hurricane"
            );
          case "sustainData":
            return cryptoData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Mostly_cloudy"
            );
          case "declineData":
            return cryptoData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Sunny"
            );
          default:
            return [];
        }
      case "risk":
        switch (state.cryptoRiskTrait) {
          case "veryHighData":
            return cryptoData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Very high"
            );
          case "highData":
            return cryptoData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "High"
            );
          case "moderateData":
            return cryptoData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Moderate"
            );
          case "lowData":
            return cryptoData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Low"
            );
          default:
            return [];
        }
      case "volume":
        return cryptoDt ? [].concat(...cryptoDt) : [];
      default:
        return [];
    }
  }, [
    cryptoData,
    state.cryptoSortType,
    state.cryptoRiskTrait,
    state.cryptoWeatherTrait,
  ]);

  const filteredForeignData = useMemo(() => {
    if (!foreignData) return [];

    switch (state.foreignSortType) {
      case "weather":
        switch (state.foreignWeatherTrait) {
          case "extremeRiseData":
            return foreignData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Volcano"
            );
          case "riseData":
            return foreignData.filter(
              (asset: NowTrendingData) =>
                asset.WTHR_ENG_NM === "Thunderstorm" ||
                asset.WTHR_ENG_NM === "Hurricane"
            );
          case "sustainData":
            return foreignData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Mostly_cloudy"
            );
          case "declineData":
            return foreignData.filter(
              (asset: NowTrendingData) => asset.WTHR_ENG_NM === "Sunny"
            );
          default:
            return [];
        }
      case "risk":
        switch (state.foreignRiskTrait) {
          case "veryHighData":
            return foreignData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Very high"
            );
          case "highData":
            return foreignData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "High"
            );
          case "moderateData":
            return foreignData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Moderate"
            );
          case "lowData":
            return foreignData.filter(
              (asset: NowTrendingData) => asset.CVaR_LV === "Low"
            );
          default:
            return [];
        }
      case "volume":
        return foreignDt ? [].concat(...foreignDt) : [];
      default:
        return [];
    }
  }, [
    foreignData,
    state.foreignSortType,
    state.foreignWeatherTrait,
    state.foreignRiskTrait,
  ]);

  const handleLoadMore = (
    dataType: "korea" | "foreign" | "crypto",
    datasetName: keyof StateType["korea"],
    dataset: NowTrendingData[]
  ) => {
    if (["korea", "foreign", "crypto"].includes(dataType)) {
      if (state[dataType][datasetName] >= dataset.length) {
        router.push("/explore");
      } else {
        dispatch({
          type: "INCREASE_COUNT",
          dataType: dataType,
          dataset: datasetName,
        });
      }
    } else {
      console.error("Invalid dataType provided to handleLoadMore");
    }
  };

  return (
    <main className="fixed pb-12 bg-white z-30 left-0 top-0 w-full h-screen overflow-y-auto">
      <div className="flex flex-col space-y-5">
        <div className="px-8 ">
          <section
            onClick={() =>
              dispatch({ type: "SET_SEARCH_MODAL_OPEN", payload: true })
            }
            className="  h-10 mt-5   py-5 px-4 flex items-center border border-solid border-gray-100 bg-gray-50 rounded-xl "
          >
            <Image
              src={"/images/icons/search.svg"}
              alt="search"
              className="mr-2 w-4 h-4"
              width={4}
              height={4}
            />
            <div
              placeholder={router.locale == "ko" ? "자산 검색" : "Search"}
              className="text-gray-400 outline-none  text-sm w-full bg-gray-50"
            >
              {router.locale == "ko" ? "자산 검색" : "Search"}
            </div>
          </section>
        </div>
        <div className="flex flex-col">
          <div className="">
            <div className="">
              <SearchTable
                data={filteredKoreanData}
                theme={"국내 주요 자산"}
                sortType={state.koreaSortType}
                dispatchSort={"SET_KOREA_SORT_TYPE"}
                isValid={isKoreaValid}
                len={
                  state.korea[
                    state.koreanWeatherTrait as keyof typeof state.korea
                  ]
                }
                handleLoadMore={() =>
                  handleLoadMore(
                    "korea",
                    state.koreanWeatherTrait as keyof typeof state.korea,
                    filteredKoreanData
                  )
                }
                count={state.koreanWeatherTrait}
              />
              <SearchTable
                data={filteredForeignData}
                theme={"해외 주요 자산"}
                sortType={state.foreignSortType}
                dispatchSort={"SET_FOREIGN_SORT_TYPE"}
                isValid={isForeignValid}
                len={
                  state.foreign[
                    state.foreignWeatherTrait as keyof typeof state.foreign
                  ]
                }
                handleLoadMore={() =>
                  handleLoadMore(
                    "foreign",
                    state.foreignWeatherTrait as keyof typeof state.foreign,
                    filteredForeignData
                  )
                }
                count={state.foreignWeatherTrait}
              />
              <div className="pb-[120px]">
                <SearchTable
                  data={filteredCryptoData}
                  theme={"가상자산"}
                  sortType={state.cryptoSortType}
                  dispatchSort={"SET_CRYPTO_SORT_TYPE"}
                  isValid={isCryptoValid}
                  len={
                    state.crypto[
                      state.cryptoWeatherTrait as keyof typeof state.crypto
                    ]
                  }
                  handleLoadMore={() =>
                    handleLoadMore(
                      "crypto",
                      state.cryptoWeatherTrait as keyof typeof state.crypto,
                      filteredCryptoData
                    )
                  }
                  count={state.cryptoWeatherTrait}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {state.isSearchModalOpen && <SearchModal />}
    </main>
  );
}

export default Search;
