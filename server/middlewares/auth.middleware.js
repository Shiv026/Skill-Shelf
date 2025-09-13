import jwt from "jsonwebtoken";
import { db } from "../database/db.js";
import { JWT_SECRET } from "../config/env.js";

const authorize = async (req, res, next) => {
  try {
    let token;
    const authorization = req.headers.authorization;

    if (authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized Access" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const [user] = await db.query(
      "SELECT user_id, name, email, signup_date FROM users WHERE user_id = ?",
      [decoded.id]
    );

    if (user.length === 0)
      return res.status(401).json({ message: "Unauthorized" });

    req.user = user[0];
    console.log(user[0]);
    next();
  } catch (err) {
    next(err);
  }
};
export default authorize;