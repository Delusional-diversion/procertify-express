import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },

        is_used: {
            type: Boolean,
            default: false,
        },

        redeem_datetime: {
            type: Date,
            default: null,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const OrganisationModel = new mongoose.model(
    "Organisation",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        header_img: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        is_active: {
            default: false,
        },

        coupons: [CouponSchema],
    }),
    "organisations"
);
