import { OrganisationModel } from "../models/Organisation.js";
import { logError } from "../utils/error-logger.js";

export const get_b2bOrgCredHandler = async (req, res) => {
    try {
        let { email, password } = req.body;

        password = sha256DigToHex(password);

        res.json({
            success: true,
            payload: await OrganisationModel.findOneAndUpdate(
                { _id: res.locals.USEROBJ._id },
                { email, password },
                { new: true }
            ),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_b2bWhoAmIHandler = async (req, res) => {
    try {
        res.json({
            success: true,
            payload: res.locals.ORGOBJ,
        });
    } catch (e) {
        logError(e, res);
    }
};
