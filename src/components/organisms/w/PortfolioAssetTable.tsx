import React, { Dispatch, SetStateAction } from "react";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";
import Image from "next/image";
import { COLORS } from "data/default";
import { useRouter } from "next/router";
import useHandleImageError from "utils/useHandleImageError";

interface props {
  isOpenDetail: string;
  setIsOpenDetail: Dispatch<SetStateAction<string>>;
  index: number;
  data: any;
  ticker: string;
}

function PortfolioAssetTable({
  isOpenDetail,
  setIsOpenDetail,
  index,
  data,
  ticker,
}: props) {
  const router = useRouter();
  const handleImageError = useHandleImageError();
  return (
    <section className={`border-gray-100   ${isOpenDetail !== ticker}`}>
      <article
        className="flex items-center py-4 cursor-pointer"
        onClick={() => setIsOpenDetail(ticker === isOpenDetail ? "" : ticker)}
      >
        <Image src={data.image || ""} alt="" className="h-10 mr-3" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div>
              <Image
                unoptimized
                src={
                  `/images/logos/${data.ticker}.png` ||
                  "/images/logos/errorLogo.png"
                }
                width={36}
                height={36}
                alt="logo"
                onError={(event) => handleImageError(event, data.exchange)}
              />
            </div>
            <div>
              <h6>{decodeURIComponent(data.krName)}</h6>
              <p className="text-gray-500 text-xs">
                {data.quantity}
                {"주"}
              </p>
            </div>
          </div>
        </div>
        <div className={`py-1 px-3  rounded-20 ${COLORS[data.risk]} `}>
          <h6 className="text-xs">{data.riskKr}</h6>
        </div>
        <Image
          src={"/images/icons/arrowDownGray.svg"}
          width={15}
          height={15}
          alt=""
          className={`ml-3 mr-5 ${
            isOpenDetail === ticker ? "rotate-[180deg] " : " "
          }`}
        />
      </article>
      {isOpenDetail === ticker && (
        <article className="bg-gray-50 p-4  w-screen text-sm font-medium">
          <div className="flex flex-col border-b border-gray-100 mb-3">
            <div className="flex items-center space-x-2">
              <div className={`py-1 px-3  rounded-20 ${COLORS[data.risk]} `}>
                <h6 className="text-xs">{data.riskKr}</h6>
              </div>
              <div className="flex items-center space-x-1">
                <p className="text-gray-500">전체 자산 중 </p>
                <p className="text-gray-500">
                  {data.riskPer}
                  {"%"}{" "}
                </p>
              </div>
            </div>
            {data.risk && data.risk === "Very high" ? (
              <div className=" p-2  rounded-xl flex items-center justify-between">
                <p className="text-lg w-1/2 font-bold">
                  {"가격이 아주 큰 폭으로 오르내릴 수 있어요"}
                </p>
                <Image
                  src="/images/icons/riskHigh.svg"
                  width={54}
                  height={54}
                  alt="highRisk"
                />
              </div>
            ) : data.risk === "High" ? (
              <div className=" p-2  rounded-xl flex items-center justify-between">
                <p className="text-lg w-1/2 font-bold ">
                  {"가격이 큰 폭으로 오르내릴 수 있어요"}
                </p>
                <Image
                  src="/images/icons/riskHigh.svg"
                  width={54}
                  height={54}
                  alt="highRisk"
                />
              </div>
            ) : data.risk === "Moderate" ? (
              <div className=" p-2  rounded-xl flex items-center justify-between">
                <p className="text-lg w-1/2 font-bold  ">
                  {"가격이 적당한 폭으로 오르내릴 수 있어요"}
                </p>
                <Image
                  src="/images/icons/riskHigh.svg"
                  width={54}
                  height={54}
                  alt="highRisk"
                />
              </div>
            ) : data.risk === "Low" ? (
              <div className=" p-2  rounded-xl flex items-center justify-between">
                <p className="text-lg w-1/2 font-bold  ">
                  {"자산의 가격 변화가 별로 없을 가능성이 높아요"}
                </p>
                <Image
                  src="/images/icons/riskHigh.svg"
                  width={54}
                  height={54}
                  alt="highRisk"
                />
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <p className="font-bold text-md">평가액</p>
            <p className="font-bold text-2xl">
              {data.totalMarketKrPrice
                ? data.totalMarketKrPrice.toLocaleString("en-us", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }) + "원"
                : ""}
            </p>

            <div className="flex justify-between max-w-[800px] items-center pt-2">
              <div className="flex flex-col">
                <p className="text-gray-500">총 수익</p>
                {data.totalMarketKrPrice &&
                data.userTotal &&
                data.totalMarketKrPrice - data.userTotal > 0 ? (
                  <div
                    className={`flex items-center text-md ${
                      data.totalMarketKrPrice - data.userTotal > 10000000
                        ? "pt-1 "
                        : ` `
                    } `}
                  >
                    <RiArrowUpSFill color={"red"} />
                    <p className={"text-red-500 font-bold"}>
                      {data.totalMarketKrPrice &&
                        data.userTotal &&
                        (
                          data.totalMarketKrPrice - data.userTotal
                        ).toLocaleString("en-us", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) + " 원"}
                    </p>
                  </div>
                ) : data.totalMarketKrPrice &&
                  data.userTotal &&
                  data.totalMarketKrPrice - data.userTotal <= 0 ? (
                  <div className="flex items-center text-md">
                    <RiArrowDownSFill color={"blue"} />
                    <p className={"text-blue-500 font-bold"}>
                      {data.totalMarketKrPrice - data.userTotal &&
                        (
                          data.totalMarketKrPrice - data.userTotal
                        ).toLocaleString("en-us", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) + " 원"}
                    </p>
                  </div>
                ) : (
                  ""
                )}
                {data.userChange && parseFloat(data.userChange) > 0 ? (
                  <div
                    className={`flex items-center text-sm ${
                      parseFloat(data.userChange) > 10000000 ? "pt-1 " : ` `
                    } `}
                  >
                    <p className={"text-red-500 font-bold"}>
                      {data.userChange &&
                        "(" +
                          "+" +
                          parseFloat(data.userChange).toLocaleString("en-us", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }) +
                          " %" +
                          ")"}
                    </p>
                  </div>
                ) : data.userChange && parseFloat(data.userChange) < 0 ? (
                  <div className="flex items-center text-xs">
                    <p className={"text-blue-500 font-bold"}>
                      {data.userChange &&
                        "(" +
                          parseFloat(data.userChange).toLocaleString("en-us", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          }) +
                          " %" +
                          ")"}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-col">
                <p className="text-gray-500">일간 수익</p>
                {data.todayProfit && data.todayProfit > 0 ? (
                  <div
                    className={`flex items-center text-md ${
                      data.todayProfit > 10000000 ? "pt-1 " : ` `
                    } `}
                  >
                    <RiArrowUpSFill color={"red"} />
                    <p className={"text-red-500 font-bold"}>
                      {data.todayProfit.toLocaleString("en-us", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }) + " 원"}
                    </p>
                  </div>
                ) : data.todayProfit && data.todayProfit ? (
                  <div className="flex items-center text-md">
                    <RiArrowDownSFill color={"blue"} />
                    <p className={"text-blue-500 font-bold"}>
                      {data.todayProfit &&
                        data.todayProfit.toLocaleString("en-us", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }) + " 원"}
                    </p>
                  </div>
                ) : (
                  ""
                )}
                {data.todayChangePercentage &&
                data.todayChangePercentage > 0 ? (
                  <div
                    className={`flex items-center text-sm ${
                      data.todayChangePercentage * 100 > 10000000
                        ? "pt-1 "
                        : ` `
                    } `}
                  >
                    <p className={"text-red-500 font-bold"}>
                      {data.todayChangePercentage &&
                        "(" +
                          "+" +
                          (data.todayChangePercentage * 100).toLocaleString(
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
                ) : data.todayChangePercentage &&
                  data.todayChangePercentage < 0 ? (
                  <div className="flex items-center text-sm">
                    <p className={"text-blue-500 font-bold"}>
                      {data.todayChangePercentage &&
                        "(" +
                          (data.todayChangePercentage * 100).toLocaleString(
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
                  ""
                )}
              </div>
              <div></div>
            </div>

            <div className="pt-4 flex items-center justify-between max-w-[800px]">
              <div className="flex flex-col space-y-1">
                <p className="text-gray-500">평균단가</p>
                <p className="font-bold">
                  {data.price.toLocaleString("en-us")}
                  {"원"}
                </p>
              </div>

              <div className="flex flex-col space-y-1">
                <p className="text-gray-500 ml-3">보유 수량</p>
                <p className="font-bold ml-3">
                  {data.quantity.toLocaleString("en-us")}
                  {"주"}
                </p>
              </div>
              <div></div>
            </div>
          </div>
        </article>
      )}

      {isOpenDetail === ticker && (
        <div>
          <div
            onClick={() => router.push(`/detail/${ticker}`)}
            className="bg-white cursor-pointer w-full flex justify-center py-3  text-md border-b border-gray-100"
          >
            자세히 보기
          </div>
          <div className="bg-gray-100 w-full py-1.5"></div>
        </div>
      )}
    </section>
  );
}

export default PortfolioAssetTable;
