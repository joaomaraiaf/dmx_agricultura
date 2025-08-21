import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import webRoutes from "./routes/web";
import { authenticateToken } from "./middlewares/authMiddleware";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/authenticated", authenticateToken, webRoutes);

export default app;
