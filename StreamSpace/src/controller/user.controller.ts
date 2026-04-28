import bycrypt from "bcrypt";
import pool from "../config/db.js";
import type { Request, Response } from "express";

interface User {
  email: string;
  username: string;
  password: string;
}

export const userRegister = async (req: Request, res: Response) => {
  const userData: User = req.body;

  try {
    const salt = await bycrypt.genSalt(10);
    const passwordHash = await bycrypt.hash(userData.password, salt);

    const query = `
        INSERT INTO users (username, email, password_hash)
        VALUES($1, $2, $3)
        RETURNING id, username;
    `;
    const result = await pool.query(query, [
      userData.username,
      userData.email,
      passwordHash,
    ]);

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
