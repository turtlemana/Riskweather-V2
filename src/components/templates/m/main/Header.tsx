import React, { useState } from "react";
import MainCard from "components/organisms/m/MainCard";
import Image from "next/image";
import Top30Modal from "components/modals/m/Top30Modal";

function Header({ trendingData }: any) {
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const standardTime =
    trendingData && trendingData[0].UDT_DT.split("T")[1].split(".")[0];
  return (
    <main className="mb-3 w-full bg-white">
      <div className="flex flex-col p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <h1 className="text-xl">실시간 리스크 TOP 30</h1>
            <p className="text-gray-500">
              {standardTime && standardTime} {"기준"}
            </p>
          </div>
          <div
            className="flex items-center space-x-2"
            onClick={() => {
              setIsRiskModalOpen(true);
            }}
          >
            <p className="text-sm text-gray-500">전체보기</p>
            <Image
              src="/images/icons/arrowRight.svg"
              width={5}
              height={9}
              alt="arrow"
            />
          </div>
        </div>

        <div className="flex justify-start items-center space-x-2 overflow-x-auto">
          {trendingData.map((asset: any, i: number) => (
            <MainCard asset={asset} key={i} />
          ))}
        </div>
      </div>
      {isRiskModalOpen && (
        <Top30Modal setIsRiskModalOpen={setIsRiskModalOpen} />
      )}
    </main>
  );
}

export default Header;
