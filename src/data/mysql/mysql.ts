//MySql Connection via connection pool
import mysql from 'mysql2/promise';

interface QueryParams {
    query: string;
    values?: (string | number | boolean | Date | null)[];
};

// const pool = mysql.createPool(
//     {
//         host: process.env.MYSQL_HOST,
//         port: 3306,
//         waitForConnections: true,
//         user: process.env.MYSQL_USER,
//         password: process.env.MYSQL_PASSWORD,
//         connectionLimit: 20,
//         queueLimit: 0,

//     }
// )

const pool = mysql.createPool(
    {
        host: 'localhost', // 변경된 호스트
        port: 3307,       // 변경된 포트 번호
        waitForConnections: true,
        user: 'rw',     // Rust 예제에서 사용한 데이터베이스 사용자 이름
        password: 'c7f99603b5c25ced38fd95feb50cde9468c23d377085409ac951a830174a3bc9e129889a1145028fe86d3d6afcecfca5ab4524a6b7a48a577827730c369a1c85', // Rust 예제에서 사용한 비밀번호
        connectionLimit: 20,
        queueLimit: 0,
    }
);

export default async function executeQuery({ query, values }: QueryParams): Promise<any> {
    if (!pool) {
        throw new Error("DB Pool is not initialized.");
    }
    const conn = await pool.getConnection();

    try {
        const [results, fields] = await conn.execute(query, values);
        return results;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

