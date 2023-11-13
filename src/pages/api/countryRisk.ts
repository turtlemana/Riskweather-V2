import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next'
import { NowTrendingData } from "interfaces/main";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const result: NowTrendingData[] = await executeQuery({

            query: `SELECT al.*
            FROM RMS.ALL_ASSETS al 
            WHERE CAT="Index"
            AND ITEM_KR_NM IN ('나스닥', '코스피', '니케이225', '니프티 50', '선전종합지수', 'TSEC', 'FTSE 100', 'DAX', '스위스 시장 지수', 'AEX')
            ORDER BY 
                CASE 
                    WHEN ITEM_KR_NM = '코스피' THEN 1
                    WHEN ITEM_KR_NM = '나스닥' THEN 2
                    WHEN ITEM_KR_NM = '니케이225' THEN 3
                    WHEN ITEM_KR_NM = '선전종합지수' THEN 4
                    WHEN ITEM_KR_NM = '니프티 50' THEN 5
                    ELSE 6
                END;
            ;`
        })

        res.status(200).json([...result])
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;