import { ApiError } from "../utils/ApiError.js";
import * as contentModel from "../models/content.model.js";

const REPORT_STATUSES = ["Pendiente", "En Proceso", "Atendido"];
const PRIORITIES = ["baja", "media", "alta"];
const SHIFTS = ["mañana", "tarde"];

const validateRequiredText = (value, message) => {
    if (!String(value ?? "").trim()) {
        throw new ApiError(400, message);
    }
};

export const getAnnouncements = async (req, res, next) => {
    try {
        const data = await contentModel.findAllAnnouncements();

        const formatted = data.map(a => ({
            ...a,
            date: a.created_at
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        next(error);
    }
};

export const createAnnouncement = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        validateRequiredText(title, "El titulo es obligatorio");
        validateRequiredText(description, "La descripcion es obligatoria");

        const id = await contentModel.createAnnouncement({
            title: String(title).trim(),
            description: String(description).trim()
        });

        res.status(201).json({ success: true, id });
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncement = async (req, res, next) => {
    try {
        const announcementId = Number(req.params.id);
        const { title, description } = req.body;
        validateRequiredText(title, "El titulo es obligatorio");
        validateRequiredText(description, "La descripcion es obligatoria");

        const affectedRows = await contentModel.updateAnnouncementById(announcementId, {
            title: String(title).trim(),
            description: String(description).trim()
        });

        if (!affectedRows) {
            throw new ApiError(404, "Aviso no encontrado");
        }

        res.json({ success: true, message: "Aviso actualizado correctamente" });
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement = async (req, res, next) => {
    try {
        const announcementId = Number(req.params.id);
        const affectedRows = await contentModel.deleteAnnouncementById(announcementId);

        if (!affectedRows) {
            throw new ApiError(404, "Aviso no encontrado");
        }

        res.json({ success: true, message: "Aviso eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};

export const createReport = async (req, res, next) => {
    try {
        const { address, priority, description } = req.body;

        validateRequiredText(address, "Dirección obligatoria");
        validateRequiredText(priority, "Prioridad obligatoria");
        validateRequiredText(description, "Descripción obligatoria");

        if (!PRIORITIES.includes(priority)) {
            throw new ApiError(400, "Prioridad no válida");
        }

        const id = await contentModel.createReport({
            userId: req.user.id,
            address,
            priority,
            description
        });

        res.status(201).json({
            success: true,
            id,
            defaultStatus: REPORT_STATUSES[0]
        });
    } catch (error) {
        next(error);
    }
};

export const getMyReports = async (req, res, next) => {
    try {
        const reports = await contentModel.findReportsByUserId(req.user.id);

        res.json({
            success: true,
            data: reports,
            validStatuses: REPORT_STATUSES
        });
    } catch (error) {
        next(error);
    }
};

export const getSchedules = async (req, res, next) => {
    try {
        const schedules = await contentModel.findAllSchedules();
        res.json({ success: true, data: schedules });
    } catch (error) {
        next(error);
    }
};

export const createSchedule = async (req, res, next) => {
    try {
        const { zone, day, shift, hour } = req.body;

        validateRequiredText(zone, "Zona obligatoria");
        validateRequiredText(day, "Día obligatorio");
        validateRequiredText(shift, "Turno obligatorio");
        validateRequiredText(hour, "Hora obligatoria");

        if (!SHIFTS.includes(shift)) {
            throw new ApiError(400, "Turno no válido");
        }

        const id = await contentModel.createSchedule({
            zone, day, shift, hour
        });

        res.status(201).json({ success: true, id });
    } catch (error) {
        next(error);
    }
};

export const updateSchedule = async (req, res, next) => {
    try {
        const scheduleId = Number(req.params.id);
        const { zone, day, shift, hour } = req.body;

        validateRequiredText(zone, "Zona obligatoria");
        validateRequiredText(day, "Día obligatorio");
        validateRequiredText(shift, "Turno obligatorio");
        validateRequiredText(hour, "Hora obligatoria");

        if (!SHIFTS.includes(shift)) {
            throw new ApiError(400, "Turno no válido");
        }

        const affectedRows = await contentModel.updateScheduleById(scheduleId, {
            zone: String(zone).trim(),
            day: String(day).trim(),
            shift: String(shift).trim(),
            hour: String(hour).trim()
        });

        if (!affectedRows) {
            throw new ApiError(404, "Horario no encontrado");
        }

        res.json({ success: true, message: "Horario actualizado correctamente" });
    } catch (error) {
        next(error);
    }
};

export const deleteSchedule = async (req, res, next) => {
    try {
        const scheduleId = Number(req.params.id);
        const affectedRows = await contentModel.deleteScheduleById(scheduleId);

        if (!affectedRows) {
            throw new ApiError(404, "Horario no encontrado");
        }

        res.json({ success: true, message: "Horario eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};

export const getTips = async (req, res, next) => {
    try {
        const tips = await contentModel.findAllTips();
        res.json({ success: true, data: tips });
    } catch (error) {
        next(error);
    }
};

export const createTip = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        validateRequiredText(title, "Título obligatorio");
        validateRequiredText(description, "Descripción obligatoria");

        const id = await contentModel.createTip({ title, description });

        res.status(201).json({ success: true, id });
    } catch (error) {
        next(error);
    }
};

export const updateTip = async (req, res, next) => {
    try {
        const tipId = Number(req.params.id);
        const { title, description } = req.body;
        validateRequiredText(title, "Título obligatorio");
        validateRequiredText(description, "Descripción obligatoria");

        const affectedRows = await contentModel.updateTipById(tipId, {
            title: String(title).trim(),
            description: String(description).trim()
        });

        if (!affectedRows) {
            throw new ApiError(404, "Consejo no encontrado");
        }

        res.json({ success: true, message: "Consejo actualizado correctamente" });
    } catch (error) {
        next(error);
    }
};

export const deleteTip = async (req, res, next) => {
    try {
        const tipId = Number(req.params.id);
        const affectedRows = await contentModel.deleteTipById(tipId);

        if (!affectedRows) {
            throw new ApiError(404, "Consejo no encontrado");
        }

        res.json({ success: true, message: "Consejo eliminado correctamente" });
    } catch (error) {
        next(error);
    }
};
