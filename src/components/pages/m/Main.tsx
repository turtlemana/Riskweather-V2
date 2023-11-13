import React, { useState } from "react";
import Header from "components/templates/m/main/Header";
import Portfolio from "components/templates/m/main/Portfolio";
import SearchBar from "components/templates/m/main/SearchBar";
import ExplodeTable from "components/templates/m/main/ExplodeTable";
import CountryRisk from "components/templates/m/main/CountryRisk";
import { NowTrendingData } from "interfaces/main";
import CVarRankTable from "components/templates/m/main/CVarRankTable";
CVarRankTable;
function Main({
  trendingData,
  countryRiskData,
}: {
  trendingData: NowTrendingData[];
  countryRiskData: NowTrendingData[];
}) {
  return (
    <main className="min-w-[360px] h-auto max-w-[800px]">
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
