import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  createCourse,
  viewAllCourse,
  viewCourse,
  editCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

const courseRouter = Router();
courseRouter.get("/", viewAllCourse);
courseRouter.get("/:id", viewCourse);
courseRouter.post("/", authorize, role(["admin", "instructor"]), createCourse);
courseRouter.put("/:id", authorize, role(["admin", "instructor"]), editCourse);
courseRouter.delete(
  "/:id",
  authorize,
  role(["admin", "instructor"]),
  deleteCourse
);

export default courseRouter;
