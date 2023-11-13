interface AssetInfo {
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
    ADJ_CLOSE_CHANGE: number;
    TRADE_VALUE: number;
    VaRNTS: number;
    CVaRNTS: number;
    VaRNTS_95: number;
    CVaRNTS_95: number;
    CVaRNTS_PER: number;
    EXP_CVaRET_95: number;
    EXP_VaRNTS: number;
    EXP_CVaRNTS: number;
    EXP_VaRNTS_95: number;
    EXP_CVaRNTS_95: number;
    FORCAST_INCREASE: number;
    FORCAST_DECREASE: number;
    CVaR_LV: string;
    CVaR_LV_KR: string;
    LV_DSCP_KR: string;
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

export type { AssetInfo }