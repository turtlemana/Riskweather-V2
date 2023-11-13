import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const interest = req.body.interest;

    if (!interest) {
        res.status(400).json({ message: "No interest provided." });
        return;
    }

    const interestTickers = interest.map((asset: any) => `'${asset.ticker}'`).join(",");

    try {
        const query = `
            SELECT *
            FROM RMS.ALL_ASSETS
            WHERE ITEM_CD_DL IN (${interestTickers})
        `;

        const result: any = await executeQuery({ query });

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;
