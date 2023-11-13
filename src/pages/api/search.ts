import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';

const isValidSearchTerm = (str: string) => {
    return str && str.trim().length > 0;
};

const escapeSearchString = (str: string): string => {
    // 이전 버전에서 이스케이프 처리를 하던 특수 문자들을 제외합니다.
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// ... 나머지 코드 ...

const isSpecialCharOnly = (str: string): boolean => {
    // 이제 특수 문자만 있는지 검사하는 대신에 모든 문자를 허용합니다.
    return false; // 항상 false를 반환하여 모든 검색어를 문자열로 취급합니다.
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { search } = req.query;

    let searchQuery = '';
    let searchValues: any = [];

    if (isValidSearchTerm(search as string)) {
        const escapedSearch = escapeSearchString(search as string);

        // Check if the search term is a special character only or if it includes special characters.
        if (isSpecialCharOnly(search as string)) {
            // This is the case where the search term consists only of special characters.
            searchQuery = `AND (ITEM_CD_DL LIKE ? OR ITEM_ENG_NM LIKE ? OR ITEM_KR_NM LIKE ?)`;
            searchValues = [`%${escapedSearch}%`, `%${escapedSearch}%`, `%${escapedSearch}%`];
        } else {
            // This is the case where the search term includes normal characters or special characters.
            searchQuery = `AND (ITEM_CD_DL LIKE ? OR ITEM_ENG_NM LIKE ? OR ITEM_KR_NM LIKE ?)`;
            // Include the entire search term with '%' wildcard before and after for a LIKE search.
            searchValues = [`%${escapedSearch}%`, `%${escapedSearch}%`, `%${escapedSearch}%`];
        }
    }

    try {
        const result: any = await executeQuery({
            query: `
                SELECT ADJ_CLOSE_USD, ADJ_CLOSE_CHANGE, LOC, CAT, ADJ_CLOSE_KRW, ADJ_CLOSE, ADJ_CLOSE_CHG, ITEM_KR_NM, HR_ITEM_NM, LV_DSCP_KR, LV_DSCP_ENG, ITEM_CD_DL, ITEM_ENG_NM, CVaR_LV, WTHR_ENG_NM, WTHR_ENG_DL, CVaRNTS, EXP_CVaRNTS, ADJ_CLOSE, ADJ_CLOSE_USD, WTHR_KR_DL, CVaR_LV_KR
                FROM RMS.ALL_ASSETS
                WHERE 1=1
                ${searchQuery}
                ORDER BY CASE WHEN LOC = 'Korea (South)' OR CAT='Crypto' OR ITEM_ENG_NM IN ('Apple Inc','Netflix Inc','Meta Platforn Inc Class A','Nvdia Corp','Microsoft Corp','Amazon Com Inc','Alphabet Inc Class A','Tesla Inc','Taiwan Semiconductor Manufacturing') THEN 0 ELSE 1 END, TRADE_VALUE DESC
                LIMIT 100
            `,
            values: searchValues
        });

        res.status(200).json([...result]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error executing search query" });
    }
}

export default handler;