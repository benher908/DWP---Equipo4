import db from "../config/db.js";

export const findAllAnnouncements = async () => {
    const [rows] = await db.execute(
        `SELECT id, title, description, created_at
         FROM announcements
         ORDER BY created_at DESC`
    );

    return rows;
};

export const createAnnouncement = async ({ title, description }) => {
    const [result] = await db.execute(
        `INSERT INTO announcements (title, description)
         VALUES (?, ?)`,
        [title, description]
    );

    return result.insertId;
};

export const updateAnnouncementById = async (id, { title, description }) => {
    const [result] = await db.execute(
        `UPDATE announcements
         SET title = ?, description = ?
         WHERE id = ?`,
        [title, description, id]
    );

    return result.affectedRows;
};

export const deleteAnnouncementById = async (id) => {
    const [result] = await db.execute(
        "DELETE FROM announcements WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};

export const createReport = async ({ userId, address, priority, description }) => {
    const [result] = await db.execute(
        `INSERT INTO reports (user_id, address, priority, description)
         VALUES (?, ?, ?, ?)`,
        [userId, address, priority, description]
    );

    return result.insertId;
};

export const findReportsByUserId = async (userId) => {
    const [rows] = await db.execute(
        `SELECT id, address, priority, description, status, created_at
         FROM reports
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};

export const findAllSchedules = async () => {
    const [rows] = await db.execute(
        `SELECT id, zone, day, shift, hour, created_at
         FROM schedules
         ORDER BY created_at DESC`
    );

    return rows;
};

export const createSchedule = async ({ zone, day, shift, hour }) => {
    const [result] = await db.execute(
        `INSERT INTO schedules (zone, day, shift, hour)
         VALUES (?, ?, ?, ?)`,
        [zone, day, shift, hour]
    );

    return result.insertId;
};

export const updateScheduleById = async (id, { zone, day, shift, hour }) => {
    const [result] = await db.execute(
        `UPDATE schedules
        SET zone = ?, day = ?, shift = ?, hour = ?         
        WHERE id = ?`,
        [zone, day, shift, hour, id]
    );

    return result.affectedRows;
};

export const deleteScheduleById = async (id) => {
    const [result] = await db.execute(
        "DELETE FROM schedules WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};

export const findAllTips = async () => {
    const [rows] = await db.execute(
        `SELECT id, title, description, created_at
         FROM tips
         ORDER BY created_at DESC`
    );

    return rows;
};

export const createTip = async ({ title, description }) => {
    const [result] = await db.execute(
        `INSERT INTO tips (title, description)
         VALUES (?, ?)`,
        [title, description]
    );

    return result.insertId;
};

export const updateTipById = async (id, { title, description }) => {
    const [result] = await db.execute(
        `UPDATE tips
         SET title = ?, description = ?
         WHERE id = ?`,
        [title, description, id]
    );

    return result.affectedRows;
};

export const deleteTipById = async (id) => {
    const [result] = await db.execute(
        "DELETE FROM tips WHERE id = ?",
        [id]
    );

    return result.affectedRows;
};
