import { Request, Response } from "express";
import { User, createUser as createUserModel, findUserById } from "../models/userModel";
import { db } from "../db/knex";

export const getUsers = async (req: Request, res: Response) => {
    const users = await db<User>("users").select("*");
    res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const newUser = await createUserModel({ name, email } as User);
    res.status(201).json(newUser);
};
