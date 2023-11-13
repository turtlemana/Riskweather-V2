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

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let inDebounce: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func(...args), delay);
  };
};

const saveToLocalStorage = (query: string) => {
  if (!query.trim()) {
    return;
  }
  const existingSearches = JSON.parse(
    localStorage.getItem("recentSearches") || "[]"
  );
  if (!existingSearches.includes(query.trim())) {
    const newSearches = [query, ...existingSearches].slice(0, 10); // 최근 10개만 저장
    localStorage.setItem("recentSearches", JSON.stringify(newSearches));
  }
};

function SearchModal({}) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleImageError = useHandleImageError();
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();
  const router = useRouter();
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    `/api/search?search=${encodeURIComponent(state.searchInput)}`,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];
  const debouncedSave = useCallback(
    debounce((query: string) => saveToLocalStorage(query), 1000),
    []
  );
  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      if (query.length > 20) {
        return;
      }
      dispatch({ type: "SET_SEARCH", payload: query });
      debouncedSave(query);
    },
    [dispatch, debouncedSave]
  );

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      // Enter 터치 이벤트 감지
      event.preventDefault(); // 기본적인 터치 이벤트 동작 방지

      if (data.length >= 1) {
        const firstItem = data[0]; // 첫 번째 항목
        router.push({ pathname: `/detail/${firstItem["ITEM_CD_DL"]}` });
      }
    }
  };
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem("recentSearches") || "[]");
  });

  React.useEffect(() => {
    setRecentSearches(
      JSON.parse(localStorage.getItem("recentSearches") || "[]")
    );
  }, []);
  const handleRecentSearchClick = (searchTerm: string) => {
    dispatch({ type: "SET_SEARCH", payload: searchTerm }); // 검색창에 검색어 설정
    debouncedSave(searchTerm); // localStorage에 저장
  };

  return (
    <main className="z-50 fixed pb-16  bg-white left-0 top-0 w-full h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-3">
        <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
          <Image
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() =>
              dispatch({ type: "SET_SEARCH_MODAL_OPEN", payload: false })
            }
          />
          <section
            onClick={() =>
              dispatch({ type: "SET_SEARCH_MODAL_OPEN", payload: true })
            }
            className="w-full  h-10   py-5 px-4 flex items-center border border-solid border-gray-100 bg-gray-50 rounded-xl "
          >
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
              onKeyUp={handleKeyUp}
            />
          </section>
          <div></div>
        </div>

        <div className="flex flex-col ">
          <div className=" ml-5 mx-2 mt-0 overflow-x-auto whitespace-nowrap flex">
            {recentSearches.map((search, idx) => (
              <span
                key={idx}
                onClick={() => handleRecentSearchClick(search)}
                className="cursor-pointer bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2 text-sm"
              >
                {search}
              </span>
            ))}
          </div>
          <div className="">
            <ul className=" overflow-y-auto flex flex-col ">
              {data.length > 0 && !isValid ? (
                <div>
                  <div className="p-5 space-y-4">
                    {data.map((asset: NowTrendingData, i: number) => (
                      <li
                        onClick={() =>
                          router.push(`/detail/${asset.ITEM_CD_DL}`)
                        }
                        key={i}
                        className="flex justify-between items-center"
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
                                {asset.CAT !== "Index"
                                  ? router.locale === "ko"
                                    ? asset.ADJ_CLOSE_KRW &&
                                      asset.ADJ_CLOSE_KRW.toLocaleString(
                                        "en-us",
                                        {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0,
                                        }
                                      ) + "원"
                                    : asset.ADJ_CLOSE_USD &&
                                      asset.ADJ_CLOSE_USD.toLocaleString(
                                        "en-us",
                                        {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                        }
                                      ) + "＄"
                                  : asset.ADJ_CLOSE &&
                                    asset.ADJ_CLOSE.toLocaleString("en-us", {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    })}
                              </p>
                              {asset.ADJ_CLOSE_CHG &&
                              asset.ADJ_CLOSE_CHG > 0 ? (
                                <div
                                  className={`flex items-center text-xs font-semibold  ${
                                    asset.ADJ_CLOSE_KRW > 10000000
                                      ? "pt-1 "
                                      : ` `
                                  } `}
                                >
                                  <RiArrowUpSFill color={"red"} />
                                  <p className={"text-red-500 mr-1"}>
                                    {asset.ADJ_CLOSE_CHANGE &&
                                      asset.ADJ_CLOSE_CHANGE.toLocaleString(
                                        "en-us",
                                        {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                  </p>
                                  <p className={"text-red-500"}>
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
                                <div
                                  onClick={() =>
                                    router.push(`/detail/${asset.ITEM_CD_DL}`)
                                  }
                                  className="flex items-center text-xs font-semibold"
                                >
                                  <RiArrowDownSFill color={"blue"} />
                                  <p className={"text-blue-500 mr-1"}>
                                    {asset.ADJ_CLOSE_CHANGE &&
                                      asset.ADJ_CLOSE_CHANGE.toLocaleString(
                                        "en-us",
                                        {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                        }
                                      )}
                                  </p>
                                  <p className={"text-blue-500"}>
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
                          </div>
                        </div>

                        <div
                          className={`py-1 h-6 px-4 rounded-20 text-center flex items-center justify-center ${
                            COLORS[asset.CVaR_LV]
                          }`}
                        >
                          <h6 className="text-xs ">
                            {router.locale == "ko"
                              ? asset.CVaR_LV_KR
                              : asset.CVaR_LV}
                          </h6>
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
    </main>
  );
}

export default SearchModal;
