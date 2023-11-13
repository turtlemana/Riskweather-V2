import React, { useState } from "react";
import Image from "next/image";
import MiniTable from "components/organisms/m/MiniTable";
import axios from "axios";
import useSWR from "swr";

function ExplodeTable() {
  const [explodeType, setExplodeType] = useState("Korea (South)");
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: explodeValid } = useSWR(
    `/api/ExplodeAssets?type=${explodeType}`,
    fetcher
  );
  const explodeData = explodeDt ? [].concat(...explodeDt) : [];

  return (
    <main className="mb-3 w-full bg-white">
      <div className="flex flex-col  space-y-3">
        <div className={"flex flex-col px-5 pt-5 pb-2 space-y-1"}>
          <Image
            src="/images/weather/explosion.svg"
            alt="volcano"
            width={48}
            height={48}
          />
          <h1 className="text-lg">방금 전 리스크가 폭등한</h1>
          <p className="text-sm text-gray-500">
            리스크가 폭등하면 가격이 급격히 오르내릴 수 있어요
          </p>
        </div>

        <div className="flex justify-start items-center space-x-2 "></div>
        <MiniTable
          data={explodeData}
          type={explodeType}
          setType={setExplodeType}
          isValid={explodeValid}
        />
      </div>
    </main>
  );
}

export default ExplodeTable;
