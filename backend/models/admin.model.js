import db from "../config/db.js";

export const findAllUsers = async () => {
    const [rows] = await db.execute(
        `SELECT id, name, email, address, water_meter, role, status, is_active, created_at
         FROM users
         ORDER BY created_at DESC`
    );

    return rows;
};

export const deleteUserById = async (userId) => {
    const [result] = await db.execute(
        "DELETE FROM users WHERE id = ?",
        [userId]
    );

    return result.affectedRows;
};

export const updateUserStatusById = async (userId, status) => {
    const isActive = status === "active" ? 1 : 0;

    const [result] = await db.execute(
        "UPDATE users SET status = ?, is_active = ? WHERE id = ?",
        [status, isActive, userId]
    );

    return result.affectedRows;
};

export const findAllReports = async () => {
    const [rows] = await db.execute(
        `SELECT 
            reports.id,
            reports.user_id,
            reports.address,
            reports.priority,
            reports.description,
            reports.status,
            reports.created_at,
            users.name AS user_name,
            users.email AS user_email,
            users.address AS user_address
        FROM reports
        INNER JOIN users ON users.id = reports.user_id
        ORDER BY reports.created_at DESC`
    );

    return rows;
};

export const updateReportStatusById = async (reportId, status) => {
    const [result] = await db.execute(
        "UPDATE reports SET status = ? WHERE id = ?",
        [status, reportId]
    );

    return result.affectedRows;
};

export const deleteReportById = async (reportId) => {
    const [result] = await db.execute(
        "DELETE FROM reports WHERE id = ?",
        [reportId]
    );

    return result.affectedRows;
};
