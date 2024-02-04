import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import siteRouter from "./site-router.js";
import dashRouter from "./dash-router.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "50mb" }));

app.get("/health", async (req, res) => {
    res.send({
        status: "200 OK 👍 ;)",
        uptime: process.uptime(),
        timestamp: Date.now(),
        version: "1.0.0",
    });
});

async function configureMdb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            retryWrites: true,
            retryReads: true,
        });

        console.log("[✓] Connected to MongoDB cluster");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

configureMdb();

app.use("/site", siteRouter);
app.use("/b2b", dashRouter);

app.listen(process.env.PORT || 7000, () => {
    console.log(`[✓] Server is running on PORT ${process.env.PORT}`);
});
