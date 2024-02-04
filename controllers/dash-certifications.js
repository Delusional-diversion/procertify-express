import { CertificationModel } from "../models/Certification.js";
import { logError } from "../utils/error-logger.js";

export const post_createCertHandler = async (req, res) => {
    try {
        const {
            category,
            cert_title,
            cert_description,
            header_image,
            price,
            exam_meta_easy_count,
            exam_meta_medium_count,
            exam_meta_advanced_count,
            exam_meta_exam_duration,
        } = req.body;

        const organisation_id = res.locals.ORGOBJ._id;

        res.json({
            success: true,
            payload: await CertificationModel.create({
                organisation: organisation_id,
                category: category,
                cert_title: cert_title,
                cert_description: cert_description,
                header_image: header_image,
                price: price,
                exam_meta: {
                    easy_count: exam_meta_easy_count,
                    medium_count: exam_meta_medium_count,
                    advanced_count: exam_meta_advanced_count,
                    exam_duration: exam_meta_exam_duration,
                },
            }),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_b2bCertsHandler = async (req, res) => {
    try {
        const organisation_id = res.locals.ORGOBJ._id;

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

export const put_updateCertHandler = async (req, res) => {
    try {
        const { certification_id } = req.params;
        const { mongoquery } = req.params;

        res.json({
            success: true,
            payload: await CertificationModel.findOneAndUpdate(
                { _id: certification_id },
                mongoquery,
                { new: true }
            ),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const delete_removeCertHandler = async (req, res) => {
    try {
        const { certification_id } = req.params;

        res.json({
            success: true,
            payload: await CertificationModel.findOneAndDelete({
                _id: certification_id,
            }),
        });
    } catch (e) {
        logError(e, res);
    }
};
