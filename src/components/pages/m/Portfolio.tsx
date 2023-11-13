import React, { useState, useEffect } from "react";
import Header from "components/templates/m/portfolio/Header";
import Asset from "components/templates/m/portfolio/Asset";
import useSWR from "swr";
import axios from "axios";
import NoPortfolio from "components/templates/m/portfolio/NoPortfolio";
import PortfolioAddModal from "components/modals/m/PortfolioAddModal";
import PortfolioEditModal from "components/modals/m/PortfolioEditModal";
import Main from "components/templates/m/portfolio/Main";
import PortfolioDetail from "components/templates/m/portfolio/PortfolioDetail";
import AddAssets from "components/templates/m/portfolio/AddAssets";
import {
  usePortfolioDispatch,
  usePortfolioState,
} from "contexts/PortfolioContext";

function Portfolio({ session }: any) {
  const dispatch = usePortfolioDispatch();

  const state = usePortfolioState();

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isAssetAddOpen, setIsAssetAddOpen] = useState(false);
  const {
    data: userInfo,
    isValidating,
    mutate,
  } = useSWR(
    session ? `/api/auth/user?session=${session.user.email}` : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );
  const userProfile: any = userInfo ? [].concat(userInfo.user)[0] : {};
  const userPortfolio = userProfile?.portfolios ? userProfile?.portfolios : [];
  const [portfolio, setPortfolio] = useState(
    userProfile.portfolios && userProfile.portfolios.length > 0
      ? userProfile.portfolios[0]
      : []
  );

  const postFetcher = (url: string, data: any) =>
    axios.post(url, data).then((res) => res.data);

  const { data: portfolioPrices, mutate: portMutate } = useSWR(
    userPortfolio.length ? `/api/portfolioPrice` : null,
    () =>
      postFetcher("/api/portfolioPrice", {
        portfolios: userPortfolio,
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      shouldRetryOnError: true,
    }
  );

  useEffect(() => {
    if (portfolioPrices) {
      const updatedPortfolio = portfolioPrices[0];
      setPortfolio(updatedPortfolio);
    }
  }, [portfolioPrices]);

  return (
    <main className="min-w-[360px] h-auto">
      {!session ||
      !userProfile.portfolios ||
      userProfile.portfolios.length === 0 ? (
        <NoPortfolio
          setIsAddModalOpen={setIsAddModalOpen}
          session={session}
          userProfile={userProfile}
        />
      ) : (
        <Main
          key={userPortfolio}
          setPortfolio={setPortfolio}
          setIsDetailOpen={setIsDetailOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          userProfile={userProfile}
          portfolios={portfolioPrices}
          portMutate={portMutate}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}

      {state.isAddOpen && (
        <PortfolioAddModal
          setIsDetailOpen={setIsDetailOpen}
          userProfile={userProfile}
          session={session}
          mutate={mutate}
          portMutate={portMutate}
          setIsAddModalOpen={setIsAddModalOpen}
        />
      )}
      {state.isDetailOpen && (
        <PortfolioDetail
          setPortfolio={setPortfolio}
          setIsAssetAddOpen={setIsAssetAddOpen}
          setIsDetailOpen={setIsDetailOpen}
          portfolio={portfolio}
        />
      )}
      {state.isAssetAddOpen && (
        <AddAssets
          userProfile={userProfile}
          session={session}
          mutate={mutate}
          portfolio={portfolio}
          ptfPrice={portfolioPrices}
          setIsAssetAddOpen={setIsAssetAddOpen}
          portMutate={portMutate}
          setPortfolio={setPortfolio}
        />
      )}
      {state.isEditOpen && (
        <PortfolioEditModal
          userProfile={userProfile}
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          session={session}
          setIsAssetAddOpen={setIsAssetAddOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          setIsDetailOpen={setIsDetailOpen}
          mutate={mutate}
          portMutate={portMutate}
        />
      )}
    </main>
  );
}

export default Portfolio;
