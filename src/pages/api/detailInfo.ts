import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';
import { InfoData } from "interfaces/detail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { ticker } = req.query
    try {

        const result: InfoData[] = await executeQuery({

            query: `SELECT fi.*
            FROM RMS.FIN_INFO fi 
            WHERE fi.ITEM_CD_DL = ?;`, values: [ticker as string]
        })

        res.status(200).json([...result])
    } catch (err) {
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;