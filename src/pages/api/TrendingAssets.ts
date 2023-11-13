import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next'
import { NowTrendingData } from "interfaces/main";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const result: NowTrendingData[] = await executeQuery({

            query: `SELECT al.*
            FROM RMS.ALL_ASSETS al 
            WHERE 1=1

            AND (HR_ITEM_NM IN ('Ethereum','BNB','NASDAQ','Russell 2000','NYSE COMPOSITE','FTSE 100','DAX','Euronext N.V.','KOSPI','KOSDAQ','Nikkei 225','TSEC','Hangseng','NIFTY 50') 
            OR HR_ITEM_NM IS NULL)
       
            ORDER BY al.TRADE_VALUE DESC
            LIMIT 10
            ;`
        })

        res.status(200).json([...result])
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;