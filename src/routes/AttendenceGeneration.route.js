import { Router } from "express";
const router = Router();
import { get,addAbsentPunches,updatePermissionPunches,updateAbsentPunches } from "../controllers/AttendenceGeneration.controller.js";

router.get("/search", get);

router.post('/',addAbsentPunches)

router.put('/update-permission',updatePermissionPunches)

router.put('/update-absent-punches',updateAbsentPunches)
export default router;
