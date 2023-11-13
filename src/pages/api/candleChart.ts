import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { ticker } = req.query
    try {

        const result: string = await executeQuery({

            query: `SELECT CHART FROM RMS.CHART_TMP 
            WHERE ITEM_CD_DL = ? AND CHART_TP=0;`
            , values: [ticker as string]
        })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;




