import express from "express";
import { orgAuthHandler } from "./middlewares/secure-auth.js";
import {
    post_b2b2SignInHandler,
    post_b2bApplyHandler,
} from "./controllers/dash-login-apply.js";
import {
    delete_removeCertHandler,
    get_b2bCertsHandler,
    post_createCertHandler,
    put_updateCertHandler,
} from "./controllers/dash-certifications.js";
import {
    get_b2bOrgCredHandler,
    get_b2bWhoAmIHandler,
} from "./controllers/org-account.js";

const router = express.Router();

router.post("/apply", post_b2bApplyHandler);
router.post("/sign-in", post_b2b2SignInHandler); // no sign in unless @is_active:true

router.post("/certifications/create", orgAuthHandler, post_createCertHandler);
router.get("/certifications", orgAuthHandler, get_b2bCertsHandler);
router.put(
    "/certifications/:certification_id/update",
    orgAuthHandler,
    put_updateCertHandler
);
router.delete(
    "/certifications/:certification_id/delete",
    orgAuthHandler,
    delete_removeCertHandler
);

router.post("/account/update", orgAuthHandler, get_b2bOrgCredHandler);
router.get("/account/whoami", orgAuthHandler, get_b2bWhoAmIHandler);

export default router;
