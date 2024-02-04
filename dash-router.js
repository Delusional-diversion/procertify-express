import express from "express";

const router = express.Router();

router.post("/apply", post_b2bApplyHandler);
router.post("/sign-in", post_b2b2SignInHandler); // no sign in unless @is_active:true

router.post("/certifications/create", post_createCertHandler);
router.get("/certifications", get_b2bCertsHandler);
router.put("/certifications/update", post_createQnAHandler);
router.delete("/certifications/delete", delete_CertificationHandler);

router.post("/account/update", get_b2bWhoAmIHandler);
router.get("/account/whoami", get_b2bWhoAmIHandler);

export default router;
