import { Router } from "express";

import $export from "./export";

const router = Router();
export default router;

router.use("/export", $export);
