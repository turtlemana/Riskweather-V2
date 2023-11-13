import React, {
  KeyboardEventHandler,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import axios from "axios";
import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/router";
import Loading from "components/organisms/m/Loading";
import { NowTrendingData } from "interfaces/main";
import { COLORS } from "data/default";
import useHandleImageError from "utils/useHandleImageError";
import { toast } from "react-toastify";

interface props {
  setIsSearchModalOpen: Dispatch<SetStateAction<boolean>>;
  session: any;
  update: any;
  mutate: any;
  interestMutate: any;
  interestedAssets: any;
}
function InterestSearchModal({
  setIsSearchModalOpen,
  session,
  update,
  mutate,
  interestMutate,
  interestedAssets,
}: props) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleImageError = useHandleImageError();
  const [selectCoin, setSelectCoin]: any = useState([]);

  const [search, setSearch] = useState("");
  const router = useRouter();
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: explodeDt, isValidating: isValid } = useSWR(
    search ? `/api/search?search=${encodeURIComponent(search)}` : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  const data = explodeDt ? [].concat(...explodeDt) : [];
  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.length > 20) {
      return;
    }
    setSearch(query);
  }, []);

  const handleSelect = (asset: any) => {
    // 이미 관심 자산에 포함되어 있는지 확인
    if (
      interestedAssets &&
      interestedAssets.some(
        (intAsset: any) => intAsset.ITEM_CD_DL === asset.ITEM_CD_DL
      )
    ) {
      toast.error(
        router.locale == "ko"
          ? "이미 포함된 자산입니다."
          : "Asset already included."
      );
      return;
    }

    if (
      selectCoin.some(
        (selectedAsset: any) => selectedAsset.ticker === asset.ITEM_CD_DL
      )
    ) {
      const filtered = selectCoin.filter(
        (selectedAsset: any) => selectedAsset.ticker !== asset.ITEM_CD_DL
      );
      setSelectCoin(filtered);
    } else {
      if (selectCoin.length >= 50) {
        return;
      }
      const newAsset = {
        ticker: asset.ITEM_CD_DL,
        name: asset.ITEM_ENG_NM,
        krName: encodeURIComponent(asset.ITEM_KR_NM),
      };
      setSelectCoin([...selectCoin, newAsset]);
    }
  };

  const handleAddInterests = async () => {
    try {
      const response = await axios.put(
        `/api/auth/user?session=${session.user.email}`,
        {
          enteredInput: {
            action: "add",
            interest: selectCoin,
          },
        }
      );

      if (response.status === 200) {
        toast(
          router.locale == "ko"
            ? "관심 자산에 등록됐습니다"
            : "Successfully added",
          { hideProgressBar: true, autoClose: 2000, type: "success" }
        );
        await update();
        await mutate();
        await interestMutate();
        setIsSearchModalOpen(false);
      } else {
        toast(
          router.locale == "ko"
            ? "관심 자산 등록에 실패했습니다"
            : "Fetch Error",
          { hideProgressBar: true, autoClose: 2000, type: "error" }
        );
      }
    } catch (error) {
      console.error("Error while adding interests:", error);
    }
  };

  return (
    <main className="z-50 fixed pb-16  bg-white left-0 top-0 w-full h-screen overflow-y-auto">
      <div className="flex flex-col  space-y-3">
        <div className="mt-5 px-5 space-x-4 py-3 flex justify-between items-center">
          <Image
            src={"/images/icons/arrowLeft.svg"}
            alt="arrow"
            width={11}
            height={6}
            onClick={() => setIsSearchModalOpen(false)}
          />
          <section className="w-full  h-10   py-5 px-4 flex items-center border border-solid border-gray-100 bg-gray-50 rounded-xl ">
            {/* <Image
                src={"/images/icons/search.svg"}
                alt="search"
                className="mr-2 w-4 h-4"
                width={4}
                height={4}
              /> */}
            <input
              placeholder={router.locale == "ko" ? "자산 검색" : "Search"}
              className="text-gray-400 outline-none  text-sm w-full bg-gray-50"
              value={search}
              onChange={onSearch}
            />
          </section>

          <div></div>
        </div>

        <div className="flex flex-col ">
          <div className="">
            <ul className="grid grid-cols-3 gap-4 p-5">
              {data.length > 0 && !isValid ? (
                data.map((asset: NowTrendingData, i: number) => (
                  <li
                    key={i}
                    className={`flex flex-col items-center justify-center p-2 rounded-md
        cursor-pointer relative
        ${
          selectCoin.some(
            (selectedAsset: any) => selectedAsset.ticker === asset.ITEM_CD_DL
          ) ||
          (interestedAssets &&
            interestedAssets.some(
              (intAsset: any) => intAsset.ITEM_CD_DL === asset.ITEM_CD_DL
            ))
            ? "bg-gray-300 rounded-md"
            : ""
        }`}
                    onClick={() => handleSelect(asset)}
                  >
                    <Image
                      unoptimized
                      quality={100}
                      className="w-[36px] h-[36px] "
                      src={
                        `/images/logos/${asset.ITEM_CD_DL}.png` ||
                        "/images/logos/errorLogo.png"
                      }
                      width={36}
                      height={36}
                      alt="logo"
                      onError={(event) =>
                        handleImageError(event, asset.HR_ITEM_NM)
                      }
                    />
                    <p className="mt-2 text-sm text-center">
                      {router.locale === "ko"
                        ? asset.ITEM_KR_NM
                        : asset.ITEM_ENG_NM}
                    </p>
                    {selectCoin.some(
                      (selectedAsset: any) =>
                        selectedAsset.ticker === asset.ITEM_CD_DL
                    ) ||
                      (interestedAssets &&
                        interestedAssets.some(
                          (intAsset: any) =>
                            intAsset.ITEM_CD_DL === asset.ITEM_CD_DL
                        ) && (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Image
                              src="/images/icons/check.svg"
                              width={24}
                              height={24}
                              alt="Selected"
                            />
                          </div>
                        ))}
                  </li>
                ))
              ) : data.length === 0 && !isValid ? (
                <div></div>
              ) : (
                <Loading />
              )}
            </ul>
          </div>
        </div>
        {selectCoin.length > 0 && (
          <div className="sticky mt-2 bottom-5 left-0 right-0 flex justify-center">
            <button
              onClick={handleAddInterests}
              className="w-full mx-8 text-white  bg-blue-500 rounded-lg py-3 px-4"
            >
              {selectCoin.length} 개 추가하기
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default InterestSearchModal;
