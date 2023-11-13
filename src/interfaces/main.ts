interface IndexData {
    exchg: string;
    assetKrName: string;
    assetName: string;
    ticker: string;
    risk: number;
    koreanRisk: string;
    maxLoss: number;
    weather: string;
    Exp_CVaRNTS: number;
    weatherExplain: string;
    koreanWeatherExplain: string;
    riskDescriptionEn: string;
    riskDescriptionKr: string;
}

interface CarouselData {
    ITEM_CD_DL: string;
    ITEM_KR_NM: string;
    ITEM_ENG_NM: string;
    HR_ITEM_NM: string;
    CAT: string;
    SECT: string;
    LOC: string;
    CURR: string;
    ADJ_CLOSE: number;
    ADJ_CLOSE_CHG: number;
    ADJ_CLOSE_USD: number;
    ADJ_CLOSE_KRW: number;
    TRADE_VALUE: number;
    VaRNTS: number;
    CVaRNTS: number;
    VaRNTS_95: number;
    CVaRNTS_95: number;
    EXP_VaRNTS: number;
    EXP_CVaRNTS: number;
    EXP_VaRNTS_95: number;
    EXP_CVaRNTS_95: number;
    CVaR_LV: string;
    CVaR_LV_KR: string;
    LV_DSCP_KR: string;
    LV_DSCP_ENG: string;
    RW_IDX?: number;
    RW_IDX_95?: number;
    WTHR_KR_NM: string;
    WTHR_ENG_NM: string;
    WTHR_KR_DL: string;
    WTHR_ENG_DL: string;
    EW_SGN: number;
    UDT_DT: Date;
    CHART: string;


}



interface NowTrendingData {
    ITEM_CD_DL: string;
    ITEM_KR_NM: string;
    ITEM_ENG_NM: string;
    HR_ITEM_NM: string;
    CAT: string;
    SECT: string;
    LOC: string;
    CURR: string;
    ADJ_CLOSE: number;
    ADJ_CLOSE_CHG: number;
    ADJ_CLOSE_USD: number;
    ADJ_CLOSE_KRW: number;
    TRADE_VALUE: number;
    VaRNTS: number;
    CVaRNTS: number;
    VaRNTS_95: number;
    CVaRNTS_95: number;
    EXP_VaRNTS: number;
    EXP_CVaRNTS: number;
    EXP_VaRNTS_95: number;
    EXP_CVaRNTS_95: number;
    CVaR_LV: string;
    CVaR_LV_KR: string;
    LV_DSCP_KR: string;
    LV_DSCP_ENG: string;
    ADJ_CLOSE_CHANGE: number;
    RW_IDX?: number;
    RW_IDX_95?: number;
    WTHR_KR_NM: string;
    WTHR_ENG_NM: string;
    WTHR_KR_DL: string;
    WTHR_ENG_DL: string;
    EW_SGN: number;
    UDT_DT: Date;
    CHART: string;

}


interface RiskLevelData {
    ITEM_CD_DL: string;
    ITEM_KR_NM: string;
    ITEM_ENG_NM: string;
    HR_ITEM_NM: string;
    CAT: string;
    SECT: string;
    LOC: string;
    CURR: string;
    ADJ_CLOSE: number;
    ADJ_CLOSE_CHG: number;
    ADJ_CLOSE_USD: number;
    ADJ_CLOSE_KRW: number;
    TRADE_VALUE: number;
    VaRNTS: number;
    CVaRNTS: number;
    VaRNTS_95: number;
    CVaRNTS_95: number;
    EXP_VaRNTS: number;
    EXP_CVaRNTS: number;
    EXP_VaRNTS_95: number;
    EXP_CVaRNTS_95: number;
    CVaR_LV: string;
    CVaR_LV_KR: string;
    LV_DSCP_KR: string;
    LV_DSCP_ENG: string;

    RW_IDX?: number;
    RW_IDX_95?: number;
    WTHR_KR_NM: string;
    WTHR_ENG_NM: string;
    WTHR_KR_DL: string;
    WTHR_ENG_DL: string;
    EW_SGN: number;
    UDT_DT: Date;
    CHART: string;

}

export type { IndexData, CarouselData, NowTrendingData, RiskLevelData }

