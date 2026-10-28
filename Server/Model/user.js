const pool = require("../db/db");

async function searchUser(email) {
    const sql = "SELECT id, email, usePassword FROM usetime WHERE email = ?";
    const [rows] = await pool.query(sql, [email]);
    return rows[0] || null;
}

async function addUser(email, usePassword) {
    let sql = "INSERT INTO usetime (email, usePassword) VALUES (?, ?)";
    const [result] = await pool.query(sql, [email, usePassword]);
    return result;
}

async function addrefeshToken(userId, token, createAt, expiresAt) {
    let sql = "INSERT INTO refestoken (userId, token, expiresAt, createdAt) VALUES (?, ?, ?, ?)";

    const [result] = await pool.query(sql, [userId, token, expiresAt, createAt]);
    return result;
}

module.exports = {
    searchUser,
    addUser,
    addrefeshToken
};