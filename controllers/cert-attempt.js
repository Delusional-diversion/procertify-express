import { CertificationModel } from "../models/Certification";
import { ExamSessionModel } from "../models/ExamSession";
import { formatDate } from "../utils/datetime";
import { logError } from "../utils/error-logger";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const post_certificationAttemptHandler = async (req, res) => {
    try {
        const { u_certification_id } = req.params;
        const userCertificationObj = res.locals.USEROBJ.certifications.filter(
            (i) => i._id === u_certification_id
        )[0];

        const certificationObj = await CertificationModel.findOne({
            _id: userCertificationObj.certification_ref,
        });

        const examSessionObj = await ExamSessionModel.findOne({
            _id: userCertificationObj.exam_session_ref,
        });

        const now = new Date();
        if (
            !(
                examSessionObj.scheduled_start_time < now &&
                now < examSessionObj.scheduled_end_time
            )
        )
            return res.json({ success: false, status: "TIME_RANGE_INVALID" });

        const { easy_count, medium_count, advanced_count } =
            certificationObj.exam_metadata;

        let easy_q = [],
            easy_qarray = certificationObj.qna_array.filter(
                (i) => i.weightage === 1
            ),
            med_q = [],
            med_qarray = certificationObj.qna_array.filter(
                (i) => i.weightage === 2
            ),
            adv_q = [],
            adv_qarray = certificationObj.qna_array.filter(
                (i) => i.weightage === 3
            );

        while (easy_q.length !== easy_count) {
            const choice =
                easy_qarray[Math.floor(Math.random() * myArray.length)];

            if (!easy_q.filter((i) => i._id === choice._id))
                easy_q.push(choice);
        }

        while (med_q.length !== medium_count) {
            const choice =
                med_qarray[Math.floor(Math.random() * myArray.length)];

            if (!med_qarray.filter((i) => i._id === choice._id))
                easy_qarray.push(choice);
        }

        while (adv_q.length !== advanced_count) {
            const choice =
                easy_qarray[Math.floor(Math.random() * myArray.length)];

            if (!adv_qarray.filter((i) => i._id === choice._id))
                adv_qarray.push(choice);
        }

        let new_qna_set = easy_q;
        new_qna_set.concat(med_q);
        new_qna_set.concat(adv_q);

        await ExamSessionModel.findOneAndUpdate(
            { _id: userCertificationObj.exam_session_ref },
            {
                $set: {
                    qna_set: new_qna_set,
                    user_response_set: Array(new_qna_set.length).fill(null),
                },
            }
        );
    } catch (e) {
        logError(e, res);
    }
};

export const post_examSessionRespond = async (req, res) => {
    try {
        const { qindex, qresponse } = req.body;
        const { exam_session_id } = req.params;

        const examSessionObj = await ExamSessionModel.findOne({
            _id: exam_session_id,
        });

        examSessionObj.user_response_set[qindex] = qresponse;

        await examSessionObj.save();

        res.json({
            success: true,
        });
    } catch (e) {
        logError(e, res);
    }
};

export const post_examSessionSubmit = async (req, res) => {
    try {
        const { exam_session_id } = req.params;

        const { qna_set, user_response_set, certification_ref } =
            await ExamSessionModel.findOne({ _id: exam_session_id });

        const { exam_metadata } = await CertificationModel.findOne({
            _id: certification_ref,
        });

        let total_score =
            exam_metadata.easy_count +
            exam_metadata.medium_count * 2 +
            exam_metadata.advanced_count * 3;

        let acquired_score = 0;
        for (let i = 0; i < user_response_set.length; i++)
            if (qna_set[i].answer === user_response_set[i])
                acquired_score += qna_set[i].weightage;

        res.json({
            success: true,
            payload: await ExamSessionModel.findOneAndUpdate(
                {
                    _id: exam_session_id,
                },
                { $set: { result: (acquired_score / total_score) * 100 } },
                { new: true }
            ),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_generateCertificate = async (req, res) => {
    try {
        const { exam_session_id } = req.params;

        const { certification_ref, result } = await ExamSessionModel.findOne({
            _id: exam_session_id,
        })
            .populate("certification_ref")
            .exec();

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const certificateContent = `This is to certify that ${certification_ref.cert_title} has successfully completed the course with a performance metric of ${result}%.`;
        const dateContent = `Date of Completion: ${formatDate(new Date())}`;
        const organisationContent = `Certified by: ${
            certification_ref.organisation ?? "ProCertify"
        }`;
        const sessionIdContent = `Verified and signed by ProCertify: ${exam_session_id}`;

        page.drawText(certificateContent, { x: 50, y: 500, font });
        page.drawText(dateContent, { x: 50, y: 480, font });
        page.drawText(organisationContent, { x: 50, y: 460, font });
        page.drawText(sessionIdContent, { x: 50, y: 440, font });

        const modifiedPdfBytes = await pdfDoc.save();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            "inline; filename=certificate.pdf"
        );

        res.send(modifiedPdfBytes);
    } catch (e) {
        logError(e, res);
    }
};
