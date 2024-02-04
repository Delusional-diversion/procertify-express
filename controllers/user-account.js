import { UserModel } from "../models/User";
import { sha256DigToHex } from "../utils/cryptography";
import { logError } from "../utils/error-logger";

export const put_userCredHandler = async (req, res) => {
    try {
        let { email, password } = req.body;

        password = sha256DigToHex(password);

        res.json({
            success: true,
            payload: await UserModel.findOneAndUpdate(
                { _id: res.locals.USEROBJ._id },
                { email, password },
                { new: true }
            ),
        });
    } catch (e) {
        logError(e, res);
    }
};

export const get_whoAmIHandler = async (req, res) => {
    try {
        res.json({
            success: true,
            payload: res.locals.USEROBJ,
        });
    } catch (e) {
        logError(e, res);
    }
};
