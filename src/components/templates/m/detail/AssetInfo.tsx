import React, { useMemo, useState, Dispatch, SetStateAction } from "react";
import { INFO_DATA } from "data/detail";
import { DetailInfo, InfoData, RenderInfoData } from "interfaces/detail";
import { useRouter } from "next/router";

function AssetInfo({
  type,
  setType,
  detailInfo,
  cat,
}: {
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  detailInfo: DetailInfo;
  cat: string;
}) {
  const router = useRouter();

  const infoData: InfoData[] = useMemo(() => {
    if (detailInfo) {
      const { ITEM_CD, ITEM_CD_DL, ITEM_ENG_NM, ...infData }: DetailInfo =
        detailInfo;
      const entries = Object.entries(infData);

      const arr = entries.map(
        ([key, value]: [string, string | number | null]) => ({ key, value })
      );

      return arr;
    }
    return [];
  }, [detailInfo]);

  const renderData: RenderInfoData[] = useMemo(() => {
    for (let i = 0; i < INFO_DATA.length; i++) {
      for (let j = 0; j < infoData.length; j++) {
        if (INFO_DATA[i].originalData == infoData[j].key) {
          //@ts-ignore
          INFO_DATA[i].value = infoData[j].value;
          break;
        }
      }
    }
    return INFO_DATA;
  }, [infoData]);

  const filteredArray = useMemo(() => {
    return renderData.filter(({ title, value }) => {
      return (
        value &&
        value !== "NA" &&
        !["Category", "Country", "Website", "Sector", "Industry"].includes(
          title
        )
      );
    });
  }, [renderData]);

  return (
    <main id="itemInfo" className="mb-3 w-full bg-white">
      <div className="flex flex-col p-5 space-y-5">
        <div>
          <p className="font-bold text-xl">{"종목정보"}</p>
        </div>

        <ul className="flex flex-col space-y-3">
          {(type === "assetInfo"
            ? filteredArray
            : filteredArray.slice(0, 4)
          ).map((item, index) => {
            if (index % 2 !== 0) return null;

            const currentItem = item;
            const nextItem = filteredArray[index + 1];

            return (
              <li key={currentItem.id} className="flex justify-between">
                <div className="flex flex-col w-1/2">
                  <p className="text-gray-400 text-sm">
                    {router.locale === "ko"
                      ? currentItem.koreanTitle
                      : currentItem.title}
                  </p>
                  <p className="font-semibold">
                    {currentItem.title === "Category"
                      ? (currentItem.value || "")[0].toUpperCase() +
                        (currentItem.value || "").slice(1)
                      : isNaN(parseFloat(currentItem.value || ""))
                      ? currentItem.value || ""
                      : parseFloat(currentItem.value || "").toLocaleString()}
                  </p>
                </div>
                {nextItem && (
                  <div className="flex flex-col w-1/2">
                    <p className="text-gray-400 text-sm">
                      {router.locale === "ko"
                        ? nextItem.koreanTitle
                        : nextItem.title}
                    </p>
                    <p className="font-semibold truncate" title="value">
                      {nextItem.title === "Category"
                        ? (nextItem.value || "")[0].toUpperCase() +
                          (nextItem.value || "").slice(1)
                        : isNaN(parseFloat(nextItem.value || ""))
                        ? nextItem.value || ""
                        : parseFloat(nextItem.value || "").toLocaleString()}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {cat !== "Crypto" && cat !== "Index" && type !== "assetInfo" && (
          <div className="px-5">
            <button
              className="flex bg-gray-100 text-gray-500 rounded-lg w-full h-10 justify-center items-center"
              onClick={() => setType(type === "assetInfo" ? "" : "assetInfo")}
            >
              <p className=" text-sm font-semibold">{"더 보기"}</p>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default AssetInfo;
