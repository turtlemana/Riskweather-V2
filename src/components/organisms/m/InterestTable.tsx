import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { NowTrendingData } from "interfaces/main";
import Loading from "./Loading";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import useHandleImageError from "utils/useHandleImageError";
import { OptionModal } from "components/modals/m/OptionModal";

interface Props {
  data: NowTrendingData[];
  isValid: boolean;
  isOptionOpen: boolean;
  setIsOptionOpen: Dispatch<SetStateAction<boolean>>;
  setIsSearchModalOpen: Dispatch<SetStateAction<boolean>>;
  session: any;
  update: any;
  mutate: any;
  interestMutate: any;
}

function InterestTable({
  session,
  update,
  mutate,
  interestMutate,
  data,
  isValid,
  isOptionOpen,
  setIsOptionOpen,
  setIsSearchModalOpen,
}: Props) {
  const router = useRouter();
  const handleImageError = useHandleImageError();
  const [sortOrder, setSortOrder] = useState("riskHigh");
  const [selectedAsset, setSelectedAsset] = useState<NowTrendingData | null>(
    null
  );
  const [sortedData, setSortedData] = useState(data);
  const [currency, setCurrency] = useState("KRW");
  useEffect(() => {
    let sorted = [...(data || [])]; // 원본 데이터를 변경하지 않기 위해 복사합니다.

    switch (sortOrder) {
      case "returnHigh":
        sorted.sort((a, b) => b.ADJ_CLOSE_CHG - a.ADJ_CLOSE_CHG);
        break;
      case "returnLow":
        sorted.sort((a, b) => a.ADJ_CLOSE_CHG - b.ADJ_CLOSE_CHG);
        break;
      case "riskHigh":
        sorted.sort((a, b) => b.CVaRNTS - a.CVaRNTS);
        break;
      case "riskLow":
        sorted.sort((a, b) => a.CVaRNTS - b.CVaRNTS);
        break;
      default:
        break;
    }

    setSortedData(sorted);
  }, [sortOrder, data]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto ">
      <div className="flex-grow overflow-auto pb-14">
        <div className="p-5">
          <h1 className="text-2xl">내 관심 자산</h1>
        </div>
        <div className="text-sm w-screen py-2 px-7 text-gray-500 bg-gray-100 flex justify-between items-center">
          <p>종목명</p>
          <p>리스크 상태</p>
        </div>
        <div className="flex justify-between items-center px-5">
          <div>
            <select
              className="text-center mt-5 mb-2  text-gray-400 text-sm"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option className="text-gray-500" value="riskHigh">
                리스크 높은 순
              </option>
              <option className="text-gray-500" value="riskLow">
                리스크 낮은 순
              </option>
              <option className="text-gray-500" value="returnHigh">
                일간 수익 높은 순
              </option>
              <option className="text-gray-500" value="returnLow">
                일간 수익 낮은 순
              </option>
            </select>
          </div>
          <div className="relative mt-5 mb-2 rounded-2xl">
            <div
              className="border absolute w-1/2 h-full bg-white rounded-2xl transform transition-transform duration-300"
              style={{
                transform:
                  currency === "KRW" ? "translateX(0%)" : "translateX(100%)",
              }}
            ></div>
            <div className="flex border rounded-2xl overflow-hidden h-[25px] justify-center items-center">
              <button
                onClick={() => setCurrency("KRW")}
                className={`text-xs font-bold flex-1 py-2 px-3 ${
                  currency === "KRW"
                    ? "bg-white text-black"
                    : "bg-gray-200 text-gray-400"
                } leading-none`}
                style={{
                  transform:
                    currency === "KRW" ? "translateY(-1px)" : "translateY(0px)",
                }}
              >
                원화
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`text-xs font-bold flex-1 py-2 px-3 ${
                  currency === "USD"
                    ? "bg-white text-black"
                    : "bg-gray-200 text-gray-400"
                } leading-none`}
                style={{
                  transform:
                    currency === "USD" ? "translateY(-1px)" : "translateY(0px)",
                }}
              >
                달러
              </button>
            </div>
          </div>
        </div>
        <ul className=" flex flex-col  border-b-gray-100 h-screen">
          {data && data.length > 0 ? (
            <div>
              <div className="p-5 space-y-4">
                {sortedData.map((asset: NowTrendingData, i: number) => (
                  <li key={i} className="flex justify-between">
                    <div
                      className="flex shrink-0 space-x-5 items-center"
                      onClick={() => router.push(`/detail/${asset.ITEM_CD_DL}`)}
                    >
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
                            {currency === "KRW"
                              ? asset.ADJ_CLOSE_KRW &&
                                asset.ADJ_CLOSE_KRW.toLocaleString("en-us", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }) + (asset.CAT !== "Index" ? "원" : "")
                              : asset.ADJ_CLOSE_USD &&
                                asset.ADJ_CLOSE_USD.toLocaleString("en-us", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }) + (asset.CAT !== "Index" ? "＄" : "")}
                          </p>
                          {asset.ADJ_CLOSE_CHG && asset.ADJ_CLOSE_CHG > 0 ? (
                            <p className="text-red-500 text-xs font-semibold ">
                              {"(" +
                                "+" +
                                asset.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) +
                                "%" +
                                ")"}
                            </p>
                          ) : (
                            <p className="text-blue-500 text-xs font-semibold">
                              {"(" +
                                asset.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }) +
                                "%" +
                                ")"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-between space-x-2">
                      <div
                        onClick={() =>
                          router.push(`/detail/${asset.ITEM_CD_DL}`)
                        }
                        className="w-[120px]  truncate flex  justify-center items-center space-x-1"
                      >
                        <Image
                          src={`/images/weather/${asset.WTHR_ENG_NM}.svg`}
                          width={28}
                          height={28}
                          alt={`weather`}
                        />
                        <p className="text-xs">
                          {router.locale === "ko"
                            ? asset.WTHR_KR_DL && asset.WTHR_KR_DL
                            : asset.WTHR_ENG_DL && asset.WTHR_ENG_DL}
                        </p>
                      </div>
                      <Image
                        width={20}
                        height={20}
                        src="/images/icons/option.svg"
                        alt="option"
                        onClick={() => {
                          setIsOptionOpen(true);
                          setSelectedAsset(asset);
                        }}
                      />
                    </div>
                  </li>
                ))}
              </div>
            </div>
          ) : isValid ? (
            <Loading />
          ) : (
            <div className="h-screen p-5">
              <div className=" w-full h-[200px] bg-gray-100 rounded-xl"></div>
            </div>
          )}
        </ul>
        <OptionModal
          interestMutate={interestMutate}
          mutate={mutate}
          session={session}
          update={update}
          isOpen={isOptionOpen}
          onClose={() => setIsOptionOpen(false)}
          asset={selectedAsset as any}
          onRemove={() => {
            // 여기에서 선택된 항목을 삭제하는 로직을 추가합니다.
            // 예: data 배열에서 해당 항목을 제거
            setSelectedAsset(null);
          }}
        />
      </div>

      <div className="fixed  bottom-20 left-0 right-0 flex justify-center">
        <button
          onClick={() => {
            setIsSearchModalOpen(true);
          }}
          className="w-full mx-8 text-blue-500 font-bold bg-blue-50 rounded-lg py-2 px-4"
        >
          +자산 추가
        </button>
      </div>
    </div>
  );
}

export default InterestTable;
