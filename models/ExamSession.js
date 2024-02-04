import mongoose from "mongoose";
import crypto from "crypto";
import { QnASchema } from "./Certification.js";

const UserResponseSchema = new mongoose.Schema(
    {
        type: String,
        default: null,
    },
    { timestamps: true }
);

export const ExamSessionModel = mongoose.model(
    "ExamSession",
    new mongoose.Schema({
        certification_ref: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Certification",
        },

        session_id: {
            type: String,
            default: () => crypto.randomBytes(32).toString("hex").toUpperCase(),
        },

        scheduled_start_time: {
            type: Date,
            required: true,
        },

        scheduled_end_time: {
            type: Date,
            required: true,
        },

        // ensure equal
        qna_set: [QnASchema],

        // ensure equal
        user_response_set: [UserResponseSchema],

        result: {
            type: Number,
            default: null,
        },
    }),
    "exam_sessions"
);
