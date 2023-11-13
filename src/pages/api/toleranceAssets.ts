import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next'
import { AssetInfo } from "interfaces/explore";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    try {

        const result: AssetInfo[] = await executeQuery({

            query: `SELECT al.ITEM_ENG_NM, al.HR_ITEM_NM,al.ITEM_CD_DL,al.ITEM_KR_NM
            FROM RMS.ALL_ASSETS al 
            WHERE ITEM_ENG_NM IN ('Bitcoin','Ethereum','Apple Inc',
           'Alphabet Inc Class A', 
             'Tesla Inc', 'Tencent Holdings Ltd',
            'Toyota Motor Corp','Amazon Com Inc','Dai','Polygon','BNB',
            'Chainlink','Nvidia Corp','Sony Group Corp', 
            'Tether', 'Meta Platforn Inc Class A' ,'Asml Holding Nv',
            'Taiwan Semiconductor Manufacturing',
            'Microsoft Corp','Stellar','Dogecoin',
            'Netflix Inc',
            'Jpmorgan Chase & Co','Nintendo Ltd','Mitsubishi Corp',
            'XRP', 'Litecoin','Cardano','USD Coin','LVMH',
            'Pfizer Inc','Ethereum Classic',
            'Paypal Holdings Inc','Allianz','Mercedes-benz Group N Ag',
            'Moderna Inc','Meituan')
            OR ITEM_KR_NM IN ('삼성전자','셀트리온', '포스코퓨처엠','에코프로', 'SK하이닉스','LG화학','NAVER','현대차','카카오','KB금융','엔씨소프트','LG이노텍','삼성SDI','KT&G','넥슨게임즈')
         
            ORDER BY CASE WHEN LOC = 'Korea (South)' THEN 0 ELSE 1 END, TRADE_VALUE DESC

            LIMIT 50
            ;`
        })

        res.status(200).json([...result])
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Can't find data" });
    }
}

export default handler;