import express from "express";
import { logError } from "./utils/error-logger.js";

const router = express.Router();

router.get("/faceid", async (req, res) => {
    try {
        const response = await fetch("http://localhost:7000/verifypfp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image1: req.body.image1,
                image2: req.body.image2,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        const result = await response.json();

        res.json({
            success: true,
            payload: result,
        });
    } catch (e) {
        logError(e, res);
    }
});

router.get("/proctor", async (req, res) => {
    try {
        const response = await fetch("http://localhost:7000/proctor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                original: req.body.original,
                captured: req.body.captured,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed with status ${response.status}`);
        }

        const result = await response.json();

        res.json({
            success: true,
            payload: result,
        });
    } catch (e) {
        logError(e, res);
    }
});

export default router;
