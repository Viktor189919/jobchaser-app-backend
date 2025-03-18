import express, { Request, Response } from "express";
import { createUser, signinUser, deleteUser } from "../controllers/userControllers"
import authMiddleware from "../middleware/auth";
import validateCredentials from "../middleware/validateCredentials";

const router = express.Router();

router.post("/signup", validateCredentials, createUser)
router.post("/signin", validateCredentials, signinUser)
router.put("/",)
router.delete("/", authMiddleware, deleteUser)

export default router;