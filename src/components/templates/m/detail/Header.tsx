import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useMemo,
} from "react";
import { DetailData } from "interfaces/detail";
import useHandleImageError from "utils/useHandleImageError";
import Image from "next/image";
import { useRouter } from "next/router";
import { CSVLink } from "react-csv";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import liveRisk from "../../../../../public/lottie/liveRisk.json";

function Header({
  isNullDetailInfo,
  detailData,
  type,
  setType,
  isItemCD_DLPresent,
  aiResult,
}: {
  isNullDetailInfo: boolean;
  detailData: DetailData;
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  isItemCD_DLPresent: boolean;
  aiResult: any;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();
  const handleImageError = useHandleImageError();
  const { data: session, status, update }: any = useSession();

  const isInterested = useMemo(() => {
    if (session && session.user) {
      return session.user.interest.includes(detailData.ITEM_CD_DL);
    }
  }, [session]);

  const handleStarClick = async () => {
    if (!session || !session.user) {
      router.push("/login");
      return;
    } else {
      const enteredInput = {
        interest: {
          name: encodeURIComponent(detailData.ITEM_ENG_NM),
          krName: encodeURIComponent(detailData.ITEM_KR_NM),
          ticker: detailData.ITEM_CD_DL,
        },
        action: isInterested ? "remove" : "add",
      };

      const data = await fetch(`/api/auth/user?session=${session.user.email}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enteredInput }),
      }).then((res) => {
        if (res.ok) {
          toast(
            router.locale == "ko"
              ? "관심 자산에 등록됐습니다"
              : "Successfully added",
            { hideProgressBar: true, autoClose: 2000, type: "success" }
          );
          update();
        } else {
          toast(
            router.locale == "ko"
              ? "관심 자산 등록에 실패했습니다"
              : "Fetch Error",
            { hideProgressBar: true, autoClose: 2000, type: "error" }
          );
        }
      });
    }
  };

  return (
    <main className="mb-3 w-full bg-white">
      <div className="flex flex-col ">
        <div className="sticky top-0  bg-white px-5 py-5 flex justify-between items-center">
          <Image
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => router.back()}
          />

          <div className="flex items-center space-x-5">
            {isInterested ? (
              <Image
                src={"/images/icons/starBlue.svg"}
                width={30}
                height={30}
                alt="star"
                onClick={handleStarClick}
              />
            ) : (
              <Image
                src={"/images/icons/starGray.svg"}
                width={30}
                height={30}
                alt="star"
                onClick={handleStarClick}
              />
            )}
            {isClient && (
              <CSVLink
                data={[detailData as DetailData]}
                filename={`${router.query.ticker}.csv`}
              >
                <Image
                  className="w-auto h-auto"
                  src={"/images/icons/download.svg"}
                  width={30}
                  height={30}
                  alt="download"
                />
              </CSVLink>
            )}
          </div>
        </div>
        <div className="flex shrink-0 space-x-3 items-center pt-5 pb-2 px-5">
          <Image
            unoptimized
            quality={100}
            className="w-[36px] h-[36px]"
            src={
              `/images/logos/${detailData.ITEM_CD_DL}.png` ||
              "/images/logos/errorLogo.png"
            }
            width={36}
            height={36}
            alt="logo"
            onError={(event) => handleImageError(event, detailData.HR_ITEM_NM)}
          />
          <div className="flex flex-col space-y-0.5">
            <div className="flex items-center space-x-1">
              <p className="text-gray-500 text-[10px]">
                {detailData.ITEM_CD_DL && detailData.ITEM_CD_DL}
              </p>
              <p className="text-gray-500 text-[10px]">
                {detailData.HR_ITEM_NM && detailData.HR_ITEM_NM}
              </p>
            </div>
            <p className="font-semibold truncate text-xl">
              {router.locale === "ko"
                ? detailData.ITEM_KR_NM && detailData.ITEM_KR_NM
                : detailData.ITEM_ENG_NM && detailData.ITEM_ENG_NM}
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-0.5 px-5">
          <div className="flex space-x-1 items-center">
            <p className="font-semibold text-2xl">
              {detailData.ADJ_CLOSE &&
                detailData.ADJ_CLOSE.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
            </p>
            <p className="font-semibold text-lg">
              {detailData.CAT !== "Index" && detailData.CURR && detailData.CURR}
            </p>
          </div>
          {/* {router.locale === "ko"
              ? detailData.ADJ_CLOSE_KRW &&
                detailData.ADJ_CLOSE_KRW.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }) + "원"
              : detailData.ADJ_CLOSE_USD &&
                detailData.ADJ_CLOSE_USD.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }) + "＄"} */}
          <div className="flex items-center space-x-2">
            <p className="text-gray-500 text-sm">{"전일대비"}</p>
            {detailData.ADJ_CLOSE_CHG && detailData.ADJ_CLOSE_CHG > 0 ? (
              <p className="text-red-500 text-xs font-semibold ">
                {"+" +
                  detailData.ADJ_CLOSE_CHANGE.toLocaleString("en-us", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }) +
                  " " +
                  "(" +
                  detailData.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) +
                  "%" +
                  ")"}
              </p>
            ) : (
              <p className="text-blue-500 text-xs font-semibold">
                {detailData.ADJ_CLOSE_CHANGE.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }) +
                  " " +
                  "(" +
                  detailData.ADJ_CLOSE_CHG.toLocaleString("en-us", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) +
                  "%" +
                  ")"}
              </p>
            )}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          {isItemCD_DLPresent && (
            <div className="flex items-center rounded-lg bg-gray-50 w-full py-2 px-3 ">
              <div className=" text-[13px] flex items-center space-x-5">
                <div className="flex items-center space-x-2">
                  <Lottie
                    animationData={liveRisk}
                    renderer="svg"
                    autoplay
                    loop
                    style={{ width: 7, height: 7 }}
                  />{" "}
                  <p className="text-gray-800 font-semibold">
                    실시간 리스크 높음
                  </p>
                </div>

                <p className=" text-gray-200">|</p>
                <p className="text-gray-600 ">순간적 가격 하락에 대비하세요</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-5 px-5 pt-6  font-semibold">
          <div className="flex flex-col">
            <div
              className={`${type === "AI" ? "text-black " : "text-gray-400 "}`}
              onClick={() => setType("AI")}
            >
              <div className={"flex space-x-1 items-center flex-shrink-0"}>
                <p>{"AI 분석"}</p>
                <Image
                  src="/images/icons/lightning.svg"
                  alt="lightning"
                  width={12}
                  height={12}
                />
              </div>
            </div>
            {type === "AI" && (
              <hr className={"border-b-2 border-b-black mt-1.5"} />
            )}
          </div>

          <div className="flex flex-col ">
            <div
              className={`${
                type === "chart" ? "text-black " : "text-gray-400 "
              }`}
              onClick={() => setType("chart")}
            >
              <p>{"차트"}</p>
            </div>
            {type === "chart" && (
              <hr className={"border-b-2 border-b-black mt-1.5"} />
            )}
          </div>
          {/* <div className="flex flex-col ">
            <Link
              href={"#myAsset"}
              className={`${
                type === "myAsset" ? "text-black " : "text-gray-400 "
              }`}
              onClick={() => setType("myAsset")}
            >
              <p>{"내 자산"}</p>
            </Link>
            {type === "myAsset" && (
              <hr className={"border-b-2 border-b-black mt-1.5 "} />
            )}
          </div> */}

          {!isNullDetailInfo && (
            <div className="flex flex-col ">
              <div
                className={`${
                  type === "assetInfo" ? "text-black " : "text-gray-400 "
                }`}
                onClick={() => setType("assetInfo")}
              >
                <p>{"종목정보"}</p>
              </div>
              {type === "assetInfo" && (
                <hr className={"border-b-2 border-b-black mt-1.5 "} />
              )}
            </div>
          )}

          {/* <div className="flex flex-col ">
            <Link
              href={"#News"}
              className={`${
                type === "news" ? "text-black " : "text-gray-400 "
              }`}
              onClick={() => setType("news")}
            >
              <p>{"뉴스"}</p>
            </Link>
            {type === "news" && (
              <hr className={"border-b-2 border-b-black mt-1.5 "} />
            )}
          </div> */}
        </div>
        <hr />
        {type === "AI" && (
          <div>
            <div className="p-5 flex flex-col space-y-2 ">
              <div className="text-sm flex items-center space-x-1.5">
                {detailData.CVaR_LV_KR && (
                  <p
                    className={`${
                      detailData.CVaR_LV === "Very high"
                        ? "text-red-500 "
                        : detailData.CVaR_LV === "Moderate"
                        ? "text-orange-300 "
                        : detailData.CVaR_LV === "High"
                        ? "text-red-500 "
                        : detailData.CVaR_LV === "Low"
                        ? "text-green-500 "
                        : ""
                    }" font-semibold`}
                  >
                    {detailData.CVaR_LV_KR}
                  </p>
                )}
                <p className="text-gray-300 font-semibold">|</p>
                <p className="text-gray-300 font-semibold">{`전체 자산 중 ${
                  detailData.CVaRNTS_PER && detailData.CVaRNTS_PER
                }%`}</p>
              </div>

              <div className=" flex w-800:items-center flex-col ">
                <p className="whitespace text-xl font-semibold w-[300px]">
                  {aiResult && aiResult.LV_DSCP_KR.split("\\n")[0]}
                </p>
                <p className="whitespace text-xl font-semibold w-[300px]">
                  {aiResult && aiResult.LV_DSCP_KR.split("\\n")[1]}
                </p>
                {/* <Image
                  src="/images/icons/highRiskChart.svg"
                  width={54}
                  height={54}
                  alt="highRisk"
                /> */}
              </div>
              {/* {detailData.CVaR_LV && detailData.CVaR_LV === "Very high" ? (
                <div className=" flex items-center justify-between">
                  <p className="text-xl font-semibold w-[180px]">
                    {"가격이 아주 큰 폭으로 오르내릴 수 있어요"}
                  </p>
                  <Image
                    src="/images/icons/highRiskChart.svg"
                    width={54}
                    height={54}
                    alt="highRisk"
                  />
                </div>
              ) : detailData.CVaR_LV === "High" ? (
                <div className=" flex items-center justify-between">
                  <p className="text-xl font-semibold w-[180px]">
                    {"가격의 큰 폭으로 오르내릴 수 있어요"}
                  </p>
                  <Image
                    src="/images/icons/highRiskChart.svg"
                    width={54}
                    height={54}
                    alt="highRisk"
                  />
                </div>
              ) : detailData.CVaR_LV === "Moderate" ? (
                <div className=" flex items-center justify-between">
                  <p className="text-xl font-semibold w-[180px]">
                    {"가격이 적당한 폭으로 오르내릴 수 있어요"}
                  </p>
                  <Image
                    src="/images/icons/highRiskChart.svg"
                    width={54}
                    height={54}
                    alt="highRisk"
                  />
                </div>
              ) : detailData.CVaR_LV === "Low" ? (
                <div className=" flex items-center justify-between">
                  <p className="text-xl font-semibold w-[180px]">
                    {"가격 변화가 별로 없을 가능성이 높아요"}
                  </p>
                  <Image
                    src="/images/icons/highRiskChart.svg"
                    width={54}
                    height={54}
                    alt="highRisk"
                  />
                </div>
              ) : (
                ""
              )} */}
              <p className="mb-5 text-xs text-gray-400">
                {detailData.UDT_DT &&
                  detailData.UDT_DT.toString().split("T")[0]}{" "}
                {detailData.UDT_DT &&
                  detailData.UDT_DT.toString().split("T")[1].slice(0, 5)}
                {" 기준"}
              </p>
              <div className="border-b pt-3 border-gray-200" />
            </div>
            <div className="px-5 pb-5 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/icons/BoxPriceDown.svg"
                  alt="priceDown"
                  width={36}
                  height={36}
                />
                <div className="flex flex-col">
                  <p className=" text-gray-500 text-xs">{"최대 하락 시"}</p>

                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-md">
                      {detailData.FORECAST_DECREASE &&
                        detailData.FORECAST_DECREASE.toLocaleString("en-us", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                    </p>
                    <p className="text-blue-500 font-semibold">
                      {" "}
                      {detailData.EXP_CVaRNTS_95 &&
                        "-" +
                          detailData.EXP_CVaRNTS_95.toLocaleString("en-us", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }) +
                          "%"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/icons/BoxPriceUp.svg"
                  alt="priceUp"
                  width={36}
                  height={36}
                />
                <div className="flex flex-col">
                  <p className=" text-gray-500 text-xs">{"최대 상승 시"}</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-md">
                      {detailData.FORECAST_INCREASE &&
                        detailData.FORECAST_INCREASE.toLocaleString("en-us", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}{" "}
                    </p>
                    <p className="text-red-500 font-semibold">
                      {detailData.EXP_CVaRET_95 &&
                        "+" +
                          detailData.EXP_CVaRET_95.toLocaleString("en-us", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }) +
                          "%"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Header;
