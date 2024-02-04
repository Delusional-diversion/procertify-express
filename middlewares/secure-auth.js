import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import { OrganisationModel } from "../models/Organisation.js";

export const userAuthHandler = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            jwt.verify(
                req.headers.authorization.split(" ")[1],

                process.env.JWT_SECRET,

                async (err, userObj) => {
                    if (err)
                        res.status(400).json({
                            success: false,
                            status: "JWT_DECRYPT_ERROR",
                            message: err.message,
                        });

                    res.locals.USEROBJ = await UserModel.findOne({
                        email: userObj.email,
                    });
                }
            );
        } else {
            res.status(403).json({
                success: false,
                status: "AUTH_TOKEN_MISSING",
                message: "Auth token missing in payload",
            });
        }
    } catch (e) {
        logError(e, res);
    }
};

export const orgAuthHandler = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            jwt.verify(
                req.headers.authorization.split(" ")[1],

                process.env.JWT_SECRET,

                async (err, orgObj) => {
                    if (err)
                        res.status(400).json({
                            success: false,
                            status: "JWT_DECRYPT_ERROR",
                            message: err.message,
                        });

                    res.locals.ORGOBJ = await OrganisationModel.findOne({
                        email: orgObj.email,
                    });
                }
            );
        } else {
            res.status(403).json({
                success: false,
                status: "AUTH_TOKEN_MISSING",
                message: "Auth token missing in payload",
            });
        }
    } catch (e) {
        logError(e, res);
    }
};
