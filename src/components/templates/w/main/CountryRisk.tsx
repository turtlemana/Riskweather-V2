import React, { useState } from "react";
import TodayCard from "./TodayCard";
import WeatherCard from "components/organisms/m/WeatherCard";
import Image from "next/image";
import CountryRiskModal from "components/modals/w/CountryRiskModal";

function CountryRisk({ countryRiskData }: any) {
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);

  return (
    <main className="w-full bg-white">
      <div className="flex flex-col p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg">국가별 리스크 트렌드</h1>
          <div
            className="flex items-center space-x-2"
            onClick={() => {
              setIsRiskModalOpen(true);
            }}
          >
            <p className="text-sm text-gray-500 cursor-pointer">전체보기</p>
            <Image
              src="/images/icons/arrowRight.svg"
              width={5}
              height={9}
              alt="arrow"
            />
          </div>
        </div>

        <div className="flex justify-start items-center space-x-2 overflow-x-auto slim-scroll">
          {countryRiskData.map((asset: any, i: number) => (
            <WeatherCard asset={asset} key={i} />
          ))}
        </div>
      </div>
      {isRiskModalOpen && (
        <CountryRiskModal setIsRiskModalOpen={setIsRiskModalOpen} />
      )}
    </main>
  );
}

export default CountryRisk;
