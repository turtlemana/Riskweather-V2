import { setValue, existValue, getValue, deleteValue } from "data/redis/redis";
import executeQuery from "data/mysql/mysql";
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcrypt';

interface UserInfoRow {
    email: string;
    platform_type: string;
    name: string;
    profileImage: string;
    created_at: string;
    accessLevel: string;
    inter_ticker: string;
    inter_kr_name: string;
    inter_name: string;
    port_ticker: string;
    port_kr_name: string;
    port_name: string;
    quantity: number;
};

interface UserInfo {
    email: string;
    platform_type: string;
    name: string;
    profileImage: string;
    created_at: string;
    accessLevel: string;
    interest: { name: string, krName: string, ticker: string }[];
    interestedResult: number;
    portfolio: { name: string, krName: string, ticker: string, quantity: number }[];
    portfolioResult: number;
    portfolioLevel: string;
    portfolioTime: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { session }: { session?: string } = req.query;

        if (!session) {
            res.status(401).json({ message: "You must be logged in." });
            return;
        }

        const user = await getValue("users", session);


        if (user === null || user === undefined || !user || user.length === 0) {
            const query = `
        SELECT 
          u.EMAIL AS email,
          u.PLATFORM AS platform_type,
          u.USER_NM AS name,
          u.IMG AS profileImage,
          u.CREATE_AT AS created_at,
          u.ACCESS_LV AS accessLevel,
          i.ITEM_CD_DL AS inter_ticker,
          i.ITEM_ENG_NM AS inter_name,
          i.ITEM_KR_NM as inter_kr_name,
          p.ITEM_CD_DL AS port_ticker,
          p.ITEM_ENG_NM AS port_name,
          p.ITEM_KR_NM as port_kr_name,
          p.ITEM_QTY AS quantity,
          p.PORT_CVaRNTS as portfolioResult,
          p.PORT_CVaR_LV as portfolioLevel,
          p.UPDATE_DT as portfolioTime
        FROM 
          RWC.RW_USER_INFO u
        LEFT JOIN 
          RWC.RW_USER_INTER i ON u.EMAIL = i.EMAIL
        LEFT JOIN 
          RWC.RW_USER_PORT p ON u.EMAIL = p.EMAIL AND p.IS_CURRENT = 1
        WHERE 
          u.EMAIL = ?;
      `;

            const results = await executeQuery({ query, values: [session] });

            if (results.length === 0) {
                res.status(404).json({ message: "User not found in MySQL." });
                return;
            }

            const userInfo: any = {
                email: results[0].email,
                platform_type: results[0].platform_type,
                name: results[0].name,
                profileImage: String(results[0].profileImage),
                created_at: results[0].created_at,
                accessLevel: results[0].accessLevel,
                interest: [],
                portfolio: [],
                portfolioResult: results[0].portfolioResult,
                portfolioLevel: results[0].portfolioLevel,
                portfolioTime: results[0].portfolioTime
            };
            results.forEach((row: UserInfoRow) => {
                if (row.inter_ticker && row.inter_name) {
                    const asset = { name: row.inter_name, krName: row.inter_kr_name, ticker: row.inter_ticker };
                    if (!userInfo.interest.some((a: any) => a.ticker === asset.ticker)) {
                        userInfo.interest.push(asset);
                    }
                }
                if (row.port_ticker && row.port_name && row.quantity) {
                    const asset = {
                        name: row.port_name,
                        krName: row.port_kr_name,
                        ticker: row.port_ticker,
                        quantity: row.quantity,
                    };
                    if (!userInfo.portfolio.some((a: any) => a.ticker === asset.ticker)) {
                        userInfo.portfolio.push(asset);
                    }
                }
            });
            await setValue("users", session, userInfo);
            res.status(200).json({ user: userInfo });
            return;
        }

