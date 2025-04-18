import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db"
import ProtectedRequest from "../types/api";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS!);

async function createUser(req : Request, res : Response) {

    const { email, password } = req.body;

    const isUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (isUser) {
        res.status(409).json({message: "A user with this email already exists"});
        return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        }
    })

    if (!user) {
        res.status(500).json({message: "Error creating user, please try again"})
    }

    res.status(201).json({message: "User created successfully"});
}

async function signinUser(req : Request, res : Response) {

    const { email, password } = req.body;

    // Try for handling error from database call
    try {

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            res.status(404).json({message: "User not found"})
            return;
        }

        const isUserPassword = await bcrypt.compare(password, user.password)

        if (!isUserPassword) {
            res.status(404).json({message: "Wrong password"})
            return;
        }

        
        const JWT = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET as string,
            {expiresIn: "1h"}
        )

        res.cookie("jobchaserToken", JWT, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 3600000
        })

        res.status(200).json({message: "Signed in successfully"})

    } catch (error) {
        console.error("Error from catch in signinUser: ", error);
        res.status(500).json({message: "Internal server error"});
        return;
    }
} 

async function signoutUser(req: ProtectedRequest, res: Response) {

    const token = req.cookies.jobchaserToken;

    if (token) {

        res.clearCookie("jobchaserToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })
    }

    // The same response regardless the token is found and removed or token is not found.
    res.status(200).json({message: "Logged out successfully"});
}

async function deleteUser(req : ProtectedRequest, res : Response) {

    if (!req.user) {
        res.status(401).json({message: "Unauthorized, token not found"});
        return;
    }
    
    const { password } = req.body;

    const isUserPassword = await bcrypt.compare(password, req.user.password)

    if (!isUserPassword) {
        res.status(404).json({message: "Wrong password"})
        return;
    }

    const user = await prisma.user.delete({
        where: {
            id: req.user.id,
        }
    })

    if (!user) {
        res.status(404).json({message: "User not found"})
        return;
    }

    res.status(200).json({message: "User deleted successfully"})

}

export { createUser, signinUser, signoutUser, deleteUser }