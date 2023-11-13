import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';
import { AssetInfo } from "interfaces/explore";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { ticker } = req.query
    try {
        let result: AssetInfo[] = await executeQuery({
            query: `SELECT a.*, i.RISK_YN_5MIN FROM RMS.ITEM_INFO i
            JOIN RMS.ALL_ASSETS AS a
            ON i.ITEM_CD=a.ITEM_CD
            WHERE i.ITEM_CD_DL = ?  
            ;`, values: [ticker as string]
        })
        const { CVaR_LV, WTHR_ENG_NM, RISK_YN_5MIN }: any = result[0];

        const is5MinPrice: any[] = (RISK_YN_5MIN === 1) ? await executeQuery({
            query: `SELECT CUR_PRICE,PRICE_CHG_PER,PRICE_CHG_USD,PRICE_CHG_KRW
            FROM RMS.ALL_ASSETS_5MIN
            WHERE ITEM_CD_DL = ?
            ;`, values: [ticker as string]
        }) : [];


        if (is5MinPrice.length > 0) {
            result[0].ADJ_CLOSE = is5MinPrice[0].CUR_PRICE
            if (result[0].LOC === "Korea (South)") {
                result[0].ADJ_CLOSE_CHANGE = is5MinPrice[0].PRICE_CHG_KRW
            } else {
                result[0].ADJ_CLOSE_CHANGE = is5MinPrice[0].PRICE_CHG_USD
            }
            result[0].ADJ_CLOSE_CHG = is5MinPrice[0].PRICE_CHG_PER

        }

        const aiResult: any[] = (CVaR_LV && WTHR_ENG_NM) ? await executeQuery({
            query: `SELECT LV_DSCP_KR, LV_DSCP_ENG,WTHR_DSCP_KR,WTHR_DSCP_ENG 
            FROM RMS.WTHR_LV_INFO 
            WHERE CVaR_LV_ENG = ? AND WTHR_ENG_NM = ?
            ;`, values: [CVaR_LV, WTHR_ENG_NM]
        }) : [];




        res.status(200).json([...result, ...aiResult])
    } catch (err) {
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;