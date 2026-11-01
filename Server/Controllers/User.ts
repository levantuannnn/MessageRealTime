import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jwt, { type Algorithm, type JwtPayload } from "jsonwebtoken";
import type { ResultSetHeader } from "mysql2/promise";

interface RegisterBody {
    email?: string;
    password?: string;
}

interface LoginBody {
    email?: string;
    password?: string;
}

interface RefreshTokenBody {
    userId?: number;
    token?: string;
}

interface UserModel {
    searchUser(email: string): Promise<{
        id: number;
        email: string;
        usePassword: string;
    } | null>;
    addUser(email: string, password: string): Promise<ResultSetHeader>;
    addrefeshToken(
        userId: number,
        token: string,
        createAt: Date,
        expiresAt: Date
    ): Promise<ResultSetHeader>;
}

const { searchUser, addUser, addrefeshToken } = require("../Model/user") as UserModel;

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string;
        }
    }
}

function getJwtConfig(): { secret: string; algorithm: Algorithm } {
    const secret = process.env.SECREC_KEY;
    const algorithm = process.env.KEY;

    if (!secret || !algorithm) {
        throw new Error("Missing JWT configuration");
    }

    return { secret, algorithm: algorithm as Algorithm };
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
}

function midelWare(req: Request, res: Response, next: NextFunction): void {
    const headers = req.headers.authorization;
    if (!headers) {
        res.status(400).json({ message: "loi khong tim thay" });
        return;
    }

    const parts = headers.split(" ");
    if (parts.length !== 2) {
        res.status(400).json({ message: "loi khong tim thay" });
        return;
    }

    const [type, token] = parts;
    if (type !== "Bearer" || !token) {
        res.status(400).json({ message: "loi khong tim thay" });
        return;
    }

    try {
        const { secret, algorithm } = getJwtConfig();
        req.user = jwt.verify(token, secret, { algorithms: [algorithm] });
        next();
    } catch {
        res.status(401).json({
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
}

async function register(
    req: Request<Record<string, string>, unknown, RegisterBody>,
    res: Response
) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ email và password!"
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await addUser(email, hashedPassword);

        return res.status(201).json({
            message: "Đăng ký thành công!",
            userId: result.insertId
        });
    } catch (error: unknown) {
        console.error("Lỗi đăng ký:", error);
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "ER_DUP_ENTRY"
        ) {
            return res.status(400).json({ message: "Email này đã được sử dụng!" });
        }
        return res.status(500).json({
            message: "Lỗi server",
            error: getErrorMessage(error)
        });
    }
}

async function login(
    req: Request<Record<string, string>, unknown, LoginBody>,
    res: Response
) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ email và password!"
            });
        }

        const user = await searchUser(email);
        if (!user || !(await bcrypt.compare(password, user.usePassword))) {
            return res.status(401).json({
                message: "Email hoặc mật khẩu không chính xác!"
            });
        }

        const { secret, algorithm } = getJwtConfig();
        const claims = { userId: user.id, role: "user" };
        const token = jwt.sign(claims, secret, {
            expiresIn: "30s",
            algorithm
        });
        const rawRefreshToken = jwt.sign(claims, secret, {
            expiresIn: "7d",
            algorithm
        });

        const hashedRefreshToken = await bcrypt.hash(rawRefreshToken, 10);
        const createAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(createAt.getDate() + 7);
        await addrefeshToken(user.id, hashedRefreshToken, createAt, expiresAt);

        return res.status(200).json({
            message: "Đăng nhập thành công!",
            accessToken: token,
            refreshToken: rawRefreshToken,
            data: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error: unknown) {
        console.error("Lỗi đăng nhập:", error);
        return res.status(500).json({
            message: "Lỗi server",
            error: getErrorMessage(error)
        });
    }
}

async function saveRefreshToken(
    req: Request<Record<string, string>, unknown, RefreshTokenBody>,
    res: Response
) {
    try {
        const { userId, token } = req.body;
        if (!userId || !token) {
            return res.status(400).json({
                message: "Thiếu thông tin userId hoặc token!"
            });
        }

        const createAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(createAt.getDate() + 7);
        const result = await addrefeshToken(userId, token, createAt, expiresAt);

        return res.status(200).json({
            message: "Lưu refresh token thành công!",
            result
        });
    } catch (error: unknown) {
        console.error("Lỗi lưu token:", error);
        return res.status(500).json({
            message: "Lỗi server",
            error: getErrorMessage(error)
        });
    }
}

function loginSystem(req: Request, res: Response) {
    return res.status(200).json({
        message: "Truy cập hệ thống thành công",
        user: req.user
    });
}

module.exports = {
    midelWare,
    register,
    login,
    saveRefreshToken,
    loginSystem
};
