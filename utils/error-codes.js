export const statusCodes = {
    SUCCESS: {
        OTP_VERIF_SUCCESS: "OTP has been verified successfully.",
        USER_ACCOUNT_CREATED: "User account creation is succesful.",
        SIGN_IN_SUCCESS: "Sign in has been successful",
    },
    ERROR: {
        OTP_VERIF_FAILED: "OTP could not be verified.",
        SIGN_IN_UNAUTHORISED: "User invalid incorrect",
        AUTH_TOKEN_MISSING: "Bearer token not found",
        ILLEGAL_REGISTER_ACCESS:
            "Account creation revoked because UID isn't verified.",
        TIME_RANGE_INVALID: "Exam cannot be attempted right now.",
    },
};
