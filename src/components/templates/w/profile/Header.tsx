import React, { useState, useCallback } from "react";
import Image from "next/image";
import useHandleWeatherImageError from "utils/useHandleWeatherImageError";
import {
  useGlobalState,
  useGlobalDispatch,
  StateType,
  ActionType,
} from "contexts/SearchContext";
import { useRouter } from "next/router";
interface props {
  userProfile: any;
}
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

function Header({ userProfile }: props) {
  const router = useRouter();

  const dispatch = useGlobalDispatch();

  const handleImageError = useHandleWeatherImageError();
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("recentSearches") || "[]")
      : [];
  });
  const debouncedSave = useCallback(
    debounce((query: string) => saveToLocalStorage(query), 1000),
    []
  );
  const handleRecentSearchClick = (searchTerm: string) => {
    dispatch({ type: "SET_SEARCH", payload: searchTerm }); // 검색창에 검색어 설정
    dispatch({ type: "SET_SEARCH_MODAL_OPEN", payload: true });
    debouncedSave(searchTerm); // localStorage에 저장
    router.push("/search");
  };
  return (
    <main className="w-full bg-white">
      <div className="flex flex-col">
        <div className="flex items-center p-5 space-x-3">
          <Image
            onError={handleImageError}
            width={60}
            height={60}
            unoptimized
            src={
              userProfile?.profileImage
                ? userProfile?.profileImage
                : "/images/logos/errorLogo.png"
            }
            referrerPolicy="no-referrer"
            loading="eager"
            alt="profile"
          />
          <div className="flex flex-col ">
            <p> {userProfile?.name}</p>
            <p
              className={`text-xs ${
                userProfile?.toleranceResult &&
                userProfile?.toleranceResult == "aggressive"
                  ? "text-red-400 font-bold "
                  : userProfile?.toleranceResult == "moderate"
                  ? "text-orange-400 font-bold "
                  : userProfile?.toleranceResult == "moderately conservative"
                  ? "text-yellow-400 font-bold "
                  : userProfile?.toleranceResult == "conservative"
                  ? "text-green-400 font-bold "
                  : "text-gray-400 "
              } `}
            >
              {" "}
              {userProfile?.toleranceResult
                ? router.locale == "ko"
                  ? userProfile?.toleranceResult == "aggressive"
                    ? "공격적인 투자자"
                    : userProfile?.toleranceResult == "moderate"
                    ? "중립적인 투자자"
                    : userProfile?.toleranceResult == "moderately conservative"
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
        </div>

        <div className="p-5 flex flex-col">
          <p className="font-bold text-lg">최근 검색</p>
          <div className="  mt-2 overflow-x-auto whitespace-nowrap flex">
            {recentSearches.map((search, idx) => (
              <span
                key={idx}
                onClick={() => {
                  handleRecentSearchClick(search);
                }}
                className="cursor-pointer bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2 text-sm"
              >
                {search}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Header;
