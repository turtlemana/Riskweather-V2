import executeQuery from "data//mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const portfolioList = req.body.portfolios;

    if (!portfolioList || portfolioList.length === 0) {
        res.status(400).json({ message: "No portfolio provided." });
        return;
    }

    const response: any[] = [];

    for (const p of portfolioList) {
        if (!p.items || p.items.length === 0) {
            response.push(p);
            continue;
        }

        const tickers = p.items.map((item: any) => item.ticker);

        try {
            const result: any = await executeQuery({
                query: `SELECT UDT_DT, ITEM_CD_DL, LOC, ITEM_ENG_NM, ADJ_CLOSE, ADJ_CLOSE_USD, ADJ_CLOSE_KRW, ADJ_CLOSE_CHG,CAT,LOC,CVaR_LV,CVaRNTS_PER, CVaR_LV_KR
                        FROM RMS.ALL_ASSETS
                        WHERE 1=1 AND ITEM_CD_DL in (${tickers.map((ticker: any) => `'${ticker}'`).join(",")})
                        LIMIT 10;`
            });

            let totalPortfolioPriceKr = 0;
            let totalPortfolioPriceUs = 0;
            let totalUserPrice = 0;

            let totalPortfolioValue = 0;
            let weightedChangeSum = 0;
            let totalTodayProfit = 0;

            const updatedItems = p.items.map((item: any) => {
                const assetData = result.find((r: any) => r.ITEM_CD_DL === item.ticker);
                const totalMarketKrPrice = assetData ? assetData.ADJ_CLOSE_KRW * item.quantity : 0;
                const totalMarketUsPrice = assetData ? assetData.ADJ_CLOSE_USD * item.quantity : 0;
                const userTotal = item.price * item.quantity;
                const userChange = ((totalMarketKrPrice / userTotal) > 1 ? (totalMarketKrPrice / userTotal - 1) * 100 : -(1 - totalMarketKrPrice / userTotal) * 100);
                const todayChangePercentage = assetData ? assetData.ADJ_CLOSE_CHG / 100 : 0;
                const todayProfit = assetData ? totalMarketKrPrice * todayChangePercentage : 0;
                const risk = assetData ? assetData.CVaR_LV : ""
                const riskKr = assetData ? assetData.CVaR_LV_KR : ""
                const riskPer = assetData ? assetData.CVaRNTS_PER : ""
                const loc = assetData ? assetData.LOC : ""
                const cat = assetData ? assetData.CAT : ""

                totalPortfolioPriceKr += totalMarketKrPrice;
                totalPortfolioPriceUs += totalMarketUsPrice;
                totalUserPrice += userTotal;
                totalPortfolioValue += totalMarketKrPrice;
                weightedChangeSum += totalMarketKrPrice * todayChangePercentage;
                totalTodayProfit += todayProfit;



                return {
                    ...item,
                    risk, riskKr, riskPer, loc, cat,
                    totalMarketKrPrice,
                    totalMarketUsPrice,
                    userTotal,
                    userChange,
                    todayChangePercentage,
                    todayProfit

                };
            });

            const totalChange = (totalPortfolioPriceKr / totalUserPrice) > 1 ? ((totalPortfolioPriceKr / totalUserPrice - 1) * 100) : -(1 - totalPortfolioPriceKr / totalUserPrice) * 100;
            const totalTodayChangePer = weightedChangeSum / totalPortfolioValue;

            response.push({
                ...p,
                items: updatedItems,
                totalPortfolioPriceKr,
                totalPortfolioPriceUs,
                totalUserPrice,
                totalChange,
                totalTodayChangePer,
                totalTodayProfit

            });

        } catch (err) {
            console.log(err);
            res.status(401).json({ message: "Can't find data for one of the portfolios." });
            return;
        }
    }

    res.status(200).json(response);
}

export default handler;
