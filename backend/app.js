import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; 
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// allow our frontend origin and send cookies for auth (refresh token)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);



const PORT = process.env.PORT || 3010;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;
