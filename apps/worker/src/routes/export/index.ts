import { Router } from "express";
import { exportAccount } from "../../controllers/export/index";
import { isFromTrustedSource } from "../../utils/middlewares";

const router = Router();
export default router;

router.post("/", isFromTrustedSource, exportAccount);
