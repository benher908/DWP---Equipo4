import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; 
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = process.env.FRONTEND_URL || '';
      const isLocal517 = origin.startsWith('http://localhost:517');
      const isLocal3010 = origin.startsWith('http://localhost:3010');
      const isVercel = origin.startsWith('https://https://dwp-equipo4.vercel.app');
      if (origin === allowed || isLocal517 || isLocal3010 || isRailway) {
        return callback(null, true);
      }
      console.warn('CORS blocked origin', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
//app.use(express.static(path.join(__dirname, 'public')));

//app.get(/^(?!\/api).+/, (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

app.use(errorHandler);



const PORT = process.env.PORT || 3010;
console.log("Inicio del servidor con variables:", {
  PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  FRONTEND_URL: process.env.FRONTEND_URL,
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;
