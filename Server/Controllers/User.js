const { searchUser, addUser, addrefeshToken } = require('../Model/user');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

function midelWare(req, res, next) {
    const headers = req.headers.authorization;
    if (!headers) {
        return res.status(401).json({
            message: "Vui lòng cung cấp access token hợp lệ."
        });
    }
    const parts = headers.split(" ");
    if (parts.length !== 2) {
        return res.status(401).json({
            message: "Vui lòng cung cấp access token hợp lệ."
        });
    }
    const [type, token] = parts;
    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Vui lòng cung cấp access token hợp lệ."
        });
    }
    try {
        const data = jwt.verify(
            token,
            process.env.SECREC_KEY, {
            algorithms: [process.env.KEY]
        }
        );
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
}

const register = async (req, res) => {
    try {
        const email = req.body.email;
        const usePassword = req.body.password;
        if (!email || !usePassword) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ email và password!" });
        }
        let salt = bcrypt.genSaltSync(10);

        let hashedPassword = await bcrypt.hash(usePassword, salt);
        const result = await addUser(email, hashedPassword);

        return res.status(201).json({
            message: "Đăng ký thành công!",
            userId: result.insertId
        });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email này đã được sử dụng!" });
        }
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email:", email, "password:", password);
        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ email và password!" });
        }

        const user = await searchUser(email);

        if (!user || !(await bcrypt.compare(password, user.usePassword))) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác!" });
        }
        const token = jwt.sign(
            {
                userId: user.id,
                role: "user"
            },
            process.env.SECREC_KEY,
            {
                expiresIn: "30s",
                algorithm: process.env.KEY
            }
        )
        const rawRefreshToken = jwt.sign(
            {
                userId: user.id,
                role: "user",
            },
            process.env.SECREC_KEY,
            {
                expiresIn: "7d",
                algorithm: process.env.KEY
            }
        )
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
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const saveRefreshToken = async (req, res) => {
    try {
        const { userId, token } = req.body;

        if (!userId || !token) {
            return res.status(400).json({ message: "Thiếu thông tin userId hoặc token!" });
        }

        const createAt = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(createAt.getDate() + 7);

        const result = await addrefeshToken(userId, token, createAt, expiresAt);

        return res.status(200).json({
            message: "Lưu refresh token thành công!",
            result
        });
    } catch (error) {
        console.error("Lỗi lưu token:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const loginSystem = (req, res) => {
    return res.status(200).json({ message: "Truy cập hệ thống thành công", user: req.user });
}

module.exports = {
    midelWare,
    register,
    login,
    saveRefreshToken,
    loginSystem
};