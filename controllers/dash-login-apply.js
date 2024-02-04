import { OrganisationModel } from "../models/Organisation.js";
import { sha256DigToHex } from "../utils/cryptography.js";
import { logError } from "../utils/error-logger.js";
import crypto from "crypto";

export const post_b2bApplyHandler = async (req, res) => {
    try {
        let { name, email, header_img, password } = req.body;

        header_img = Buffer.from(header_img, "base64");
        password = sha256DigToHex(password);

        res.json({
            success: true,
            payload: await OrganisationModel.create({
                name,
                email,
                header_img,
                password,
            }),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const post_b2b2SignInHandler = async (req, res) => {
    try {
        let { email, password } = req.body;

        password = sha256DigToHex(password);

        const userObj = await OrganisationModel.findOne({ email, password });

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
