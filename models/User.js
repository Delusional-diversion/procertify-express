import mongoose from "mongoose";
import { CertificationModel } from "./Certification.js";
import { ExamSession } from "./ExamSession.js";
import { OrganisationModel } from "./Organisation.js";

/* const CountrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    std_code: { type: String, required: true },
}); */

const UserCertificationSchema = new mongoose.Schema(
    {
        test_time_begin: { type: Date, required: true },

        test_time_end: { type: Date, required: true },

        certification_ref: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Certification",
            required: true,
        },

        exam_session_ref: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "ExamSession",
            required: true,
        },
    },
    { timestamps: true }
);

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    pfp: {
        type: Buffer,
        required: true,
    },

    /* country: {
        type: CountrySchema,
        enum: countryArray.map((countryObj) => ({
            name: countryObj.name,
            std_code: countryObj.std_code,
        })),
        required: true,
    }, */

    /* organisation: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Organisation",
        default: null,
    }, */

    govt_id: {
        full_name: {
            type: String,
            required: true,
        },

        uid: {
            type: String,
            required: true,
            unique: true,
        },

        dob: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: type,
        },
    },

    certifications: [UserCertificationSchema],
});

export const UserModel = mongoose.model("User", UserSchema, "users");
