import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface ProtectedRequest extends Request {
    user? : JwtPayload;
}

async function authMiddleware(req : ProtectedRequest, res : Response, next : NextFunction) {

    const token = req.cookies.jobchaserToken

    if (!token) {
        console.error("Error from authMiddleware: No token found")
        res.status(401).json({message: "Unauthorized, no token"});
        return;
    }

    if (!process.env.JWT_SECRET) {
        console.error("Error from authMiddleware: JWT secret is not defined")
        res.status(500).json({message: "Internal server error"});
        return;
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.user = decoded;
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({message: "Unauthorized, invalid token"})
    }
}

export default authMiddleware