import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { getValue, setValue } from "data/redis/redis";
import executeQuery from "data/mysql/mysql";





const s3 = new S3({
    region: "ap-northeast-2",
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_KEY,
    signatureVersion: "v4",
});


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { session }: { session?: string } = req.query
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        let { name, type, imageUrl } = req.body;

        const fileParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: name,
            Expires: 600,
            ContentType: type,
        };

        const url = await s3.getSignedUrlPromise("putObject", fileParams);

        await executeQuery({
            query: `UPDATE RWC.RW_USER_INFO 
      SET IMG = ?
      WHERE EMAIL = ?
      `, values: [imageUrl, session]
        })


        if (session) {
            const userInfo = await getValue("users", session)
            userInfo.profileImage = imageUrl

            await setValue("users", session, userInfo)
            res.status(200).json({ url });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "8mb",
        },
    },
};