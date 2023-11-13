import React from "react";
import Image from "next/image";
import { RiArrowUpSFill } from "react-icons/ri";
import { RiArrowDownSFill } from "react-icons/ri";

function Header() {
  return (
    <main className="mb-3 w-full bg-white">
      <div
        className="flex flex-col 
       p-5 space-y-3"
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between ">
            <Image
              src="/images/icons/arrowDown.svg"
              alt="arrow"
              width={19}
              height={11}
            />

            <div className="flex flex-col  items-center">
              <p className="text-gray-500 text-xs">기본</p>
              <p className="text-red-500 font-semibold text-xs">변동성 높음</p>
            </div>

            <div></div>
          </div>
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">포트폴리오</p>
              <p className="font-bold">기본</p>
            </div>
            <button className="bg-blue-100 text-blue-500 text-sm font-semibold px-2 py-1 rounded-lg">
              +자산 추가
            </button>
          </div>
        </div>
        <hr className="w-full" />

        <div className="flex space-x-2 items-center">
          <h1 className="text-md">총 자산</h1>
          <select className="text-gray-400 text-xs">
            <option>일간 수익</option>
          </select>
        </div>
        <div className="space-y-5">
          <div className="flex flex-col">
            <div className="text-xl font-semibold">
              {parseInt("234023200").toLocaleString("en-us", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) + "원"}
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <p className="text-gray-400">오늘</p>
              <RiArrowUpSFill color={"red"} />
              <p className="text-red-500 font-semibold">
                {parseInt("1000200").toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }) + "원"}
              </p>

              <p className="text-red-500 font-semibold">
                {"(" + "+" + "10.8" + "%" + ")"}
              </p>
            </div>
          </div>

          <div className="p-2 border rounded-lg flex justify-start items-center space-x-2 overflow-x-auto">
            <Image
              src="/images/icons/chart.svg"
              width={40}
              height={40}
              alt="chart"
            />
            <div className="flex flex-col space-y-1">
              <p className="font-semibold">변동성 높음</p>
              <p className="text-gray-500 text-sm">
                자산이 아주 큰 폭으로 오르내릴 수 있어요
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Header;
