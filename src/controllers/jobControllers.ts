import prisma from "../config/db"
import { Response } from "express"
import ProtectedRequest from "../types/api";

async function createJob(req : ProtectedRequest, res : Response) {
    
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized, token not found" });
        return;
    }

    const { id } = req.user
    const { company, adExpiresAt } = req.body;

    const job = await prisma.job.create({
        data: {
            user_id: id,
            company: company,
            adExpiresAt: adExpiresAt
        }
    })

    if (!job) {
        res.status(500).json({message: "Error creating job, please try again"});
        return;
    }

    res.status(201).json({message: "Job created successfully"});
}

async function getJobs(req : ProtectedRequest, res : Response) {

    if (!req.user) {
        res.status(401).json({message: "Unauthorized, token not found"})
        return;
    }

    const { id } = req.user;
    
    const jobs = await prisma.job.findMany({
        where: {
            user_id: id,
        }
    });

    if (!jobs) {
        res.status(500).json({message: "Error fetching jobs"});
        return;
    }

    if (jobs.length < 1) {
        res.status(404).json({message: "No jobs found"})
    }

    res.status(200).json({message: "Jobs fetched successfully", jobs: jobs})
}

async function getJobByCompany(req : ProtectedRequest, res : Response) {

    const { company } = req.params;

    if (!company) {
        res.status(400).json({message: "Could not find request parameter"})
        return;
    }

    const job = await prisma.job.findMany({
        where: {
            company: company.toString(),
        }
    })

    if (!job) {
        res.status(500).json({message: "Error fetching jobs"});
        return;
    }

    if (job.length < 1) {
        res.status(204).json({message: "No jobs found for this user"});
        return;
    }

    res.status(200).json({message: "Jobs fetched successfully", jobs: job})
}

async function deleteJobById(req : ProtectedRequest, res : Response) {

    if (!req.user) {
        res.status(401).json({message: "Unauthorized, token not found"});
        return;
    }

    try {
        const job = await prisma.job.delete({
            where: {
                id: req.body.id,
                user_id: req.user.id
            }
        });

        if (!job) {
            res.status(404).json({message: "Job not found"});
            return;
        }

        res.status(200).json({message: "Job deleted successfully", job: job})

    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }      
}

async function deleteAllJobs(req : ProtectedRequest, res : Response) {

    if (!req.user) {
        res.status(401).json({message: "Unauthorized, token not found"});
        return;
    }

    const { id } = req.user;

    try {
        const deletedJobs = await prisma.job.deleteMany({
            where: {
                user_id: id,
            }
        })

        if (!deletedJobs) {
            res.status(404).json({message: "No jobs found"});
            return;
        }

        res.status(200).json({message: "All jobs deleted successfully"});

    } catch (error) {   
        res.status(500).json({message: "Internal server error"})
    }

}

export { getJobByCompany, getJobs, createJob, deleteJobById, deleteAllJobs }