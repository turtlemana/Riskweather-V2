import React, { useState, useMemo } from "react";
import Image from "next/image";
import RiskTable from "components/organisms/w/RiskTable";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function CVarRankTable() {
  const router = useRouter();
  const [type, setType] = useState("Korea (South)");
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: rankDt, isValidating: rankValid } = useSWR(
    `/api/cvarRank?type=${type}`,
    fetcher
  );
  const rankData = rankDt ? [].concat(...rankDt) : [];

  return (
    <main className=" mb-3 w-full bg-white">
      <div className="flex flex-col  space-y-3">
        <div className={"flex flex-col px-5 pt-5 pb-2 space-y-1"}>
          <Image
            src="/images/icons/priceDown.svg"
            alt="chart"
            width={32}
            height={32}
          />
          <h1 className="text-lg">큰 하락이 예상되는 위험 자산</h1>
          <p className="text-sm text-gray-500">
            Riskweather AI의 분석 결과입니다.
          </p>
        </div>

        {/* <div className="flex px-5 space-x-2 items-center">
          <button
            className={`py-1 px-2  rounded-2xl ${
              type === "Korea (South)"
                ? "bg-black text-white "
                : "bg-white text-gray-400 "
            }`}
            onClick={() => setType("Korea (South)")}
          >
            국내주식
          </button>
          <button
            className={`py-1 px-2  rounded-2xl  ${
              type === "United States"
                ? "bg-black text-white "
                : "bg-white text-gray-400 "
            }`}
            onClick={() => setType("United States")}
          >
            해외주식
          </button>
          <button
            className={`py-1 px-2  rounded-2xl  ${
              type === "Crypto"
                ? "bg-black text-white "
                : "bg-white text-gray-400 "
            }`}
            onClick={() => setType("Crypto")}
          >
            가상자산
          </button>
        </div> */}

        <div className="flex justify-start items-center space-x-2 "></div>
        <RiskTable
          data={rankData}
          type={type}
          setType={setType}
          isValid={rankValid}
        />
      </div>
    </main>
  );
}

export default CVarRankTable;
