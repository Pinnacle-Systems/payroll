import { Router } from "express";
const router = Router();
import { get } from "../controllers/AttendenceGeneration.controller.js";

router.get("/search", get); 

export default router;
