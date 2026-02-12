import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware básico
app.use(express.json());

// Ruta Hola Mundo
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hola Mundo desde Node.js + TypeScript 🚀"
  });
});

// Arranque del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
