import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
    deleteReport,deleteUser,getReports,getUsers,updateReportStatus,updateUserStatus } from "../controllers/admin.controller.js";

const router = Router();

router.use(verifyToken);
router.use(checkRole(["admin"]));

router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/reports", getReports);
router.patch("/reports/:id", updateReportStatus);
router.delete("/reports/:id", deleteReport);

export default router;
