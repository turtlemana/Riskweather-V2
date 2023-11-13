interface TopRiskItem {
    HR_ITEM_NM: string;
    ITEM_CD_DL: string;
    ITEM_ENG_NM: string;
    ITEM_KR_NM: string;
    WTHR_KR_DL: string;
    WTHR_ENG_DL: string;
    WTHR_ENG_NM: string;
}
interface ResultItem {
    HR_ITEM_NM: string;
    ITEM_CD_DL: string;
    ITEM_ENG_NM: string;
    ITEM_KR_NM: string;
    WTHR_KR_DL: string;
    WTHR_ENG_DL: string;
    WTHR_ENG_NM: string;
    CVaR_LV: string;
    CVaR_LV_KR: string;
    LV_DSCP_KR: string;
    LV_DSCP_ENG: string;
}


export type { TopRiskItem, ResultItem }