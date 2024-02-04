import express from "express";
import {
    post_aadhaarOtpVerifyHandler,
    post_aadhaarOtpRequestHandler,
    post_signUpCreatePfHandler,
} from "./controllers/site-login-register.js";
import {
    get_catHandler,
    get_catsHandler,
    get_certHandler,
    get_compHandler,
    get_compsHandler,
    get_userCertHandler,
    get_userCertsHandler,
} from "./controllers/site-certifications.js";
import { userAuthHandler } from "./middlewares/secure-auth.js";
import {
    get_generateCertificate,
    post_certificationAttemptHandler,
    post_examSessionRespond,
    post_examSessionSubmit,
} from "./controllers/cert-attempt.js";
import {
    get_whoAmIHandler,
    put_userCredHandler,
} from "./controllers/user-account.js";

const router = express.Router();

// sign up
router.post("/sign-up/aadhaar/request-otp", post_aadhaarOtpRequestHandler); // @aadhaarno
router.post("/sign-up/aadhaar/verify-otp", post_aadhaarOtpVerifyHandler); // @aadhaarno @otp
router.post("/sign-up/create-profile", post_signUpCreatePfHandler);

// sign in
router.post("/sign-in", post_signInHandler);

// global certifications
router.get("/certifications/global/categories", get_catsHandler);
router.get("/certifications/global/categories/:category_id", get_catHandler);
router.get("/certifications/:certification_id", get_certHandler);

// organisation certifications
router.get("/certifications/organisations", get_compsHandler);
router.get("/certifications/organisations/:organisation_id", get_compHandler);
router.post(
    "/certifications/:certification_id/buy",
    userAuthHandler,
    post_buyCertHandler
);

// user-bought certifications
router.get("/user/certifications", userAuthHandler, get_userCertsHandler);
router.get(
    "/user/certifications/:u_certification_id",
    userAuthHandler,
    get_userCertHandler
);

// user bought-certification test attempt
router.post(
    "/user/certifications/:u_certification_id/attempt",
    userAuthHandler,
    post_certificationAttemptHandler
);
router.post(
    "/user/certifications/:exam_session_id/respond",
    userAuthHandler,
    post_examSessionRespond
);
router.post(
    "/user/certifications/:exam_session_id/submit",
    userAuthHandler,
    post_examSessionSubmit
);
router.get(
    "/user/certifications/:exam_session_id/download-cert",
    userAuthHandler,
    get_generateCertificate
);

// user account settings
router.put("/user/account/update", put_userCredHandler);
router.get("/user/account/whoami", get_whoAmIHandler);

export default router;
