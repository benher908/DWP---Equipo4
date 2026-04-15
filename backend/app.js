import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import contentRoutes from "./routes/content.routes.js";

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
      const isVercel = origin.startsWith('https://dwp-equipo4-gray.vercel.app');
      if (origin === allowed || isLocal517 || isLocal3010 || isVercel) {
        return callback(null, true);
      }

      console.warn("CORS blocked origin", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", contentRoutes);
//app.use(express.static(path.join(__dirname, 'public')));

//app.get(/^(?!\/api).+/, (req, res) => {
  //res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

app.use(errorHandler);

export default app;
