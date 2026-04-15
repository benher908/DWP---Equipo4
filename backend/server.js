import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { ensureDatabaseSchema } from "./services/bootstrap.service.js";

const PORT = process.env.PORT || 3000;

console.log("Inicio del servidor con variables:", {
  PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  FRONTEND_URL: process.env.FRONTEND_URL
});

ensureDatabaseSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo inicializar el esquema base:", error);
    process.exit(1);
  });
