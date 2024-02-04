import ms from "ms";
import { CertificationModel } from "../models/Certification.js";
import { CertCategoryModel } from "../models/CertificationCategory.js";
import { ExamSessionModel } from "../models/ExamSession.js";
import { logError } from "../utils/error-logger.js";
import { OrganisationModel } from "../models/Organisation.js";
import { UserModel } from "../models/User.js";

export const get_catsHandler = async (req, res) => {
    try {
        res.json({
            success: true,
            payload: await CertCategoryModel.find({}),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_catHandler = async (req, res) => {
    try {
        const { category_id } = req.params;

        res.json({
            success: true,
            payload: await CertificationModel.find({ category: category_id }),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_certHandler = async (req, res) => {
    try {
        const { certification_id } = req.params;

        res.json({
            success: true,
            payload: await CertificationModel.find({ _id: certification_id }),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const post_buyCertHandler = async (req, res) => {
    try {
        const { certification_id } = req.params;

        const certificationObj = await CertificationModel.aggregate([
            { $match: { _id: certification_id } },
            { $project: { exam_metadata: 1 } },
        ]);

        const { scheduled_start_time } = req.body;

        const scheduled_end_time = new Date(
            new Date(scheduled_start_time).getTime() +
                ms(certificationObj.exam_metadata.exam_duration)
        );

        const examSessionObj = await ExamSessionModel.create({
            certification_ref: certification_id,

            scheduled_start_time: new Date(scheduled_start_time),

            scheduled_end_time: scheduled_end_time,
        });

        await UserModel.findOneAndUpdate(
            { _id: res.locals.USEROBJ._id },
            {
                $push: {
                    certifications: {
                        test_begin_time: scheduled_start_time,

                        test_time_end: scheduled_end_time,

                        certification_ref: certification_id,

                        exam_session_ref: examSessionObj._id,
                    },
                },
            }
        );

        res.json({
            success: true,
            payload: examSessionObj,
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_compsHandler = async (req, res) => {
    try {
        res.json({
            success: true,
            payload: await OrganisationModel.find({}),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_compHandler = async (req, res) => {
    try {
        const { organisation_id } = req.params;

        res.json({
            success: true,
            payload: await CertificationModel.find({
                organisation: organisation_id,
            }),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_userCertsHandler = async (req, res) => {
    try {
        res.json({
            success: true,
            payload: (
                await UserModel.findOne({ _id: res.locals.USEROBJ._id }).select(
                    "certifications"
                )
            ).certifications,
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_userCertHandler = async (req, res) => {
    try {
        const { u_certification_id } = req.params;

        res.json({
            success: true,
            payload: (
                await UserModel.findOne({ _id: res.locals.USEROBJ._id }).select(
                    "certifications"
                )
            ).certifications.filter((cert) => cert._id === u_certification_id),
        });
    } catch (e) {
        logError(e, res);
    }
};
