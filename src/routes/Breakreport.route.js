import { Router } from "express";
const router = Router();
import { get } from "../controllers/BreakReport.controller.js";

router.get("/search", get); 

export default router;
