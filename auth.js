import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateAccessToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.split(" ")[1];
    if (token == null) res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) res.sendStatus(403);
        req.user = user;
        next();
    })
}

export const authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.body.refresh_token;
    if (refreshToken == null) res.sendStatus(400);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    }) 
}

export const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' });
}

export const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}