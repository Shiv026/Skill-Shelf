// import { Router } from "express";
// import upload from "../middlewares/upload.middleware.js";
// import role from "../middlewares/role.middleware.js";
// import { createLessons, getLessonsByCourse } from "../controllers/lesson.controller.js";
// import authorize from "../middlewares/auth.middleware.js";


// const lessonsRouter = Router();

// // POST: Save new lesson
// // Pass this through the middleware if user has instructor role or not
// lessonsRouter.post("/", authorize, role(["admin", "instructor"]), upload.array("videos", 5), createLessons);

// // GET: Fetch all lessons of a course
// //Pass this through the middleware if user has enrolled then only get the lesson
// lessonsRouter.get("/:courseId", getLessonsByCourse);

// export default lessonsRouter;


import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import role from "../middlewares/role.middleware.js";
import { createLessons, getLessonsByCourse, getLessonByLessonId } from "../controllers/lesson.controller.js";
import { createLessons, getLessonsByCourse, getLessonByLessonId } from "../controllers/lesson.controller.js";
import authorize from "../middlewares/auth.middleware.js";


const lessonsRouter = Router();

// POST: Save new lesson
// Pass this through the middleware if user has instructor role or not
lessonsRouter.post("/:courseId", authorize, role(["admin", "instructor"]), upload.array("videos", 5), createLessons);

// GET: Fetch all lessons of a course
lessonsRouter.get("/:courseId", authorize, getLessonsByCourse);

// GET: Fetch a particular lesson details 
lessonsRouter.get("/:courseId/:lessonId", authorize, getLessonByLessonId);
//Pass this through the middleware if user has enrolled then only get the lesson
lessonsRouter.get("/:courseId", getLessonsByCourse);

// GET: Fetch a particular lesson details 
lessonsRouter.get("/:courseId/:lessonId", getLessonByLessonId);

export default lessonsRouter;
