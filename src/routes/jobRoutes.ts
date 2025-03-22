import express from "express";
import { createJob, getJobs, deleteJobById } from "../controllers/jobControllers";
import authMiddleware from "../middleware/auth";

const router = express.Router();
router.use(authMiddleware)

router.post("/", createJob);
router.get("/favourites", getJobs);
router.delete("/favourites", deleteJobById)

export default router;