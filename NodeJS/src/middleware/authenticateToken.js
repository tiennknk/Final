import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ errCode: 99, errMessage: 'Không xác định được user đăng nhập!' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ errCode: 99, errMessage: 'Không xác định được user đăng nhập!' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ errCode: 99, errMessage: 'Token không hợp lệ!' });
    }
};

export default authenticateToken;