import { db } from "../database/db.js";
const role = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.user_id;

      const [userRoles] = await db.query(
        `SELECT r.role_name from roles r JOIN user_roles ur
        ON r.role_id = ur.role_id where ur.user_id = ?`,
        [userId]
      );
      const userRoleNames = userRoles.map((role) => role.role_name);
      const hasRole = userRoleNames.some((role) => allowedRoles.includes(role));
      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: You do not have the required role" });
      }
      next();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  };
};
export default role;
