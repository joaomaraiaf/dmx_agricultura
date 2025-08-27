import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email já cadastrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Usuário criado com sucesso", user });
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor", error: err });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "24h",
        });

        res.json({ message: "Login realizado com sucesso", token });
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor", error: err });
    }
}
