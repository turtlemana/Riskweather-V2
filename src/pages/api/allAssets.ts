import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';
import { AssetInfo } from "interfaces/explore";

const removeSpecialCharacters = (str: string) => {
    return str.replace(/[&|*]/g, '');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { page, limit, loc, sect, weather, exchg, search, type, riskLv, priceOrder, lossOrder, priceChgOrder } = req.query;
    const parsedPage = typeof page === 'string' ? parseInt(page, 10) : 1;
    const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : 20;

    const cleanedSearch = search ? removeSpecialCharacters(search as string) : "";
    let rowSearchQuery = '';
    let searchQuery = '';
    let searchValues: string[] = [];

    let typeQuery = type == "All" || !type ? "" : "AND CAT = ?";
    if (type !== "All" && type) searchValues.push(type as string);

    let riskLvQuery = riskLv == "All" || !riskLv ? "" : "AND CVAR_LV = ?";
    if (riskLv !== "All" && riskLv) searchValues.push(riskLv as string);

    let weatherQuery = !weather || weather == "All" ? "" : "AND WTHR_ENG_NM = ?";
    if (weather !== "All" && weather) searchValues.push(weather as string);

    let locQuery = !loc || loc == "All" ? "" : "AND LOC=?";
    if (loc !== "All" && loc) searchValues.push(loc as string);

    let exchgQuery = !exchg || exchg == "All" ? "" : "AND HR_ITEM_NM=?";
    if (exchg !== "All" && exchg) searchValues.push(exchg as string);

    let sectQuery = !sect || sect == "All" ? "" : "AND SECT=?";
    if (sect !== "All" && sect) searchValues.push(sect as string);
    if (cleanedSearch) {
        rowSearchQuery = `AND MATCH(ITEM_CD_DL, ITEM_ENG_NM, ITEM_KR_NM) AGAINST(? IN BOOLEAN MODE)`;
        searchQuery = `AND MATCH(al.ITEM_CD_DL, al.ITEM_ENG_NM, al.ITEM_KR_NM) AGAINST(? IN BOOLEAN MODE)`;
        const searchStr = cleanedSearch.includes(" ") ? `\"${cleanedSearch}*\"` : `${cleanedSearch}*`;
        searchValues.push(searchStr);
    }


    try {
        const rowNum = await executeQuery({
            query: `SELECT count(*) FROM RMS.ALL_ASSETS 
            WHERE 1=1
            ${typeQuery}
            ${riskLvQuery}
            ${weatherQuery}
            ${locQuery}
            ${exchgQuery}
            ${sectQuery}
            ${rowSearchQuery};`,
            values: searchValues
        });

        const parsedRow = await JSON.parse(JSON.stringify(rowNum));
        const rowCount = parsedRow[0]['count(*)'];

        const result = await executeQuery({
            query: `SELECT al.*,cc.*
            FROM RMS.ALL_ASSETS al 
            LEFT JOIN RMS.CHART_TMP cc 
            ON cc.ITEM_CD = al.ITEM_CD AND cc.CHART_TP=7 
            WHERE 1=1
            ${typeQuery}
            ${riskLvQuery}
            ${weatherQuery}
            ${locQuery}
            ${exchgQuery}
            ${sectQuery}
            ${searchQuery}
            ${generateOrderQuery(priceOrder as string, lossOrder as string, priceChgOrder as string)}
            LIMIT ${parsedLimit * (parsedPage - 1)}, ${limit};`,
            values: searchValues
        }) as AssetInfo[];

        res.status(200).json([{ assets: [...result] }, { rowCount: rowCount }]);
    } catch (err: any) {
        console.error("Error:", err);
        res.status(401).json({ message: "Can't find data", error: err.message });
    }
}

const generateOrderQuery = (priceOrder: string, lossOrder: string, priceChgOrder: string) => {
    if (priceOrder !== "neutral" && priceOrder) {
        return priceOrder === "priceAsc" ? "ORDER BY ADJ_CLOSE_USD ASC" : "ORDER BY ADJ_CLOSE_USD DESC";
    } else if (lossOrder !== "neutral" && lossOrder) {
        return lossOrder === "lossAsc" ? "ORDER BY CVaRNTS ASC" : "ORDER BY CVaRNTS DESC";
    } else if (priceChgOrder !== "neutral" && priceChgOrder) {
        return priceChgOrder === "priceChgAsc" ? "ORDER BY ADJ_CLOSE_CHG" : "ORDER BY ADJ_CLOSE_CHG DESC";
    } else {
        return "ORDER BY CASE WHEN LOC = 'Korea (South)' OR CAT='Crypto' OR ITEM_ENG_NM IN ('Apple Inc','Netflix Inc','Meta Platforn Inc Class A','Nvdia Corp','Microsoft Corp','Amazon Com Inc','Alphabet Inc Class A','Tesla Inc','Taiwan Semiconductor Manufacturing') THEN 0 ELSE 1 END, TRADE_VALUE DESC";
    }
};

export default handler;
