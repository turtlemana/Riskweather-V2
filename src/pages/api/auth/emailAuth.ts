// api/auth/emailAuth.ts
import { sendVerificationCode } from 'lib/brevo'; // Update the import path
import { NextApiRequest, NextApiResponse } from "next";
import { existValue } from 'data/redis/redis';
import executeQuery from "data/mysql/mysql";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { email } = req.body;

    try {
        const query = `SELECT EMAIL FROM RWC.RW_USER_INFO WHERE EMAIL = ?;`;
        const userExistSql: unknown[] = await executeQuery({
            query: query,
            values: [email]
        });
        const isUserExist = await existValue("users", email);
        if (!isUserExist && userExistSql.length <= 0) {
            const verificationCode = await sendVerificationCode(email);
            res.status(200).json({ verificationCode });
        }
        else {
            res.status(409).json({ message: "user already exists" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
