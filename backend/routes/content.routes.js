import { Router } from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
    createAnnouncement,createReport,createSchedule,createTip,deleteAnnouncement,deleteSchedule,deleteTip,
    getAnnouncements,getMyReports,getSchedules,getTips,updateAnnouncement,updateSchedule,updateTip} from "../controllers/content.controller.js";

const router = Router();

router.get("/announcements", getAnnouncements);
router.get("/schedules", getSchedules);
router.get("/tips", getTips);

router.post("/reports", verifyToken, checkRole(["user", "admin"]), createReport);
router.get("/reports/my", verifyToken, checkRole(["user", "admin"]), getMyReports);

router.post("/announcements", verifyToken, checkRole(["admin"]), createAnnouncement);
router.put("/announcements/:id", verifyToken, checkRole(["admin"]), updateAnnouncement);
router.delete("/announcements/:id", verifyToken, checkRole(["admin"]), deleteAnnouncement);

router.post("/schedules", verifyToken, checkRole(["admin"]), createSchedule);
router.put("/schedules/:id", verifyToken, checkRole(["admin"]), updateSchedule);
router.delete("/schedules/:id", verifyToken, checkRole(["admin"]), deleteSchedule);

router.post("/tips", verifyToken, checkRole(["admin"]), createTip);
router.put("/tips/:id", verifyToken, checkRole(["admin"]), updateTip);
router.delete("/tips/:id", verifyToken, checkRole(["admin"]), deleteTip);

export default router;
