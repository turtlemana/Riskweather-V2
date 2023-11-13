import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next'
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const result: any = await executeQuery({

            query: `SELECT al.*
            FROM RMS.ALL_ASSETS_5MIN al 
            WHERE al.CHART_5MIN IS NOT NULL AND al.EXP_CVaRNTS_95 IS NOT NULL
            AND CAT="Stock"
            ORDER BY al.EXP_CVaRNTS_95 DESC
            LIMIT 30
            ;`
        })

        res.status(200).json([...result])
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;