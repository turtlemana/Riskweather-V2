import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next'
import { NowTrendingData } from "interfaces/main";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {
        const type: string = req.query.type as string;
        let whereClause = `WHERE CAT="Index"`;

        if (type === "All") {
            // All에 대한 조건이 필요없습니다.
        } else if (type === "else") {
            whereClause += ` AND LOC NOT IN ('Korea (South)', 'United States', 'Japan', 'China')`;
        } else {
            whereClause += ` AND LOC='${type}'`;
        }


        const result: NowTrendingData[] = await executeQuery({
            query: `SELECT al.*
                  FROM RMS.ALL_ASSETS al 
                  ${whereClause}
                  ORDER BY 
                      CASE 
                          WHEN ITEM_KR_NM = '코스피' THEN 1
                          WHEN ITEM_KR_NM = '코스닥' THEN 2
                          WHEN ITEM_KR_NM = '나스닥' THEN 3
                          WHEN ITEM_KR_NM = '니케이225' THEN 4
                          WHEN ITEM_KR_NM = '선전종합지수' THEN 5
                          WHEN ITEM_KR_NM = '니프티 50' THEN 6
                          ELSE 7
                      END;
              `
        });

        res.status(200).json([...result]);
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Can't find data" });
    }
};
export default handler;