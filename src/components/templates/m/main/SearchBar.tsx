import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import TypeModal from "components/modals/m/TypeModal";

function SearchBar() {
  const router = useRouter();
  const [type, setType] = useState("Korea (South)");

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  return (
    <main className="mb-3 w-full   bg-white">
      <div className="flex flex-col p-5 ">
        <div className="">
          <h1 className="text-lg">자산 찾기</h1>
        </div>
        <section
          onClick={() => router.push("/search")}
          className="w-full h-10 mt-3 mb-5 py-2.5 px-4 flex items-center border border-solid border-gray-100 bg-gray-100 rounded-xl "
        >
          <Image
            src={"/images/icons/search.svg"}
            alt="search"
            className="mr-2 w-4 h-4"
            width={4}
            height={4}
          />
          <div
            placeholder={router.locale == "ko" ? "자산 검색" : "Search"}
            className="text-gray-400 outline-none  text-sm w-full bg-gray-100"
          >
            {router.locale == "ko" ? "자산 검색" : "Search"}
          </div>
        </section>

        <div className="space-y-7 ">
          <div
            onClick={() => {
              setIsTypeModalOpen(true);
              setType("Korea (South)");
            }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/images/icons/koreanFlag.svg"
                alt="flag"
                width={30}
                height={30}
              />
              <div className="flex flex-col">
                <p className="font-semibold">국내 주요 자산</p>
                <p className="text-gray-500 text-xs">1904개 자산</p>
              </div>
            </div>
            <Image
              src="/images/icons/arrowRight.svg"
              width={9}
              height={16}
              alt="arrow"
            />
          </div>
          <div
            onClick={() => {
              setIsTypeModalOpen(true);
              setType("United States");
            }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/images/icons/globe.svg"
                alt="flag"
                width={30}
                height={30}
              />
              <div className="flex flex-col">
                <p className="font-semibold">해외 주요 자산</p>
                <p className="text-gray-500 text-xs">1883개 자산</p>
              </div>
            </div>
            <Image
              src="/images/icons/arrowRight.svg"
              width={9}
              height={16}
              alt="arrow"
            />
          </div>
          <div
            onClick={() => {
              setIsTypeModalOpen(true);
              setType("Crypto");
            }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Image
                src="/images/icons/crypto.svg"
                alt="flag"
                width={30}
                height={30}
              />
              <div className="flex flex-col pb-3">
                <p className="font-semibold">가상 자산</p>
                <p className="text-gray-500 text-xs">105개 자산</p>
              </div>
            </div>
            <Image
              src="/images/icons/arrowRight.svg"
              width={9}
              height={16}
              alt="arrow"
            />
          </div>
        </div>
      </div>
      {isTypeModalOpen && (
        <TypeModal type={type} setIsTypeModalOpen={setIsTypeModalOpen} />
      )}
    </main>
  );
}

export default SearchBar;
