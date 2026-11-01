import type {
    Pool,
    ResultSetHeader,
    RowDataPacket
} from "mysql2/promise";

const pool = require("../db/db") as Pool;

interface UserRow extends RowDataPacket {
    id: number;
    email: string;
    usePassword: string;
}

async function searchUser(email: string): Promise<UserRow | null> {
    const sql = "SELECT id, email, usePassword FROM usetime WHERE email = ?";
    const [rows] = await pool.query<UserRow[]>(sql, [email]);
    return rows[0] ?? null;
}

async function addUser(email: string, usePassword: string): Promise<ResultSetHeader> {
    const sql = "INSERT INTO usetime (email, usePassword) VALUES (?, ?)";
    const [result] = await pool.query<ResultSetHeader>(sql, [email, usePassword]);
    return result;
}

async function addrefeshToken(
    userId: number,
    token: string,
    createAt: Date,
    expiresAt: Date
): Promise<ResultSetHeader> {
    const sql = "INSERT INTO refestoken (userId, token, expiresAt, createdAt) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query<ResultSetHeader>(sql, [
        userId,
        token,
        expiresAt,
        createAt
    ]);
    return result;
}

module.exports = {
    searchUser,
    addUser,
    addrefeshToken
};