        res.status(200).json({ user });
    }

    else if (req.method === "POST") {
        try {
            if (!req.body) return res.status(404).json({ error: "Don't have login data" })
            const { newUser } = req.body;
            let newUserObj = {
                ...newUser,
                created_at: Date.now()
            }
            //@ts-ignore
            const userExistSql: unknown[] = await executeQuery({
                query: `SELECT EMAIL FROM RWC.RW_USER_INFO WHERE EMAIL = ?;`,
                values: [newUser.email]
            });

            const checkExisting = await existValue("users", newUser.email)
            if (checkExisting == true || userExistSql.length > 0) return res.status(422).json({ message: "User already exists" })

            const id = uuid();
            const hashedPassword = newUser.password ? await bcrypt.hash(newUser.password, 10) : "";
            await executeQuery({
                query: `INSERT INTO RWC.RW_USER_INFO (EMAIL, USER_NM, MEMBERSHIP, PLATFORM, IMG,PW, CREATE_AT, UPDATE_DT,ACCESS_LV) VALUES (?, ?, ?, ?, ?,?, NOW(), NOW(),1)`,
                values: [newUser.email, newUser.name || id?.toString(), newUser.accessLevel, newUser.platform_type, newUser.profileImage, hashedPassword]
            });
            newUserObj = {
                ...newUserObj,
                password: hashedPassword ? hashedPassword : ""

            }

            await setValue("users", newUser.email, newUserObj)

            res.status(200).json({ newUser: newUserObj })
        } catch (error) {
            console.error('Error in addUser:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else if (req.method === "PUT") {
        const { session }: { session?: string } = req.query
        try {
            if (!req.body) return res.status(404).json({ error: "Don't have login data" })
            if (!session) {
                res.status(401).json({ message: "You must be logged in." });
                return;
            }
            const { enteredInput } = req.body;

            const userInfo: any = await getValue("users", session)

            if (!userInfo) {
                res.status(401).json({ message: "User not found." });
                return;
            }

            const userName = enteredInput?.name ? enteredInput?.name : "";
            const profileImage = enteredInput?.profileImage ? enteredInput?.profileImage : "";
            const toleranceAssets = enteredInput?.toleranceAssets ? enteredInput?.toleranceAssets : ""
            const portfolio = enteredInput?.portfolio ? enteredInput?.portfolio : ""
            const interest = enteredInput?.interest ? enteredInput?.interest : ""

            if (interest) {
                if (Array.isArray(interest)) {
                    // If interest is an array
                    if (enteredInput.action === "add") {
                        for (const asset of interest) {
                            await executeQuery({
                                query: `INSERT INTO RWC.RW_USER_INTER VALUES (?, NOW(), ?, ?, ?)`,
                                values: [userInfo.email as string, asset.ticker, asset.name, asset.krName],
                            });
                        }

                        const currentInterests = (userInfo as any).interest || [];
                        const updatedInterests = [...currentInterests, ...interest];
                        await setValue("users", userInfo.email, { ...userInfo, interest: updatedInterests });
                    } else if (enteredInput.action === "remove") {
                        for (const asset of interest) {
                            await executeQuery({
                                query: `DELETE FROM RWC.RW_USER_INTER WHERE email=? AND ITEM_CD_DL=?`,
                                values: [userInfo.email as string, asset.ticker],
                            });
                        }

                        const updatedInterests = (userInfo as any).interest.filter((item: any) => !interest.some((int: any) => int.ticker === item.ticker));
                        await setValue("users", userInfo.email, { ...userInfo, interest: updatedInterests });
                    }
                } else {
                    // Original logic for single item
                    if (enteredInput.action === "add") {
                        await executeQuery({
                            query: `INSERT INTO RWC.RW_USER_INTER VALUES (?, NOW(), ?, ?, ?)`,
                            values: [userInfo.email as string, interest.ticker, interest.name, interest.krName],
                        });

                        const currentInterests = (userInfo as any).interest || [];
                        const updatedInterests = [...currentInterests, interest];
                        await setValue("users", userInfo.email, { ...userInfo, interest: updatedInterests });
                    } else if (enteredInput.action === "remove") {
                        await executeQuery({
                            query: `DELETE FROM RWC.RW_USER_INTER WHERE email=? AND ITEM_CD_DL=?`,
                            values: [userInfo.email as string, interest.ticker],
                        });

                        const updatedInterests = (userInfo as any).interest.filter((item: any) => item.ticker !== interest.ticker);
                        await setValue("users", userInfo.email, { ...userInfo, interest: updatedInterests });
                    }
                }
            }
            if (toleranceAssets) {
                await executeQuery({ query: `UPDATE RWC.RW_USER_TOLERANCE SET IS_CURRENT = 0 WHERE EMAIL = ?`, values: [userInfo.email as string] })

                for (let i = 0; i < toleranceAssets.length; i++) {
                    await executeQuery({
                        query: `INSERT INTO RWC.RW_USER_TOLERANCE VALUES (?, NOW(), ?, ?, ?, ?, ?,NOW())`,
                        values: [userInfo.email as string, decodeURIComponent(toleranceAssets[i].ticker), decodeURIComponent(toleranceAssets[i].name), decodeURIComponent(toleranceAssets[i].krName), decodeURIComponent(enteredInput.toleranceResult), 1]
                    });

                }
                await setValue("users", userInfo.email, { ...userInfo, accessLevel: 2, ...enteredInput })

            } else if (portfolio) {
                if (enteredInput.method === "portfolioGenerate" && portfolio.portName) {
                    // 해당 이메일과 포트폴리오 이름에 해당하는 기존 포트폴리오를 비활성화
                    // await executeQuery({
                    //     query: `UPDATE RWC.RW_USER_PORT SET IS_CURRENT = 0 WHERE EMAIL = ? AND PORT_NM = ?`,
                    //     values: [userInfo.email as string, portfolio.portName]
                    // });

                    if (!portfolio.items && !portfolio.portfolioResult && !portfolio.portfolioLevel) {
                        // 포트폴리오 이름만 추가하는 경우
                        await executeQuery({
                            query: `INSERT INTO RWC.RW_USER_PORT (EMAIL, PORT_NM, UDT_DT, IS_CURRENT) VALUES (?, ?, NOW(), 1)`,
                            values: [userInfo.email, portfolio.portName]
                        });
                        const newPortfolio = {
                            portName: portfolio.portName,
                            items: [],
                            portfolioLevel: "",
                            portfolioResult: 0,
                            portfolioTime: ""
                        };
                        const updatedPortfolios = [...((userInfo as any).portfolios || []), newPortfolio];

                        // Redis에 업데이트된 portfolios 정보를 저장
                        await setValue("users", userInfo.email, { ...userInfo, portfolios: updatedPortfolios, accessLevel: 2 });
                    } else {
                        // 포트폴리오 아이템과 관련 정보를 포함하여 추가하는 경우
                        const itemsJSON = JSON.stringify(portfolio.items);
                        await executeQuery({
                            query: `INSERT INTO RWC.RW_USER_PORT (EMAIL, PORT_NM, PORT_ITEMS, PORT_CVaRNTS, PORT_CVaR_LV, UDT_DT, IS_CURRENT) VALUES (?, ?, ?, ?, ?, NOW(), 1)`,
                            values: [userInfo.email, portfolio.portName, itemsJSON, portfolio.portfolioResult, portfolio.portfolioLevel]
                        });
                    }
                }
                else if (enteredInput.method === "portfolioNameEdit" && portfolio.portName && portfolio.newPortName) {
                    // 포트폴리오 이름을 수정하는 로직
                    // 해당 이메일과 기존 포트폴리오 이름에 해당하는 데이터를 찾아 이름을 업데이트
                    await executeQuery({
                        query: `UPDATE RWC.RW_USER_PORT SET PORT_NM = ? WHERE EMAIL = ? AND PORT_NM = ?`,
                        values: [portfolio.newPortName, userInfo.email, portfolio.portName]
                    });

                    // Redis에도 업데이트된 포트폴리오 이름을 반영
                    const currentUserInfo = await getValue("users", userInfo.email);

                    // 현재 사용자의 포트폴리오 목록 가져오기
                    const currentPortfolios = currentUserInfo.portfolios;

                    // 포트폴리오 이름 변경하기
                    const updatedPortfolios = currentPortfolios.map((ptf: any) => {
                        if (ptf.portName === portfolio.portName) {
                            return { ...ptf, portName: portfolio.newPortName };
                        }
                        return ptf;
                    });

                    // Redis에 변경된 정보 저장하기
                    await setValue("users", userInfo.email, { ...currentUserInfo, portfolios: updatedPortfolios });
                }
                else if (enteredInput.method === "portfolioAssetAdd") {
                    // 포트폴리오 아이템과 관련 정보를 포함하여 업데이트



                    const itemsJSON = JSON.stringify(portfolio.items);
                    await executeQuery({
                        query: `UPDATE RWC.RW_USER_PORT SET PORT_ITEMS = ?, PORT_CVaRNTS = ?, PORT_CVaR_LV = ?, UDT_DT = NOW() WHERE EMAIL = ? AND PORT_NM = ? AND IS_CURRENT = 1`,
                        values: [itemsJSON, enteredInput.portfolioResult, enteredInput.portfolioLevel, userInfo.email, portfolio.portName]
                    });

                    // Redis에 업데이트된 portfolios 정보를 저장
                    const newPortfolio = {
                        portName: portfolio.portName,
                        items: portfolio.items,
                        portfolioLevel: enteredInput.portfolioLevel,
                        portfolioResult: enteredInput.portfolioResult,
                        portfolioTime: enteredInput.portfolioTime
                    };
                    const updatedPortfolios = (userInfo as any).portfolios.map((p: any) => {
                        if (p.portName === portfolio.portName) {
                            return newPortfolio;
                        }
                        return p;
                    });

                    await setValue("users", userInfo.email, { ...userInfo, portfolios: updatedPortfolios, accessLevel: 2 });
                } else if (enteredInput.method === "portfolioDelete") {
                    // 포트폴리오 삭제 로직
                    const portNameToDelete = enteredInput.portfolio.portName;

                    await executeQuery({
                        query: `DELETE FROM RWC.RW_USER_PORT WHERE EMAIL = ? AND PORT_NM = ?`,
                        values: [userInfo.email as string, portNameToDelete]
                    });

                    const updatedPortfolios = (userInfo as any).portfolios.filter(
                        (p: any) => p.portName !== portNameToDelete
                    );

                    await setValue("users", userInfo.email, { ...userInfo, portfolios: updatedPortfolios });
                }


                // await setValue("users", userInfo.email, { ...userInfo, accessLevel: 2, ...enteredInput })

            }
            else if (userName && profileImage) {
                await executeQuery({
                    query: `UPDATE RWC.RW_USER_INFO SET IMG = ? WHERE EMAIL = ?`,
                    values: [profileImage, userInfo.email]
                });
                await setValue("users", userInfo.email, { ...userInfo, accessLevel: 2, ...enteredInput })

            }

            else if (userName) {
                await executeQuery({
                    query: `UPDATE RWC.RW_USER_INFO SET USER_NM = ? WHERE EMAIL = ?`,
                    values: [userName, userInfo.email]
                });
                await setValue("users", userInfo.email, { ...userInfo, accessLevel: 2, ...enteredInput })

            }
            if (userInfo?.email) {
                // await setValue("users", userInfo.email, { ...userInfo, accessLevel: 2, ...enteredInput })
                await executeQuery({
                    query: `UPDATE RWC.RW_USER_INFO SET MEMBERSHIP = ? WHERE EMAIL = ?`,
                    values: [2, userInfo.email]
                })
            }

            res.status(200).json({ enteredInput: enteredInput })

        }
        catch (error) {
            console.error('Error in addUserInfo:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    else if (req.method === "DELETE") {
        try {
            const { session }: { session?: string } = req.query
            if (!session) {
                res.status(401).json({ message: "You must be logged in." });
                return;
            }


            await deleteValue("users", session)
            await executeQuery({ query: `UPDATE RWC.RW_USER_TOLERANCE SET IS_CURRENT = 0 WHERE EMAIL = ?`, values: [session] })
            await executeQuery({ query: `UPDATE RWC.RW_USER_PORT SET IS_CURRENT = 0 WHERE EMAIL = ?`, values: [session] })

            await executeQuery({
                query: `DELETE FROM RWC.RW_USER_INFO 
    WHERE EMAIL = ?`, values: [session]
            })
            res.status(200).json({ deleteSuccess: true })
        }
        catch {
            res.status(500).json({ message: 'Internal server error' });

        }
    } else {
        res.status(405).json({ message: "Method not allowed" })
    }

}

