import { Router } from "express";
const router = Router();
import { get, create } from "../controllers/preEmployee.controller.js";

router.post("/", create);

router.get("/", get);

export default router;
