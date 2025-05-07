// routes/educatorRoutes.js
import express from "express";
import {
  getEducatorCourses,
  updateRoleToEducator,
  educatorDashboardData,
  getEnrolledStudentsData,
} from "../controllers/educatorControllers.js";
import { addCourse } from "../controllers/educatorControllers.js";
import upload from "../configs/multer.js";
import { ProtectEducator } from "../middlewares/authmiddlewares.js";

const educatorRouter = express.Router();

educatorRouter.get("/update-role", updateRoleToEducator);

educatorRouter.post(
  "/add-course",
  upload.single("image"),
  ProtectEducator,
  addCourse
);

educatorRouter.get("/courses", ProtectEducator, getEducatorCourses);

educatorRouter.get("/dashboard", ProtectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  ProtectEducator,
  getEnrolledStudentsData
);
export default educatorRouter;
