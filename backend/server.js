import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(cors());

// Rotas
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API EcoObra funcionando ✔️");
});

const PORT = 3000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
