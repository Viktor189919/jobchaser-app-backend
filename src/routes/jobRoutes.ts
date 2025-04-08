import express from "express";
import { createUserJob, getUserJobs, deleteUserJob } from "../controllers/jobControllers";
import authMiddleware from "../middleware/auth";

const router = express.Router();
router.use(authMiddleware)

router.post("/favourites", createUserJob);
router.get("/favourites", getUserJobs);
router.delete("/favourites", deleteUserJob)

export default router;