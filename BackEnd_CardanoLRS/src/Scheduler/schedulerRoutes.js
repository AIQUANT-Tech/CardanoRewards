import express from "express";
import { processUserMappingFeed } from "../Scheduler/schedulerController.js";

const router = express.Router();

router.post("/run", processUserMappingFeed);

export default router;
