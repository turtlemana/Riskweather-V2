import React, { useState } from "react";
import Header from "components/templates/w/main/Header";
import Portfolio from "components/templates/w/main/Portfolio";
import SearchBar from "components/templates/w/main/SearchBar";
import ExplodeTable from "components/templates/m/main/ExplodeTable";
import CountryRisk from "components/templates/w/main/CountryRisk";
import { NowTrendingData } from "interfaces/main";
import CVarRankTable from "components/templates/w/main/CVarRankTable";
CVarRankTable;
function Main({
  trendingData,
  countryRiskData,
}: {
  trendingData: NowTrendingData[];
  countryRiskData: NowTrendingData[];
}) {
  return (
    <main className="min-w-[360px] max-w-[800px] h-auto ">
      <Header trendingData={trendingData} />
      <Portfolio />
      <CVarRankTable />

      <SearchBar />
      {/* <ExplodeTable /> */}
      <CountryRisk countryRiskData={countryRiskData} />
    </main>
  );
}

export default Main;
