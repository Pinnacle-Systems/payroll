import { Router } from "express";
const router = Router();
import { get,addAbsentPunches } from "../controllers/AttendenceGeneration.controller.js";

router.get("/search", get);

router.post('/',addAbsentPunches)

export default router;
