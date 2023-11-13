// api/auth/emailAuth.ts
import { sendPasswordResetEmail } from 'lib/brevo'; // Update the import path
import { NextApiRequest, NextApiResponse } from "next";
import { getValue, existValue, setValue, getExValue, deleteExValue } from 'data/redis/redis';
import executeQuery from "data/mysql/mysql";
import bcrypt from 'bcrypt';
interface UserInfo {
    email: string;
    platform_type: string;
    name: string;
    profileImage: string;
    created_at: string;
    accessLevel: string;
    interestedAssets: { name: string, krName: string, ticker: string }[];
    interestedResult: number;
    portfolio: { name: string, krName: string, ticker: string, quantity: number }[];
    portfolioResult: number;
    portfolioLevel: string;
    portfolioTime: string;
    password?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {

        const { USER_ID, AUTH_KEY } = req.query
        try {
            const userKey = await getExValue(USER_ID as string);

            if (userKey === AUTH_KEY) {

                return res.status(200).json({ userKey })

            } else {
                return res.status(400).json({ message: 'AUTH_KEY expired' })
            }
        } catch (error) {
            console.error(error);
            return res.status(404).json({ message: 'AUTH_KEY not found' });
        }
    }

    else if (req.method === "POST") {
        const { email } = req.body;

        try {
            const query = `SELECT EMAIL,PLATFORM FROM RWC.RW_USER_INFO WHERE EMAIL = ?;`;
            const userExistSql: any = await executeQuery({
                query: query,
                values: [email]
            });
            const isUserExist = await existValue("users", email);
            if (isUserExist && userExistSql.length > 0) {
                if (userExistSql[0].PLATFORM !== "credentials") {
                    return res.status(400).json({ message: "only credential users are allowed" })
                }
                const passwordReset = await sendPasswordResetEmail(email);
                return res.status(200).json({ passwordReset });
            }

            else {
                return res.status(409).json({ message: "user doesn't exists" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    else if (req.method === "PUT") {
        try {
            if (!req.body) return res.status(404).json({ error: "Don't have data" })

            const { changeInfo } = req.body;
            if (!changeInfo.email) {
                return res.status(401).json({ message: "Error indexing user email" });

            }
            const userInfo: UserInfo = await getValue("users", changeInfo.email)
            if (!userInfo) {
                return res.status(401).json({ message: "User not found." });

            }
            const hashedPassword = changeInfo.newPassword ? await bcrypt.hash(changeInfo.newPassword, 10) : "";

            await setValue("users", userInfo.email, { ...userInfo, password: hashedPassword })
            await executeQuery({
                query: `UPDATE RWC.RW_USER_INFO SET PW = ? WHERE EMAIL = ?`,
                values: [hashedPassword, userInfo.email]
            })

            await deleteExValue(userInfo.email)

            res.status(200).json({ success: true })

        } catch (error) {
            console.error('Error in changing password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    else {
        return res.status(405).json({ message: "Method not allowed" });

    }
}

