import mongoose from "mongoose";
import { OrganisationModel } from "./Organisation.js";
import { CertCategoryModel } from "./CertificationCategory.js";

export const QnASchema = new mongoose.Schema({
    class: {
        type: String,
        enum: ["obj-mcq", /* "subjective", "code", */ "obj-saq"],
        required: true,
    },

    question_statement: {
        type: String,
        required: true,
    },

    mcq_choices: {
        type: [String],
        default: null,
    },

    answer: {
        type: String,
        required: true,
    },

    weightage: {
        type: Number,
        required: true,
        enum: [1, 2, 3],
    },
});

export const CertificationModel = mongoose.model(
    "Certification",
    new mongoose.Schema({
        organisation: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Organisation",
            default: null,
        },

        category: {
            type: String,
            required: true,
            ref: "CertificationCategory",
        },

        cert_title: {
            type: String,
            required: true,
        },

        header_image: {
            type: Buffer,
            default: null,
        },

        cert_description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        qna_array: [QnASchema],

        exam_metadata: {
            easy_count: {
                type: Number,
                min: 10,
                default: 10,
            },

            medium_count: {
                type: Number,
                min: 10,
                default: 10,
            },

            advanced_count: {
                type: Number,
                min: 10,
                default: 10,
            },

            exam_duration: {
                // docs: https://www.npmjs.com/package/ms
                type: String,
                default: "3600s",
            },
        },
    }),
    "certifications"
);
