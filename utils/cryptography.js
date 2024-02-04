import crypto from "crypto";

export const sha256DigToHex = (input) => {
    return crypto.createHash("sha256").update(Buffer.from(input)).digest("hex");
};

export const sha256DigToBase64 = (input) => {
    return crypto
        .createHash("sha256")
        .update(Buffer.from(input))
        .digest("base64");
};
