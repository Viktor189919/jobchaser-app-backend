import express, { Request, Response, NextFunction } from "express";
import { createUser, signinUser, signoutUser, deleteUser } from "../controllers/userControllers"
import authMiddleware from "../middleware/auth";
import validateCredentials from "../middleware/validateCredentials";

const router = express.Router();

router.post("/signup", validateCredentials, createUser)
router.post("/signin", validateCredentials, signinUser)
router.post("/signout", signoutUser)
router.post("/checkAuth", authMiddleware, (req : Request, res : Response) => {
    res.status(200).json({message: "Authorized"})
})
router.put("/",)
router.delete("/", authMiddleware, deleteUser)

export default router;