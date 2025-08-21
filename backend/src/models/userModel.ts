// src/models/userModel.ts
import { db } from "../db/knex";

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}

const TABLE = "users";

export async function findUserByEmail(email: string): Promise<User | undefined> {
    return db<User>(TABLE).where({ email }).first();
}

export async function createUser(user: User): Promise<User> {
    const [created] = await db<User>(TABLE).insert(user).returning("*");
    return created;
}

export async function findUserById(id: number): Promise<User | undefined> {
    return db<User>(TABLE).where({ id }).first();
}
