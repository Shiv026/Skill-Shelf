import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { db } from "../database/db.js";
import validateEmail from "../utils/validateEmail.js";

export const signUp = async (req, res, next) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { name, email, password } = req.body;

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email format validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return res.status(400).json({ message: "User already exists" });

    // Insert user
    const [results] = await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    // Get new user ID
    const userId = results.insertId;

    // Get student role ID
    const [roleResult] = await connection.query(
      "SELECT role_id FROM roles WHERE role_name = ?",
      ["student"]
    );
    const roleId = roleResult[0].role_id;

    // Assign student role to user
    const [defaultRole] = await connection.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [userId, roleId]
    );
    if (defaultRole.affectedRows !== 1)
      throw new Error("Failed to insert user role");

    const token = jwt.sign({ id: results.insertId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await connection.commit();
    return res.status(201).json({
      sucess: true,
      message: "User registered successfully",
      data: {
        token,
        id: results.insertId,
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Both fields are required" });
    }

    // Email format validation
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // check if user exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length === 0)
      return res.status(404).json({ message: "User does not exist" });

    const user = existingUser[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res
      .status(200)
      .json({ success: true, message: "User signed-in", data: token });
  } catch (err) {
    next(err);
  }
};
export const signOut = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  return res.status(200).json({
    message:
      "Signed out successfully. Please delete the token on the client side.",
  });
};
