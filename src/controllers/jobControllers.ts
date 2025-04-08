import prisma from "../config/db"
import { Response } from "express"
import ProtectedRequest from "../types/api";

async function createUserJob(req : ProtectedRequest, res : Response) {
    
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized, token not found" });
        return;
    }

    const { id } = req.user
    const { jobtechId, companyName, jobHeadline, companyURL } = req.body;

    try {

        const isJob = await prisma.job.findUnique({
            where: {
                id: jobtechId,
            }
        })

        if (!isJob) {

            const job = await prisma.job.create({
                data: {
                    id: jobtechId, 
                    companyName: companyName, 
                    jobHeadline: jobHeadline, 
                    companyURL: companyURL,
                }
            })
        }

        const isUserJob = await prisma.user_jobs.findMany({
            where: {
                user_id: id,
                job_id: jobtechId,
            }
        })

        if (isUserJob.length < 1) {

            const userJob = await prisma.user_jobs.create({
                data: {
                    user_id: id,
                    job_id: jobtechId,
                }
            })

            if (!userJob) {
                res.status(500).json({message: "Error creating job, please try again"});
                return;
            }
        }
        
        res.status(201).json({message: "Job created successfully"});

    } catch (error) {
        console.error("Error creating job: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}

async function getUserJobs(req : ProtectedRequest, res : Response) {

    if (!req.user) {
        res.status(401).json({message: "Unauthorized, token not found"})
        return;
    }

    const { id } = req.user;

    try {

        const user = await prisma.user.findUnique({
            where: { 
                id: id 
            },
            include: {
                User_jobs: {
                include: {
                    Job: true,
                },
                },
            },
        });
          
        const jobs = user?.User_jobs.map(job => job.Job) ?? [];

        res.status(200).json({message: "Jobs fetched successfully", jobs: jobs})

    } catch (error) {
        console.error("Error from getUserJobs controller: ", error)
        res.status(500).json({message: "Internal server error"})
    }
}

async function deleteUserJob(req : ProtectedRequest, res : Response) {

    if (!req.user) {
        res.status(401).json({message: "Unauthorized, token not found"});
        return;
    }

    try {

        const job = await prisma.user_jobs.deleteMany({
            where: {
                user_id: req.user.id,
                job_id: req.body.id,
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

// async function deleteAllJobs(req : ProtectedRequest, res : Response) {

//     if (!req.user) {
//         res.status(401).json({message: "Unauthorized, token not found"});
//         return;
//     }

//     const { id } = req.user;

//     try {
//         const deletedJobs = await prisma.job.deleteMany({
//             where: {
//                 user_id: id,
//             }
//         })

//         if (!deletedJobs) {
//             res.status(404).json({message: "No jobs found"});
//             return;
//         }

//         res.status(200).json({message: "All jobs deleted successfully"});

//     } catch (error) {   
//         res.status(500).json({message: "Internal server error"})
//     }

// }

export { getUserJobs, createUserJob, deleteUserJob }