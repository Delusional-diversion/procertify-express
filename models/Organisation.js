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

export const OrganisationModel = mongoose.model(
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
            type: Buffer,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        is_active: {
            type: Boolean,
            default: false,
        },

        coupons: [CouponSchema],
    }),
    "organisations"
);
