import React, {
  useMemo,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { NowTrendingData } from "interfaces/main";
import useHandleImageError from "utils/useHandleImageError";
import Image from "next/image";
import { useRouter } from "next/router";
import MobileCandleChart from "chart/MobileCandleChart";
import { Chart, CandleChartInterface } from "interfaces/detail";
import { MENU_LIST } from "data/detail";
import dynamic from "next/dynamic";
import Loading from "components/organisms/m/Loading";

const DynamicCandleChart: React.FC<any> = dynamic(
  () => import("chart/WebCandleChart"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
) as any;
function DetailChart({ chartData, cat }: any) {
  const router = useRouter();

  const data = useMemo(() => {
    if (!chartData || !Array.isArray(chartData)) return [];

    const orderedData = chartData.sort((a: any, b: any) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    const alteredTime = orderedData.map((ohlc: any) => {
      return {
        ...ohlc,
        open: ohlc.KRW_open,
        close: ohlc.KRW_close,
        high: ohlc.KRW_high,
        low: ohlc.KRW_low,
        ewi: ohlc.ewi,
        rwi: ohlc.rwi,
        volume: ohlc.volume,
        time: ohlc.date,
        date: undefined,
      };
    });

    return alteredTime;
  }, [chartData]);

  const [select, setSelect] = useState(0);
  const [chartSelect, setChartSelect] = useState("Candle");

  const [candleSlice, setCandleSlice] = useState(data);

  let tmpOriginData = JSON.parse(JSON.stringify(data));

  let tmpData = JSON.parse(JSON.stringify(data));
  const [highestPrice, setHighestPrice] = useState(
    tmpOriginData.reduce((prev: Chart, current: Chart) => {
      return prev.close > current.close ? prev : current;
    })
  );
  const [lowestPrice, setLowestPrice] = useState(
    tmpOriginData.reduce((prev: Chart, current: Chart) => {
      return prev.close > current.close ? current : prev;
    })
  );
  const [selected, setSelected] = useState("1M");

  const chartSelectHandler = () => {
    setSelect(select === 0 ? 1 : 0);
    setChartSelect(chartSelect === "Candle" ? "Line" : "Candle");
  };

  const clickHandler = ({ title }: { title: string }) => {
    setSelected(title);
  };

  useEffect(() => {
    if (selected == "All") {
      setCandleSlice(data);
      setHighestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? prev : current;
        })
      );
      setLowestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? current : prev;
        })
      );
    } else if (selected == "1W") {
      tmpData = data.slice(-5);
      setCandleSlice(tmpData);
      tmpOriginData = data.slice(-5);
      setHighestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? prev : current;
        })
      );
      setLowestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? current : prev;
        })
      );
    } else if (selected == "2W") {
      tmpData = data.slice(-11);
      setCandleSlice(tmpData);
      tmpOriginData = data.slice(-11);
      setHighestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? prev : current;
        })
      );
      setLowestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? current : prev;
        })
      );
    } else if (selected == "1M") {
      tmpData = data.slice(-21);
      setCandleSlice(tmpData);
      tmpOriginData = data.slice(-21);
      setHighestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? prev : current;
        })
      );
      setLowestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? current : prev;
        })
      );
    } else if (selected == "3M") {
      tmpData = data.slice(-63);
      setCandleSlice(tmpData);
      tmpOriginData = data.slice(-63);
      setHighestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? prev : current;
        })
      );
      setLowestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? current : prev;
        })
      );
    } else if (selected == "6M") {
      tmpData = data.slice(-126);
      setCandleSlice(tmpData);
      tmpOriginData = data.slice(-126);
      setHighestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? prev : current;
        })
      );
      setLowestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? current : prev;
        })
      );
    } else if (selected == "1Y") {
      tmpData = data.slice(-252);
      setCandleSlice(tmpData);
      tmpOriginData = data.slice(-252);
      setHighestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? prev : current;
        })
      );
      setLowestPrice(
        tmpOriginData.reduce((prev: Chart, current: Chart) => {
          return prev.close > current.close ? current : prev;
        })
      );
    }
  }, [selected, data]);
  return (
    <main id="chart" className="mb-3 w-full bg-white">
      <div className="flex flex-col ">
        <div className="flex flex-col px-5 pt-5 space-y-1 mb-0">
          <p className="font-semibold text-lg">{"차트"}</p>
          <Image
            quality={100}
            src="/images/icons/chartExplain.svg"
            width={280}
            height={40}
            alt="chartExplain"
          />
        </div>
        <div className="pb-8 px-3 flex items-center justify-between">
          <ul className="flex gap-1   pt-3 pb-7 overflow-scroll customScrollBar items-center justify-start">
            {MENU_LIST.map(({ id, title, koreanTitle }) => (
              <li
                key={id}
                className={`py-1 px-[6px] rounded-lg  min-w-[45px] h-6 text-center cursor-pointer hover:bg-gray-50 ${
                  selected === title ? " bg-gray-100" : ""
                }`}
                onClick={() => clickHandler({ title })}
              >
                <h6
                  className={`${
                    router.locale == "ko" ? "text-xs " : "text-xs "
                  } pt-px ${
                    selected === title ? "text-black" : "text-gray-400"
                  }`}
                >
                  {router.locale == "ko" ? koreanTitle : title}
                </h6>
              </li>
            ))}
          </ul>
          <div className="pb-3 pr-8">
            {chartSelect === "Line" ? (
              <Image
                className="cursor-pointer"
                onClick={() => setChartSelect("Candle")}
                src="/images/icons/candle.svg"
                width={20}
                height={20}
                alt="candle"
              />
            ) : (
              <Image
                className="cursor-pointer"
                onClick={() => setChartSelect("Line")}
                src="/images/icons/line.svg"
                width={20}
                height={20}
                alt="candle"
              />
            )}
          </div>
        </div>
        <div className="flex justify-center  items-center">
          <DynamicCandleChart
            key={candleSlice.length + chartSelect}
            chartSelect={chartSelect}
            data={candleSlice}
            cat={cat}
          />
        </div>
      </div>
      <section className=" flex justify-start ml-5 text-xs text-gray-800">
        <div className="flex  mb-6 justify-center text-center items-center">
          <li className="flex items-center flex-row  ">
            <p className="text-xs font-bold">{`${selected} 최고가격`} : </p>
            <p className="text-xs ">
              {highestPrice?.close.toLocaleString("en-us", {
                minimumFractionDigits: 0,
                maximumFractionDigits: router.locale === "ko" ? 2 : 2,
              })}{" "}
              {cat == "Index" ? "" : router.locale === "ko" ? "￦" : "＄"}
            </p>
          </li>
          <div className="ml-3 mr-3 w-px h-[14px] bg-gray-300" />

          <li className="flex items-center flex-row">
            <p className="text-xs font-bold">{`${selected} 최저가격`} : </p>
            <p className="text-xs ">
              {lowestPrice?.close.toLocaleString("en-us", {
                minimumFractionDigits: 0,
                maximumFractionDigits: router.locale === "ko" ? 2 : 2,
              })}{" "}
              {cat == "Index" ? "" : router.locale === "ko" ? "￦" : "＄"}
            </p>
          </li>
        </div>
      </section>
    </main>
  );
}

export default DetailChart;
