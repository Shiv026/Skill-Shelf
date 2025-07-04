import { Router } from "express";
import { newEnrollment, userEnrollments } from "../controllers/enrollment.controller.js"; 
import authorize from "../middlewares/auth.middleware.js";
const enrollementRouter = Router();

//Enroll on a course (everyone)
enrollementRouter.post('/', authorize, newEnrollment);

//Get all enrolled courses (for that user only)
enrollementRouter.get('/', authorize, userEnrollments); 


export default enrollementRouter;
