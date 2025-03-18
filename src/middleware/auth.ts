import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface ProtectedRequest extends Request {
    user? : JwtPayload;
}

async function authMiddleware(req : ProtectedRequest, res : Response, next : NextFunction) {

    const bearerToken = req.headers.authorization?.split(" ")[1];

    if (!bearerToken) {
        res.status(401).json({message: "Unauthorized, no token"});
        return;
    }

    if (!process.env.JWT_SECRET) {
        res.status(500).json({message: "Jwt secret is not defined"});
        return;
    }

    try {
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as JwtPayload
        req.user = decoded;
        console.log("Req user", req.user);
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Unauthorized, invalid token"})
    }
}

export default authMiddleware