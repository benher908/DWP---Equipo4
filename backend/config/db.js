import mysql from "mysql2/promise";
import "dotenv/config"

// use environment variables but allow sensible defaults when none are provided
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "dwp4_app",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    waitForConnections: true, 
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 3306;
    try {
        const connection = await pool.getConnection();
        console.log(`Conectado a MySQL en ${host}:${port}`);
        connection.release();
    } catch (error) {
        console.error(`Error conectando a MySQL en ${host}:${port}:`, error);
    }
})();


export default pool;
