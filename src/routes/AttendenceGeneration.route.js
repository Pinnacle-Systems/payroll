import { Router } from "express";
const router = Router();
import { get,addAbsentPunches,updatePermissionPunches } from "../controllers/AttendenceGeneration.controller.js";

router.get("/search", get);

router.post('/',addAbsentPunches)

router.put('/update-permission',updatePermissionPunches)

export default router;
