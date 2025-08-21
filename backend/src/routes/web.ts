import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController";

const router = Router();

// Rotas protegidas (todas precisam de autenticação)
router.get("/users", getUsers);
router.post("/users", createUser);

// Rota de perfil
router.get("/profile", (req, res) => {
    res.json({ message: "Perfil do usuário autenticado", user: (req as any).user });
});

export default router;