import db from "../config/db.js";

const createStatements = [
    `CREATE TABLE IF NOT EXISTS announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        description TEXT NOT NULL,
        status ENUM('Pendiente', 'En Proceso', 'Atendido') DEFAULT 'Pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
];

export const ensureDatabaseSchema = async () => {
    for (const statement of createStatements) {
        await db.execute(statement);
    }

    const [statusColumn] = await db.execute(
        `SELECT COLUMN_NAME
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'users'
           AND COLUMN_NAME = 'status'`
    );

    if (!statusColumn.length) {
        await db.execute(
            "ALTER TABLE users ADD COLUMN status ENUM('active', 'banned') DEFAULT 'active' AFTER role"
        );
    }

    await db.execute(
        "UPDATE users SET status = 'active' WHERE status IS NULL"
    );
};
