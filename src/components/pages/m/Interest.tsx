import React, { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";
import { useSession } from "next-auth/react";
import InterestTable from "components/organisms/m/InterestTable";
import { OptionModal } from "components/modals/m/OptionModal";
import InterestSearchModal from "components/modals/m/InterestSearchModal";

function Interest() {
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  useEffect(() => {
    if (isOptionOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOptionOpen]);
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: session, status, update }: any = useSession();
  const {
    data: userInfo,
    isValidating,
    mutate,
  } = useSWR(`/api/auth/user?session=${session.user.email}`, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  const userProfile: any = userInfo ? [].concat(userInfo.user)[0] : {};
  const fetchInterestedAssets = async () => {
    try {
      const response = await axios.post("/api/interest", {
        interest: userInfo?.user?.interest,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const {
    data: interestedAssets,
    error,
    mutate: interestMutate,
    isValidating: interestValid,
  } = useSWR("/api/interest", fetchInterestedAssets, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  return (
    <main className="min-w-[360px] h-auto bg-white">
      <InterestTable
        update={update}
        mutate={mutate}
        interestMutate={interestMutate}
        session={session}
        isOptionOpen={isOptionOpen}
        setIsOptionOpen={setIsOptionOpen}
        data={interestedAssets}
        isValid={interestValid}
        setIsSearchModalOpen={setIsSearchModalOpen}
      />
      {isSearchModalOpen && (
        <InterestSearchModal
          interestedAssets={interestedAssets}
          mutate={mutate}
          interestMutate={interestMutate}
          session={session}
          update={update}
          setIsSearchModalOpen={setIsSearchModalOpen}
        />
      )}
    </main>
  );
}

export default Interest;
