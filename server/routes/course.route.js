import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  createCourse,
  viewAllCourse,
  viewCourse,
  editCourse,
  deleteCourse,
  getCourseEnrollments,
} from "../controllers/course.controller.js";

const courseRouter = Router();

//View all course (everyone)
courseRouter.get("/", viewAllCourse);

//View a course by Id (everyone)
courseRouter.get("/:id", viewCourse);

//Create a course (instructor, admin)
courseRouter.post("/", authorize, role(["admin", "instructor"]), createCourse);

//Edit the course (course instructor, admin)
courseRouter.put("/:id", authorize, role(["admin", "instructor"]), editCourse);

//Delete the course (course instructor, admin)
courseRouter.delete("/:id", authorize, role(["admin", "instructor"]), deleteCourse);

//Get all enrolled students of a course (course instructor, admin)
courseRouter.get("/:id/enrollments", authorize, role(["admin", "instructor"]), getCourseEnrollments);


export default courseRouter;
