import express from "express";
import { createJob, getJobs, getJobByCompany, deleteJobById, deleteAllJobs } from "../controllers/jobControllers";
import authMiddleware from "../middleware/auth";

const router = express.Router();
router.use(authMiddleware)

router.post("/", createJob);
router.get("/favourites", getJobs);
router.get("/favourites/:company", getJobByCompany);
router.delete("/favourites", deleteJobById)
router.delete("/favourites/deleteAll", deleteAllJobs)

export default router;