import mongoose from "mongoose";

export const CertCategoryModel = mongoose.model(
    "CertificationCategory",
    new mongoose.Schema({
        _id: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        header_img_url: {
            type: String,
            default: null,
        },
    }),
    "cert_categories"
);
