import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getAllTaskByParticularUser,createTask,updateTask,deleteTask,toggleCompletion} from "../controllers/task.controllers.js"

const router = Router()

router.route("/").get(verifyJWT,getAllTaskByParticularUser)
router.route("/").post(verifyJWT,createTask)
router.route("/:id").patch(verifyJWT,updateTask)
router.route("/:id").delete(verifyJWT,deleteTask)
router.route("/:id").post(verifyJWT,toggleCompletion)


export default router