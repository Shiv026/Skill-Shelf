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
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }
    // store the email in lowerCase
    const LowerCaseEmail = email.toLowerCase();

    // Email format validation
    if (!validateEmail(LowerCaseEmail)) {
      const err = new Error("Invalid email format");
      err.statusCode = 400;
      throw err;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      const err = new Error("User already exists");
      err.statusCode = 400;
      throw err;
    }

    // Insert user
    const [results] = await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, LowerCaseEmail, hashedPassword]
    );

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
    if (defaultRole.affectedRows !== 1) {
      const err = new Error("Failed to insert user role");
      err.statusCode = 500;
      throw err;
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
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
    // lowercase the email
    const lowerCaseEmail = email.toLowerCase();

    // check if user exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [lowerCaseEmail]
    );
    if (existingUser.length === 0)
      return res.status(404).json({ message: "User does not exist" });

    const user = existingUser[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user.user_id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const userData = {
      userId : user.user_id,
      email: user.email,
      name: user.name
    }
    return res
      .status(200)
      .json({ success: true, message: "User signed-in", token, userData });
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