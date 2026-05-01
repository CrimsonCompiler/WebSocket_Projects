import bycrypt from "bcrypt";
import pool from "../config/db.js";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface User {
  username: string;
  email: string;
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

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const query = `SELECT *
                   FROM users
                   WHERE email=$1`;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      return;
    }

    // Found the user
    const user = result.rows[0];

    //.

    // check pass hash
    const isMatch = bycrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //.

    // sign a jwt

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    //.

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token: token,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
    });

    //.
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
    });
  }
};
