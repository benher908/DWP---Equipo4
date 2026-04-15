import db from "../config/db.js";

export const findByEmail = async (email) => {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

export const findByWaterMeter = async (waterMeter) => {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE water_meter = ?",
        [waterMeter]
    );
    return rows[0];
};

export const createUser = async (user) => {
    const [result] = await db.execute(
        `INSERT INTO users 
        (name, email, address, water_meter, password, role)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            user.name,
            user.email,
            user.address,
            user.water_meter,
            user.password,
            user.role
        ]
    );

    return result.insertId;
};

export const updatePasswordById = async (userId, hashedPassword) => {
    await db.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
    );
};

export const saveRefreshToken = async (userId, token, expiresAt) => {
    await db.execute(
        `INSERT INTO refresh_tokens (user_id, token, expires_at)
         VALUES (?, ?, ?)`,
        [userId, token, expiresAt]
    );
};

export const deleteRefreshToken = async (token) => {
    await db.execute(
        "DELETE FROM refresh_tokens WHERE token = ?",
        [token]
    );
};

export const findRefreshToken = async (token) => {
    const [rows] = await db.execute(
        "SELECT * FROM refresh_tokens WHERE token = ?",
        [token]
    );
    return rows[0];
};

export const deleteAllUserTokens = async (userId) => {
    await db.execute(
        "DELETE FROM refresh_tokens WHERE user_id = ?",
        [userId]
    );
};

export const findById = async (userId) => {
    const [rows] = await db.execute(
        `SELECT id, name, email, role, status, is_active
         FROM users
         WHERE id = ?`,
        [userId]
    );

    return rows[0];
};
