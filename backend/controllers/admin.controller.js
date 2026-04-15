import { ApiError } from "../utils/ApiError.js";
import * as adminModel from "../models/admin.model.js";

const REPORT_STATUSES = ["Pendiente", "En Proceso", "Atendido"];
const USER_STATUSES = ["active", "banned"];

export const getUsers = async (req, res, next) => {
    try {
        const users = await adminModel.findAllUsers();
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);

        if (userId === req.user.id) {
            throw new ApiError(400, "No puedes eliminar tu propio usuario");
        }

        const affectedRows = await adminModel.deleteUserById(userId);
        if (!affectedRows) {
            throw new ApiError(404, "Usuario no encontrado");
        }

        res.json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};

export const updateUserStatus = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const { status } = req.body;

        if (!USER_STATUSES.includes(status)) {
            throw new ApiError(400, "Estado de usuario no valido");
        }

        const affectedRows = await adminModel.updateUserStatusById(userId, status);
        if (!affectedRows) {
            throw new ApiError(404, "Usuario no encontrado");
        }

        res.json({ success: true, message: "Estado del usuario actualizado" });
    } catch (error) {
        next(error);
    }
};

export const getReports = async (req, res, next) => {
    try {
        const reports = await adminModel.findAllReports();
        res.json({ success: true, data: reports, validStatuses: REPORT_STATUSES });
    } catch (error) {
        next(error);
    }
};

export const updateReportStatus = async (req, res, next) => {
    try {
        const reportId = Number(req.params.id);
        const { status } = req.body;

        if (!REPORT_STATUSES.includes(status)) {
            throw new ApiError(400, "Estado de reporte no valido");
        }

        const affectedRows = await adminModel.updateReportStatusById(reportId, status);
        if (!affectedRows) {
            throw new ApiError(404, "Reporte no encontrado");
        }

        res.json({ success: true, message: "Estado del reporte actualizado" });
    } catch (error) {
        next(error);
    }
};

export const deleteReport = async (req, res, next) => {
    try {
        const reportId = Number(req.params.id);
        const affectedRows = await adminModel.deleteReportById(reportId);

        if (!affectedRows) {
            throw new ApiError(404, "Reporte no encontrado");
        }

        res.json({ success: true, message: "Reporte eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};
