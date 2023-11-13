import NextAuth, { User, Account } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google"
import KakaoProvider from 'next-auth/providers/kakao'
import { v4 as uuid } from 'uuid'
import type { NextAuthOptions } from "next-auth"
import executeQuery from "data/mysql/mysql";
import { UserInfo } from "interfaces/portfolio"
import { Session } from "interfaces/login"
import { getValue, existValue } from 'data/redis/redis'
import bcrypt from 'bcrypt'




export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials, req) => {
                const { email, password } = credentials || {};

                if (!email || !password) {
                    return null;
                }

                const parsedInfo: UserInfo = await getValue("users", email);


                const users = await executeQuery({
                    query: `SELECT EMAIL,PW,USER_NM,IMG,ACCESS_LV FROM RWC.RW_USER_INFO WHERE EMAIL = ?;`,
                    values: [email]
                });

                if (users && users.length > 0) {
                    const user = users[0];

                    const isValidSql = await bcrypt.compare(password, user.PW);
                    const isValidRedis = await bcrypt.compare(password, parsedInfo.password as any)
                    if (isValidSql && isValidRedis) {
                        return {
                            id: user.EMAIL, // 여기에 유니크한 사용자 ID를 제공해야 합니다.
                            email: user.EMAIL,
                            name: user.USER_NM, // 여기에 실제 이름을 넣을 수 있으면 좋습니다.
                            image: user.IMG // 사용자의 프로필 이미지 URL이 있다면 여기에 추가합니다.
                        };
                    }
                }

                return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            /*@ts-ignore */

        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID as string,
            clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
        }),

    ],

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: `/login`,
        error: `/ko/login`
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60
    },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60
    },



    callbacks: {
        //@ts-ignore
        async session({ session }: Session) {
            if (!session?.user?.email) return session;

            let parsedInfo: any = await getValue("users", session.user.email);
            if (!parsedInfo) {
                parsedInfo = await getValue("users", session.user.email);
            }

            if (!parsedInfo) return session;

            session.user.name = parsedInfo['name'] || null;
            session.user.accessLevel = parsedInfo["accessLevel"] || null;
            session.user.membership = parsedInfo["membership"] || null;
            session.user.image = parsedInfo["profileImage"] || null;
            session.user.toleranceResult = parsedInfo["toleranceResult"] || null;
            session.user.interestedAssets = parsedInfo["interestedAssets"]?.map((asset: any) => asset.ticker) || [];
            session.user.portfolios = parsedInfo["portfolios"] || [];
            session.user.interest = parsedInfo["interest"]?.map((asset: any) => asset.ticker) || [];
            return session;
        },

        //@ts-ignore
        async signIn({ user, account }: { user: User; account: Account }) {
            if (!user.email) {
                throw new Error('User email is undefined or null');
            }

            const query = `SELECT EMAIL FROM RWC.RW_USER_INFO WHERE EMAIL = ?;`;
            const userExistSql: unknown[] = await executeQuery({
                query: query,
                values: [user.email]
            });
            const isUserExist = await existValue("users", user.email);
            const id = uuid();
            if (!isUserExist) {
                const newUser = {
                    id,
                    email: user.email,
                    platform_type: account?.provider,
                    name: user.name ? user.name : id.toString(),
                    profileImage: '/images/users/default4.svg',
                    created_at: Date.now(),
                    accessLevel: 1,
                    membership: 0
                };

                const data = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/user`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ newUser })
                }).then(res => res.json());

                return [data.newUser];
            } else if (isUserExist && userExistSql.length > 0) {
                const parsedInfo: UserInfo = await getValue("users", user.email);
                const userPlatform = parsedInfo.platform_type;


                if (userPlatform !== account?.provider) {
                    throw new Error(`An account with this email already exists on ${userPlatform} platform.`);
                } else {
                    return true
                }
            }
        }
    }



}

export default NextAuth(authOptions)

