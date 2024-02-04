import { UserModel } from "../models/User.js";
import { aadhaarDb, aadhaarVerificationSession } from "../static/aadhaar-db.js";
import { sha256DigToHex } from "../utils/cryptography.js";
import { logError } from "../utils/error-logger.js";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

export const post_aadhaarOtpRequestHandler = async (res, req) => {
    try {
        const { country, govt_uid } = req.body;

        // const otp = await sendSmsVerificationRequest(govt_uid);

        // addRedisKey(govt_uid, otp);

        res.json({ success: true });
    } catch (e) {
        logError(e, res);
    }
};

export const post_aadhaarOtpVerifyHandler = async (res, req) => {
    try {
        const { govt_uid, otp } = req.body;

        const is_otp_verified = aadhaarVerificationSession[govt_uid] === otp;

        if (!is_otp_verified) {
            return res.json({
                success: false,
                status: "OTP_VERIF_FAILED",
            });
        }

        aadhaarVerificationSession[govt_uid] = true;

        res.json({
            success: true,
            status: "OTP_VERIF_SUCCESS",
        });
    } catch (e) {
        logError(e, res);
    }
};

export const post_signUpCreatePfHandler = async (req, res) => {
    try {
        const { email, password, pfp, govt_id } = req.body;

        if (!aadhaarVerificationSession[govt_id]) {
            return res.json({
                success: false,
                status: "ILLEGAL_REGISTER_ACCESS",
            });
        }

        const { full_name, uid, dob, phone } = aadhaarDb.filter(
            (user) => user.uid === govt_id
        )[0];

        await UserModel.create({
            email: email,
            password: sha256DigToHex(password),
            pfp: Buffer.from(pfp, "base64"), // NOTE: base64
            govt_id: {
                full_name: full_name,
                uid: uid,
                dob: dob,
                phone: phone,
            },
        });

        res.json({
            success: true,
            status: "USER_ACCOUNT_CREATED",
            jwt: jwt.sign(
                // session token
                {
                    email: email,
                    salt: crypto.randomBytes(32).toString("hex"),
                },

                process.env.JWT_SECRET
            ),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const post_signInHandler = async (req, res) => {
    try {
        let { email, password } = req.body;

        password = sha256DigToHex(password);

        const userObj = await UserModel.findOne({ email, password });

        if (!userObj) {
            return res.status(403).json({
                success: false,
                status: "SIGN_IN_UNAUTHORISED",
            });
        }

        const sessionToken = jwt.sign(
            {
                email: email,
                salt: crypto.randomBytes(32).toString("hex"),
            },

            process.env.JWT_SECRET
        );

        res.json({
            success: true,
            status: "SIGN_IN_SUCCESS",
            jwt: sessionToken,
        });
    } catch (e) {
        logError(e, res);
    }
};

export default router;
