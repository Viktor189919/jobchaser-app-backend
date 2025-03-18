import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes"
import jobRoutes from "./routes/jobRoutes"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes)
app.use("/jobs", jobRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
